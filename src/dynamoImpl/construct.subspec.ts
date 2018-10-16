import { IObjectStore } from 'that-simple-objectstore'
import * as T from '../testing'

/**
 * CONSTRUCT Tests for Dynamo Objectstore
 */
export const CONSTRUCTTests = (args: { objectStore: IObjectStore }) => {
	/* should allow CONSTRUCTing of tables */
	it('should allow CONSTRUCTing of tables', async () => {
		await args.objectStore.construct(T.TestMultiKey)
		await args.objectStore.construct(T.TestSingleKey)
		await args.objectStore.construct(T.TestMultiKey)
	})
}
