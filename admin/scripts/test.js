const BuildUtils = require('that-build-library').BuildUtils

module.exports = Promise.resolve()

	.then(() => BuildUtils.echo('Testing'))
	.then(() =>
		// prettier-ignore
		BuildUtils.exec('nyc', [
			'--reporter', 'html',
			'--reporter', 'text',
			'--reporter', 'lcov',
			'--report-dir', './coverage',
			'--temp-directory', './coverage/tmp',
			'--require', 'tsconfig-paths/register',
			'--require', 'ts-node/register',
			'--all',
			'--check-coverage',
			'--skip-empty',
			'--lines', 100,
			'--branches', 100,
			'--functions', 100,
			'--statements', 100,
			'--per-file',
			'--extension', '.ts',
			'--exclude', "src/testing",
			'--exclude', "**/index.ts",
			'--exclude', '**/*.spec.ts',
			'--exclude', '**/*.subspec.ts',
			'--exclude', 'dist/**',
			'--exclude', 'node_modules/**',
			'--include', 'src',
			'node_modules/.bin/jasmine',
			'src/**/*.spec.ts'
		])
	)
	.catch(e => {
		console.error('An error occurred during unit testing', e)
		process.exit(1)
	})
