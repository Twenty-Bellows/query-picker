const path = require('path');
const defaultConfig = require('@wordpress/scripts/config/webpack.config');

defaultConfig[0] = {
	...defaultConfig[0],
	...{
		entry: {
			queryPickerEdit: './src/query-picker/edit.jsx',
		},
	},
};

module.exports = defaultConfig;
