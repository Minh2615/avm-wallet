const defaultTheme = require( 'tailwindcss/defaultTheme' );

module.exports = {
	mode: 'jit',
	content: [ './src/**/*.{js,jsx,ts,tsx}' ],
	theme: {
		extend: {
			
		},
	},
	plugins: [
		require( '@tailwindcss/line-clamp' ),
		require( '@tailwindcss/aspect-ratio' ),
		require( '@tailwindcss/forms' ),
	],
};
