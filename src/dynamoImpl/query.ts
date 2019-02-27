import * as AWS from 'aws-sdk'
import * as M from 'that-simple-model'
import * as util from 'util'
import * as DynamoUtils from '@/dynamoUtils'
import * as O from 'that-simple-objectstore'
import * as _ from 'lodash'
import { DynamoError } from '@/errors/dynamo.error'

/**
 * Performs a DynamoDB query
 */
export async function query<T extends M.IModel>(
	c: AWS.DynamoDB.DocumentClient,
	cls: M.IModelClass<T>,
	options: O.IObjectStoreQueryOptions<T>
): Promise<O.IObjectStoreQueryResult<T>> {
	// Attempt Query from Dynamo
	try {
		options = options || {}

		// Build the Query
		const fields: Array<string> = _.keys(options.where || {})
		const dynamoQuery = {
			TableName: DynamoUtils.getTableName(cls),
			...(where => {
				if (!where) {
					return {}
				}

				const keys = DynamoUtils.getDynamoKey(cls)

				const condition = fields
						.filter(f => keys.hasOwnProperty(f))
						.map(k => '#' + k + ' = :' + k)
						.join(' and '),
					names = fields.reduce((p, k) => ({ ...p, ['#' + k]: k }), {}),
					values = fields.reduce((p, k) => ({ ...p, [':' + k]: where[k] }), {}),
					filter = fields
						.filter(f => !keys.hasOwnProperty(f))
						.map(k => '#' + k + ' = :' + k)
						.join(' and ')

				return {
					FilterExpression: _.isEmpty(filter) ? null : filter,
					KeyConditionExpression: condition,
					ExpressionAttributeNames: names,
					ExpressionAttributeValues: values,
					ExclusiveStartKey: options.continuationToken,
					Limit: options.limit
				}
			})(options.where)
		}

		// Create and Run DynamoDB Query
		return await util
			.promisify(c.query.bind(c))(dynamoQuery)
			// Convert results into their Model classes
			.then(async ({ Items, LastEvaluatedKey }) => {
				let items = (Items || []).map(Item =>
						DynamoUtils.dynamoToClass(cls, Item)
					),
					continuationToken = LastEvaluatedKey

				// IF there are more results to get
				if (
					((!options.continuationCount || options.continuationCount > 0) &&
						continuationToken &&
						_.isUndefined(options.limit)) ||
					(!_.isUndefined(options.limit) &&
						Items.length < options.limit &&
						options.continuationCount > 0 &&
						continuationToken)
				) {
					const res = await query<T>(c, cls, {
						...options,
						continuationToken: continuationToken,
						continuationCount: (options.continuationCount || 10) - 1
					})
					return {
						items: [].concat(items, res.items),
						continuationToken: res.continuationToken
					}
				}
				// OTHERWISE
				return { items, continuationToken }
			})
			// Perform any additionality filtering specified as part of the query
			.then(data =>
				options.filter
					? {
							items: data.items.filter(options.filter),
							continuationToken: data.continuationToken
					  }
					: data
			)

			// Convert response into a QueryResult
			.then(data => ({
				status: O.ObjectStoreQueryStatus.OK,
				items: data.items,
				continuationToken: data.continuationToken
			}))
	} catch (err) {
		// Catch Errors
		// istanbul ignore next
		throw new DynamoError('Problem Querying from Dynamo', err)
	}
}
