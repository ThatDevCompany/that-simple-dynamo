import * as AWS from 'aws-sdk'
import * as M from 'that-simple-model'
import * as util from 'util'
import * as DynamoUtils from '@/dynamoUtils'
import * as O from 'that-simple-objectstore'
import * as _ from 'lodash'

/**
 * Performs a DynamoDB query
 */
export async function query<T extends M.IModel>(
	c: AWS.DynamoDB.DocumentClient,
	cls: M.IModelClass<T>,
	query: O.IObjectStoreQueryOptions<T>
): Promise<O.IObjectStoreQueryResult<T>> {
	query = query || {}

	console.log({
		TableName: DynamoUtils.getTableName(cls),
		...(where => {
			if (!where) {
				return {}
			}
			const keys: Array<string> = _.keys(where),
				indexName = keys.join('') + 'Index',
				condition = keys.map(k => k + ' =:' + k).join(' and '),
				values = {...keys.map(k => ({[':' + k]: where[k]}))}
			return {
				KeyConditionExpression: condition,
				ExpressionAttributeValues: values
			}
		})(query.where)
	})

	return util
	// Create and Run DynamoDB Query
		.promisify(c.scan.bind(c))({
			TableName: DynamoUtils.getTableName(cls),
			...(where => {
				if (!where) {
					return {}
				}
				const keys: Array<string> = _.keys(where),
					indexName = keys.join('') + 'Index',
					condition = keys.map(k => k + ' =:' + k).join(' and '),
					values = {...keys.map(k => ({[':' + k]: where[k]}))}
				return {
					KeyConditionExpression: condition,
					ExpressionAttributeValues: values
				}
			})(query.where)
		})
		// Convert results into their Model classes
		.then(({Items}) => ({
			items: (Items || []).map(Item => DynamoUtils.dynamoToClass(cls, Item))
		}))
		// Perform any additionality filtering specified as part of the query
		.then(({items}) =>
			(query.filter)
				? {items: items.map(query.filter)}
				: {items}
		)
}