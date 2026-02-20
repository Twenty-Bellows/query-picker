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

/**
 * Enqueue block editor assets.
 *
 * @return void
 */
function query_picker_enqueue_block_editor_assets() {
	wp_enqueue_script(
		'twenty-bellows/query-picker',
		plugins_url( 'build/queryPickerEdit.js', __FILE__ ),
		array( 'wp-blocks', 'wp-dom-ready', 'wp-edit-post' ),
		filemtime( __DIR__ . '/build/queryPickerEdit.js' ),
		false
	);
}
add_action( 'enqueue_block_editor_assets', 'query_picker_enqueue_block_editor_assets' );

/**
 * Modify the query for the Query block to use the selected posts.
 *
 * @see https://developer.wordpress.org/reference/hooks/query_loop_block_query_vars/
 *
 * @param array    $query The query arguments.
 * @param WP_Block $block The block instance.
 * @return array Modified query arguments.
 */
function query_picker_modify_query_loop_block_query_vars( $query, $block ) {
	// Check if block context has query attributes.
	if ( ! isset( $block->context['query'] ) ) {
		return $query;
	}

	$query_block_attributes = $block->context['query'];

	// Check if pickedPosts is set and not empty.
	if ( ! isset( $query_block_attributes['pickedPosts'] ) || count( $query_block_attributes['pickedPosts'] ) === 0 ) {
		return $query;
	}

	// Modify query to use picked posts.
	$query['post__in'] = $query_block_attributes['pickedPosts'];
	$query['orderby']  = 'post__in';

	return $query;
}
add_filter( 'query_loop_block_query_vars', 'query_picker_modify_query_loop_block_query_vars', 10, 2 );

/**
 * Modify REST API query arguments to use picked posts.
 *
 * @param array           $args    Query arguments.
 * @param WP_REST_Request $request REST request object.
 * @return array Modified query arguments.
 */
function query_picker_modify_rest_query( $args, $request ) {
	// Check if pickedPosts parameter exists and is not empty.
	if ( ! $request->has_param( 'pickedPosts' ) || count( $request->get_param( 'pickedPosts' ) ) === 0 ) {
		return $args;
	}

	// Modify query to use picked posts.
	$args['orderby']  = 'post__in';
	$args['post__in'] = array_map( 'intval', (array) $request->get_param( 'pickedPosts' ) );

	return $args;
}

/**
 * Register REST API query filters for all post types.
 *
 * @return void
 */
function query_picker_register_rest_filters() {
	$post_types = get_post_types();

	foreach ( $post_types as $post_type ) {
		add_filter( "rest_{$post_type}_query", 'query_picker_modify_rest_query', 10, 2 );
	}
}
add_action( 'init', 'query_picker_register_rest_filters', 12 );
