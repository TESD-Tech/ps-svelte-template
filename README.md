# PowerSchool Svelte Template

A modern template for building PowerSchool plugins using Svelte 5, TypeScript, and Vite. This template allows you to create both full applications and individual reusable web components that can be embedded in PowerSchool pages.

## Features

- **Svelte 5 with Runes**: Uses the latest Svelte 5 features for reactive state management
- **TypeScript**: Full TypeScript support for type safety and better developer experience
- **Standard CSS**: Clean, vanilla CSS with no external dependencies
- **Shadow DOM Encapsulation**: Components are isolated from PowerSchool's styles
- **Automatic Component Registration**: Components in `src/lib` are automatically available as web components
- **PowerSchool Plugin Ready**: Includes plugin.xml and proper output structure

## Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm (recommended) or npm

### Clone the Template

```bash
# Clone the repository
git clone https://github.com/yourusername/ps-svelte-template.git your-plugin-name
cd your-plugin-name

# Remove the existing git repository and initialize a new one
rm -rf .git
git init

# Install dependencies
pnpm install
```

### Development

```bash
# Start the development server
pnpm dev
```

This will start a development server at http://localhost:5173/ps-svelte-template/

### Building for Production

```bash
# Build the project
pnpm build
```

This will create a production-ready build in the `dist/WEB_ROOT/ps-svelte-template/` directory.

### Packaging for PowerSchool

```bash
# Package the plugin using @tesd-tech/ps-package
npx ps-package
```

This will create a `.zip` file in the `plugin_archive` directory that can be installed in PowerSchool.

## Project Structure

```
├── dist/                     # Build output
├── plugin_archive/           # Plugin archives
├── public/                   # Static assets
├── src/
│   ├── lib/                  # Reusable components (automatically registered as web components)
│   ├── app.css               # Global styles
│   ├── App.svelte            # Main application component
│   ├── custom-element.ts     # Full application web component wrapper
│   ├── lib-components.ts     # Automatic component registration system
│   └── main.ts               # Entry point
│   └── powerschool/          # PowerSchool-specific files
│       ├── WEB_ROOT/         # PowerSchool web root
│       ├── pagecataloging/   # PowerSchool menu JSON file
│       └── user_schema_root/ # PowerSchool database extension XML
├── vite.config.ts            # Vite configuration
└── package.json              # Project dependencies
```

## Using Components in PowerSchool

### Full Application

To use the full Svelte application in a PowerSchool page:

```html
<!-- Include the script -->
<script type="module" src="/ps-svelte-template/index.js"></script>

<!-- Use the custom element -->
<ps-svelte-app></ps-svelte-app>
```

### Individual Components

To use individual components from the library:

```html
<!-- Include the script -->
<script type="module" src="/ps-svelte-template/index.js"></script>

<!-- Use a component -->
<svelte-counter></svelte-counter>

<!-- With attributes/props -->
<svelte-counter initial-count="10"></svelte-counter>
```

## Creating New Components

### Adding a Component to the Library

1. Create a new `.svelte` file in the `src/lib` directory
2. Use Svelte 5's runes syntax for props and state
3. That's it! The component will be automatically registered as a web component

Example component (`src/lib/Greeting.svelte`):

```svelte
<script lang="ts">
  // Define props using Svelte 5 runes
  const props = $props<{name?: string}>();
  
  // Default value if name is not provided
  const displayName = props.name ?? 'World';
</script>

<div class="greeting">
  <h2>Hello, {displayName}!</h2>
</div>

<style>
  .greeting {
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    background-color: #f9f9f9;
  }
  
  h2 {
    margin: 0;
    color: #333;
  }
</style>
```

This component will be automatically available as `<svelte-greeting>` in PowerSchool:

```html
<svelte-greeting name="PowerSchool"></svelte-greeting>
```

## Creating Custom Pages

To create a custom page in PowerSchool using this template:

1. Add a page definition to your `plugin.xml`:

```xml
<page name="my-custom-page" content="my-custom-page.html" />
```

2. Create the HTML file in the `public` directory (`public/my-custom-page.html`):

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>My Custom Page</title>
</head>
<body>
  <!-- Include the script -->
  <script type="module" src="/ps-svelte-template/index.js"></script>
  
  <!-- Use components -->
  <div class="ps-page">
    <h1>My Custom Page</h1>
    <ps-svelte-app></ps-svelte-app>
    
    <h2>Individual Components</h2>
    <svelte-counter></svelte-counter>
    <svelte-greeting name="PowerSchool Admin"></svelte-greeting>
  </div>
</body>
</html>
```

## Customizing the Template

### Changing the Plugin Name

1. Update the `name` field in `package.json`
2. Update the `name` attribute in `plugin.xml`
3. Update the version in both files to match

The build paths in `vite.config.ts` will automatically update based on your package name to prevent namespace collisions. The template reads the project name from `package.json` and dynamically sets:

- The base path (`base: /${projectName}/`)
- The output directory (`outDir: dist/WEB_ROOT/${projectName}/`)

This ensures that when you clone this template and rename it, your plugin will have its own unique namespace in PowerSchool.

### Styling Components

Components use Shadow DOM for style encapsulation. Global styles from `app.css` are automatically injected into each component's Shadow DOM.

You can also use Svelte's scoped styles within each component:

```svelte
<style>
  /* These styles will only apply to this component */
  button {
    background-color: #4CAF50;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
  }
</style>
```

## Advanced Usage

### Component Attributes and Properties

HTML attributes are automatically converted to camelCase for Svelte props:

```html
<!-- HTML attribute: data-value -->
<svelte-component data-value="123"></svelte-component>
```

In your Svelte component:

```svelte
<script lang="ts">
  const props = $props<{dataValue?: string}>();
  console.log(props.dataValue); // "123"
</script>
```

### Event Handling

To listen to events from your components in PowerSchool:

```html
<svelte-counter id="myCounter"></svelte-counter>

<script>
  document.getElementById('myCounter').addEventListener('count-changed', (event) => {
    console.log('New count:', event.detail.count);
  });
</script>
```

In your Svelte component:

```svelte
<script lang="ts">
  const props = $props<{initialCount?: number}>();
  let count = $state(props.initialCount ?? 0);
  
  function increment() {
    count += 1;
    
    // Dispatch a custom event
    const event = new CustomEvent('count-changed', {
      detail: { count },
      bubbles: true,
      composed: true // Allows the event to cross the Shadow DOM boundary
    });
    
    dispatchEvent(event);
  }
</script>
```

## Troubleshooting

### Component Not Showing Up

- Make sure the script is properly loaded
- Check browser console for errors
- Verify that the component name matches the file name (with `svelte-` prefix)

### Styling Issues

- Remember that Shadow DOM isolates styles
- Global styles from PowerSchool won't affect your components
- Use the browser inspector to debug Shadow DOM styles

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

