// Mock for svelte/internal/disclose-version module
import { vi } from 'vitest';

// Just export a mock function
const disclose_version = vi.fn();

export { disclose_version };
export default disclose_version;
