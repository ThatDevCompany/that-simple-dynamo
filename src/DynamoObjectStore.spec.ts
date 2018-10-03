import * as sqlite from 'sqlite'
import { DynamoObjectStore } from './DynamoObjectStore'
import { InitialiseDynamoDB, MultiKey, SingleKey } from '@/testing'

/**
 * Run and return a query on the db using SQLite
 * NOTE: We open and close it each time to avoid conflic ts between sqlite
 * and dynamo access
 */
async function dbGet(sql: string) {
	const db: sqlite.Database = await sqlite.open(
		`db/${process.env.AWS_ACCESS_KEY_ID}_${process.env.AWS_REGION}.db`
	)
	const result = await db.get(sql)
	db.close()
	return result
}

/**
 * Tests for Dynamo Objectstore
 */
describe('Dynamo ObjectStore', () => {
	let objectStore
	let multiKey = new MultiKey()
	multiKey.hash = 'ABC'
	multiKey.range = '123'
	multiKey.title = 'Test Item'
	let singleKey = new SingleKey()
	singleKey.hash = 'ABC'
	singleKey.title = 'Test Item'

	// Setup the Test Database
	beforeAll(done => {
		InitialiseDynamoDB().then(() => {
			// Create ObjectStore
			objectStore = new DynamoObjectStore({
				region: process.env.AWS_REGION,
				accessKeyId: process.env.AWS_ACCESS_KEY_ID,
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
				endpoint: process.env.AWS_ENDPOINT
			})
			done()
		})
	}, 20000)

	/* should allow CREATEing of tables */
	it('should allow CREATEing of tables', async () => {
		const result = await objectStore.createTable('TestTable', 'Part', 'Sort')
		expect(result).toBeTruthy()
		const result2 = await objectStore.createTable('TestTable2', 'Part')
		expect(result2).toBeTruthy()
		const result3 = await objectStore.createTable('TestTable', 'Part', 'Sort')
		expect(result3).toBeFalsy()
	})

	/* should allow PUTting of an item with MULTIple keys */
	it('should allow PUTting of an item with MULTIple keys', async () => {
		await dbGet(`DELETE FROM ${MultiKey.meta.kind}`)
		await objectStore.put(multiKey)
		const data = await dbGet(
			`SELECT *
			FROM ${multiKey.meta.kind}
			WHERE hashKey LIKE "${multiKey.hash}"
			AND rangeKey LIKE "${multiKey.range}"`
		)
		expect(data).toBeDefined()
		expect(data.hashKey.toString()).toBe(multiKey.hash)
		expect(data.rangeKey.toString()).toBe(multiKey.range)
		expect(true).toBeTruthy()
	})

	/* should allow PUTting of an item with SINGLE keys */
	it('should allow PUTting of an item with SINGLE keys', async () => {
		await dbGet(`DELETE FROM ${SingleKey.meta.kind}`)
		await objectStore.put(singleKey)
		const data = await dbGet(
			`SELECT *
			FROM ${singleKey.meta.kind}
			WHERE hashKey LIKE "${singleKey.hash}"`
		)
		expect(data).toBeDefined()
		expect(data.hashKey.toString()).toBe(singleKey.hash)
	})

	/* should allow GETting of an item with MULTIple keys by its ID */
	it('should allow GETting of an item with MULTIple keys by its ID', async () => {
		await dbGet(`DELETE FROM ${MultiKey.meta.kind}`)
		await objectStore.put(multiKey)
		const data = await objectStore.get(MultiKey, multiKey.hash, multiKey.range)
		expect(data instanceof MultiKey).toBeTruthy()
		expect((data as MultiKey).hash).toBe(multiKey.hash)
		expect((data as MultiKey).range).toBe(multiKey.range)
		expect((data as MultiKey).title).toBe(multiKey.title)
	})

	/* should allow GETting of an item with SINGLE keys by its ID */
	it('should allow GETting of an item with SINGLE keys by its ID', async () => {
		await dbGet(`DELETE FROM ${SingleKey.meta.kind}`)
		await objectStore.put(singleKey)
		const data = await objectStore.get(SingleKey, singleKey.hash)
		expect(data instanceof SingleKey).toBeTruthy()
		expect((data as SingleKey).hash).toBe(singleKey.hash)
		expect((data as SingleKey).title).toBe(singleKey.title)
	})

	/* should allow simply QUERYing of all items */
	it('should allow simply QUERYing of all items', async () => {
		await dbGet(`DELETE FROM ${MultiKey.meta.kind}`)
		await objectStore.put(multiKey)
		const data = await objectStore.query(MultiKey)
		expect(data).toBeDefined()
		expect(data.items instanceof Array).toBeTruthy()
		expect(data.items.length).toBeGreaterThan(0)
		console.log('here', data)
		expect((data.items[0] as MultiKey).hash).toBe(multiKey.hash)
		expect((data.items[0] as MultiKey).range).toBe(multiKey.range)
		expect((data.items[0] as MultiKey).title).toBe(multiKey.title)
	})

	/* should allow DELETEing of an item by its ID */
	it('should allow DELETEing of an item by its ID', async () => {
		await dbGet(`DELETE FROM ${MultiKey.meta.kind}`)
		await objectStore.put(multiKey)
		await objectStore.remove(multiKey)
		const data = await dbGet(
			`SELECT *
			FROM ${multiKey.meta.kind}
			WHERE hashKey LIKE "${multiKey.hash}"
			AND rangeKey LIKE "${multiKey.range}"`
		)
		expect(data).toBeUndefined()
	})
})
