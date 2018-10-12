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
	// NULL safety
	query = query || {}

	// Validate the all properties in WHERE clause are Searchable
	const keys: Array<string> = _.keys(query.where || {})
	if (
		keys.some(
			key =>
				cls.meta.primaryKey != key &&
				cls.meta.secondaryKey != key &&
				cls.meta.searchables.indexOf(key) < 0
		)
	) {
		return Promise.resolve({
			status: O.ObjectStoreQueryStatus.ERROR,
			items: []
		})
	}

	// Build the Query
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
	return (
		util
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
			// Catch and Convert errors into a QueryResult
			.catch(() => ({
				status: O.ObjectStoreQueryStatus.ERROR,
				items: null
			}))
	)
}
