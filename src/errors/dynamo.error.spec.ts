import { DynamoError } from './dynamo.error'

/**
 * Tests for GeneralError
 */
describe('GeneralError', () => {
	/**
	 * General Tests
	 */
	it('should be defined', async () => {
		expect(DynamoError).toBeDefined()
	})

	it('should be instantiable', async () => {
		const err = new DynamoError()
		expect(err).toBeDefined()
	})
})
