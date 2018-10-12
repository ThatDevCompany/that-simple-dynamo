import { IObjectStore } from 'that-simple-objectstore'
import * as T from '../testing/index'

/**
 * PUT Tests for Dynamo Objectstore
 */
export const PUTTests = (args: { objectStore: IObjectStore }) => {
	/* should allow PUTting of an item with MULTIple keys */
	it('should allow PUTting of an item with MULTIple keys', async () => {
		await T.dbGet(`DELETE FROM ${T.MultiKey.meta.kind}`)
		await args.objectStore.put(T.multiKey)
		const data = await T.dbGet(
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

	/* should allow PUTting of an item with SINGLE keys */
	it('should allow PUTting of an item with SINGLE keys', async () => {
		await T.dbGet(`DELETE FROM ${T.SingleKey.meta.kind}`)
		await args.objectStore.put(T.singleKey)
		const data = await T.dbGet(
			`SELECT *
			FROM ${T.singleKey.meta.kind}
			WHERE hashKey LIKE "${T.singleKey.hash}"`
		)
		expect(data).toBeDefined()
		expect(data.hashKey.toString()).toBe(T.singleKey.hash)
	})
}
