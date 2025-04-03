const path = require( 'path' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

defaultConfig[ 0 ] = {
	...defaultConfig[ 0 ],
	...{
		entry: {
      queryPickerEdit: './src/query-picker/edit.jsx',
      queryPickerView: './src/query-picker/view.js',
		},
	},
};

module.exports = defaultConfig;
