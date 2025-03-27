// This file automatically creates custom elements for all Svelte components in the lib directory
import { mount } from 'svelte';
import type { ComponentType } from 'svelte';
import styles from './app.css?inline';
// Import contrast fix styles
import contrastFixStyles from './css-fix/contrast-fix.css?inline';

// Import all components from lib directory
// This will be processed by Vite's glob import feature
const componentModules = import.meta.glob('./lib/*.svelte', { eager: true });

// Type for a Svelte component constructor
type SvelteComponentConstructor = ComponentType<any>;

/**
 * Creates a custom element class for a Svelte component with Svelte 5 compatibility
 */
function createCustomElementClass(
  SvelteComponent: SvelteComponentConstructor, 
  elementName: string
) {
  return class extends HTMLElement {
    private shadow: ShadowRoot;
    private svelteInstance: ReturnType<typeof mount> | null = null;
    private props: Record<string, any> = {};
    
    // Define the observed attributes for attribute changes
    static get observedAttributes() {
      return Array.from(this.prototype.constructor.name);
    }
    
    constructor() {
      super();
      
      // Create shadow DOM for style isolation
      this.shadow = this.attachShadow({ mode: 'open' });
      
      // Inject global styles
      const styleElement = document.createElement('style');
      styleElement.textContent = styles;
      this.shadow.appendChild(styleElement);
      
      // Inject contrast fix styles
      const contrastFixElement = document.createElement('style');
      contrastFixElement.textContent = contrastFixStyles;
      contrastFixElement.id = 'contrast-fix-styles';
      this.shadow.appendChild(contrastFixElement);
      
      // Create container
      const container = document.createElement('div');
      container.id = `${elementName}-container`;
      this.shadow.appendChild(container);
    }
    
    /**
     * Called when the element is added to the DOM
     */
    connectedCallback() {
      // Get all attributes and set as props
      this.updatePropsFromAttributes();
      
      // Mount the Svelte component
      this.mountComponent();
    }
    
    /**
     * Called when the element is removed from the DOM
     */
    disconnectedCallback() {
      this.destroyComponent();
    }
    
    /**
     * Called when attributes are changed
     */
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      if (oldValue !== newValue) {
        // Update the prop value
        this.props[this.camelCase(name)] = this.parseAttributeValue(newValue);
        
        // Update the component if it's already mounted
        if (this.svelteInstance) {
          this.updateComponent();
        }
      }
    }
    
    /**
     * Convert attribute name to camelCase for Svelte props
     */
    private camelCase(str: string): string {
      return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    }
    
    /**
     * Parse attribute value to the appropriate type
     */
    private parseAttributeValue(value: string): any {
      if (value === 'true') return true;
      if (value === 'false') return false;
      if (value === 'null') return null;
      if (value === 'undefined') return undefined;
      if (!isNaN(Number(value)) && value.trim() !== '') return Number(value);
      
      // Try to parse as JSON
      try {
        return JSON.parse(value);
      } catch (e) {
        // If not valid JSON, return as string
        return value;
      }
    }
    
    /**
     * Update props from element attributes
     */
    private updatePropsFromAttributes() {
      Array.from(this.attributes).forEach(attr => {
        const name = this.camelCase(attr.name);
        const value = this.parseAttributeValue(attr.value);
        this.props[name] = value;
      });
    }
    
    /**
     * Mount the Svelte component with improved error handling
     * and compatibility with Svelte 5's mount API
     */
    private mountComponent() {
      try {
        const target = this.shadow.getElementById(`${elementName}-container`);
        
        if (!target) {
          console.error(`Mount target not found for ${elementName}`);
          return;
        }
        
        // Using the Svelte 5 mount API
        this.svelteInstance = mount(SvelteComponent, {
          target,
          props: this.props
        });
        
        // Success logging for development
        if (import.meta.env.DEV) {
          console.debug(`Successfully mounted <${elementName}>`);
        }
      } catch (error) {
        console.error(`Failed to mount component <${elementName}>:`, error);
      }
    }
    
    /**
     * Update the Svelte component with new props
     */
    private updateComponent() {
      if (this.svelteInstance) {
        try {
          // Use the Svelte 5 approach to update props
          Object.entries(this.props).forEach(([key, value]) => {
            // In Svelte 5, props are directly set on the mount instance
            (this.svelteInstance as any)[key] = value;
          });
        } catch (error) {
          console.error(`Failed to update props for <${elementName}>:`, error);
        }
      }
    }
    
    /**
     * Destroy the Svelte component with proper cleanup
     */
    private destroyComponent() {
      if (this.svelteInstance) {
        try {
          // Svelte 5 uses different destroy mechanism
          if (typeof this.svelteInstance.$destroy === 'function') {
            this.svelteInstance.$destroy();
          } else {
            // Svelte 5 mount API handles cleanup directly
            // by returning control handle we can destroy
            this.svelteInstance = null;
          }
        } catch (error) {
          console.error(`Error destroying <${elementName}>:`, error);
        }
      }
    }
  };
}

/**
 * Register all components as custom elements
 */
export function registerLibComponents() {
  // Process each component module
  Object.entries(componentModules).forEach(([path, module]) => {
    // Extract the component name from the path
    // e.g., './lib/Counter.svelte' becomes 'counter'
    const fileName = path.split('/').pop()?.split('.')[0]?.toLowerCase() || '';
    
    // Create the custom element name with 'svelte-' prefix
    const elementName = `svelte-${fileName}`;
    
    // Skip if already registered
    if (customElements.get(elementName)) {
      return;
    }
    
    // Get the default export (the Svelte component)
    const component = (module as any).default;
    
    // Register the custom element
    try {
      customElements.define(
        elementName,
        createCustomElementClass(component, elementName)
      );
      
      if (import.meta.env.DEV) {
        console.log(`Registered custom element: <${elementName}>`);
      }
    } catch (error) {
      console.error(`Failed to register <${elementName}>:`, error);
    }
  });
}

// Automatically register all components when this file is imported
registerLibComponents();
