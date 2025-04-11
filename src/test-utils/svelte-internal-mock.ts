// Mock for Svelte internal
import { vi } from 'vitest';

// Mock disclose-version
export const disclose_version = vi.fn();

// Mock internal functions used by Svelte compiler
export const createEventDispatcher = vi.fn(() => {
  return vi.fn();
});

export const getContext = vi.fn((key: any) => undefined);
export const setContext = vi.fn((key: any, context: any) => {});

// Mock lifecycle hooks
export const onMount = vi.fn((fn: () => any) => {
  // Execute callback immediately to simulate mounting
  fn();
  return { destroy: vi.fn() };
});

export const onDestroy = vi.fn((fn: () => void) => {
  // Don't execute the callback - will be called by the test if needed
});

export const tick = vi.fn(() => Promise.resolve());

// Always export 'disclose-version' for imports like 'svelte/internal/disclose-version'
export const disclose_version_export = disclose_version;
export default disclose_version;
