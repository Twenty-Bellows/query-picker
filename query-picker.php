<?php
/**
 * Plugin Name:       Query Picker
 * Description:       A custom block variation of the Query block that allows you to select specific posts.
 * Requires at least: 6.6
 * Requires PHP:      7.2
 * Version:           1.0.0
 * Author:            Twenty Bellows
 * Author URI:        https://twentybellows.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       query-picker
 *
 * @package QueryPicker
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

add_action('enqueue_block_editor_assets', function () {
	wp_enqueue_script(
		'twenty-bellows/query-picker',
		plugins_url('build/queryPickerEdit.js', __FILE__),
		['wp-blocks', 'wp-dom-ready', 'wp-edit-post'],
		filemtime(__DIR__ . '/build/queryPickerEdit.js'),
		false
	);
});


/**
 *
 * Modify the query for the Query block to use the selected posts.
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
 * Modify the REST API query for all post types to use the selected posts from the Query Picker block.
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
