import { BuildUtils } from 'that-build-library'
import * as AWS from 'aws-sdk'
import * as util from 'util'

export function InitialiseDynamoDB(): Promise<any> {
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

			.then(() => BuildUtils.echo('Loading Dot Env'))
			.then(() => {
				require('dotenv').load()
			})
	)
}
