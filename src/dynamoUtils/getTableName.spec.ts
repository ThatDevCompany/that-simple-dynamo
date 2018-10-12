import { getTableName } from './getTableName'
import { MultiKey } from '@/testing'

/**
 * Tests for getTableName
 */
describe('getTableName', () => {
	/* should return the tablename for a Model class */
	it('should return the tablename for a Model class', async () => {
		const result = getTableName(MultiKey)
		expect(result).toBe(MultiKey.meta.kind)
	})

	/* should return the tablename for a Model item */
	it('should return the tablename for a Model item', async () => {
		const result = getTableName(new MultiKey())
		expect(result).toBe(MultiKey.meta.kind)
	})
})
