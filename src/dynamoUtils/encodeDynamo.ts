import * as _ from 'lodash'

/**
 * Encodes an object so it can be persisted into dynamo
 */
export function encodeDynamo(obj: any): any {
	return _.cloneDeepWith(obj, value => {
		// Replace EMPTY strings
		if (value === '') {
			return '___EMPTY___'
		}
		// Replace NULL strings
		if (value === null) {
			return '___NULL___'
		}
		// Replace DATE strings
		if (value instanceof Date) {
			return '___DATE___' + value.toISOString()
		}
	})
}
