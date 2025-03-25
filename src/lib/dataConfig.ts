// src/lib/dataConfig.ts
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
function getPluginName(): string {
  return packageJson.name.replace(/^@[^/]+\//, '');
}

// Function to determine the current portal from the URL
function detectPortal(): Portal {
  // Check the current path
  const path = window.location.pathname.toLowerCase();
  
  if (path.includes('/admin/')) return 'admin';
  if (path.includes('/teachers/')) return 'teachers';
  if (path.includes('/guardian/')) return 'guardian';
  
  return 'unknown';
}

// Function to determine the correct configuration
function getAppConfig(): AppConfig {
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
    dataSourcePath: '/mock-data.json', // Local Vite development path
    environment: 'development',
    portal: 'unknown'
  };
}

// Create a store for application configuration
export const appConfig = writable<AppConfig>(getAppConfig());

// Async function to load data from the configured path
export async function loadAppData<T>(): Promise<T> {
  // Get the current configuration
  const config = getAppConfig();
  
  try {
    const response = await fetch(config.dataSourcePath);
    
    if (!response.ok) {
      // Log detailed error information
      console.error(`Failed to fetch data from ${config.dataSourcePath}`, 
        `Status: ${response.status}, 
        Portal: ${config.portal}, 
        Environment: ${config.environment}`);
      
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error('Failed to load application data:', error);
    
    // Provide fallback or default data
    return [] as T;
  }
}

// Reactive store for application data
export const appData = writable<any[]>([]);

// Initialize data loading
export async function initializeAppData() {
  const data = await loadAppData<any[]>();
  appData.set(data);
}

// Example of a data mutation function that works across environments
export function updateAppData(updateFn: (current: any[]) => any[]) {
  appData.update(updateFn);
  
  // Optional: Sync back to server in production
  const config = getAppConfig();
  if (config.environment === 'production') {
    // Implement server sync logic here
    // This might involve a POST/PUT request to update the JSON file
    console.log(`Attempting to sync data for ${config.portal} portal`);
  }
}

// Utility function to check current portal
export function getCurrentPortal(): Portal {
  return getAppConfig().portal;
}
