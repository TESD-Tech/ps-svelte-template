// vitest-setup.js
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/svelte/svelte5';
import { afterEach } from 'vitest';

// This line above extends Vitest's expect with jest-dom matchers.

// Automatically run cleanup after each test
afterEach(() => {
  cleanup();
});

console.log('Vitest setup file executed successfully.'); // For debugging