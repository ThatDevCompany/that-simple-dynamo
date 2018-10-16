import * as M from 'that-simple-model'

/**
 * Example of a MultiKey model
 */
@M.Model({
	description: 'Description',
	kind: 'TestMultiKey'
})
export class TestMultiKey implements M.IModel {
	static meta: M.IMetaModel
	meta: M.IMetaModel

	@M.PrimaryKey
	hash: string

	@M.SecondaryKey
	range: string

	title: string
}
