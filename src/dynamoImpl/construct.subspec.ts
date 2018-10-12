import { IObjectStore } from 'that-simple-objectstore'
import { DynamoObjectStore } from '../DynamoObjectStore'
import * as T from '../testing/index'

/**
 * CONSTRUCT Tests for Dynamo Objectstore
 */
export const CONSTRUCTTests = (args: { objectStore: IObjectStore }) => {
	/* should allow CONSTRUCTing of tables */
	it('should allow CONSTRUCTing of tables', async () => {
		const result = await args.objectStore.construct(T.TestMultiKey)
		const result2 = await args.objectStore.construct(T.TestSingleKey)
		const result3 = await args.objectStore.construct(T.TestMultiKey)
	})
}
