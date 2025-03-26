import { mount } from 'svelte';
import App from './App.svelte';
// Import styles but don't apply them to the document
// We'll manually inject them into the shadow DOM
import styles from './app.css?inline';

// Dynamically determine the package name from the base URL
function getPackageName(): string {
  // Get the base URL from import.meta
  const baseUrl = import.meta.env.BASE_URL || '/';
  // Remove leading and trailing slashes
  const cleanedBase = baseUrl.replace(/^\/|\/$/g, '');
  // If there's a value, use it; otherwise fall back to a default
  return cleanedBase || 'ps-svelte';
}

export class SvelteAppElement extends HTMLElement {
  private shadow: ShadowRoot;
  private app: ReturnType<typeof mount> | null = null;

  constructor() {
    super();
    // Create a shadow DOM for style encapsulation
    this.shadow = this.attachShadow({ mode: 'open' });
    
    // Inject the global styles into the shadow DOM
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    this.shadow.appendChild(styleElement);
    
    // Create container for the Svelte app
    const appContainer = document.createElement('div');
    appContainer.id = 'svelte-app-container';
    this.shadow.appendChild(appContainer);
  }

  connectedCallback() {
    try {
      // Mount the Svelte app when the element is connected to the DOM
      const target = this.shadow.getElementById('svelte-app-container');
      
      if (!target) {
        console.error('Mount target not found for app');
        return;
      }
      
      // Using Svelte 5's mount API
      this.app = mount(App, {
        target,
        // We can pass props here if needed
        props: {}
      });
      
      if (import.meta.env.DEV) {
        console.log('Main application mounted successfully');
      }
    } catch (error) {
      console.error('Failed to mount main application:', error);
    }
  }

  disconnectedCallback() {
    // Clean up when the element is removed from the DOM
    if (this.app) {
      try {
        if (typeof this.app.$destroy === 'function') {
          this.app.$destroy();
        }
        this.app = null;
      } catch (error) {
        console.error('Error destroying app component:', error);
      }
    }
  }
}

// Define the custom element with the package name as a prefix
const packageName = getPackageName();
const elementName = `${packageName}-app`;

// Try/catch to handle registration errors
try {
  // Log the custom element name for debugging
  console.log(`Registering custom element: ${elementName}`);
  customElements.define(elementName, SvelteAppElement);
} catch (error) {
  console.error(`Failed to register ${elementName}:`, error);
  
  // Try to register with a fallback name if needed
  if (!customElements.get('ps-svelte-app')) {
    try {
      customElements.define('ps-svelte-app', SvelteAppElement);
      console.log('Registered fallback custom element: ps-svelte-app');
    } catch (fallbackError) {
      console.error('Failed to register fallback custom element:', fallbackError);
    }
  }
}
