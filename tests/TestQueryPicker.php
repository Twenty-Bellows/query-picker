<?php
/**
 * Unit tests for Query Picker plugin.
 *
 * @package QueryPicker
 */

use PHPUnit\Framework\TestCase;

/**
 * Test case for Query Picker functionality.
 */
class TestQueryPicker extends TestCase {

	/**
	 * Test query_picker_modify_query_loop_block_query_vars with valid picked posts.
	 */
	public function test_modify_query_loop_block_query_vars_with_picked_posts() {
		$query = array(
			'post_type' => 'post',
			'posts_per_page' => 10,
		);

		$block = $this->create_mock_block( array( 1, 2, 3 ) );

		$result = query_picker_modify_query_loop_block_query_vars( $query, $block );

		$this->assertArrayHasKey( 'post__in', $result );
		$this->assertEquals( array( 1, 2, 3 ), $result['post__in'] );
		$this->assertEquals( 'post__in', $result['orderby'] );
	}

	/**
	 * Test query_picker_modify_query_loop_block_query_vars without picked posts.
	 */
	public function test_modify_query_loop_block_query_vars_without_picked_posts() {
		$query = array(
			'post_type' => 'post',
			'posts_per_page' => 10,
		);

		$block = $this->create_mock_block( array() );

		$result = query_picker_modify_query_loop_block_query_vars( $query, $block );

		$this->assertArrayNotHasKey( 'post__in', $result );
		$this->assertEquals( $query, $result );
	}

	/**
	 * Test query_picker_modify_query_loop_block_query_vars with null picked posts.
	 */
	public function test_modify_query_loop_block_query_vars_with_null_picked_posts() {
		$query = array(
			'post_type' => 'post',
			'posts_per_page' => 10,
		);

		$block = $this->create_mock_block( null );

		$result = query_picker_modify_query_loop_block_query_vars( $query, $block );

		$this->assertEquals( $query, $result );
	}

	/**
	 * Test query_picker_modify_query_loop_block_query_vars without query context.
	 */
	public function test_modify_query_loop_block_query_vars_without_query_context() {
		$query = array(
			'post_type' => 'post',
			'posts_per_page' => 10,
		);

		$block = $this->create_mock_block_without_query();

		$result = query_picker_modify_query_loop_block_query_vars( $query, $block );

		$this->assertEquals( $query, $result );
	}

	/**
	 * Test query_picker_modify_query_loop_block_query_vars preserves existing query args.
	 */
	public function test_modify_query_loop_block_query_vars_preserves_existing_args() {
		$query = array(
			'post_type' => 'post',
			'posts_per_page' => 10,
			'category__in' => array( 5 ),
			'orderby' => 'date',
		);

		$block = $this->create_mock_block( array( 7, 8, 9 ) );

		$result = query_picker_modify_query_loop_block_query_vars( $query, $block );

		$this->assertEquals( 'post', $result['post_type'] );
		$this->assertEquals( 10, $result['posts_per_page'] );
		$this->assertEquals( array( 5 ), $result['category__in'] );
		$this->assertEquals( array( 7, 8, 9 ), $result['post__in'] );
		$this->assertEquals( 'post__in', $result['orderby'] );
	}

	/**
	 * Test query_picker_modify_rest_query with valid picked posts.
	 */
	public function test_modify_rest_query_with_picked_posts() {
		$args = array(
			'post_type' => 'post',
			'posts_per_page' => 10,
		);

		$request = $this->create_mock_rest_request( array( '1', '2', '3' ) );

		$result = query_picker_modify_rest_query( $args, $request );

		$this->assertArrayHasKey( 'post__in', $result );
		$this->assertEquals( array( 1, 2, 3 ), $result['post__in'] );
		$this->assertEquals( 'post__in', $result['orderby'] );
	}

	/**
	 * Test query_picker_modify_rest_query without picked posts parameter.
	 */
	public function test_modify_rest_query_without_picked_posts_param() {
		$args = array(
			'post_type' => 'post',
			'posts_per_page' => 10,
		);

		$request = $this->create_mock_rest_request( null );

		$result = query_picker_modify_rest_query( $args, $request );

		$this->assertArrayNotHasKey( 'post__in', $result );
		$this->assertEquals( $args, $result );
	}

	/**
	 * Test query_picker_modify_rest_query with empty picked posts array.
	 */
	public function test_modify_rest_query_with_empty_picked_posts() {
		$args = array(
			'post_type' => 'post',
			'posts_per_page' => 10,
		);

		$request = $this->create_mock_rest_request( array() );

		$result = query_picker_modify_rest_query( $args, $request );

		$this->assertEquals( $args, $result );
	}

