/**
 * Mock for @testing-library/svelte
 */
import { vi } from 'vitest';

// Import our client mock
import * as $ from '../svelte/internal/client';

// Re-export client module to prevent "Failed to resolve import" error
export { $ };

// Mock render function
export const render = vi.fn((component, options = {}) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  
  return {
    component,
    container,
    // Return mock query functions
    getByText: vi.fn((text) => container.querySelector(`*:contains(${text})`)),
    getByTestId: vi.fn((id) => container.querySelector(`[data-testid="${id}"]`)),
    queryByText: vi.fn((text) => container.querySelector(`*:contains(${text})`)),
    queryByTestId: vi.fn((id) => container.querySelector(`[data-testid="${id}"]`)),
    findByText: vi.fn((text) => Promise.resolve(container.querySelector(`*:contains(${text})`))),
    findByTestId: vi.fn((id) => Promise.resolve(container.querySelector(`[data-testid="${id}"]`))),
    // Cleanup function
    cleanup: vi.fn(() => {
      container.remove();
    }),
  };
});

// Helper functions
export const fireEvent = {
  click: vi.fn(),
  change: vi.fn(),
  input: vi.fn(),
  keyDown: vi.fn(),
  keyUp: vi.fn(),
  submit: vi.fn(),
};

export const screen = {
  getByText: vi.fn(),
  getByTestId: vi.fn(),
  queryByText: vi.fn(),
  queryByTestId: vi.fn(),
  findByText: vi.fn(() => Promise.resolve()),
  findByTestId: vi.fn(() => Promise.resolve()),
};

export const cleanup = vi.fn();

export const waitFor = vi.fn(() => Promise.resolve());
export const waitForElementToBeRemoved = vi.fn(() => Promise.resolve());
