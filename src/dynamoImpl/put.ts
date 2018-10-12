import * as AWS from 'aws-sdk'
import * as M from 'that-simple-model'
import * as util from 'util'
import * as DynamoUtils from '@/dynamoUtils'

/**
 * Put an Item into a DynamoDB
 */
export async function put<T extends M.IModel>(c: AWS.DynamoDB.DocumentClient, item: T): Promise<T> {
	return util
		.promisify(c.put.bind(c))({
			TableName: DynamoUtils.getTableName(item),
			Item: DynamoUtils.classToDynamo(item)
		})
		.then(() => item)
}
