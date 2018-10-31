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
					ExpressionAttributeValues: values
				}
			})(query.where)
		}

		// Create and Run DynamoDB Query
		return await util
			.promisify(c.scan.bind(c))(dynamoQuery)
			// Convert results into their Model classes
			.then(({ Items }) =>
				(Items || []).map(Item => DynamoUtils.dynamoToClass(cls, Item))
			)
			// Perform any additionality filtering specified as part of the query
			.then(items => (query.filter ? items.map(query.filter) : items))
			// Convert response into a QueryResult
			.then(items => ({
				status: O.ObjectStoreQueryStatus.OK,
				items
			}))
	} catch (err) {
		// Catch Errors
		throw new DynamoError('Problem Querying from Dynamo', err)
	}
}
