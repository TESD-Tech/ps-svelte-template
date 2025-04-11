// Mock of Svelte internal client module
import { vi } from 'vitest';

// Mock all necessary internal functions for Svelte 5 component rendering
export const BROWSER = true;
export const DEV = true;
export const HMR = false;

// Mock DOM utility functions
export const append = vi.fn();
export const attr = vi.fn();
export const children = vi.fn(() => []);
export const detach = vi.fn();
export const element = vi.fn((tag) => {
  if (typeof document !== 'undefined') {
    return document.createElement(tag);
  }
  return { tagName: tag };
});
export const empty = vi.fn();
export const insert = vi.fn();
export const listen = vi.fn(() => vi.fn()); // Return unsubscribe function
export const noop = () => {};
export const text = vi.fn((content) => {
  if (typeof document !== 'undefined') {
    return document.createTextNode(content);
  }
  return { textContent: content };
});

// Mock component lifecycle functions
export const init = vi.fn();
export const loop = vi.fn();
export const safe_not_equal = vi.fn((a, b) => a !== b);
export const validate_slots = vi.fn();
export const get_slot_changes = vi.fn(() => ({}));
export const transition_in = vi.fn();
export const transition_out = vi.fn();
export const create_slot = vi.fn();
export const update_slot = vi.fn();
export const get_all_dirty_from_scope = vi.fn(() => [true]);
export const get_binding_group_value = vi.fn(() => []);
export const compute_rest_props = vi.fn();
export const compute_slots = vi.fn();
export const set_data = vi.fn();
export const set_style = vi.fn();
export const group_outros = vi.fn();
export const check_outros = vi.fn();
export const on_mount = vi.fn((fn) => {
  try {
    fn();
  } catch (e) {
    // Ignore errors
  }
});
export const onDestroy = vi.fn();
export const createEventDispatcher = vi.fn(() => vi.fn());

// Mock for component constructor
export const SvelteComponent = function SvelteComponent(options) {
  this.options = options;
  this.$$ = {
    fragment: null,
    ctx: null
  };
  
  // Return mock component instance
  return {
    $destroy: vi.fn(),
    $set: vi.fn(),
    $on: vi.fn()
  };
};

// Mock for component initialization
export const initialize = vi.fn((component, options) => {
  return component;
});

// Mock for binding callbacks
export const binding_callbacks = [];

// Export component instance context
export const COMPONENT = {};

// Svelte 5 runes
export const runes = {
  $state: (value) => value,
  $derived: (value) => value,
  $effect: vi.fn((fn) => {
    try {
      fn();
    } catch (e) {
      // Ignore
    }
    return { destroy: vi.fn() };
  }),
  $props: (defaults) => defaults || {}
};

// Export $ for Svelte 5 runes
export const $ = {
  source: vi.fn(),
  FILENAME: 'mock.svelte',
  LINE: 0,
  COLUMN: 0
};
