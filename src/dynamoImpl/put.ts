import * as AWS from 'aws-sdk'
import * as M from 'that-simple-model'
import * as util from 'util'
import * as DynamoUtils from '@/dynamoUtils'
import { DynamoError } from '@/errors/dynamo.error'

/**
 * Put an Item into a DynamoDB
 */
export async function put<T extends M.IModel>(
	c: AWS.DynamoDB.DocumentClient,
	item: T
): Promise<T> {
	// Attempt Put in Dynamo
	try {
		return await util
			.promisify(c.put.bind(c))({
				TableName: DynamoUtils.getTableName(item),
				Item: DynamoUtils.classToDynamo(item)
			})
			.then(() => item)
	} catch (err) {
		// Catch Errors
		throw new DynamoError('Problem Putting to Dynamo', err)
	}
}
