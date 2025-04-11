// Mock dataConfig for testing
import { vi } from 'vitest';
import { writable } from 'svelte/store';

// Mock types
export type Portal = 'admin' | 'teachers' | 'guardian' | 'unknown';

export interface AppConfig {
  dataSourcePath: string;
  environment: 'development' | 'production';
  portal: Portal;
}

// Mock functions with vitest spies
export const getPluginName = vi.fn(() => 'plugin-name');
export const detectPortal = vi.fn(() => 'admin');

export const getAppConfig = vi.fn(() => ({
  dataSourcePath: '/test/path.json',
  environment: 'development',
  portal: 'admin'
}));

// Mock stores
export const appConfig = writable<AppConfig>({
  dataSourcePath: '/test/path.json',
  environment: 'development',
  portal: 'admin'
});

export const appData = writable<any[]>([]);

// Mock function implementations
export const loadAppData = vi.fn<[], Promise<any[]>>(async () => {
  return Promise.resolve([]);
});

export const initializeAppData = vi.fn(async () => {
  const data = await loadAppData();
  appData.set(data);
  return data;
});

export const updateAppData = vi.fn((updateFn: (current: any[]) => any[]) => {
  appData.update(updateFn);
});

export const changePortal = vi.fn((portal: Portal) => {
  appConfig.update(config => ({
    ...config,
    portal
  }));
});
