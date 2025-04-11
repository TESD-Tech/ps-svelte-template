// Mock file for Svelte 5
import { vi } from 'vitest';

// Create a mock destroy function that we can spy on in tests
const mockDestroy = vi.fn();

// Main Svelte exports for use in tests
export const mount = vi.fn(() => ({
  $destroy: mockDestroy,
}));

// Mocked runes
export const $state = (initial: any) => initial;
export const $derived = (value: any) => value;
export const $effect = vi.fn((callback: () => void) => {
  // Execute the effect function once to simulate initialization
  try {
    callback();
  } catch (e) {
    // Ignore errors in effect initialization
  }
  return { destroy: vi.fn() };
});

export const $props = <T>(defaults?: any) => (defaults || {}) as T;

// File info for component identification
export const $ = {
  FILENAME: 'test.svelte'
};

// Mock component type
export interface ComponentType<Props = any> {
  new (options: { target: any; props?: Props }): {
    $destroy: () => void;
  };
}

// Export the mock destroy function to let tests spy on it
export const _testing = {
  mockDestroy
};
