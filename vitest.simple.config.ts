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
      // Mock Svelte internals for testing
      'svelte/store': resolve(__dirname, './src/test-utils/svelte-store-mock.ts'),
      'svelte/internal': resolve(__dirname, './src/test-utils/svelte-internal-mock.ts'),
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    // Configure a super simple setup
    // Improve test isolation
    restoreMocks: true,
    mockReset: true,
    isolate: true,
    deps: {
      interopDefault: true
    },
    // Configure coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/lib/**/*.{js,ts}'],
      exclude: ['**/*.test.{js,ts}', '**/*.spec.{js,ts}', '**/test-utils/**']
    },
  },
});
