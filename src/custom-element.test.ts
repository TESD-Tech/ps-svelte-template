// src/custom-element.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SvelteElementTest } from './test-utils/helpers/element-testing';

// Set up global mocks first
vi.mock('svelte', () => ({
  mount: vi.fn(() => ({
    $destroy: vi.fn()
  }))
}));

vi.mock('./App.svelte', () => ({ default: {} }));
vi.mock('./app.css?inline', () => ({ default: 'body { color: red; }' }));
vi.mock('./css-fix/styleInjector', () => ({
  injectShadowContrastFix: vi.fn()
}));
vi.mock('./css-fix/contrast-fix.css?inline', () => ({ default: 'body { background: black; }' }));

// Setup mock environment globals
beforeEach(() => {
  vi.stubGlobal('import.meta', {
    env: { BASE_URL: '/custom/', DEV: true }
  });
});

// Import the module under test after setting up mocks
import { SvelteAppElement } from './custom-element';

describe('SvelteAppElement', () => {
  let element: SvelteAppElement;
  let container: HTMLElement;

  beforeEach(() => {
    // Mock the custom element registry
    SvelteElementTest.mockCustomElement('custom-app', SvelteAppElement);
    
    // Create test container
    container = SvelteElementTest.createTestContainer();
    
    // Create new element instance
    element = new SvelteAppElement();
    container.appendChild(element);
  });

  afterEach(() => {
    SvelteElementTest.cleanup();
  });

  it('creates shadow DOM with styles and app container', () => {
    // Validate shadow DOM structure
    SvelteElementTest.validateShadowDOM(element, [
      'style',                   // Style element
      '#contrast-fix-styles',    // Contrast fix styles
      '#svelte-app-container'    // App container
    ]);
  });

  it('calls mount() when connected to DOM', async () => {
    // Get reference to mocked mount function - use dynamic import instead of require
    const svelte = await import('svelte');
    const { mount } = svelte;
    
    // Call connectedCallback
    element.connectedCallback();
    
    // Verify mount was called with correct target
    expect(mount).toHaveBeenCalled();
    const mountArgs = mount.mock.calls[0][1];
    const container = element.shadowRoot!.getElementById('svelte-app-container');
    expect(mountArgs.target).toBe(container);
  });

  it('logs success message in DEV mode', () => {
    const spy = vi.spyOn(console, 'log');
    element.connectedCallback();
    expect(spy).toHaveBeenCalledWith('Main application mounted successfully');
  });

  it('cleans up when disconnected', () => {
    // Setup
    element.connectedCallback();
    const app = (element as any).app;
    const destroySpy = vi.spyOn(app, '$destroy');
    
    // Test
    element.disconnectedCallback();
    
    // Verify
    expect(destroySpy).toHaveBeenCalled();
    expect((element as any).app).toBeNull();
  });
});

describe('custom element registration', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Restore console.log to track registration messages
    vi.spyOn(console, 'log');
  });
  
  it('registers with correct element name', async () => {
    // Use a fresh import to trigger registration code
    vi.resetModules();
    vi.stubGlobal('import.meta', { env: { BASE_URL: '/test-package/' } });
    
    // Spy on customElements.define
    const defineSpy = vi.spyOn(customElements, 'define');
    
    // Import to trigger registration - use dynamic import
    await import('./custom-element');
    
    // Verify registration - no matter what BASE_URL is, it's using ps-svelte-app fallback
    expect(defineSpy).toHaveBeenCalledWith('ps-svelte-app', expect.any(Function));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Registering custom element'));
  });

  it('falls back to ps-svelte-app if registration fails', async () => {
    // Set up failure for first registration attempt
    vi.spyOn(customElements, 'define')
      .mockImplementationOnce(() => { throw new Error('Registration failed'); })
      .mockImplementation(() => {}); // Allow second attempt
      
    // Mock customElements.get to report no registration
    vi.spyOn(customElements, 'get')
      .mockReturnValue(undefined);
    
    // Import to trigger registration
    vi.resetModules();
    await import('./custom-element');
    
    // Verify fallback registration
    expect(customElements.define).toHaveBeenCalledTimes(2);
    expect(customElements.define).toHaveBeenNthCalledWith(2, 'ps-svelte-app', expect.any(Function));
  });
});
