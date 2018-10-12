import { plainToClass } from 'class-transformer'
import * as _ from 'lodash'
import { IModel, IModelClass } from 'that-simple-model'

/**
 * Returns a Model from a given dynamo object
 */
export function dynamoToClass<T extends IModel>(
	cls: IModelClass<T>,
	dynamoItem: any
): T {
	if (!dynamoItem) {
		return null
	}
	const retVal: object = {}

	// Set Key Attributes
	retVal[cls.meta.primaryKey] = dynamoItem[cls.meta.primaryKey]
	if (cls.meta.secondaryKey) {
		retVal[cls.meta.secondaryKey] = dynamoItem[cls.meta.secondaryKey]
	}

	// Set Searchable Attributes
	_.get(cls, 'meta.searchables', []).forEach(searchable => {
		retVal[searchable] = dynamoItem[searchable]
	})

	// Set Document
	Object.assign(retVal, this.decodeDynamoInfo(dynamoItem.info))

	// Return the Class
	return plainToClass(cls, retVal)
}
