import { IObjectStore } from 'that-simple-objectstore'
import * as T from '../testing/index'

/**
 * GET Tests for Dynamo Objectstore
 */
export const GETTests = (args: { objectStore: IObjectStore }) => {

	/* should allow GETting of an item with MULTIple keys by its ID */
	it('should allow GETting of an item with MULTIple keys by its ID', async () => {
		await T.dbGet(`DELETE FROM ${T.MultiKey.meta.kind}`)
		await args.objectStore.put(T.multiKey)
		const data = await args.objectStore.get(T.MultiKey, T.multiKey.hash, T.multiKey.range)
		expect(data instanceof T.MultiKey).toBeTruthy()
		expect((data as T.MultiKey).hash).toBe(T.multiKey.hash)
		expect((data as T.MultiKey).range).toBe(T.multiKey.range)
		expect((data as T.MultiKey).title).toBe(T.multiKey.title)
	})

	/* should allow GETting of an item with SINGLE keys by its ID */
	it('should allow GETting of an item with SINGLE keys by its ID', async () => {
		await T.dbGet(`DELETE FROM ${T.SingleKey.meta.kind}`)
		await args.objectStore.put(T.singleKey)
		const data = await args.objectStore.get(T.SingleKey, T.singleKey.hash)
		expect(data instanceof T.SingleKey).toBeTruthy()
		expect((data as T.SingleKey).hash).toBe(T.singleKey.hash)
		expect((data as T.SingleKey).title).toBe(T.singleKey.title)
	})

}
