# Query Picker

A WordPress block plugin that extends the Query Loop block with custom post selection capabilities. Query Picker allows you to handpick a specific post to display, giving you precise control over which content appears in your query loops.

## Description

Query Picker is a lightweight WordPress plugin that adds a powerful variation to the core Query Loop block. Instead of relying on automatic queries based on categories, tags, or other taxonomies, Query Picker lets you manually select exactly which post you want to display. This is perfect for creating curated content collections, featured post sections, or any scenario where you need one specific post.

## Features

- **Manual Post Selection**: Choose a specific post from any post type directly in the block editor
- **Query Loop Compatible**: Works as a variation of the core Query Loop block, inheriting all its display options
- **Block Editor Integration**: Seamless integration with the WordPress block editor
- **Lightweight**: Minimal performance impact with efficient querying

## Requirements

- WordPress 6.6 or higher
- PHP 7.2 or higher

## Usage

### Adding a Query Picker Block

1. Edit a page or post in the WordPress block editor
2. Add a new block by clicking the **+** button
3. Search for "Query Picker" or find it under the **Theme** category
4. Insert the block into your content

### Converting an Existing Query Loop

1. Select an existing Query Loop block
2. In the block toolbar, click the **Transform** button
3. Select **Query Picker** from the available transformations

### Selecting Posts

1. Once you've added the Query Picker block, click on it to reveal the block settings
2. In the block sidebar, you'll find the **Pick Post** section
3. Click **Select Posts** to open the post picker
4. Search for and select the posts you want to display

### Customizing Display

Change the display of the selected Post with a Post Template in the same way.  Especially useful to use Patterns (especially Synced Patterns) in your Post Templates.

## Development

### Prerequisites

- Node.js 14.0 or higher
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/twentybellows/query-picker.git
cd query-picker
```

2. Install dependencies:
```bash
npm install
```

### Available Scripts

- `npm run build` - Build the plugin for production
- `npm run watch` - Start development mode with hot reloading
- `npm run lint:js` - Lint JavaScript files
- `npm run lint:css` - Lint CSS files
- `npm run format` - Format code using WordPress coding standards
- `npm run plugin-zip` - Create a distributable plugin zip file
- `npm run plugin-test` - Build and test the plugin in a local environment
- `npm run start` - Start the development environment with wp-env
- `npm run stop` - Stop the development environment


## Frequently Asked Questions

### Can I use Query Picker with custom post types?

Yes, Query Picker works with all public post types registered in your WordPress installation.

### Does it work with the Site Editor?

Yes, Query Picker is fully compatible with the Site Editor and can be used in templates and template parts.

### How many posts can I select?

Just one.  It's for when you just want one post and you want to pick it.  There are other options out there that let you choose many (with more complicated controls) that are better for that use-case.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or create issues for bugs and feature requests.

## License

This plugin is licensed under the GPL v2 or later.

## Credits

Developed by [Twenty Bellows](https://twentybellows.com)
