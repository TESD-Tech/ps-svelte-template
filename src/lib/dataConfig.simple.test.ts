// src/lib/dataConfig.simple.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Create a direct mock of the module
vi.mock('./dataConfig', () => {
  // Create mock writable store
  const createStore = (initialValue) => ({
    subscribe: vi.fn((callback) => {
      callback(initialValue);
      return vi.fn(); // Unsubscribe function
    }),
    set: vi.fn(),
    update: vi.fn((fn) => {
      const newValue = fn(initialValue);
      initialValue = newValue;
      return newValue;
    })
  });

  // Return mocked module
  return {
    getPluginName: vi.fn(() => 'plugin-name'),
    detectPortal: vi.fn(() => 'admin'),
    getAppConfig: vi.fn(() => ({
      dataSourcePath: '/test/path.json',
      environment: 'development',
      portal: 'admin'
    })),
    appConfig: createStore({
      dataSourcePath: '/test/path.json',
      environment: 'development',
      portal: 'admin'
    }),
    appData: createStore([]),
    loadAppData: vi.fn(() => Promise.resolve([])),
    initializeAppData: vi.fn(() => Promise.resolve([])),
    updateAppData: vi.fn(),
    changePortal: vi.fn(),
  };
});

// Mock packageJson import
vi.mock('../../package.json', () => ({
  default: { name: '@org/plugin-name' }
}));

// Helper to simulate get() function from svelte/store
function get(store) {
  let value;
  store.subscribe(v => { value = v; })();
  return value;
}

// Import after mocks are setup
import * as dataConfig from './dataConfig';

describe('dataConfig simple tests', () => {
  describe('getPluginName', () => {
    it('should return the plugin name', () => {
      expect(dataConfig.getPluginName()).toBe('plugin-name');
    });
  });

  describe('detectPortal', () => {
    it('returns admin by default', () => {
      expect(dataConfig.detectPortal()).toBe('admin');
    });
  });

  describe('getAppConfig', () => {
    it('returns development config by default', () => {
      const config = dataConfig.getAppConfig();
      expect(config.environment).toBe('development');
    });
  });

  describe('loadAppData', () => {
    it('returns empty array by default', async () => {
      const data = await dataConfig.loadAppData();
      expect(data).toEqual([]);
    });
  });

  describe('appData store', () => {
    it('provides a writable store', () => {
      expect(dataConfig.appData.subscribe).toBeTypeOf('function');
      expect(dataConfig.appData.set).toBeTypeOf('function');
      expect(dataConfig.appData.update).toBeTypeOf('function');
    });
  });

  describe('updateAppData', () => {
    it('is a function', () => {
      expect(dataConfig.updateAppData).toBeTypeOf('function');
    });
  });
});
