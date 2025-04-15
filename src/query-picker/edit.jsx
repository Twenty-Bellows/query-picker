import { addFilter } from '@wordpress/hooks';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, FormTokenField } from '@wordpress/components';
import { registerBlockVariation } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import { useEffect, useRef } from '@wordpress/element';

registerBlockVariation( 'core/query', {
	name: 'twenty-bellows/query-picker',
	title: 'Query Picker',
	description:
		'A Query Loop variation that allows user to pick specific posts.',
	isActive: [ 'namespace' ],
	attributes: {
		namespace: 'twenty-bellows/query-picker',
		className: 'is-query-picker',
	},
	scope: [ 'inserter', 'transform' ],
	keywords: [ 'query' ],
	innerBlocks: [
		[ 'core/post-template', {}, [ [ 'core/post-title', {} ] ] ],
	],
	transforms: {
		from: [
			{
				type: 'block',
				blocks: [ 'core/query' ],
				transform: ( attributes, innerBlocks ) => {
					return createBlock(
						'twenty-bellows/query-picker',
						attributes,
						innerBlocks
					);
				},
			},
		],
	},
} );

const withQueryPickerControls = ( BlockEdit ) => ( props ) => {
	if ( props.attributes?.namespace !== 'twenty-bellows/query-picker' ) {
		return <BlockEdit { ...props } />;
	}

	const { attributes, setAttributes } = props;
	const queryPostType = attributes?.query?.postType || 'post';
	const pickedPosts = attributes?.query?.pickedPosts || [];
	const initialPickedPostsRef = useRef( queryPostType );

	useEffect( () => {
		if ( initialPickedPostsRef.current !== queryPostType ) {
			setAttributes( {
				query: {
					...attributes.query,
					pickedPosts: [],
				},
			} );
		}
	}, [ attributes?.query?.postType ] );

	// Fetch posts based on the query post type
	const posts = useSelect(
		( select ) =>
			select( 'core' ).getEntityRecords( 'postType', queryPostType, {
				per_page: -1,
			} ),
		[ attributes?.query?.postType ]
	);

	// Build an array of options to populate the FormTokenField
	const postOptions = ( posts ?? [] )
		.map( ( post ) => post.title.rendered )
		.sort( ( a, b ) => a.localeCompare( b ) );

	// Map selected post IDs to their titles for the FormTokenField
	const pickedPostsLabels = posts
		? pickedPosts.map( ( postId ) => {
				const post = posts.find( ( post ) => post.id === postId );
				return post ? post.title.rendered : null;
		  } )
		: [];

	const onSetPosts = ( values ) => {
		pickedPostsLabels.length = 0;
		attributes.query.pickedPosts = [];

		if ( ! values || values.length === 0 ) {
			setAttributes( { query: { ...attributes.query } } );
			return;
		}

		pickedPostsLabels.push( ...values );

		attributes.query.pickedPosts = values.map( ( value ) => {
			const post = posts.find(
				( post ) => post.title.rendered === value
			);
			return post ? post.id : null;
		} );

		setAttributes( {
			query: {
				...attributes.query,
			},
		} );
	};

	return (
		<>
			<BlockEdit { ...props } />
			<InspectorControls>
				<PanelBody title="Query Options">
					<FormTokenField
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						__experimentalExpandOnFocus
						__experimentalShowHowTo={ false }
						label={
							queryPostType.charAt( 0 ).toUpperCase() +
							queryPostType.slice( 1 ) +
							's'
						}
						onChange={ onSetPosts }
						suggestions={ postOptions }
						value={ pickedPostsLabels }
					/>
				</PanelBody>
			</InspectorControls>
		</>
	);
};

addFilter( 'editor.BlockEdit', 'core/query', withQueryPickerControls );
