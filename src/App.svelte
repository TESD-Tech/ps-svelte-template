<script lang="ts">
  import { onMount } from 'svelte';
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Counter from './lib/Counter.svelte'
  
  import { 
    appData, 
    appConfig, 
    initializeAppData,
    getCurrentPortal,
    updateAppData
  } from '$lib/dataConfig';

  // Available portals for development switching
  const availablePortals = ['admin', 'teachers', 'guardian', 'unknown'];

  // Lifecycle initialization
  onMount(async () => {
    // Initialize data from configured source
    await initializeAppData();
  });

  // Reactive state for portal and environment
  $: currentPortal = getCurrentPortal();
  $: isDevEnvironment = $appConfig.environment === 'development';

  // Function to manually change portal for development
  function changePortal(portal: string) {
    // In a real implementation, this would modify the URL or configuration
    // For now, we'll manually update the appConfig store
    appConfig.update(config => ({
      ...config,
      portal: portal as any
    }));
  }

  // Function to add a new counter to the data store
  function addCounter() {
    updateAppData(currentData => [
      ...currentData, 
      {
        id: crypto.randomUUID(),
        count: 0,
        label: `Dynamic Counter ${currentData.length + 1}`,
        portalAccess: {
          [currentPortal]: true
        }
      }
    ]);
  }
</script>

<main>
  {#if isDevEnvironment}
    <div class="dev-tools">
      <h2>Development Tools</h2>
      <div class="portal-switcher">
        <label>Current Portal: 
          <select 
            value={currentPortal} 
            onchange={(e) => changePortal(e.target.value)}
          >
            {#each availablePortals as portal}
              <option value={portal}>{portal}</option>
            {/each}
          </select>
        </label>
        <button onclick={addCounter}>Add Dynamic Counter</button>
      </div>
    </div>
  {/if}

  <div>
    <a href="https://vite.dev" target="_blank" rel="noreferrer">
      <img src={viteLogo} class="logo" alt="Vite Logo" />
    </a>
    <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a>
  </div>
  
  <h1>Vite + Svelte + PowerSchool</h1>

  <div class="config-display">
    <h3>Current Configuration</h3>
    <pre>{JSON.stringify($appConfig, null, 2)}</pre>
  </div>

  <div class="card">
    <h2>Counters</h2>
    {#each $appData.filter(item => 
      !item.portalAccess || 
      item.portalAccess[currentPortal] || 
      item.portalAccess === undefined
    ) as counterItem (counterItem.id)}
      <Counter 
        label={counterItem.label} 
        initialCount={counterItem.count}
      />
    {/each}
  </div>

  <div class="data-display">
    <h2>Current Application Data</h2>
    <pre>{JSON.stringify($appData, null, 2)}</pre>
  </div>

  <p>
    Check out <a href="https://github.com/sveltejs/kit#readme" target="_blank" rel="noreferrer">SvelteKit</a>, the official Svelte app framework powered by Vite!
  </p>

  <p class="read-the-docs">
    Click on the Vite and Svelte logos to learn more
  </p>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #4a5568;
  }
  .dev-tools {
    background-color: #f0f0f0;
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 8px;
  }
  .portal-switcher {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  .config-display, .data-display {
    background-color: #f4f4f4;
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 8px;
    overflow-x: auto;
  }
  .card {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 1rem;
  }
  pre {
    white-space: pre-wrap;
    word-break: break-all;
  }
</style>
