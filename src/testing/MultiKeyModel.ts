import {
	Model,
	PrimaryKey,
	SecondaryKey,
	IMetaModel,
	IModel
} from 'that-simple-model'

/**
 * Example of a MultiKey model
 */
@Model({
	description: 'Description',
	kind: 'MultiKey'
})
export class MultiKey implements IModel {
	static meta: IMetaModel
	meta: IMetaModel

	@PrimaryKey
	hash: string

	@SecondaryKey
	range: string

	title: string
}
