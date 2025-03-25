# PowerSchool Svelte Template

A modern template for building PowerSchool plugins using Svelte 5, TypeScript, and Vite. This template allows you to create both full applications and individual reusable web components that can be embedded in PowerSchool pages.

## Features

- **Svelte 5 with Runes**: Uses the latest Svelte 5 features for reactive state management
- **TypeScript**: Full TypeScript support for type safety and better developer experience
- **Standard CSS**: Clean, vanilla CSS with no external dependencies
- **Shadow DOM Encapsulation**: Components are isolated from PowerSchool's styles
- **Automatic Component Registration**: Components in `src/lib` are automatically available as web components
- **PowerSchool Plugin Ready**: Includes plugin.xml and proper output structure

## Data Configuration

### Environment-Specific Data Sourcing

The application uses a flexible data configuration system that supports different data sources across development and production environments.

#### Development
- Uses `/mock-data.json` in the `public/` directory
- Provides a static dataset for local development

#### Production (PowerSchool)
- Dynamically detects the current portal (admin, teachers, guardian)
- Constructs data source path: `/${pluginName}/${portal}/data.json`

#### Data Structure
Each data item can include `portalAccess` to control visibility:

```json
{
  "id": "unique-identifier",
  "count": 0,
  "label": "Item Label",
  "portalAccess": {
    "admin": true,
    "teachers": false,
    "guardian": false
  }
}
```

### Key Features
- Portal-aware data filtering
- Environment-specific data loading
- Flexible access control

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
└── vite.config.ts            # Vite configuration
```

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

## Remaining sections stay the same as in the previous README...
