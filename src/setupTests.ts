// Setup file for Vitest + Svelte Testing Library

import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { cleanup } from '@testing-library/svelte';

// Mock crypto.randomUUID since it's used in components
if (!crypto.randomUUID) {
  Object.defineProperty(crypto, 'randomUUID', {
    value: vi.fn(() => Math.random().toString(36).substring(2, 15)),
    configurable: true,
  });
}

// Mock fetch function
global.fetch = vi.fn();

// Mock browser environment functions that may be missing
global.customElements = global.customElements || {
  define: vi.fn(),
  get: vi.fn(),
  whenDefined: vi.fn(),
  registry: {}
};

// Add mock for import.meta.env
vi.stubGlobal('import.meta', {
  env: {
    DEV: true,
    BASE_URL: '/ps-svelte-template/'
  },
  glob: vi.fn(() => ({}))
});

// Cleanup after each test to prevent test pollution
afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});
