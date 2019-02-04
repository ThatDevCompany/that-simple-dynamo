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
	query: O.IObjectStoreQueryOptions<T>
): Promise<O.IObjectStoreQueryResult<T>> {
	// Attempt Query from Dynamo
	try {
		query = query || {}

		// Build the Query
		const keys: Array<string> = _.keys(query.where || {})
		const dynamoQuery = {
			TableName: DynamoUtils.getTableName(cls),
			...(where => {
				if (!where) {
					return {}
				}
				const condition = keys.map(k => '#' + k + ' = :' + k).join(' and '),
					names = keys.reduce((p, k) => ({ ...p, ['#' + k]: k }), {}),
					values = keys.reduce((p, k) => ({ ...p, [':' + k]: where[k] }), {})
				return {
					FilterExpression: condition,
					ExpressionAttributeNames: names,
					ExpressionAttributeValues: values,
					ExclusiveStartKey : query.continuationToken
				}
			})(query.where)
		}

		// Create and Run DynamoDB Query
		return await util
			.promisify(c.scan.bind(c))(dynamoQuery)
			// Convert results into their Model classes
			.then(({ Items, LastEvaluatedKey }) =>
				{
					return {
						items: (Items || /* istanbul ignore next */ []).map(Item =>
							DynamoUtils.dynamoToClass(cls, Item)
						),
						continuationToken: LastEvaluatedKey
					}
				}
			)
			// Perform any additionality filtering specified as part of the query
			.then(data => (query.filter ? {items: data.items.filter(query.filter), continuationToken: data.continuationToken} : data))

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
