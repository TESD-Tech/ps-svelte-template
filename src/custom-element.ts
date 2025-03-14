import { mount } from 'svelte';
import App from './App.svelte';
// Import styles but don't apply them to the document
// We'll manually inject them into the shadow DOM
import styles from './app.css?inline';

export class SvelteAppElement extends HTMLElement {
  private shadow: ShadowRoot;
  private app: any;

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
    // Mount the Svelte app when the element is connected to the DOM
    this.app = mount(App, {
      target: this.shadow.getElementById('svelte-app-container')!,
    });
  }

  disconnectedCallback() {
    // Clean up when the element is removed from the DOM
    if (this.app && typeof this.app.$destroy === 'function') {
      this.app.$destroy();
    }
  }
}

// Define the custom element
customElements.define('ps-svelte-app', SvelteAppElement);