	/**
	 * Test query_picker_modify_rest_query converts string IDs to integers.
	 */
	public function test_modify_rest_query_converts_string_ids_to_integers() {
		$args = array();
		$request = $this->create_mock_rest_request( array( '10', '20', '30' ) );

		$result = query_picker_modify_rest_query( $args, $request );

		$this->assertIsArray( $result['post__in'] );
		foreach ( $result['post__in'] as $id ) {
			$this->assertIsInt( $id );
		}
		$this->assertEquals( array( 10, 20, 30 ), $result['post__in'] );
	}

	/**
	 * Test query_picker_modify_rest_query preserves existing query args.
	 */
	public function test_modify_rest_query_preserves_existing_args() {
		$args = array(
			'post_type' => 'page',
			'posts_per_page' => 5,
			'post_status' => 'publish',
		);

		$request = $this->create_mock_rest_request( array( '4', '5', '6' ) );

		$result = query_picker_modify_rest_query( $args, $request );

		$this->assertEquals( 'page', $result['post_type'] );
		$this->assertEquals( 5, $result['posts_per_page'] );
		$this->assertEquals( 'publish', $result['post_status'] );
		$this->assertEquals( array( 4, 5, 6 ), $result['post__in'] );
		$this->assertEquals( 'post__in', $result['orderby'] );
	}

	/**
	 * Test query_picker_modify_rest_query handles mixed numeric and string IDs.
	 */
	public function test_modify_rest_query_handles_mixed_id_types() {
		$args = array();
		$request = $this->create_mock_rest_request( array( 1, '2', 3, '4' ) );

		$result = query_picker_modify_rest_query( $args, $request );

		$this->assertEquals( array( 1, 2, 3, 4 ), $result['post__in'] );
		foreach ( $result['post__in'] as $id ) {
			$this->assertIsInt( $id );
		}
	}

	/**
	 * Test query_picker_modify_rest_query handles single post ID.
	 */
	public function test_modify_rest_query_with_single_post() {
		$args = array();
		$request = $this->create_mock_rest_request( array( '42' ) );

		$result = query_picker_modify_rest_query( $args, $request );

		$this->assertEquals( array( 42 ), $result['post__in'] );
		$this->assertEquals( 'post__in', $result['orderby'] );
	}

	/**
	 * Test query_picker_modify_rest_query with large number of posts.
	 */
	public function test_modify_rest_query_with_many_posts() {
		$post_ids = range( 1, 100 );
		$string_ids = array_map( 'strval', $post_ids );

		$args = array();
		$request = $this->create_mock_rest_request( $string_ids );

		$result = query_picker_modify_rest_query( $args, $request );

		$this->assertEquals( $post_ids, $result['post__in'] );
		$this->assertCount( 100, $result['post__in'] );
	}

	/**
	 * Test query_picker_modify_rest_query preserves post order.
	 */
	public function test_modify_rest_query_preserves_post_order() {
		$args = array();
		$request = $this->create_mock_rest_request( array( '5', '2', '8', '1', '3' ) );

		$result = query_picker_modify_rest_query( $args, $request );

		$this->assertEquals( array( 5, 2, 8, 1, 3 ), $result['post__in'] );
		$this->assertEquals( 'post__in', $result['orderby'] );
	}

	// Helper methods.

	/**
	 * Create a mock WP_Block object.
	 *
	 * @param array|null $picked_posts Array of post IDs or null.
	 * @return object Mock block object.
	 */
	private function create_mock_block( $picked_posts ) {
		$block = new stdClass();
		$block->context = array(
			'query' => array(),
		);

		if ( null !== $picked_posts ) {
			$block->context['query']['pickedPosts'] = $picked_posts;
		}

		return $block;
	}

	/**
	 * Create a mock WP_Block object without query context.
	 *
	 * @return object Mock block object.
	 */
	private function create_mock_block_without_query() {
		$block = new stdClass();
		$block->context = array();
		return $block;
	}

	/**
	 * Create a mock WP_REST_Request object.
	 *
	 * @param array|null $picked_posts Array of post IDs or null.
	 * @return object Mock request object.
	 */
	private function create_mock_rest_request( $picked_posts ) {
		return new class( $picked_posts ) {
			/**
			 * Picked posts.
			 *
			 * @var array|null
			 */
			private $picked_posts;

			/**
			 * Constructor.
			 *
			 * @param array|null $picked_posts Picked posts.
			 */
			public function __construct( $picked_posts ) {
				$this->picked_posts = $picked_posts;
			}

			/**
			 * Check if parameter exists.
			 *
			 * @param string $key Parameter key.
			 * @return bool True if parameter exists.
			 */
			public function has_param( $key ) {
				return 'pickedPosts' === $key && null !== $this->picked_posts && ! empty( $this->picked_posts );
			}

			/**
			 * Get parameter value.
			 *
			 * @param string $key Parameter key.
			 * @return mixed Parameter value.
			 */
			public function get_param( $key ) {
				return 'pickedPosts' === $key ? $this->picked_posts : null;
			}
		};
	}
}
