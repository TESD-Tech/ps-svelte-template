// Import the full application custom element
import './custom-element';

// Import the automatic component registration system
// This will automatically register all components in the src/lib directory as custom elements
import './lib-components';

// Both the full application and individual components are now available as custom elements
// <ps-svelte-app> - The full application
// <svelte-counter> - The Counter component (automatically registered)
// Any new component added to src/lib will be automatically available as <svelte-componentname>
