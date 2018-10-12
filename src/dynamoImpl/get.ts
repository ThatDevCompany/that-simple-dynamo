import * as AWS from 'aws-sdk'
import * as M from 'that-simple-model'
import * as util from 'util'
import * as DynamoUtils from '@/dynamoUtils'

/**
 * Returns an items from the dynamodb datastore
 */
export async function get<T extends M.IModel>(
	c: AWS.DynamoDB.DocumentClient,
	cls: M.IModelClass<T>,
	partitionKey: string | number,
	sortKey?: string | number
): Promise<T> {
	return util
		.promisify(c.get.bind(c))({
			TableName: DynamoUtils.getTableName(cls),
			Key: DynamoUtils.getDynamoKey(cls, partitionKey, sortKey)
		})
		.then(({ Item }) => DynamoUtils.dynamoToClass(cls, Item))
		.catch(() => null)
}
