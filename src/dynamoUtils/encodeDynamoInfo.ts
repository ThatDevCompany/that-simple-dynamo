import * as _ from 'lodash'

/**
 * Encodes an object so it can be persisted into dynamo
 */
export function encodeDynamoInfo(info: any): any {
	return _.cloneDeepWith(info, value => {
		// Replace EMPTY strings
		if (value === '') {
			return 'EMPTY'
		}
		// Replace NULL strings
		if (value === null) {
			return 'NULL'
		}
	})
}
