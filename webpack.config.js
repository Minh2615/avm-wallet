/**
 * WordPress dependencies
 */
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

/**
 * External dependencies
 */
const path = require( 'path' );

module.exports = {
	...defaultConfig,
	entry: {
		'evm-wallet': path.resolve( process.cwd(), 'src/index.js' ),
	},

	output: {
		...defaultConfig.output,
		path: path.resolve( process.cwd(), 'build/' ),
		publicPath: 'auto',
	},

	plugins: [
		...defaultConfig.plugins,
	],

	resolve: {
		...defaultConfig.resolve,
	},
};

