import { decodeDynamo } from './decodeDynamo'

/**
 * Tests for decodeDynamoInfo
 */
describe('decodeDynamoInfo', () => {
	/* should decode NULLs and EMPTY strings */
	it('should decode NULLs and EMPTY strings', async () => {
		const result = decodeDynamo({
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
