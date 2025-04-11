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
      // Mock Svelte internals for testing
      'svelte': resolve(__dirname, './src/test-utils/svelte-mock.ts'),
      'svelte/store': resolve(__dirname, './src/test-utils/svelte-store-mock.ts'),
      'svelte/internal': resolve(__dirname, './src/test-utils/svelte-internal-mock.ts'),
      'svelte/internal/client': resolve(__dirname, './src/test-utils/svelte/internal/client.ts'),
      'svelte/internal/disclose-version': resolve(__dirname, './src/test-utils/svelte/internal/disclose-version.ts'),
      'svelte/src/runtime': resolve(__dirname, './src/test-utils/svelte-mock.ts'),
      // Mock component and module files
      './lib/Counter.svelte': resolve(__dirname, './src/test-utils/mock-lib/Counter.svelte'),
      '../lib/dataConfig': resolve(__dirname, './src/test-utils/mock-lib/dataConfig.ts'),
      // Mock for @testing-library/svelte
      '@testing-library/svelte': resolve(__dirname, './src/test-utils/helpers/testing-library-svelte-mock.ts')
    },
    // Ensure full compatibility with all import patterns
    dedupe: ['svelte', 'svelte/internal', 'svelte/store', '@testing-library/svelte']
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    // Improve test isolation
    restoreMocks: true,
    mockReset: true,
    isolate: true,
    // Configure coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{js,ts,svelte}'],
      exclude: ['**/*.test.{js,ts}', '**/*.spec.{js,ts}', '**/test-utils/**']
    },
  },
});
