import { IMetaModel, IModel, IModelClass } from 'that-simple-model'

/**
 * Returns the Table name for a given Item or Class
 */
export function getTableName<T extends IModel>(
	itemOrClass: T | IModelClass<T>
): any {
	let meta: IMetaModel =
		typeof itemOrClass === 'object'
			? (itemOrClass as IModel).meta
			: (itemOrClass as IModelClass<T>).meta
	return meta.kind
}
