# PowerSchool Svelte Template - Project Overview

## Important Setup Note

**IMPORTANT:** Prior to running any command line commands (including `pnpm`, `npx`, and `ux`), you MUST source the `.zshrc` file to ensure proper environment configuration:

```bash
source /Users/kempb/.zshrc
```

Failing to source the `.zshrc` file may result in unexpected behavior, path issues, or command not found errors.

## Portal-Aware Data Configuration

### Dynamic Data Sourcing Strategy

The template introduces a sophisticated approach to data management across different PowerSchool portals:

#### Key Components
- `dataConfig.ts`: Central configuration management
- Dynamic portal detection
- Environment-specific data loading

#### Portal Detection Mechanism
- Automatically detects current portal from URL
- Supports 'admin', 'teachers', and 'guardian' portals
- Fallback to 'unknown' if no match found

#### Data Source Path Construction
- Development: `/mock-data.json`
- Production: `/${pluginName}/${portal}/data.json`

#### Data Structure Example
```json
{
  "id": "unique-identifier",
  "name": "Sample Item",
  "portalAccess": {
    "admin": true,
    "teachers": false,
    "guardian": true
  }
}
```

### Portal-Specific Features
- Granular access control
- Dynamic data filtering
- Seamless environment switching

### Implementation Highlights
- TypeScript-driven type safety
- Reactive state management
- Flexible configuration

## Key Technical Specifications

### Svelte 5 Runes Implementation
The project leverages Svelte 5's new rune-based reactivity system, introducing several key changes:

#### State Management
- `$state()`: Declares reactive state
- `$derived()`: Creates computed values
- `$props()`: Defines component props
- `$effect()`: Handles side effects

#### Example of Runes in Counter Component
```svelte
<script lang="ts">
  const props = $props<{initialCount?: number}>();
  let count = $state(props.initialCount ?? 0);
  
  const increment = () => {
    count += 1;
  }
</script>
```

### TypeScript Integration
- Full TypeScript support
- Type-safe prop definitions
- Enhanced developer experience with strong typing

### Build Configuration
- **Vite**: Primary build tool
- Dynamic project naming from `package.json`
- Automatic base path and output directory configuration
- Web component friendly build options

#### Vite Configuration Highlights
```typescript
export default defineConfig({
  plugins: [svelte({ customElement: false })],
  base: `/${projectName}/`,
  build: {
    outDir: `dist/WEB_ROOT/${projectName}/`,
    // Optimized for web components
  }
})
```

### Web Component Strategy
- Automatic component registration
- Shadow DOM encapsulation
- Custom element naming convention
- Seamless integration with PowerSchool

## Project Structure

```
├── dist/                     # Build output
├── plugin_archive/           # Plugin archives
├── public/                   # Static assets
│   └── mock-data.json        # Development mock data
├── src/
│   ├── lib/                  # Reusable components
│   │   ├── dataConfig.ts     # Data configuration management
│   │   └── Counter.svelte    # Example component
│   ├── app.css               # Global styles
│   ├── App.svelte            # Main application component
│   └── main.ts               # Entry point
└── vite.config.ts            # Build configuration
```

## Key Development Features

### Component Creation
- Place components in `src/lib`
- Automatically registered as web components
- Use Svelte 5 runes for props and state

### Styling
- Shadow DOM for style isolation
- Global CSS injected into components
- Scoped component-level styles

### PowerSchool Integration
- Plugin-ready structure
- Custom page creation support
- Flexible component embedding

## Packaging and Deployment

### Build Commands
- `pnpm dev`: Start development server
- `pnpm build`: Create production build
- `npx ps-package`: Package for PowerSchool

### Build Output
- Generates plugin in `dist/WEB_ROOT/ps-svelte-template/`
- Creates installable `.zip` in `plugin_archive/`

## Advanced Usage Examples

### Event Handling
```svelte
<script lang="ts">
  let count = $state(0);
  
  function increment() {
    count += 1;
    
    // Cross-boundary event dispatch
    dispatchEvent(new CustomEvent('count-changed', {
      detail: { count },
      bubbles: true,
      composed: true
    }));
  }
</script>
```

### Attribute to Prop Conversion
```html
<!-- HTML attribute -->
<svelte-component data-value="123"></svelte-component>

<!-- Svelte component -->
<script lang="ts">
  const props = $props<{dataValue?: string}>();
  console.log(props.dataValue); // "123"
</script>
```

## Recommended Practices

1. Use Svelte 5 runes for state and props
2. Leverage Shadow DOM for style isolation
3. Create reusable components in `src/lib`
4. Use TypeScript for type safety
5. Follow naming conventions for web components

## Troubleshooting

### Common Issues
- Verify script loading
- Check browser console
- Inspect Shadow DOM styles
- Ensure component names match file names

## Contributing
- Open to contributions
- Submit pull requests
- Follow existing code style

## License
MIT License - see LICENSE file for details

## Key Dependencies
- Svelte 5
- Vite
- TypeScript
- @sveltejs/vite-plugin-svelte

## Future Roadmap
- Continued Svelte 5 feature adoption
- Enhanced PowerSchool integration
- Performance optimizations
- Expanded component library
