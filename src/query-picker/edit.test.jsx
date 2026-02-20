/**
 * @jest-environment jsdom
 */

// Mock WordPress dependencies BEFORE any imports
jest.mock( '@wordpress/hooks', () => ( {
	addFilter: jest.fn(),
} ) );

jest.mock( '@wordpress/blocks', () => ( {
	registerBlockVariation: jest.fn(),
	createBlock: jest.fn( ( blockName, attributes, innerBlocks ) => ( {
		blockName,
		attributes,
		innerBlocks,
	} ) ),
} ) );

jest.mock( '@wordpress/data', () => ( {
	useSelect: jest.fn(),
} ) );

jest.mock( '@wordpress/block-editor', () => ( {
	InspectorControls: ( { children } ) => <div>{ children }</div>,
} ) );

// Store onChange handlers for testing
const onChangeHandlers = {};

jest.mock( '@wordpress/components', () => ( {
	PanelBody: ( { children, title } ) => (
		<div data-testid="panel-body" title={ title }>
			{ children }
		</div>
	),
	FormTokenField: ( props ) => {
		// Store the onChange handler so tests can access it
		onChangeHandlers.current = props.onChange;

		return (
			<div
				data-testid="form-token-field"
				data-label={ props.label }
				data-value={ JSON.stringify( props.value ) }
				data-suggestions={ JSON.stringify( props.suggestions ) }
			/>
		);
	},
} ) );

jest.mock( '@wordpress/element', () => ( {
	...jest.requireActual( 'react' ),
	useRef: jest.requireActual( 'react' ).useRef,
	useEffect: jest.requireActual( 'react' ).useEffect,
} ) );

import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { addFilter } from '@wordpress/hooks';
import { registerBlockVariation } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';

// Import the module to trigger registration and capture the filter
import './edit.jsx';

// Extract the HOC from the addFilter call
const withQueryPickerControls = addFilter.mock.calls.find(
	( call ) => call[ 0 ] === 'editor.BlockEdit' && call[ 1 ] === 'core/query'
)?.[ 2 ];

