import * as _ from 'lodash'

/**
 * Encodes an object so it can be persisted into dynamo
 */
export function encodeDynamo(obj: any): any {
	return _.cloneDeepWith(obj, value => {
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
