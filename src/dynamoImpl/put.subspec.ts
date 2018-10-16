import { IObjectStore } from 'that-simple-objectstore'
import * as T from '../testing'

/**
 * PUT Tests for Dynamo Objectstore
 */
export const PUTTests = (args: { objectStore: IObjectStore }) => {
	/* should allow PUTting of an item with MULTIple keys */
	it('should allow PUTting of an item with MULTIple keys', async () => {
		await T.emptyTable(T.MultiKey)
		await args.objectStore.put(T.multiKey)
		const data = await T.getData(
			`SELECT *
			FROM ${T.multiKey.meta.kind}
			WHERE hashKey LIKE "${T.multiKey.hash}"
			AND rangeKey LIKE "${T.multiKey.range}"`
		)
		expect(data).toBeDefined()
		expect(data.hashKey.toString()).toBe(T.multiKey.hash)
		expect(data.rangeKey.toString()).toBe(T.multiKey.range)
		expect(true).toBeTruthy()
	})

	/* should allow REPUTting (updating) of an item with MULTIple keys */
	it('should allow REPUTting (updating) of an item with MULTIple keys', async () => {
		await T.emptyTable(T.MultiKey)
		const multiKey = new T.MultiKey()
		multiKey.hash = 'EFG'
		multiKey.range = '321'
		multiKey.title = 'Test Item'
		multiKey.description = 'Test Description'
		await args.objectStore.put(multiKey)
		multiKey.title = 'UPDATE Test'
		await args.objectStore.put(multiKey)
		const result = await args.objectStore.query(T.MultiKey, {
			where: { title: 'UPDATE Test' }
		})
		expect(result.items.length).toBe(1)
		expect(result.items[0].hash).toBe(multiKey.hash)
		expect(result.items[0].range).toBe(multiKey.range)
	})

	/* should allow PUTting of an item with SINGLE keys */
	it('should allow PUTting of an item with SINGLE keys', async () => {
		await T.emptyTable(T.SingleKey)
		await args.objectStore.put(T.singleKey)
		const data = await T.getData(
			`SELECT *
			FROM ${T.singleKey.meta.kind}
			WHERE hashKey LIKE "${T.singleKey.hash}"`
		)
		expect(data).toBeDefined()
		expect(data.hashKey.toString()).toBe(T.singleKey.hash)
	})
}