describe( 'Query Picker Block', () => {
	beforeEach( () => {
		useSelect.mockClear();
	} );

	describe( 'Block Variation Registration', () => {
		it( 'should register the block variation with correct configuration including inner blocks and transforms', () => {
			expect( registerBlockVariation ).toHaveBeenCalledWith(
				'core/query',
				expect.objectContaining( {
					name: 'twenty-bellows/query-picker',
					title: 'Query Picker',
					description:
						'A Query Loop variation that allows user to pick specific posts.',
					isActive: [ 'namespace' ],
					attributes: expect.objectContaining( {
						namespace: 'twenty-bellows/query-picker',
						className: 'is-query-picker',
					} ),
					scope: [ 'inserter', 'transform' ],
					keywords: [ 'query' ],
					innerBlocks: [
						[ 'core/post-template', {}, [ [ 'core/post-title', {} ] ] ],
					],
					transforms: expect.objectContaining( {
						from: expect.arrayContaining( [
							expect.objectContaining( {
								type: 'block',
								blocks: [ 'core/query' ],
								transform: expect.any( Function ),
							} ),
						] ),
					} ),
				} )
			);
		} );
	} );

	describe( 'Filter Registration', () => {
		it( 'should register the editor.BlockEdit filter', () => {
			// Verify that withQueryPickerControls HOC was extracted successfully
			expect( withQueryPickerControls ).toBeDefined();
			expect( withQueryPickerControls ).toBeInstanceOf( Function );
		} );
	} );

	describe( 'withQueryPickerControls HOC', () => {
		let MockBlockEdit;

		beforeEach( () => {
			MockBlockEdit = jest.fn( ( props ) => (
				<div data-testid="original-block-edit">Original Block</div>
			) );
		} );

		it( 'should return original BlockEdit for non-query-picker blocks', () => {
			const props = {
				attributes: {
					namespace: 'some-other-namespace',
				},
			};

			const WrappedComponent = withQueryPickerControls( MockBlockEdit );
			const { container } = render( <WrappedComponent { ...props } /> );

			expect( MockBlockEdit ).toHaveBeenCalledWith( props, {} );
			expect(
				container.querySelector( '[data-testid="original-block-edit"]' )
			).toBeInTheDocument();
		} );

		it( 'should return original BlockEdit when namespace is undefined', () => {
			const props = {
				attributes: {},
			};

			const WrappedComponent = withQueryPickerControls( MockBlockEdit );
			render( <WrappedComponent { ...props } /> );

			expect( MockBlockEdit ).toHaveBeenCalledWith( props, {} );
		} );

		it( 'should render query picker controls for query-picker blocks', () => {
			useSelect.mockReturnValue( [
				{ id: 1, title: { rendered: 'Post 1' } },
				{ id: 2, title: { rendered: 'Post 2' } },
			] );

			const mockSetAttributes = jest.fn();
			const props = {
				attributes: {
					namespace: 'twenty-bellows/query-picker',
					query: {
						postType: 'post',
						pickedPosts: [],
					},
				},
				setAttributes: mockSetAttributes,
			};

			const WrappedComponent = withQueryPickerControls( MockBlockEdit );
			render( <WrappedComponent { ...props } /> );

			expect(
				screen.getByTestId( 'form-token-field' )
			).toBeInTheDocument();
		} );

		it( 'should use default postType "post" when not specified', () => {
			useSelect.mockReturnValue( [] );

			const props = {
				attributes: {
					namespace: 'twenty-bellows/query-picker',
				},
				setAttributes: jest.fn(),
			};

			const WrappedComponent = withQueryPickerControls( MockBlockEdit );
			render( <WrappedComponent { ...props } /> );

			// useSelect should be called
			expect( useSelect ).toHaveBeenCalled();
			const selectCallback = useSelect.mock.calls[ 0 ][ 0 ];
			const mockSelect = jest.fn().mockReturnValue( {
				getEntityRecords: jest.fn(),
			} );

			selectCallback( mockSelect );

			expect( mockSelect ).toHaveBeenCalledWith( 'core' );
			expect( mockSelect().getEntityRecords ).toHaveBeenCalledWith(
				'postType',
				'post',
				{ per_page: -1 }
			);
		} );

		it( 'should build sorted post options from fetched posts', () => {
			const mockPosts = [
				{ id: 1, title: { rendered: 'Zebra Post' } },
				{ id: 2, title: { rendered: 'Apple Post' } },
				{ id: 3, title: { rendered: 'Banana Post' } },
			];

			useSelect.mockReturnValue( mockPosts );

			const props = {
				attributes: {
					namespace: 'twenty-bellows/query-picker',
					query: { postType: 'post', pickedPosts: [] },
				},
				setAttributes: jest.fn(),
			};

			const WrappedComponent = withQueryPickerControls( MockBlockEdit );
			render( <WrappedComponent { ...props } /> );

			const tokenField = screen.getByTestId( 'form-token-field' );
			const suggestions = JSON.parse(
				tokenField.getAttribute( 'data-suggestions' )
			);

			// Should be sorted alphabetically
			expect( suggestions ).toEqual( [
				'Apple Post',
				'Banana Post',
				'Zebra Post',
			] );
		} );

		it( 'should map picked post IDs to their titles', () => {
			const mockPosts = [
				{ id: 1, title: { rendered: 'Post 1' } },
				{ id: 2, title: { rendered: 'Post 2' } },
				{ id: 3, title: { rendered: 'Post 3' } },
			];

			useSelect.mockReturnValue( mockPosts );

			const props = {
				attributes: {
					namespace: 'twenty-bellows/query-picker',
					query: { postType: 'post', pickedPosts: [ 1, 3 ] },
				},
				setAttributes: jest.fn(),
			};

			const WrappedComponent = withQueryPickerControls( MockBlockEdit );
			render( <WrappedComponent { ...props } /> );

			const tokenField = screen.getByTestId( 'form-token-field' );
			const value = JSON.parse( tokenField.getAttribute( 'data-value' ) );

			expect( value ).toEqual( [ 'Post 1', 'Post 3' ] );
		} );

		it( 'should handle missing posts gracefully when mapping IDs', () => {
			const mockPosts = [
				{ id: 1, title: { rendered: 'Post 1' } },
				{ id: 2, title: { rendered: 'Post 2' } },
			];

			useSelect.mockReturnValue( mockPosts );

			const props = {
				attributes: {
					namespace: 'twenty-bellows/query-picker',
					query: { postType: 'post', pickedPosts: [ 1, 999 ] },
				},
				setAttributes: jest.fn(),
			};

			const WrappedComponent = withQueryPickerControls( MockBlockEdit );
			render( <WrappedComponent { ...props } /> );

			const tokenField = screen.getByTestId( 'form-token-field' );
			const value = JSON.parse( tokenField.getAttribute( 'data-value' ) );

			expect( value ).toEqual( [ 'Post 1', null ] );
		} );

		it( 'should generate correct label for different post types', () => {
			useSelect.mockReturnValue( [] );

			const testCases = [
				{ postType: 'post', expectedLabel: 'Posts' },
				{ postType: 'page', expectedLabel: 'Pages' },
				{ postType: 'product', expectedLabel: 'Products' },
			];

			testCases.forEach( ( { postType, expectedLabel } ) => {
				const props = {
					attributes: {
						namespace: 'twenty-bellows/query-picker',
						query: { postType, pickedPosts: [] },
					},
					setAttributes: jest.fn(),
				};

				const WrappedComponent =
					withQueryPickerControls( MockBlockEdit );
				const { unmount } = render(
					<WrappedComponent { ...props } />
				);

				const tokenField = screen.getByTestId( 'form-token-field' );
				expect( tokenField.getAttribute( 'data-label' ) ).toBe(
					expectedLabel
				);

				unmount();
			} );
		} );

		it( 'should handle null posts gracefully', () => {
			useSelect.mockReturnValue( null );

			const props = {
				attributes: {
					namespace: 'twenty-bellows/query-picker',
					query: { postType: 'post', pickedPosts: [ 1, 2 ] },
				},
				setAttributes: jest.fn(),
			};

			const WrappedComponent = withQueryPickerControls( MockBlockEdit );
			render( <WrappedComponent { ...props } /> );

			const tokenField = screen.getByTestId( 'form-token-field' );
			const suggestions = JSON.parse(
				tokenField.getAttribute( 'data-suggestions' )
			);
			expect( suggestions ).toEqual( [] );

			const value = JSON.parse( tokenField.getAttribute( 'data-value' ) );
			expect( value ).toEqual( [] );
		} );

		it( 'should handle undefined posts gracefully', () => {
			useSelect.mockReturnValue( undefined );

			const props = {
				attributes: {
					namespace: 'twenty-bellows/query-picker',
					query: { postType: 'post', pickedPosts: [] },
				},
				setAttributes: jest.fn(),
			};

			const WrappedComponent = withQueryPickerControls( MockBlockEdit );
			render( <WrappedComponent { ...props } /> );

			const tokenField = screen.getByTestId( 'form-token-field' );
			const suggestions = JSON.parse(
				tokenField.getAttribute( 'data-suggestions' )
			);
			expect( suggestions ).toEqual( [] );
		} );
	} );

	describe( 'Post Selection (onSetPosts)', () => {
		let mockSetAttributes;
		let props;

		beforeEach( () => {
			mockSetAttributes = jest.fn();

			const mockPosts = [
				{ id: 1, title: { rendered: 'Post 1' } },
				{ id: 2, title: { rendered: 'Post 2' } },
				{ id: 3, title: { rendered: 'Post 3' } },
			];

			useSelect.mockReturnValue( mockPosts );

			props = {
				attributes: {
					namespace: 'twenty-bellows/query-picker',
					query: { postType: 'post', pickedPosts: [] },
				},
				setAttributes: mockSetAttributes,
			};
		} );

		it( 'should clear picked posts when values is null', () => {
			const MockBlockEdit = () => <div>Block</div>;
			const WrappedComponent = withQueryPickerControls( MockBlockEdit );
			render( <WrappedComponent { ...props } /> );

			// Trigger onChange through the stored handler
			onChangeHandlers.current( null );

			expect( mockSetAttributes ).toHaveBeenCalledWith( {
				query: expect.objectContaining( {
					pickedPosts: [],
				} ),
			} );
		} );

		it( 'should clear picked posts when values is empty array', () => {
			const MockBlockEdit = () => <div>Block</div>;
			const WrappedComponent = withQueryPickerControls( MockBlockEdit );
			render( <WrappedComponent { ...props } /> );

			onChangeHandlers.current( [] );

			expect( mockSetAttributes ).toHaveBeenCalledWith( {
				query: expect.objectContaining( {
					pickedPosts: [],
				} ),
			} );
		} );

		it( 'should update picked posts when selecting posts', () => {
			const MockBlockEdit = () => <div>Block</div>;
			const WrappedComponent = withQueryPickerControls( MockBlockEdit );
			render( <WrappedComponent { ...props } /> );

			onChangeHandlers.current( [ 'Post 1', 'Post 3' ] );

			expect( mockSetAttributes ).toHaveBeenCalledWith( {
				query: expect.objectContaining( {
					postType: 'post',
					pickedPosts: [ 1, 3 ],
				} ),
			} );
		} );

		it( 'should handle selecting all posts', () => {
			const MockBlockEdit = () => <div>Block</div>;
			const WrappedComponent = withQueryPickerControls( MockBlockEdit );
			render( <WrappedComponent { ...props } /> );

			onChangeHandlers.current( [ 'Post 1', 'Post 2', 'Post 3' ] );

			expect( mockSetAttributes ).toHaveBeenCalledWith( {
				query: expect.objectContaining( {
					pickedPosts: [ 1, 2, 3 ],
				} ),
			} );
		} );

		it( 'should preserve order of selected posts', () => {
			const MockBlockEdit = () => <div>Block</div>;
			const WrappedComponent = withQueryPickerControls( MockBlockEdit );
			render( <WrappedComponent { ...props } /> );

			onChangeHandlers.current( [ 'Post 3', 'Post 1', 'Post 2' ] );

			expect( mockSetAttributes ).toHaveBeenCalledWith( {
				query: expect.objectContaining( {
					pickedPosts: [ 3, 1, 2 ],
				} ),
			} );
		} );
	} );

	describe( 'Post Type Change Effect', () => {
		it( 'should reset picked posts when post type changes', async () => {
			const mockSetAttributes = jest.fn();

			useSelect.mockReturnValue( [
				{ id: 1, title: { rendered: 'Post 1' } },
			] );

			const initialProps = {
				attributes: {
					namespace: 'twenty-bellows/query-picker',
					query: { postType: 'post', pickedPosts: [ 1 ] },
				},
				setAttributes: mockSetAttributes,
			};

			const MockBlockEdit = () => <div>Block</div>;
			const WrappedComponent = withQueryPickerControls( MockBlockEdit );

			const { rerender } = render(
				<WrappedComponent { ...initialProps } />
			);

			// Change post type
			const updatedProps = {
				...initialProps,
				attributes: {
					...initialProps.attributes,
					query: { postType: 'page', pickedPosts: [ 1 ] },
				},
			};

			rerender( <WrappedComponent { ...updatedProps } /> );

			await waitFor( () => {
				expect( mockSetAttributes ).toHaveBeenCalledWith( {
					query: expect.objectContaining( {
						pickedPosts: [],
					} ),
				} );
			} );
		} );
	} );
} );
