import { classToPlain } from 'class-transformer'
import * as _ from 'lodash'
import { IModel } from 'that-simple-model'
import { encodeDynamo } from '@/dynamoUtils/encodeDynamo'

/**
 * Returns a Dynamo object from a given Model item
 */
export function classToDynamo<T extends IModel>(item: T): any {
	return encodeDynamo(classToPlain(item))
}
