<?php
/**
 * PHPUnit bootstrap file for Query Picker tests.
 *
 * @package QueryPicker
 */

// Define test environment constants.
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', '/tmp/wordpress/' );
}

// Mock WordPress functions used by the plugin.
if ( ! function_exists( 'add_action' ) ) {
	/**
	 * Mock add_action function.
	 *
	 * @param string   $hook     Hook name.
	 * @param callable $callback Callback function.
	 * @param int      $priority Priority.
	 * @param int      $args     Number of arguments.
	 */
	function add_action( $hook, $callback, $priority = 10, $args = 1 ) {
		// Mock implementation - do nothing in tests.
	}
}

if ( ! function_exists( 'add_filter' ) ) {
	/**
	 * Mock add_filter function.
	 *
	 * @param string   $hook     Hook name.
	 * @param callable $callback Callback function.
	 * @param int      $priority Priority.
	 * @param int      $args     Number of arguments.
	 */
	function add_filter( $hook, $callback, $priority = 10, $args = 1 ) {
		// Mock implementation - do nothing in tests.
	}
}

if ( ! function_exists( 'wp_enqueue_script' ) ) {
	/**
	 * Mock wp_enqueue_script function.
	 *
	 * @param string $handle Handle name.
	 * @param string $src    Source URL.
	 * @param array  $deps   Dependencies.
	 * @param string $ver    Version.
	 * @param bool   $in_footer Whether to enqueue in footer.
	 */
	function wp_enqueue_script( $handle, $src = '', $deps = array(), $ver = false, $in_footer = false ) {
		// Mock implementation - do nothing in tests.
	}
}

if ( ! function_exists( 'plugins_url' ) ) {
	/**
	 * Mock plugins_url function.
	 *
	 * @param string $path Path.
	 * @param string $plugin Plugin file.
	 * @return string Mocked URL.
	 */
	function plugins_url( $path = '', $plugin = '' ) {
		return 'http://example.com/wp-content/plugins/' . $path;
	}
}

if ( ! function_exists( 'get_post_types' ) ) {
	/**
	 * Mock get_post_types function.
	 *
	 * @return array Array of post types.
	 */
	function get_post_types() {
		return array( 'post', 'page', 'attachment' );
	}
}

// Load the plugin file.
require_once dirname( __DIR__ ) . '/query-picker.php';
