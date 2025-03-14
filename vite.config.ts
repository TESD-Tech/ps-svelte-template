import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    svelte({
      compilerOptions: {
        // We'll handle custom elements differently for individual components vs. the main app
        customElement: false
      },
      // Generate CSS that can be injected into Shadow DOM
      emitCss: false
    })
  ],
  base: '/ps-svelte-template/',
  css: {
    // Ensure CSS modules are properly processed
    modules: {
      localsConvention: 'camelCaseOnly'
    }
  },
  build: {
    outDir: 'dist/WEB_ROOT/ps-svelte-template/',
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
