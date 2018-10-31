import * as AWS from 'aws-sdk'
import { IModel, IModelClass, IMetaModel } from 'that-simple-model'
import * as util from 'util'
import { DynamoError } from '@/errors/dynamo.error'

/**
 * Construct a Table inside a DynamoDB
 */
export async function construct<T extends IModel>(
	d: AWS.DynamoDB,
	cls: IModelClass<T>
): Promise<void> {
	// Attempt Dynamo Table Construction
	try {
		let m: IMetaModel = cls.meta,
			ks = [],
			ad = [],
			gsi = []

		ks.push({ AttributeName: m.primaryKey, KeyType: 'HASH' })
		ad.push({ AttributeName: m.primaryKey, AttributeType: 'S' })

		if (m.secondaryKey) {
			ks.push({ AttributeName: m.secondaryKey, KeyType: 'RANGE' })
			ad.push({ AttributeName: m.secondaryKey, AttributeType: 'S' })
		}

		// Create The Table
		return await util.promisify(d.createTable.bind(d))({
			TableName: m.kind,
			KeySchema: ks,
			AttributeDefinitions: ad,
			ProvisionedThroughput: {
				ReadCapacityUnits: 10,
				WriteCapacityUnits: 10
			}
		})
	} catch (err) {
		// Catch Errors
		throw new DynamoError('Problem constructing table', err)
	}
}
