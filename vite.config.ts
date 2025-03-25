import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Read package.json to get the project name
const packageJson = JSON.parse(
  readFileSync(resolve(__dirname, 'package.json'), 'utf-8')
);

// Use the package name as the base path (remove any scope if present)
const projectName = packageJson.name.replace(/^@[^/]+\//, '');

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        // We'll handle custom elements differently for individual components vs. the main app
        customElement: false
      },
      // Generate CSS that can be injected into Shadow DOM
      emitCss: false
    })
  ],
  // Dynamically set the base path using the package name
  base: `/${projectName}/`,
  css: {
    // Ensure CSS modules are properly processed
    modules: {
      localsConvention: 'camelCaseOnly'
    }
  },
  resolve: {
    // Add alias for package.json import
    alias: {
      '../../package.json': resolve(__dirname, 'package.json')
    }
  },
  build: {
    // Dynamically set the output directory using the package name
    outDir: `dist/WEB_ROOT/${projectName}/`,
    assetsDir: 'assets',
    // Optimize the build for web components
    rollupOptions: {
      // Just use the main entry point which will automatically register all components
      input: {
        'index': 'src/main.ts'
      },
      output: {
        // Predictable file names for easier integration
        entryFileNames: '[name].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
})