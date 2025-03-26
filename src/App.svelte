<script lang="ts">
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Counter from './lib/Counter.svelte'
  
  import { 
    appData, 
    appConfig, 
    initializeAppData,
    updateAppData
  } from './lib/dataConfig';

  // Available portals for development switching
  const availablePortals = ['admin', 'teachers', 'guardian', 'unknown'];

  // Reactive derived values using runes
  const currentPortal = $derived($appConfig.portal);
  const isDevEnvironment = $derived($appConfig.environment === 'development');

  // Initialize data on component mount
  $effect(() => {
    console.log('Initializing app with portal:', currentPortal);
    initializeAppData();
  });
  
  // Function to manually change portal for development
  async function changePortal(e) {
    const select = e.target;
    const newPortal = select.value;
    
    console.log(`Changing portal from ${currentPortal} to ${newPortal}`);
    
    // Update the app config with the new portal
    appConfig.update(config => ({
      ...config,
      portal: newPortal
    }));
    
    // Re-load data for the new portal
    await initializeAppData();
  }

  // Function to manually reload data
  async function reloadData() {
    console.log('Manually reloading data for portal:', currentPortal);
    await initializeAppData();
  }

  // Function to add a new counter to the data store
  function addCounter() {
    updateAppData(currentData => [
      ...currentData, 
      {
        id: crypto.randomUUID(),
        count: 0,
        label: `Counter ${currentData.length + 1}`,
        portalAccess: {
          [currentPortal]: true
        }
      }
    ]);
  }
</script>

