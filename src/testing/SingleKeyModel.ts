import * as M from 'that-simple-model'

/**
 * An example of a SingleKey model
 */
@M.Model({
	description: 'Description',
	kind: 'SingleKey'
})
export class SingleKey implements M.IModel {
	static meta: M.IMetaModel
	meta: M.IMetaModel

	@M.PrimaryKey
	hash: string

	title: string

	description: string
}

export const singleKey = new SingleKey()
singleKey.hash = 'ABC'
singleKey.title = 'Test Item'
singleKey.description = 'Test Description'
