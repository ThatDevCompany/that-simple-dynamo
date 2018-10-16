import * as _ from 'lodash'

/**
 * Decodes an object that has been persisted in dynamo
 */
export function decodeDynamo(obj: any): any {
	return _.cloneDeepWith(obj, value => {
		// Replace EMPTY strings
		if (value === 'EMPTY') {
			return ''
		}
		// Replace NULL strings
		if (value === 'NULL') {
			return null
		}
	})
}
