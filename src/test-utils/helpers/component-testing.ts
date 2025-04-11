import { vi } from 'vitest';
import { render, RenderResult, screen, fireEvent } from '@testing-library/svelte';
import { _testing } from 'svelte';

// Helper function to create a mock for props
export function mockProps<T>(props: Partial<T> = {}): T {
  return props as T;
}

// Helper to render component with standardized options
export function renderComponent<Props>(
  Component: any, 
  options: { props?: Partial<Props> } = {}
): RenderResult {
  // Reset any mocks before rendering
  vi.clearAllMocks();
  
  // Render the component
  const result = render(Component, { 
    props: options.props || {} 
  });
  
  return result;
}

// Helper to test destroy/cleanup
export function testDestroy(component: RenderResult): void {
  // Destroy the component
  component.unmount();
  
  // Check if the destroy function was called
  expect(_testing.mockDestroy).toHaveBeenCalled();
}

// Helper function to simulate DOM events
export async function triggerEvent(
  element: Element | null, 
  eventName: string, 
  eventData: any = {}
): Promise<void> {
  if (!element) {
    throw new Error(`Element not found for event: ${eventName}`);
  }
  
  await fireEvent(element, new CustomEvent(eventName, { 
    bubbles: true, 
    cancelable: true, 
    detail: eventData 
  }));
}

// Handle missing implementation of @testing-library/svelte
export { screen, fireEvent, render };
