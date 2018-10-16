import { plainToClass } from 'class-transformer'
import * as _ from 'lodash'
import { IModel, IModelClass } from 'that-simple-model'
import { decodeDynamo } from '@/dynamoUtils/decodeDynamo'

/**
 * Returns a Model from a given dynamo object
 */
export function dynamoToClass<T extends IModel>(
	cls: IModelClass<T>,
	dynamoObject: any
): T {
	if (!dynamoObject) {
		return null
	}
	return plainToClass<T, object>(cls, decodeDynamo(dynamoObject))
}
