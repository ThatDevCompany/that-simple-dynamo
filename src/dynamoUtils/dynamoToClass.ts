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
	return plainToClass<T, object>(cls, dynamoItem)
}
