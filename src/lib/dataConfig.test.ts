// src/lib/dataConfig.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { get } from 'svelte/store';

// Mock packageJson import
vi.mock('../../package.json', () => ({
  default: { name: '@org/plugin-name' }
}));

// Import the module under test after setting up mocks
import * as dataConfig from './dataConfig';

// Helper to mock window.location.pathname
function setPathname(pathname: string) {
  Object.defineProperty(window, 'location', {
    value: { pathname },
    writable: true,
    configurable: true
  });
}

// Helper to mock fetch
function mockFetch(response: any, ok = true, status = 200) {
  global.fetch = vi.fn().mockResolvedValue({
    ok,
    status,
    json: vi.fn().mockResolvedValue(response)
  });
}

describe('dataConfig module', () => {
  // Reset mocks and store state between tests
  afterEach(() => {
    vi.restoreAllMocks();
    // Reset appConfig and appData stores
    dataConfig.appConfig.set(dataConfig.getAppConfig());
    dataConfig.appData.set([]);
  });

  describe('getPluginName', () => {
    it('removes org scope from package name', () => {
      expect(dataConfig.getPluginName()).toBe('plugin-name');
    });
  });

  describe('detectPortal', () => {
    it('detects admin portal', () => {
      setPathname('/ps/admin/dashboard');
      expect(dataConfig.detectPortal()).toBe('admin');
    });
    
    it('detects teachers portal', () => {
      setPathname('/ps/teachers/home');
      expect(dataConfig.detectPortal()).toBe('teachers');
    });
    
    it('detects guardian portal', () => {
      setPathname('/ps/guardian/home');
      expect(dataConfig.detectPortal()).toBe('guardian');
    });
    
    it('returns unknown for other paths', () => {
      setPathname('/ps/other/home');
      expect(dataConfig.detectPortal()).toBe('unknown');
    });
  });

  describe('getAppConfig', () => {
    it('returns production config for PowerSchool path', () => {
      setPathname('/ps/admin/dashboard');
      const config = dataConfig.getAppConfig();
      expect(config.environment).toBe('production');
      expect(config.portal).toBe('admin');
      expect(config.dataSourcePath).toBe('/plugin-name/admin/data.json');
    });
    
    it('returns development config for non-ps path', () => {
      setPathname('/dev/test/');
      const config = dataConfig.getAppConfig();
      expect(config.environment).toBe('development');
      expect(config.portal).toBe('unknown');
      expect(config.dataSourcePath).toContain('mock-data.json');
    });
  });

  describe('loadAppData', () => {
    beforeEach(() => {
      setPathname('/ps/admin/dashboard');
      dataConfig.appConfig.set(dataConfig.getAppConfig());
    });

    it('loads and returns data (object)', async () => {
      const mockData = { foo: 'bar' };
      mockFetch(mockData);
      const data = await dataConfig.loadAppData();
      expect(data).toEqual(mockData);
    });

    it('filters array data by portalAccess', async () => {
      const mockData = [
        { id: 1, portalAccess: { admin: true } },
        { id: 2, portalAccess: { teachers: true } },
        { id: 3 }
      ];
      mockFetch(mockData);
      const data = await dataConfig.loadAppData();
      expect(data).toEqual([
        { id: 1, portalAccess: { admin: true } },
        { id: 3 }
      ]);
    });

    it('returns all items if portalAccess is missing', async () => {
      const mockData = [{ id: 1 }, { id: 2 }];
      mockFetch(mockData);
      const data = await dataConfig.loadAppData();
      expect(data).toEqual(mockData);
    });

    it('returns empty array on fetch error', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('fail'));
      const data = await dataConfig.loadAppData();
      expect(data).toEqual([]);
    });

    it('returns empty array on non-ok response', async () => {
      mockFetch(null, false, 404);
      const data = await dataConfig.loadAppData();
      expect(data).toEqual([]);
    });
  });

  describe('initializeAppData', () => {
    it('sets appData store with loaded data', async () => {
      setPathname('/ps/admin/dashboard');
      const mockData = [{ id: 1 }];
      mockFetch(mockData);
      await dataConfig.initializeAppData();
      expect(get(dataConfig.appData)).toEqual(mockData);
    });

    it('sets appData to [] on error', async () => {
      setPathname('/ps/admin/dashboard');
      global.fetch = vi.fn().mockRejectedValue(new Error('fail'));
      await dataConfig.initializeAppData();
      expect(get(dataConfig.appData)).toEqual([]);
    });
  });

  describe('updateAppData', () => {
    it('updates appData store', () => {
      dataConfig.appData.set([{ id: 1 }]);
      dataConfig.updateAppData(arr => [...arr, { id: 2 }]);
      expect(get(dataConfig.appData)).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it('logs sync in production', () => {
      setPathname('/ps/admin/dashboard');
      const spy = vi.spyOn(console, 'log');
      dataConfig.updateAppData(arr => arr);
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('Sync changes for admin portal would happen here'));
    });
  });

  describe('changePortal', () => {
    it('updates portal in appConfig and reloads data', async () => {
      setPathname('/ps/admin/dashboard');
      mockFetch([{ id: 1 }]);
      await dataConfig.changePortal('teachers');
      const config = get(dataConfig.appConfig);
      expect(config.portal).toBe('teachers');
      // Wait for appData to update
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(get(dataConfig.appData)).toEqual([{ id: 1 }]);
    });
  });
});
