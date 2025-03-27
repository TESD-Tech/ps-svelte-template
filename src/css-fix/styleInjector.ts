/**
 * Style Injector for PowerSchool Svelte Template
 * 
 * Fixes the white text on white background issue by injecting CSS
 * into both the document and Shadow DOM.
 */

// Import our contrast fix CSS
import contrastFixCSS from './contrast-fix.css?inline';

/**
 * Injects the contrast fix CSS into the document
 */
export function injectGlobalContrastFix(): void {
  if (document.getElementById('ps-template-contrast-fix')) {
    return; // Already injected
  }
  
  const styleElement = document.createElement('style');
  styleElement.id = 'ps-template-contrast-fix';
  styleElement.textContent = contrastFixCSS;
  document.head.appendChild(styleElement);
  
  console.log('Injected global contrast fix CSS');
}

/**
 * Injects the contrast fix CSS into a Shadow DOM
 */
export function injectShadowContrastFix(shadowRoot: ShadowRoot): void {
  // Check if already injected
  if (shadowRoot.getElementById('shadow-contrast-fix')) {
    return;
  }
  
  const styleElement = document.createElement('style');
  styleElement.id = 'shadow-contrast-fix';
  styleElement.textContent = contrastFixCSS;
  shadowRoot.appendChild(styleElement);
}

/**
 * Finds and fixes all Shadow DOM instances in the document
 */
export function fixAllShadowDoms(): void {
  // Find all elements with Shadow DOM
  const elements = Array.from(document.querySelectorAll('*'));
  
  elements.forEach(el => {
    try {
      if (el.shadowRoot) {
        injectShadowContrastFix(el.shadowRoot);
      }
    } catch (error) {
      console.error('Error injecting styles into shadow root:', error);
    }
  });
}

/**
 * Initialize the contrast fix
 * Call this once at application startup
 */
export function initializeContrastFix(): void {
  // Inject global contrast fix
  injectGlobalContrastFix();
  
  // Fix existing Shadow DOMs
  fixAllShadowDoms();
  
  // Watch for new elements with Shadow DOM
  setInterval(fixAllShadowDoms, 1000);
  
  console.log('Contrast fix initialized');
}

/**
 * Shadow DOM wrapper that automatically injects contrast fix
 */
export function createStyledShadowDOM(host: HTMLElement, mode: 'open' | 'closed' = 'open'): ShadowRoot {
  const shadowRoot = host.attachShadow({ mode });
  injectShadowContrastFix(shadowRoot);
  return shadowRoot;
}

/**
 * Modify the custom element registration to automatically inject contrast fix
 */
export function defineStyledCustomElement(
  name: string,
  constructor: CustomElementConstructor,
  options?: ElementDefinitionOptions
): void {
  // Save original connected callback
  const originalConnectedCallback = constructor.prototype.connectedCallback;
  
  // Override connected callback to inject styles
  constructor.prototype.connectedCallback = function() {
    // Call original callback if it exists
    if (originalConnectedCallback) {
      originalConnectedCallback.call(this);
    }
    
    // Inject styles if this element has a shadow root
    if (this.shadowRoot) {
      injectShadowContrastFix(this.shadowRoot);
    }
  };
  
  // Define the custom element
  customElements.define(name, constructor, options);
}
