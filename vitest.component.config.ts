import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    // Disable hot reloading when running tests
    svelte({ hot: !process.env.VITEST })
  ],
  resolve: {
    alias: {
      // Create aliases for test mocks and utilities
      '$test': resolve(__dirname, './src/test-utils'),
      '$lib': resolve(__dirname, './src/lib'),
      // Component alias for direct imports
      '../lib/Counter.svelte': resolve(__dirname, './src/test-utils/mock-lib/Counter.svelte')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-utils/setupComponentTests.ts',
    include: ['**/src/lib/**/*.test.ts'],
    // Improve test isolation
    restoreMocks: true,
    mockReset: true,
    isolate: true,
    // Configure coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/lib/**/*.{js,ts,svelte}'],
      exclude: ['**/*.test.{js,ts}', '**/*.spec.{js,ts}', '**/test-utils/**']
    },
  },
});
