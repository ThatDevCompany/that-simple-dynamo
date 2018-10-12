import { IObjectStore } from 'that-simple-objectstore'
import * as T from '../testing/index'

/**
 * REMOVE Tests for Dynamo Objectstore
 */
export const REMOVETests = (args: { objectStore: IObjectStore }) => {

	/* should allow REMOVEing of an item by its ID */
	it('should allow REMOVEing of an item by its ID', async () => {
		await T.dbGet(`DELETE FROM ${T.MultiKey.meta.kind}`)
		await args.objectStore.put(T.multiKey)
		await args.objectStore.remove(T.multiKey)
		const data = await T.dbGet(
			`SELECT *
			FROM ${T.multiKey.meta.kind}
			WHERE hashKey LIKE "${T.multiKey.hash}"
			AND rangeKey LIKE "${T.multiKey.range}"`
		)
		expect(data).toBeUndefined()
	})

}
