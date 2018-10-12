import * as AWS from 'aws-sdk'
import * as M from 'that-simple-model'
import * as util from 'util'
import * as DynamoUtils from '@/dynamoUtils'

/**
 * Removes an item from the dynamodb datastore
 */
export async function remove<T extends M.IModel>(c: AWS.DynamoDB.DocumentClient, item: T): Promise<void> {
	return util.promisify(c.delete.bind(c))({
		TableName: DynamoUtils.getTableName(item),
		Key: DynamoUtils.getDynamoKey(item)
	})
}
