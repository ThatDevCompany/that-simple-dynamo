import { Model, PrimaryKey, IMetaModel, IModel } from 'that-simple-model'

/**
 * An example of a SingleKey model
 */
@Model({
	description: 'Description',
	kind: 'TestSingleKey',
	indexes: [
		{ primaryKey: 'hash', secondaryKey: 'title' }
	]
})
export class TestSingleKey implements IModel {
	static meta: IMetaModel
	meta: IMetaModel

	@PrimaryKey
	hash: string

	title: string
}
