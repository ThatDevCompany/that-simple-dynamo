import * as M from 'that-simple-model'
import { singleKey } from '@/testing/SingleKeyModel'

/**
 * Example of a MultiKey model
 */
@M.Model({
	description: 'Description',
	kind: 'MultiKey'
})
export class MultiKey implements M.IModel {
	static meta: M.IMetaModel
	meta: M.IMetaModel

	@M.PrimaryKey
	hash: string

	@M.SecondaryKey
	range: string

	title: string

	description: string
}

export const multiKey = new MultiKey()
multiKey.hash = 'ABC'
multiKey.range = '123'
multiKey.title = 'Test Item'
multiKey.description = 'Test Description'

export const multiKey2 = new MultiKey()
multiKey2.hash = 'ABC'
multiKey2.range = '234'
multiKey2.title = 'Test Item 2'
multiKey2.description = 'Test Description 2'

export const multiKey3 = new MultiKey()
multiKey3.hash = 'XYZ'
multiKey3.range = '345'
multiKey3.title = 'Test Item 3'
multiKey3.description = 'Test Description 3'

export const multiKey4 = new MultiKey()
multiKey4.hash = 'XYZ'
multiKey4.range = '456'
multiKey4.title = 'Test Item 4'
multiKey4.description = 'Test Description 4'