<main class="container">
  <header class="mb-8">
    <div class="logo-container">
      <a href="https://vite.dev" target="_blank" rel="noreferrer">
        <img src={viteLogo} class="logo" alt="Vite Logo" />
      </a>
      <a href="https://svelte.dev" target="_blank" rel="noreferrer">
        <img src={svelteLogo} class="logo" alt="Svelte Logo" />
      </a>
    </div>
    <h1>PowerSchool + Svelte 5</h1>
  </header>

  {#if isDevEnvironment}
    <section class="dev-tools card">
      <div class="flex justify-between items-center mb-4">
        <h2>Development Tools</h2>
        <div class="flex flex-col gap-4">
          <div class="portal-switcher">
            <h4>Switch Portal:</h4>
            <div class="portal-buttons">
              {#each availablePortals as portal}
                <button 
                  class={`portal-button ${portal === currentPortal ? 'active' : 'secondary'}`}
                  onclick={() => {
                    appConfig.update(config => ({
                      ...config,
                      portal
                    }));
                    initializeAppData();
                  }}
                >
                  {portal}
                </button>
              {/each}
            </div>
          </div>
          
          <div class="action-buttons">
            <button onclick={addCounter} class="add-button">
              <span class="icon">+</span> Add Counter
            </button>
            <button class="secondary reload-button" onclick={reloadData}>
              <span class="icon">↻</span> Reload Data
            </button>
          </div>
        </div>
      </div>
      
      <div class="config-display">
        <h3>Configuration</h3>
        <pre>{JSON.stringify($appConfig, null, 2)}</pre>
      </div>
    </section>
  {/if}

  <section class="card component-demo">
    <div class="card-header">
      <h2>Component Demo</h2>
      <div class="card-tag">Portal: {currentPortal}</div>
    </div>
    <p class="mb-4">The counters below demonstrate Svelte 5 components with proper portal access control.</p>
    
    <div class="counters-grid">
      {#each $appData.filter(item => 
        !item.portalAccess || 
        item.portalAccess[currentPortal] 
      ) as counterItem (counterItem.id)}
        <Counter 
          label={counterItem.label} 
          initialCount={counterItem.count}
        />
      {/each}
      
      {#if $appData.filter(item => 
        !item.portalAccess || 
        item.portalAccess[currentPortal]
      ).length === 0}
        <div class="empty-state">
          <div class="empty-icon">📊</div>
          <p>No counters available in the current portal.</p>
          <button class="add-button" onclick={addCounter}>
            <span class="icon">+</span> Add your first counter
          </button>
        </div>
      {/if}
    </div>
  </section>

  {#if isDevEnvironment}
    <section class="card data-store">
      <div class="card-header">
        <h2>Data Store</h2>
        <div class="card-tag">{$appData.length} items</div>
      </div>
      <pre>{JSON.stringify($appData, null, 2)}</pre>
    </section>
  {/if}

  <footer class="footer">
    <div class="footer-links">
      <a href="https://github.com/sveltejs/kit#readme" target="_blank" rel="noreferrer" class="footer-link">
        <span class="footer-icon">📚</span> SvelteKit Docs
      </a>
      <span class="footer-divider">•</span>
      <a href="https://powerschooldevelopers.com" target="_blank" rel="noreferrer" class="footer-link">
        <span class="footer-icon">🔧</span> PowerSchool API
      </a>
    </div>
    <div class="footer-copyright">
      © {new Date().getFullYear()} PowerSchool Svelte Template
    </div>
  </footer>
</main>

<style>
  header {
    text-align: center;
  }
  .portal-switcher {
    margin-bottom: 0.5rem;
  }
  
  .portal-switcher h4 {
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: white;
    margin-bottom: 0.5rem;
    font-weight: 600;
    opacity: 0.9;
  }
  
  .portal-buttons {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }
  
  .portal-button {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
    text-transform: capitalize;
    font-weight: 600;
    letter-spacing: 0.01em;
    border-radius: 2rem;
    min-width: 5.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }
  
  .portal-button.active {
    background: linear-gradient(to right, var(--secondary-dark), var(--primary));
    color: white;
    box-shadow: 0 2px 4px rgba(99, 102, 241, 0.25);
  }
  
  .portal-button:not(.active) {
    background-color: rgba(255, 255, 255, 0.9);
    color: var(--gray-700);
    border: 1px solid var(--gray-300);
  }
  
  .portal-button:not(.active):hover {
    border-color: var(--primary-light);
    color: var(--primary);
    transform: translateY(-1px);
  }
  
  .action-buttons {
    display: flex;
    gap: 0.75rem;
  }
  
  .icon {
    display: inline-block;
    margin-right: 0.3rem;
    font-weight: bold;
  }
  
  .add-button {
    background: linear-gradient(to right, var(--success), var(--teal));
    box-shadow: 0 2px 4px rgba(16, 185, 129, 0.25);
  }
  
  .reload-button {
    color: var(--primary-dark);
    font-weight: 600;
  }
  
  .reload-button:hover {
    background-color: var(--gray-200);
  }
  
  .counters-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
  }
  
  .component-demo {
    position: relative;
    overflow: hidden;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .card-tag {
    background: var(--secondary-dark);
    color: white;
    padding: 0.3rem 0.8rem;
    border-radius: 2rem;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: capitalize;
    box-shadow: 0 2px 4px rgba(139, 92, 246, 0.25);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
  
  .empty-state {
    text-align: center;
    padding: 3rem 2rem;
    background-color: var(--gray-50);
    border-radius: var(--radius);
    grid-column: 1 / -1;
    border: 2px dashed var(--gray-300);
  }
  
  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  
  .empty-state p {
    margin-bottom: 1.5rem;
    color: var(--gray-600);
    font-size: 1.1rem;
  }
  
  .data-store pre {
    max-height: 300px;
    overflow-y: auto;
  }
  
  .footer {
    margin-top: 4rem;
    text-align: center;
    padding: 2rem 1.5rem;
    border-top: 1px solid var(--gray-200);
    color: var(--gray-600);
    background-color: var(--gray-50);
    border-radius: var(--radius);
  }
  
  .footer-links {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }
  
  .footer-link {
    display: flex;
    align-items: center;
    font-weight: 500;
    color: var(--secondary);
    transition: color 0.2s ease;
  }
  
  .footer-link:hover {
    color: var(--primary);
  }
  
  .footer-icon {
    margin-right: 0.5rem;
  }
  
  .footer-divider {
    color: var(--gray-400);
  }
  
  .footer-copyright {
    font-size: 0.85rem;
    color: var(--gray-500);
  }
  
  .config-display {
    margin-top: 1rem;
  }
  
  @media (max-width: 768px) {
    .flex {
      flex-direction: column;
    }
    
    .justify-between {
      justify-content: flex-start;
    }
    
    .items-center {
      align-items: flex-start;
    }
    
    .dev-tools .flex {
      gap: 1rem;
    }
  }
</style>