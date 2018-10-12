import * as AWS from 'aws-sdk'
import { IModel, IModelClass } from 'that-simple-model'
import * as util from 'util'

/**
 * Construct a Table inside a DynamoDB
 */
export async function construct<T extends IModel>(d: AWS.DynamoDB, cls: IModelClass<T>): Promise<void> {
	let m = cls.meta,
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
	await util.promisify(d.createTable.bind(d))({
		TableName: m.kind,
		KeySchema: ks,
		AttributeDefinitions: ad,
		ProvisionedThroughput: {
			ReadCapacityUnits: 10,
			WriteCapacityUnits: 10
		}
	}).catch(() => {})

	// If there are no additional indexes, we're done
	if (!m.indexes.length) { return }

	// Add any necessary Attributes
	m.indexes.forEach(index => {
		// If there is no attribute already for the primary key, add it
		if (!ad.some(a => a.AttributeName === index.primaryKey)) {
			ad.push({ AttributeName: index.primaryKey, AttributeType: 'S' })
		}
		// If there is no attribute already for the secondary key, add it
		if (!ad.some(a => a.AttributeName === index.secondaryKey)) {
			ad.push({ AttributeName: index.secondaryKey, AttributeType: 'S' })
		}
	})
	// Update the Table with the new attributes
	await util.promisify(d.updateTable.bind(d))({
		TableName: m.kind,
		AttributeDefinitions: ad
	}).catch(() => {})

	// Add Searchable Indexes
	m.indexes.forEach(index => {
		gsi.push({
			Create: {
				IndexName: index.primaryKey + index.secondaryKey + 'Index',
				KeySchema: [
					{AttributeName: index.primaryKey, KeyType: "HASH"},
					{AttributeName: index.secondaryKey, KeyType: "RANGE"}
				],
				Projection: {
					"ProjectionType": "ALL"
				},
				ProvisionedThroughput: {
					"ReadCapacityUnits": 1,"WriteCapacityUnits": 1
				}
			}
		})
	})

	// Update the Table with the new Indexes
	await util.promisify(d.updateTable.bind(d))({
		TableName: m.kind,
		GlobalSecondaryIndexUpdates: gsi
	}).catch(() => {})
}