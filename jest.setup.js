// Jest setup file for additional configuration
import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty( window, 'matchMedia', {
	writable: true,
	value: jest.fn().mockImplementation( ( query ) => ( {
		matches: false,
		media: query,
		onchange: null,
		addListener: jest.fn(),
		removeListener: jest.fn(),
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		dispatchEvent: jest.fn(),
	} ) ),
} );

// Suppress console errors during tests (optional)
const originalError = console.error;
beforeAll( () => {
	console.error = ( ...args ) => {
		// Filter out specific React warnings that are expected
		if (
			typeof args[ 0 ] === 'string' &&
			args[ 0 ].includes( 'Warning: ReactDOM.render' )
		) {
			return;
		}
		originalError.call( console, ...args );
	};
} );

afterAll( () => {
	console.error = originalError;
} );

// Clean up after each test
afterEach( () => {
	jest.clearAllMocks();
} );
