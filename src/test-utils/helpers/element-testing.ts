import { vi } from 'vitest';

/**
 * Helper class for testing custom elements
 */
export class SvelteElementTest {
  /**
   * Create a mock for a custom element
   * @param elementName Name of the custom element
   * @param ElementClass The element class constructor
   */
  static mockCustomElement(elementName: string, ElementClass: CustomElementConstructor): void {
    // Mock customElements.define to register the element
    vi.spyOn(customElements, 'define').mockImplementation();
    
    // Mock customElements.get to return the element class
    vi.spyOn(customElements, 'get').mockImplementation((name) => {
      if (name === elementName) {
        return ElementClass;
      }
      return undefined;
    });
  }
  
  /**
   * Check that a shadow DOM element has the expected components
   * @param element Custom element to test
   * @param expectedSelectors List of CSS selectors that should exist in shadow DOM
   */
  static validateShadowDOM(element: HTMLElement, expectedSelectors: string[]): void {
    // Verify shadow DOM exists
    const shadow = (element as any).shadowRoot;
    expect(shadow).toBeTruthy();
    
    // Check all expected selectors
    for (const selector of expectedSelectors) {
      expect(shadow.querySelector(selector)).toBeTruthy();
    }
  }
  
  /**
   * Create a container for mounting custom element tests
   */
  static createTestContainer(): HTMLElement {
    const container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);
    return container;
  }
  
  /**
   * Clean up after testing
   */
  static cleanup(): void {
    document.body.innerHTML = '';
    vi.resetAllMocks();
  }
}
