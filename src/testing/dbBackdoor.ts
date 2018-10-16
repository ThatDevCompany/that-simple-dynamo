import * as sqlite from 'sqlite'
import * as AWS from 'aws-sdk'
import * as util from 'util'
import { IModelClass, IModel } from 'that-simple-model'
import { construct } from '../dynamoImpl'

/**
 * Run and return a query on the db using SQLite
 * NOTE: We open and close it each time to avoid conflic ts between sqlite
 * and dynamo access
 //  */
export async function getData(sql: string) {
	const db: sqlite.Database = await sqlite.open(
		`db/${process.env.AWS_ACCESS_KEY_ID}_${process.env.AWS_REGION}.db`
	)

	const result = await db.get(sql)
	db.close()
	return result
}

/**
 * Empty the table
 * NOTE: We can't just use SQL for this because of DynamoDB caching etc
 * The easiest way to empty a table is to delete it and recreate it
 */
export async function emptyTable<T extends IModel>(
	cls: IModelClass<T>
): Promise<void> {
	AWS.config.update({
		region: process.env.AWS_REGION,
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		endpoint: process.env.AWS_ENDPOINT
	} as AWS.DynamoDB.ClientConfiguration)

	const d = new AWS.DynamoDB()
	await util.promisify(d.deleteTable.bind(d))({
		TableName: cls.meta.kind
	})
	return construct(new AWS.DynamoDB(), cls)
}
