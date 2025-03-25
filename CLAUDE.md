# PowerSchool Svelte Template - Project Overview

## Important Setup Note

**IMPORTANT:** Prior to running any command line commands (including `pnpm`, `npx`, and `ux`), you MUST source the `.zshrc` file to ensure proper environment configuration:

```bash
source /Users/kempb/.zshrc
```

Failing to source the `.zshrc` file may result in unexpected behavior, path issues, or command not found errors.

## Development Tools and Environment Management

### Portal-Aware Development

The template introduces comprehensive development tools for managing different PowerSchool portals:

#### Key Development Features
- Dynamic portal switching
- Real-time data store visualization
- Environment-specific configuration management

#### Development Tools Highlights
- Portal switcher dropdown
- Ability to add dynamic counters
- Transparent data store insights
- Configuration display

### Portal Simulation

Developers can:
- Switch between 'admin', 'teachers', 'guardian', and 'unknown' portals
- See how components behave in different portal contexts
- Dynamically add and interact with components

### Data Store Management

- Centralized data configuration
- Portal-specific data access
- Seamless environment switching
- Development-only detailed component information

## Example Usage

```svelte
<!-- Automatic portal and data store management -->
<div class="dev-tools">
  <select onchange={changePortal}>
    <option>admin</option>
    <option>teachers</option>
    <option>guardian</option>
  </select>
  <button onclick={addCounter}>Add Dynamic Counter</button>
</div>
```

## Configuration Insights

- Automatically detects development vs. production environments
- Dynamically constructs data source paths
- Provides granular portal-specific configuration

## Recommended Practices

1. Utilize development tools for comprehensive testing
2. Leverage portal-specific component rendering
3. Use dynamic data store for flexible state management
4. Implement portal access controls

## Troubleshooting

- Verify development server configuration
- Check browser console for configuration details
- Use portal switcher to simulate different environments

## Future Roadmap

- Enhanced development tools
- More granular portal simulation
- Advanced data store management features
- Improved developer experience

## Key Technologies

- Svelte 5 Runes
- TypeScript
- Vite
- PowerSchool Integration
