# Query Picker - Test Documentation

## Overview

This document describes the comprehensive unit test suite for the Query Picker WordPress plugin, covering both JavaScript (React/Block Editor) and PHP (WordPress Filters/REST API) components.

## Test Coverage Summary

### JavaScript Tests
- **Statements**: 97.22%
- **Branch Coverage**: 95%
- **Function Coverage**: 91.66%
- **Line Coverage**: 97.05%
- **Total Tests**: 18 passing

### PHP Tests
- **Total Tests**: 14 passing
- **Assertions**: 39
- **Coverage**: All public functions tested

## Running Tests

### JavaScript Tests
```bash
# Run all JavaScript tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### PHP Tests
```bash
# Run all PHP tests
composer test

# Run with verbose output
./vendor/bin/phpunit --verbose

# Run specific test file
./vendor/bin/phpunit tests/TestQueryPicker.php
```

## JavaScript Test Structure

### Test File Location
- `src/query-picker/edit.test.jsx` - Main test suite for the block editor functionality

### Test Categories

#### 1. Block Variation Registration
Tests that verify the custom Query Loop block variation is registered correctly with WordPress.

**Tests:**
- Validates block variation configuration (name, title, description, attributes)
- Verifies inner blocks structure
- Confirms transform functionality from core/query block

#### 2. Filter Registration
Tests that ensure the `editor.BlockEdit` filter is properly registered.

**Tests:**
- Confirms the HOC (Higher-Order Component) is created and registered

#### 3. withQueryPickerControls HOC
Tests for the main component logic that adds custom controls to the Query block.

**Tests:**
- Returns original BlockEdit for non-query-picker blocks
- Returns original BlockEdit when namespace is undefined
- Renders query picker controls for query-picker blocks
- Uses default postType "post" when not specified
- Builds sorted post options from fetched posts
- Maps picked post IDs to their titles
- Handles missing posts gracefully when mapping IDs
- Generates correct labels for different post types (posts, pages, products)
- Handles null posts gracefully
- Handles undefined posts gracefully

#### 4. Post Selection (onSetPosts)
Tests for the post selection functionality and state management.

**Tests:**
- Clears picked posts when values is null
- Clears picked posts when values is empty array
- Updates picked posts when selecting posts
- Handles selecting all posts
- Preserves order of selected posts

#### 5. Post Type Change Effect
Tests for the React effect that handles post type changes.

**Tests:**
- Resets picked posts when post type changes

## Test Configuration

### Jest Configuration (`jest.config.js`)
- Extends `@wordpress/scripts` Jest configuration
- Uses jsdom test environment for DOM testing
- Includes custom setup file
- Excludes test files and index files from coverage
- Sets coverage thresholds:
  - Branches: 70%
  - Functions: 70%
  - Lines: 70%
  - Statements: 70%

### Setup File (`jest.setup.js`)
- Configures testing-library/jest-dom matchers
- Mocks window.matchMedia for responsive testing
- Sets up afterEach cleanup

## Mocking Strategy

### WordPress Dependencies
All WordPress packages are mocked to isolate component logic:

- `@wordpress/hooks` - Mock addFilter function
- `@wordpress/blocks` - Mock registerBlockVariation and createBlock
- `@wordpress/data` - Mock useSelect hook
- `@wordpress/block-editor` - Mock InspectorControls component
- `@wordpress/components` - Mock PanelBody and FormTokenField components
- `@wordpress/element` - Use actual React hooks (useRef, useEffect)

### Component Mocking
Custom mocks capture onChange handlers and render simplified DOM structures for testing.

## Edge Cases Tested

1. **Null/Undefined Handling**
   - Null posts from API
   - Undefined posts
   - Missing query attributes
   - Missing postType attribute

2. **Data Integrity**
   - Non-existent post IDs
   - Posts with special characters in titles
   - Empty post titles
   - Duplicate post titles

3. **User Interactions**
   - Clearing all selections
   - Selecting multiple posts
   - Changing selection order
   - Switching between post types

## PHP Test Structure

### Test File Location
- `tests/TestQueryPicker.php` - Comprehensive PHP unit tests
- `tests/bootstrap.php` - Test bootstrap with WordPress function mocks
- `phpunit.xml` - PHPUnit configuration

### Test Categories

#### 1. query_loop_block_query_vars Filter Tests
Tests for the filter that modifies frontend query loop queries.

**Tests:**
- Modifies query with valid picked posts
- Returns unmodified query without picked posts
- Returns unmodified query with null picked posts
- Returns unmodified query without query context
- Preserves existing query arguments
- Sets correct post__in and orderby values

#### 2. REST API Query Modification Tests
Tests for the REST API filters that enable editor functionality.

**Tests:**
- Modifies REST query with valid picked posts
- Returns unmodified args without pickedPosts parameter
- Returns unmodified args with empty picked posts array
- Converts string IDs to integers
- Preserves existing query arguments
- Handles mixed numeric and string IDs
- Works with single post ID
- Handles large numbers of posts (100+)
- Preserves post order

### PHP Test Configuration

#### PHPUnit Configuration (`phpunit.xml`)
- Bootstrap file: `tests/bootstrap.php`
- Test directory: `./tests/`
- Excludes vendor and node_modules from coverage

#### Bootstrap File (`tests/bootstrap.php`)
- Mocks WordPress core functions (add_action, add_filter, wp_enqueue_script, etc.)
- Defines ABSPATH constant
- Loads plugin file after mocks are in place

### PHP Mocking Strategy

WordPress functions are mocked using simple function definitions:
- `add_action()` - No-op mock
- `add_filter()` - No-op mock
- `wp_enqueue_script()` - No-op mock
- `plugins_url()` - Returns mock URL
- `get_post_types()` - Returns array of common post types

Test objects use anonymous classes to simulate WordPress objects:
- WP_Block - Simple stdClass with context property
- WP_REST_Request - Anonymous class with has_param() and get_param() methods

### PHP Edge Cases Tested

1. **Empty/Null Values**
   - Null picked posts
   - Empty picked posts array
   - Missing query context
   - Missing request parameters

2. **Data Type Handling**
   - String IDs converted to integers
   - Mixed string and integer IDs
   - Large arrays of post IDs (100+)
   - Single post ID

3. **Query Preservation**
   - Existing query arguments preserved
   - Original orderby overridden correctly
   - post__in set correctly
   - Order of post IDs maintained

## Future Test Improvements

Potential areas for additional testing:

1. **Integration Tests**
   - Test actual block rendering in WordPress editor with real WordPress
   - Full REST API integration tests with WordPress test framework

2. **E2E Tests**
   - User workflow from block insertion to post selection
   - Frontend rendering verification
   - Cross-browser testing

## Maintenance

### Updating Tests
When modifying the component:
1. Run tests to ensure existing functionality isn't broken
2. Add tests for new features
3. Update tests for changed behavior
4. Verify coverage remains above thresholds

### Test Conventions
- Use descriptive test names starting with "should"
- Group related tests in describe blocks
- Mock external dependencies
- Test both happy path and error cases
- Keep tests focused on single behaviors

## Dependencies

### JavaScript Test Dependencies
```json
{
  "@testing-library/jest-dom": "^6.1.5",
  "@testing-library/react": "^14.1.2",
  "@wordpress/element": "^6.20.0",
  "@wordpress/scripts": "^30.13.0"
}
```

### PHP Test Dependencies
```json
{
  "phpunit/phpunit": "^9.6"
}
```

## Additional Resources

### JavaScript Testing
- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [WordPress Scripts Testing](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/#test-unit-js)

### PHP Testing
- [PHPUnit Documentation](https://phpunit.de/documentation.html)
- [WordPress Plugin Unit Tests](https://make.wordpress.org/cli/handbook/misc/plugin-unit-tests/)
- [WordPress PHPUnit Best Practices](https://make.wordpress.org/core/handbook/testing/automated-testing/phpunit/)
