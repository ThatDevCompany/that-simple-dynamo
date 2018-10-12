import { IObjectStore, ObjectStoreQueryStatus } from 'that-simple-objectstore'
import * as T from '../testing/index'

/**
 * QUERY Tests for Dynamo Objectstore
 */
export const QUERYTests = (args: { objectStore: IObjectStore }) => {
	const initDb = async () => {
		await T.dbGet(`DELETE FROM ${T.MultiKey.meta.kind}`)
		await args.objectStore.put(T.multiKey)
		await args.objectStore.put(T.multiKey2)
		await args.objectStore.put(T.multiKey3)
		await args.objectStore.put(T.multiKey4)
	}

	const validate = (result, length, first?) => {
		expect(result).toBeDefined()
		expect(result.status).toBe(ObjectStoreQueryStatus.OK)
		expect(result.items instanceof Array).toBeTruthy()
		expect(result.items.length).toBe(length)
		if (first) {
			expect((result.items[0] as T.MultiKey).hash).toBe(first.hash)
			expect((result.items[0] as T.MultiKey).range).toBe(first.range)
			expect((result.items[0] as T.MultiKey).title).toBe(first.title)
		}
	}

	/* should allow QUERYing of all items */
	it('should allow QUERYing of all items', async () => {
		await initDb()
		const data = await args.objectStore.query(T.MultiKey)
		validate(data, 4)
	})

	/* should allow QUERYing against primary key */
	it('should allow QUERYing against primary key', async () => {
		await initDb()
		const data = await args.objectStore.query(T.MultiKey, {
			where: { hash: T.multiKey.hash }
		})
		validate(data, 2)
	})

	/* should allow QUERYing against secondary key */
	it('should allow QUERYing against secondary key', async () => {
		await initDb()
		const data = await args.objectStore.query(T.MultiKey, {
			where: { range: T.multiKey2.range }
		})
		validate(data, 1, T.multiKey2)
	})

	/* should allow QUERYing against a searchable attribute */
	it('should allow QUERYing against a searchable attribute', async () => {
		await initDb()
		const data = await args.objectStore.query(T.MultiKey, {
			where: { title: T.multiKey3.title }
		})
		validate(data, 1, T.multiKey3)
	})

	/* should NOT allow QUERYing against a NON searchable attribute */
	it('should NOT allow QUERYing against a NON searchable attribute', async () => {
		await initDb()
		const data = await args.objectStore.query(T.MultiKey, {
			where: { description: T.multiKey4.description }
		})
		expect(data.status).toBe(ObjectStoreQueryStatus.ERROR)
	})
}
