// Mock for Svelte store
import { vi } from 'vitest';

// Mock writable store factory
export function writable<T>(initialValue: T) {
  // Store the current value
  let value = initialValue;
  
  // Create a list of subscriber callbacks
  const subscribers = new Set<(value: T) => void>();
  
  // Mock subscribe function that calls the callback immediately
  const subscribe = vi.fn((callback: (value: T) => void) => {
    subscribers.add(callback);
    callback(value);
    
    // Return unsubscribe function
    return vi.fn(() => {
      subscribers.delete(callback);
    });
  });

  // Mock set function that updates value and notifies subscribers
  const set = vi.fn((newValue: T) => {
    value = newValue;
    subscribers.forEach(callback => callback(value));
  });

  // Mock update function that transforms value and notifies subscribers
  const update = vi.fn((updater: (currentValue: T) => T) => {
    value = updater(value);
    subscribers.forEach(callback => callback(value));
  });

  return {
    subscribe,
    set,
    update,
    // For testing - direct access to the current value
    _value: () => value
  };
}

// Mock get function for store access
export const get = vi.fn(<T>(store: { subscribe: (callback: (value: T) => void) => () => void }) => {
  let value: T;
  const unsubscribe = store.subscribe(v => { value = v; });
  unsubscribe();
  return value!;
});

// Mock readable store
export function readable<T>(initialValue: T, start?: (set: (value: T) => void) => (() => void) | void) {
  const { subscribe, set } = writable(initialValue);
  
  let stop: (() => void) | void;
  if (start) {
    stop = start(set);
  }
  
  return {
    subscribe,
    _stop: vi.fn(() => {
      if (stop) stop();
    })
  };
}

// Mock derived store
export function derived<T, S>(stores: any, fn: any): { subscribe: any } {
  return {
    subscribe: vi.fn((callback: (value: S) => void) => {
      callback(fn({}));
      return () => {};
    })
  };
}
