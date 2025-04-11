// Component test setup file

import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock all Svelte modules
vi.mock('svelte', () => ({
  mount: vi.fn(() => ({ $destroy: vi.fn() })),
  $state: vi.fn((initial) => initial),
  $derived: vi.fn((value) => value),
  $effect: vi.fn((callback) => {
    try { callback(); } catch (e) {}
    return { destroy: vi.fn() };
  }),
  $props: vi.fn((defaults) => defaults || {}),
  $: { FILENAME: 'test.svelte' }
}));

vi.mock('svelte/store', () => ({
  writable: vi.fn((value) => ({
    subscribe: vi.fn((callback) => {
      callback(value);
      return vi.fn(); // Unsubscribe function
    }),
    set: vi.fn(),
    update: vi.fn()
  })),
  readable: vi.fn(),
  derived: vi.fn(),
  get: vi.fn((store) => {
    let value;
    store.subscribe((v) => { value = v; })();
    return value;
  })
}));

vi.mock('svelte/internal', () => ({
  createEventDispatcher: vi.fn(() => vi.fn()),
  getContext: vi.fn(),
  setContext: vi.fn(),
  onMount: vi.fn((fn) => {
    fn();
    return { destroy: vi.fn() };
  }),
  onDestroy: vi.fn(),
  tick: vi.fn(() => Promise.resolve()),
  disclose_version: vi.fn()
}));

vi.mock('svelte/internal/disclose-version', () => ({
  default: vi.fn()
}));

vi.mock('svelte/internal/client', () => ({
  element: vi.fn((tag) => document.createElement(tag)),
  text: vi.fn((content) => document.createTextNode(content)),
  append: vi.fn(),
  attr: vi.fn(),
  insert: vi.fn(),
  detach: vi.fn(),
  listen: vi.fn(() => vi.fn()),
  strict_equals: vi.fn((a, b) => a === b),
  safe_not_equal: vi.fn((a, b) => a !== b),
  noop: vi.fn(),
  runes: {
    $state: vi.fn(a => a),
    $derived: vi.fn(a => a),
    $effect: vi.fn(() => ({ destroy: vi.fn() })),
    $props: vi.fn(defaults => defaults || {})
  },
  $: {
    source: vi.fn(),
    FILENAME: 'test.svelte',
    LINE: 0,
    COLUMN: 0
  }
}));

// Mock dataConfig
vi.mock('../lib/dataConfig', () => ({
  appData: {
    subscribe: vi.fn(cb => {
      cb([]);
      return vi.fn();
    }),
    set: vi.fn(),
    update: vi.fn()
  },
  appConfig: {
    subscribe: vi.fn(cb => {
      cb({
        dataSourcePath: '/test/path.json',
        environment: 'development',
        portal: 'admin'
      });
      return vi.fn();
    }),
    set: vi.fn(),
    update: vi.fn()
  },
  updateAppData: vi.fn(),
  initializeAppData: vi.fn(() => Promise.resolve([])),
  getPluginName: vi.fn(() => 'plugin-name'),
  detectPortal: vi.fn(() => 'admin'),
  getAppConfig: vi.fn(() => ({
    dataSourcePath: '/test/path.json',
    environment: 'development',
    portal: 'admin'
  })),
  loadAppData: vi.fn(() => Promise.resolve([]))
}));

// Mock package.json
vi.mock('../../package.json', () => ({
  default: { name: '@org/plugin-name' }
}));

// Setup mock for Counter.svelte
vi.mock('../lib/Counter.svelte', () => ({
  default: vi.fn(() => ({
    count: 0,
    id: 'counter-test',
    label: 'Test Counter',
    increment: vi.fn(),
    decrement: vi.fn(),
    reset: vi.fn()
  }))
}));

// Mock @testing-library/svelte to avoid dependency on client module
vi.mock('@testing-library/svelte', () => ({
  render: vi.fn((component, options = {}) => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    
    return {
      component,
      container,
      getByText: vi.fn(),
      getByTestId: vi.fn(),
      queryByText: vi.fn(),
      queryByTestId: vi.fn(),
      findByText: vi.fn(() => Promise.resolve()),
      findByTestId: vi.fn(() => Promise.resolve()),
      cleanup: vi.fn()
    };
  }),
  fireEvent: {
    click: vi.fn(),
    change: vi.fn(),
    input: vi.fn(),
  },
  screen: {
    getByText: vi.fn(),
    getByTestId: vi.fn()
  },
  cleanup: vi.fn()
}));

// Mock DOM-related functions
if (typeof window !== 'undefined') {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
}

// Add global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

// Cleanup after each test
afterEach(() => {
  vi.clearAllMocks();
});
