import { encodeDynamo } from './encodeDynamo'
/**
 * Tests for encodeDynamo
 */
describe('encodeDynamo', () => {
	/* should encode NULLs and EMPTY strings */
	it('should encode NULLs and EMPTY strings', async () => {
		const result = encodeDynamo({
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
