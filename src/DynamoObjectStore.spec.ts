import { IObjectStore } from 'that-simple-objectstore'
import { DynamoObjectStore } from './DynamoObjectStore'
import * as T from '@/testing'
import { CONSTRUCTTests } from './dynamoImpl/construct.subspec'
import { REMOVETests } from './dynamoImpl/remove.subspec'
import { GETTests } from './dynamoImpl/get.subspec'
import { PUTTests } from './dynamoImpl/put.subspec'
import { QUERYTests } from './dynamoImpl/query.subspec'

/**
 * Tests for Dynamo Objectstore
 */
describe('Dynamo ObjectStore', () => {
	let args = {
		objectStore: null
	}

	// Setup the Test Database
	beforeAll(done => {
		T.InitialiseDynamoDB().then(() => {
			// Create ObjectStore
			args.objectStore = new DynamoObjectStore({
				region: process.env.AWS_REGION,
				accessKeyId: process.env.AWS_ACCESS_KEY_ID,
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
				endpoint: process.env.AWS_ENDPOINT
			})
			done()
		})
	}, 20000)

	CONSTRUCTTests(args)
	REMOVETests(args)
	GETTests(args)
	PUTTests(args)
	QUERYTests(args)

})
