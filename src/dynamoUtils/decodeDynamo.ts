import * as _ from 'lodash'

/**
 * Decodes an object that has been persisted in dynamo
 */
export function decodeDynamo(obj: any): any {
	return _.cloneDeepWith(obj, value => {
		// Replace EMPTY strings
		if (value === '___EMPTY___') {
			return ''
		}
		// Replace NULL strings
		if (value === '___NULL___') {
			return null
		}
		// Replace DATE strings
		if (typeof value === 'string' && value.startsWith('___DATE___')) {
			return new Date(value.split('___DATE___').join(''))
		}
	})
}
