import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  
  // We're handling custom elements manually in our custom-element.ts file
  // rather than using Svelte's built-in customElement compiler option
  compilerOptions: {
    css: 'injected', // This ensures CSS is injected into the shadow DOM
  }
}
