import { dynamoToClass } from '@/dynamoUtils/dynamoToClass'
import { MultiKey } from '@/testing'

/**
 * Tests for dynamoToClass
 */
describe('dynamoToClass', () => {
	it('should handle nulls', async () => {
		expect(dynamoToClass(MultiKey, null)).toBeNull()
	})

	it('should convert dynamo objects to classes', async () => {
		expect(dynamoToClass(MultiKey, {}) instanceof MultiKey).toBeTruthy()
	})
})
