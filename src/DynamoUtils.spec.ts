import { DynamoUtils } from './DynamoUtils'
import { MultiKey } from './testing'

/**
 * Tests for DynamoUtils
 */
describe('DynamoUtils.decodeDynamoInfo', () => {
	/* should decode NULLs and EMPTY strings */
	it('should decode NULLs and EMPTY strings', async () => {
		const result = DynamoUtils.decodeDynamoInfo({
			a: 'NULL',
			b: {
				c: 'ABC',
				d: 'NULL',
				e: 'EMPTY'
			},
			f: 'EMPTY'
		})
		expect(result.a).toBeNull()
		expect(result.b.c).toBe('ABC')
		expect(result.b.d).toBeNull()
		expect(result.b.e).toBe('')
		expect(result.f).toBe('')
	})
})

describe('DynamoUtils.encodeDynamoInfo', () => {
	/* should encode NULLs and EMPTY strings */
	it('should encode NULLs and EMPTY strings', async () => {
		const result = DynamoUtils.encodeDynamoInfo({
			a: null,
			b: {
				c: 'ABC',
				d: null,
				e: ''
			},
			f: ''
		})
		expect(result.a).toBe('NULL')
		expect(result.b.c).toBe('ABC')
		expect(result.b.d).toBe('NULL')
		expect(result.b.e).toBe('EMPTY')
		expect(result.f).toBe('EMPTY')
	})
})

describe('DynamoUtils.getTableName', () => {
	/* should return the tablename for a Model class */
	it('should return the tablename for a Model class', async () => {
		const result = DynamoUtils.getTableName(MultiKey)
		expect(result).toBe(MultiKey.meta.kind)
	})

	/* should return the tablename for a Model item */
	it('should return the tablename for a Model item', async () => {
		const result = DynamoUtils.getTableName(new MultiKey())
		expect(result).toBe(MultiKey.meta.kind)
	})
})
