const BuildUtils = require('that-build-library').BuildUtils

module.exports = Promise.resolve()
	.then(() => require('./lint'))
	.then(() => require('./build'))
	.then(() => BuildUtils.echo('PUBLISHING'))
	.then(() =>
		BuildUtils.publish('dist', pkg => {
			delete pkg.scripts
			delete pkg.devDependencies
		})
	)
	.catch(console.error)
