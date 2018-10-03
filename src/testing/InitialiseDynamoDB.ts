import { BuildUtils } from 'that-build-library'
import * as AWS from 'aws-sdk'
import * as util from 'util'

export function InitialiseDynamoDB(): Promise<any> {
	let createTable

	return (
		Promise.resolve()

			/* INITIALISE DYNAMO */
			.then(() => BuildUtils.echo('Stopping DynamoDB Docker'))
			.then(() => BuildUtils.exec('docker', ['stop', 'thatSimpleORM'], true))
			.catch(() => {})

			.then(() => BuildUtils.echo('Removing DynamoDB Docker'))
			.then(() => BuildUtils.exec('docker', ['rm', 'thatSimpleORM'], true))
			.catch(() => {})

			.then(() => BuildUtils.echo('Cleaning'))
			.then(() => BuildUtils.clean('db', true))
			.catch(() => {})

			.then(() => BuildUtils.echo('Starting DynamoDB Docker'))
			.then(() =>
				// prettier-ignore
				BuildUtils.exec('docker', ['run',
				'--volume', __dirname + '/../../db:/db',
				'--publish', '8001:8000',
				'--detach',
				'--name', 'thatSimpleORM',
				'amazon/dynamodb-local', '-jar', 'DynamoDBLocal.jar', '-dbPath', '/db',
			])
			)
			.catch(console.error)

			.then(() => BuildUtils.echo('Initializing DynamoDB Connection'))
			.then(() => {
				require('dotenv').load()
				AWS.config.update({
					region: process.env.AWS_REGION,
					accessKeyId: process.env.AWS_ACCESS_KEY_ID,
					secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
					endpoint: process.env.AWS_ENDPOINT
				} as any)
				const dynamodb = new AWS.DynamoDB()
				createTable = util.promisify(dynamodb.createTable.bind(dynamodb))
			})
			.catch(console.error)

			/* CREATE MULTIKEY TABLE */
			.then(() => BuildUtils.echo('Creating MultiKey Table'))
			.then(() =>
				// prettier-ignore
				createTable({
				TableName: "MultiKey",
				KeySchema: [
					{AttributeName: "hash", KeyType: "HASH"},
					{AttributeName: "range", KeyType: "RANGE"}
				],
				AttributeDefinitions: [
					{AttributeName: "hash", AttributeType: "S"},
					{AttributeName: "range", AttributeType: "S"}
				],
				ProvisionedThroughput: {
					ReadCapacityUnits: 10,
					WriteCapacityUnits: 10
				}
			})
			)
			.catch(console.error)

			/* CREATE SINGLEKEY TABLE */
			.then(() => BuildUtils.echo('Creating SingleKey Table'))
			.then(() =>
				// prettier-ignore
				createTable({
				TableName: "SingleKey",
				KeySchema: [
					{AttributeName: "hash", KeyType: "HASH"},
				],
				AttributeDefinitions: [
					{AttributeName: "hash", AttributeType: "S"},
				],
				ProvisionedThroughput: {
					ReadCapacityUnits: 10, WriteCapacityUnits: 10
				}
			})
			)
			.catch(console.error)
	)
}
