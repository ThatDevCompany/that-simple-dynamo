import * as AWS from 'aws-sdk'
import { IModel, IModelClass, IMetaModel } from 'that-simple-model'
import * as util from 'util'

/**
 * Construct a Table inside a DynamoDB
 */
export async function construct<T extends IModel>(
	d: AWS.DynamoDB,
	cls: IModelClass<T>
): Promise<void> {
	let m: IMetaModel = cls.meta,
		ks = [],
		ad = [],
		gsi = []

	ks.push({ AttributeName: m.primaryKey, KeyType: 'HASH' })
	ad.push({ AttributeName: m.primaryKey, AttributeType: 'S' })
	ad.push({ AttributeName: 'title', AttributeType: 'S' })

	if (m.secondaryKey) {
		ks.push({ AttributeName: m.secondaryKey, KeyType: 'RANGE' })
		ad.push({ AttributeName: m.secondaryKey, AttributeType: 'S' })
	}

	// Create The Table
	await util
		.promisify(d.createTable.bind(d))({
			TableName: m.kind,
			KeySchema: ks,
			AttributeDefinitions: ad,
			ProvisionedThroughput: {
				ReadCapacityUnits: 10,
				WriteCapacityUnits: 10
			}
		})
		.catch(() => {})

	// If there are no additional searchables, we're done
	if (!m.searchables.length) {
		return
	}

	// Add any necessary Attributes
	m.searchables.forEach(searchable => {
		ad.push({ AttributeName: searchable, AttributeType: 'S' })
	})
	// Update the Table with the new attributes
	await util
		.promisify(d.updateTable.bind(d))({
			TableName: m.kind,
			AttributeDefinitions: ad
		})
		.catch(() => {})
}
