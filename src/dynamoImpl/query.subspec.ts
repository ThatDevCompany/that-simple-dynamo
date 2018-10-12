import { IObjectStore } from 'that-simple-objectstore'
import * as T from '../testing/index'

/**
 * QUERY Tests for Dynamo Objectstore
 */
export const QUERYTests = (args: { objectStore: IObjectStore }) => {

	/* should allow simply QUERYing of all items */
	it('should allow simply QUERYing of all items', async () => {
		await T.dbGet(`DELETE FROM ${T.MultiKey.meta.kind}`)
		await args.objectStore.put(T.multiKey)
		const data = await args.objectStore.query(T.MultiKey)
		expect(data).toBeDefined()
		expect(data.items instanceof Array).toBeTruthy()
		expect(data.items.length).toBeGreaterThan(0)
		expect((data.items[0] as T.MultiKey).hash).toBe(T.multiKey.hash)
		expect((data.items[0] as T.MultiKey).range).toBe(T.multiKey.range)
		expect((data.items[0] as T.MultiKey).title).toBe(T.multiKey.title)
	})

}
