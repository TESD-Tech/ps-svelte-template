// src/lib/Counter.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderComponent, screen, fireEvent } from '../test-utils/helpers/component-testing';
import Counter from './Counter.svelte';

// Mock dataConfig since it has dependencies on window.location and fetch
vi.mock('../lib/dataConfig', () => ({
  appData: {
    subscribe: vi.fn(cb => {
      // Initialize with empty array
      cb([]); 
      return () => {};
    })
  },
  appConfig: {
    subscribe: vi.fn(cb => {
      // Mock the config
      cb({
        portal: 'admin',
        environment: 'development'
      });
      return () => {};
    })
  },
  updateAppData: vi.fn(),
}));

describe('Counter component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with initial count and label', () => {
    // Render component with props
    renderComponent(Counter, {
      props: {
        initialCount: 5,
        label: 'Test Counter'
      }
    });

    // Check that component renders correctly
    const heading = screen.getByText('Test Counter');
    expect(heading).toBeInTheDocument();
    expect(heading.tagName.toLowerCase()).toBe('h3');
    
    // Check the counter value
    const counterValue = screen.getByText('5');
    expect(counterValue).toBeInTheDocument();
    expect(counterValue).toHaveClass('counter-value');
  });

  it('increments the count when button is clicked', async () => {
    // Render component with props
    renderComponent(Counter, {
      props: {
        initialCount: 2,
        label: 'Click Counter'
      }
    });

    // Initial state check
    let counterValue = screen.getByText('2');
    expect(counterValue).toBeInTheDocument();

    // Find and click the button
    const button = screen.getByText('Increment');
    await fireEvent.click(button);

    // Verify count was incremented
    counterValue = screen.getByText('3');
    expect(counterValue).toBeInTheDocument();

    // Verify updateAppData was called
    const { updateAppData } = await import('../lib/dataConfig');
    expect(updateAppData).toHaveBeenCalled();
  });

  it('renders with default values when props are not provided', () => {
    // Render component without props
    renderComponent(Counter);

    // Check defaults
    const heading = screen.getByText('Counter');
    expect(heading).toBeInTheDocument();
    
    const counterValue = screen.getByText('0');
    expect(counterValue).toBeInTheDocument();
  });

  it('shows portal badge in development mode', () => {
    renderComponent(Counter);

    // The portal badge should be visible (from mocked config)
    const badge = screen.getByText('admin');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('portal-badge');
  });
});
