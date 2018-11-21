import * as AWS from 'aws-sdk'
import * as M from 'that-simple-model'
import * as util from 'util'
import * as DynamoUtils from '@/dynamoUtils'
import { DynamoError } from '@/errors/dynamo.error'

/**
 * Removes an item from the dynamodb datastore
 */
export async function remove<T extends M.IModel>(
	c: AWS.DynamoDB.DocumentClient,
	item: T
): Promise<void> {
	// Attempt Delete from Dynamo
	try {
		return await util.promisify(c.delete.bind(c))({
			TableName: DynamoUtils.getTableName(item),
			Key: DynamoUtils.getDynamoKey(item)
		})
	} catch (err) {
		// Catch Errors
		// istanbul ignore next
		throw new DynamoError('Problem Deleting from Dynamo', err)
	}
}
