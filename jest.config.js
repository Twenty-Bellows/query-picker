module.exports = {
	...require( '@wordpress/scripts/config/jest-unit.config' ),
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: [ '<rootDir>/jest.setup.js' ],
	testMatch: [
		'**/__tests__/**/*.[jt]s?(x)',
		'**/?(*.)+(spec|test).[jt]s?(x)',
	],
	moduleNameMapper: {
		'\\.(css|less|scss|sass)$': 'identity-obj-proxy',
	},
	collectCoverageFrom: [
		'src/**/*.{js,jsx}',
		'!src/**/*.test.{js,jsx}',
		'!src/**/index.{js,jsx}',
	],
	coverageThreshold: {
		global: {
			branches: 70,
			functions: 70,
			lines: 70,
			statements: 70,
		},
	},
};
