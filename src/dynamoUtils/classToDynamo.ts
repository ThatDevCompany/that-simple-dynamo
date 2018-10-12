import { classToPlain } from 'class-transformer'
import * as _ from 'lodash'
import { IModel } from 'that-simple-model'

/**
 * Returns a Dynamo object from a given Model item
 */
export function classToDynamo<T extends IModel>(item: T): any {
	// Set Primary Key Attribute and Document
	const retVal: object = {
		[item.meta.primaryKey]: item[item.meta.primaryKey],
		info: this.encodeDynamoInfo(classToPlain(item))
	}
	// Add Secondary Key Attribute
	if (item.meta.secondaryKey) {
		retVal[item.meta.secondaryKey] = item[item.meta.secondaryKey]
	}
	// Add additional Searchables
	_.get(item, 'meta.searchables', []).forEach(searchable => {
		retVal[searchable] = item[searchable]
	})
	return retVal
}
