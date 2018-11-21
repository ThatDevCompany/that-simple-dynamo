import { IObjectStore } from 'that-simple-objectstore'
import * as T from '../testing'

/**
 * REMOVE Tests for Dynamo Objectstore
 */
export const REMOVETests = (args: { objectStore: IObjectStore }) => {
	it('should allow REMOVEing of an item by its ID', async () => {
		await T.emptyTable(T.MultiKey)
		await args.objectStore.put(T.multiKey)
		await args.objectStore.remove(T.multiKey)
		const data = await T.getData(
			`SELECT *
			FROM ${T.multiKey.meta.kind}
			WHERE hashKey LIKE "${T.multiKey.hash}"
			AND rangeKey LIKE "${T.multiKey.range}"`
		)
		expect(data).toBeUndefined()
	})
}
