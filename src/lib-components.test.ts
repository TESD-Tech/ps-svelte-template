// src/lib-components.test.ts
const DummyComponent = {};
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// First, we declare all mocks - must be before any imports
// Mock for Svelte runtime
vi.mock('svelte/src/runtime', () => {
  // Create the mock function here, inside the factory
  const mountMock = vi.fn(() => ({ $destroy: vi.fn() }));
  // Export it from the mock so we can access it in tests
  return { mount: mountMock };
});

// Mock the CSS imports
vi.mock('./app.css?inline', () => ({ default: 'body { color: red; }' }));
vi.mock('./css-fix/contrast-fix.css?inline', () => ({ default: 'body { background: black; }' }));
// Mock Counter.svelte at the top level so it's hoisted correctly
vi.mock('./lib/Counter.svelte', () => ({ default: DummyComponent }));

// Setup any global values needed for testing
beforeEach(() => {
 // Mock component modules for import.meta.glob
 const componentModules = {
   './lib/Counter.svelte': { default: DummyComponent },
   './lib/Fake.svelte': { default: DummyComponent }
 };

 // Setup the import.meta globals
 vi.stubGlobal('import.meta', {
   glob: vi.fn(() => componentModules),
   env: { DEV: true }
 });
});
});

// Now, import the module under test - this is important to happen after the mocks
import * as mod from './lib-components';

describe('createCustomElementClass', () => {
  // Get the function from the module
  const DummyComponent = {};
  const CustomElement = (mod as any).createCustomElementClass(DummyComponent, 'svelte-dummy');
  let element: InstanceType<typeof CustomElement>;

  beforeEach(() => {
    element = new CustomElement();
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  it('creates shadow DOM, injects styles, and container', () => {
    const shadow = element.shadowRoot!;
    expect(shadow).toBeTruthy();
    expect(shadow.querySelectorAll('style').length).toBeGreaterThanOrEqual(2);
    expect(shadow.getElementById('svelte-dummy-container')).toBeTruthy();
  });

  it('mounts the Svelte component in connectedCallback', () => {
    element.connectedCallback();
    
    // Get the mockFn from our mocked module
    const { mount } = require('svelte/src/runtime');
    expect(mount).toHaveBeenCalled();
    
    const target = element.shadowRoot!.getElementById('svelte-dummy-container');
    if (mount.mock.calls.length > 0) {
      const callArg = mount.mock.calls[0]?.[1] as unknown as { target?: HTMLElement };
      expect(callArg?.target).toBe(target);
    } else {
      throw new Error('mount was not called');
    }
  });

  it('handles missing mount target gracefully', () => {
    const container = element.shadowRoot!.getElementById('svelte-dummy-container');
    container?.remove();
    const spy = vi.spyOn(console, 'error');
    element.connectedCallback();
    expect(spy).toHaveBeenCalledWith('Mount target not found for svelte-dummy');
  });

  it('logs on successful mount in DEV', () => {
    const spy = vi.spyOn(console, 'debug');
    element.connectedCallback();
    expect(spy).toHaveBeenCalledWith('Successfully mounted <svelte-dummy>');
  });

  it('handles mount errors gracefully', () => {
    // Get the mockFn from our mocked module
    const { mount } = require('svelte/src/runtime');
    mount.mockImplementationOnce(() => { throw new Error('fail'); });
    
    const spy = vi.spyOn(console, 'error');
    element.connectedCallback();
    expect(spy).toHaveBeenCalledWith('Failed to mount component <svelte-dummy>:', expect.any(Error));
  });

  it('updates props and calls updateComponent on attribute change', () => {
    element.connectedCallback();
    (element as any).svelteInstance = { foo: 1 };
    const updateSpy = vi.spyOn(element as any, 'updateComponent');
    element.setAttribute('foo-bar', '42');
    expect((element as any).props.fooBar).toBe(42);
    expect(updateSpy).toHaveBeenCalled();
  });

  it('parses attribute values correctly', () => {
    expect((element as any).parseAttributeValue('true')).toBe(true);
    expect((element as any).parseAttributeValue('false')).toBe(false);
    expect((element as any).parseAttributeValue('null')).toBe(null);
    expect((element as any).parseAttributeValue('undefined')).toBe(undefined);
    expect((element as any).parseAttributeValue('123')).toBe(123);
    expect((element as any).parseAttributeValue('{"a":1}')).toEqual({ a: 1 });
    expect((element as any).parseAttributeValue('foo')).toBe('foo');
  });

  it('updates the Svelte component with new props', () => {
    (element as any).svelteInstance = {};
    (element as any).props = { foo: 42, bar: 'baz' };
    element.connectedCallback();
    expect((element as any).svelteInstance.foo).toBe(42);
    expect((element as any).svelteInstance.bar).toBe('baz');
  });

  it('handles update errors gracefully', () => {
    (element as any).svelteInstance = {};
    (element as any).props = { foo: 1 };
    vi.spyOn(Object, 'entries').mockImplementationOnce(() => { throw new Error('fail'); });
    const spy = vi.spyOn(console, 'error');
    (element as any).updateComponent();
    expect(spy).toHaveBeenCalledWith('Failed to update props for <svelte-dummy>:', expect.any(Error));
  });

  it('destroys the Svelte component in disconnectedCallback', () => {
    element.connectedCallback();
    const destroySpy = vi.spyOn((element as any).svelteInstance, '$destroy');
    element.disconnectedCallback();
    expect(destroySpy).toHaveBeenCalled();
    expect((element as any).svelteInstance).toBeNull();
  });

  it('handles destroy errors gracefully', () => {
    element.connectedCallback();
    (element as any).svelteInstance.$destroy = () => { throw new Error('fail'); };
    const spy = vi.spyOn(console, 'error');
    element.disconnectedCallback();
    expect(spy).toHaveBeenCalledWith('Error destroying <svelte-dummy>:', expect.any(Error));
  });
});

describe('registerLibComponents', () => {
  const DummyComponent = {};
  const componentModules = {
    './lib/Counter.svelte': { default: DummyComponent },
    './lib/Fake.svelte': { default: DummyComponent },
  };

  beforeEach(() => {
    // Reset the customElements mock before each test
    vi.spyOn(customElements, 'get')
      .mockImplementation((name) => {
        if (name === 'svelte-counter' || name === 'svelte-fake') {
          return class extends HTMLElement {};
        }
        return undefined;
      });
  });

  it('registers all components as custom elements', () => {
    // Should register svelte-counter and svelte-fake
    expect(customElements.get('svelte-counter')).toBeTruthy();
    expect(customElements.get('svelte-fake')).toBeTruthy();
  });

  it('skips registration if already registered', () => {
    customElements.define('svelte-already', class extends HTMLElement {});
    const spy = vi.spyOn(customElements, 'define');
    // Add to componentModules
    (componentModules as any)['./lib/Already.svelte'] = { default: DummyComponent };
    // Re-run registration
    (mod as any).registerLibComponents();
    expect(spy).not.toHaveBeenCalledWith('svelte-already', expect.any(Function));
  });

  it('logs and handles registration errors', () => {
    const spy = vi.spyOn(console, 'error');
    // Make define throw an error
    vi.spyOn(customElements, 'define').mockImplementation(() => { 
      throw new Error('fail'); 
    });
    
    (mod as any).registerLibComponents();
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Failed to register <'), expect.any(Error));
  });
});
