// src/lib/dataConfig.ts
// Using writable for compatibility with Svelte 5 runes
import { writable } from 'svelte/store';
import packageJson from '../../package.json';

// Define possible portal types
export type Portal = 'admin' | 'teachers' | 'guardian' | 'unknown';

// Interface for configuration
export interface AppConfig {
  dataSourcePath: string;
  environment: 'development' | 'production';
  portal: Portal;
}

// Function to get the plugin name from package.json
export function getPluginName(): string {
  return packageJson.name.replace(/^@[^/]+\//, '');
}

// Function to determine the current portal from the URL
export function detectPortal(): Portal {
  // Check the current path
  const path = window.location.pathname.toLowerCase();
  
  if (path.includes('/admin/')) return 'admin';
  if (path.includes('/teachers/')) return 'teachers';
  if (path.includes('/guardian/')) return 'guardian';
  
  return 'unknown';
}

// Function to determine the correct configuration
export function getAppConfig(): AppConfig {
  // Check if running in PowerSchool environment
  const isPowerSchool = window.location.pathname.includes('/ps/');
  
  if (isPowerSchool) {
    const portal = detectPortal();
    const pluginName = getPluginName();
    
    // Construct dynamic path based on plugin name and portal
    return {
      dataSourcePath: `/${pluginName}/${portal}/data.json`,
      environment: 'production',
      portal
    };
  }
  
  // Development configuration
  return {
    dataSourcePath: `${window.location.pathname}mock-data.json`, // Use the full path
    environment: 'development',
    portal: detectPortal()
  };
}

// Create a store for application configuration
export const appConfig = writable<AppConfig>(getAppConfig());

// Async function to load data from the configured path
export async function loadAppData<T>(): Promise<T> {
  let config: AppConfig | undefined;
  const unsubscribe = appConfig.subscribe(c => { config = c; });
  unsubscribe();
  if (!config) {
    throw new Error('App config is not set');
  }
  
  try {
    console.log(`Loading data from ${config.dataSourcePath} for portal ${config.portal}`);
    const response = await fetch(config.dataSourcePath);
    
    if (!response.ok) {
      console.error(`Failed to fetch data from ${config.dataSourcePath}`, 
        `Status: ${response.status}, 
        Portal: ${config.portal}, 
        Environment: ${config.environment}`);
      
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Loaded raw data:', data);
    
    // If we have an array, filter based on portal access
    if (Array.isArray(data)) {
      const filteredData = data.filter(item => {
        // Include items without portalAccess property
        if (!item.portalAccess) return true;
        
        // Include items with access to current portal
        if (item.portalAccess[config!.portal]) return true;
        
        return false;
      });
      
      console.log('Filtered data for portal', config.portal, ':', filteredData);
      return filteredData as T;
    }
    
    return data as T;
  } catch (error) {
    console.error('Failed to load application data:', error);
    
    // Provide empty array as fallback
    return [] as T;
  }
}

// Reactive store for application data
export const appData = writable<any[]>([]);

// Initialize data loading - returns a promise for use with runes $effect
export async function initializeAppData() {
  try {
    const data = await loadAppData<any[]>();
    console.log('Setting app data:', data);
    appData.set(data);
    return data;
  } catch (err) {
    console.error('Error initializing app data:', err);
    appData.set([]);
    return [];
  }
}

// Update data function that works across environments
export function updateAppData(updateFn: (current: any[]) => any[]) {
  appData.update(updateFn);
  
  // Optional: Sync back to server in production
  const config = getAppConfig();
  if (config.environment === 'production') {
    // Implement server sync logic here if needed
    console.log(`Sync changes for ${config.portal} portal would happen here`);
  }
}

// Function to manually change portal (for development)
export function changePortal(portal: Portal) {
  appConfig.update(config => ({
    ...config,
    portal
  }));
  
  // Reload data with new portal
  initializeAppData();
}
