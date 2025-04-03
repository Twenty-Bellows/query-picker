<?php
/**
 * Plugin Name:       Query Picker
 * Description:       A custom block variation of the Query block that allows you to select specific posts.
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Text Domain:       query-picker
 *
 * @package QueryPicker
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

add_action('enqueue_block_editor_assets', function () {
	wp_enqueue_script(
		'query-picker',
		plugins_url('build/queryPickerEdit.js', __FILE__),
		['wp-blocks', 'wp-dom-ready', 'wp-edit-post'],
		filemtime(__DIR__ . '/build/queryPickerEdit.js')
	);
});


/**
 *
 * Modify the query for the Query block to use the selected posts from the Query Carousel block.
 *
 * @see https://developer.wordpress.org/reference/hooks/query_loop_block_query_vars/
 *
 */
add_filter('query_loop_block_query_vars', function( $query, $block ){

	$query_block_attributes = $block->context['query'];

	if ( ! isset ( $query_block_attributes['pickedPosts']) || count( $query_block_attributes['pickedPosts'] ) === 0 ) {
		return $query;
	}

	$query['post__in'] = $query_block_attributes['pickedPosts'];
	$query['orderby'] = 'post__in';

	return $query;
}, 10, 2);

/**
 *
 * Modify the REST API query for all post types to use the selected posts from the Query Carousel block.
 * This allows the Query block to use the selected posts when querying for posts in the editor.
 *
 */
add_action( 'init', function() {
	foreach( get_post_types() as $post_type ) {
		add_filter( "rest_{$post_type}_query", function( $args, $request ) {
			if ( ! $request->has_param('pickedPosts') || count( $request->get_param('pickedPosts') ) === 0 ) {
				return $args;
			}
			$args['orderby'] = 'post__in';
			$args['post__in'] = array_map('intval', (array) $request->get_param('pickedPosts'));
			return $args;
		}, 10, 2 );
	}
}, 12);
