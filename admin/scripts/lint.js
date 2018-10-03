const BuildUtils = require('that-build-library').BuildUtils

module.exports = Promise.resolve()
	.then(() => BuildUtils.echo('Prettiering SRC Typescript'))
	.then(() => BuildUtils.prettierTS())

	.then(() => BuildUtils.echo('Prettiering Admin Scripts'))
	.then(() => BuildUtils.prettierJS('admin'))

	.catch(console.error)
