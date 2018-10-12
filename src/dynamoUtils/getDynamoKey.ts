import { IMetaModel, IModel, IModelClass } from 'that-simple-model'

/**
 * Returns an Dynamo Key object for a given Model object or class
 */
export function getDynamoKey<T extends IModel>(
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
}
