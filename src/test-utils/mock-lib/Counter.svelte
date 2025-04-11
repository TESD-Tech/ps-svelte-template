// Mock component for testing
import { $state, $props, $derived, $effect } from 'svelte';
import { $ } from 'svelte';

// Set filename for component identification
Counter[$.FILENAME] = 'src/lib/Counter.svelte';

export default function Counter(options) {
  const props = options?.props || {};
  
  // Component state
  const count = $state(props.initialCount || 0);
  const id = $state(props.id || 'counter-' + Math.random().toString(36).substr(2, 9));
  const label = $state(props.label || 'Counter');
  
  // Methods
  function increment() {
    count++;
  }
  
  function decrement() {
    if (count > 0) count--;
  }
  
  function reset() {
    count = 0;
  }
  
  // Return component instance
  return {
    count,
    id,
    label,
    increment,
    decrement,
    reset
  };
}
