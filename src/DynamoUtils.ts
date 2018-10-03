import { classToPlain, plainToClass } from 'class-transformer'
import * as _ from 'lodash'
import { IMetaModel, IModel, IModelClass } from 'that-simple-model'

/**
 * A collection of Dynamo utility functions
 */
export const DynamoUtils = {
	/**
	 * Returns an Dynamo Table name for a given Model object or class
	 */
	getTableName<T extends IModel>(itemOrClass: T | IModelClass<T>): any {
		let meta: IMetaModel =
			typeof itemOrClass === 'object'
				? (itemOrClass as IModel).meta
				: (itemOrClass as IModelClass<T>).meta
		return meta.kind
	},

	/**
	 * Returns an Dynamo Key object for a given Model object or class
	 */
	getDynamoKey<T extends IModel>(
		itemOrClass: T | IModelClass<T>,
		partitionKey?: string | number,
		sortingKey?: string | number
	): any {
		const isItem = typeof itemOrClass === 'object'
		const meta: IMetaModel = isItem
			? (itemOrClass as IModel).meta
			: (itemOrClass as IModelClass<T>).meta

		const key = {
			[meta.primaryKey]: isItem
				? (itemOrClass as IModel)[meta.primaryKey]
				: partitionKey
		}
		if (meta.secondaryKey) {
			key[meta.secondaryKey] = isItem
				? (itemOrClass as IModel)[meta.secondaryKey]
				: sortingKey
		}
		return key
	},

	/**
	 * Returns a Model from a given dynamo object
	 */
	dynamoToClass<T extends IModel>(cls: IModelClass<T>, dynamoItem: any): T {
		if (!dynamoItem) {
			return null
		}
		const retVal: object = {
			[cls.meta.primaryKey]: dynamoItem[cls.meta.primaryKey],
			...this.decodeDynamoInfo(dynamoItem.info)
		}
		if (cls.meta.secondaryKey) {
			retVal[cls.meta.secondaryKey] = dynamoItem[cls.meta.secondaryKey]
		}
		return plainToClass(cls, retVal)
	},

	/**
	 * Returns a Dynamo object from a given Model item
	 */
	classToDynamo<T extends IModel>(item: T): any {
		const retVal: object = {
			[item.meta.primaryKey]: item[item.meta.primaryKey],
			info: this.encodeDynamoInfo(classToPlain(item))
		}
		if (item.meta.secondaryKey) {
			retVal[item.meta.secondaryKey] = item[item.meta.secondaryKey]
		}
		return retVal
	},

	/**
	 * Encodes an object so it can be persisted into dynamo
	 */
	encodeDynamoInfo(info: any): any {
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
	},

	/**
	 * Decodes an object that has been persisted in dynamo
	 */
	decodeDynamoInfo(info: any): any {
		return _.cloneDeepWith(info, value => {
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
}
