import * as M from 'that-simple-model'

/**
 * An example of a SingleKey model
 */
@M.Model({
	description: 'Description',
	kind: 'TestSingleKey'
})
export class TestSingleKey implements M.IModel {
	static meta: M.IMetaModel
	meta: M.IMetaModel

	@M.PrimaryKey
	hash: string

	title: string
}
