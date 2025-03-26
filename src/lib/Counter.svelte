<script lang="ts">
  import { appData, appConfig, updateAppData } from '../lib/dataConfig';

  // Define interface for counter data
  interface CounterData {
    id: string;
    count: number;
    label: string;
    portalAccess?: {
      admin?: boolean;
      teachers?: boolean;
      guardian?: boolean;
    };
  }

  // Prop for initial count and label, using Svelte 5 runes
  const props = $props<{
    initialCount?: number, 
    label?: string
  }>();
  
  // Find the counter data in the app store using $derived
  const currentCounter = $derived($appData.find(
    (item: CounterData) => item.label === (props.label ?? 'Default Counter')
  ) as CounterData | undefined);

  // Reactive count state - fixed initialization
  let count = $state(props.initialCount ?? 0);
  
  // Keep count in sync with store changes using proper effect
  $effect(() => {
    if (currentCounter) {
      count = currentCounter.count;
    }
  });

  // Increment function with app data update
  function increment() {
    updateAppData((currentData: CounterData[]) => {
      // If counter exists, update it
      if (currentCounter) {
        return currentData.map(item => 
          item.id === currentCounter.id 
            ? { ...item, count: item.count + 1 } 
            : item
        );
      }
      
      // If counter doesn't exist, create a new one
      const newCounter: CounterData = {
        id: crypto.randomUUID(),
        count: 1,
        label: props.label ?? 'Default Counter',
        portalAccess: {
          [($appConfig as any).portal]: true
        }
      };
      
      return [...currentData, newCounter];
    });

    // Update local state
    count += 1;
  }
</script>

<div class="counter-card">
  <div class="counter-header">
    <h3>{props.label ?? 'Counter'}</h3>
    {#if $appConfig.environment === 'development'}
      <span class="portal-badge">{$appConfig.portal}</span>
    {/if}
  </div>
  
  <div class="counter-value">{count}</div>
  
  <button class="counter-button" onclick={increment}>
    Increment
  </button>
  
  {#if $appConfig.environment === 'development'}
    <details class="counter-details">
      <summary>Details</summary>
      <div class="details-content">
        <div class="detail-row">
          <span class="detail-label">ID:</span>
          <span class="detail-value">{currentCounter?.id ?? 'Not in store'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Portal Access:</span>
          <span class="detail-value">
            {#if currentCounter?.portalAccess}
              {#each Object.entries(currentCounter.portalAccess) as [portal, hasAccess]}
                <span class={`portal-access ${hasAccess ? 'has-access' : 'no-access'}`}>
                  {portal}
                </span>
              {/each}
            {:else}
              All portals
            {/if}
          </span>
        </div>
      </div>
    </details>
  {/if}
</div>

<style>
  .counter-card {
    background: white;
    border-radius: var(--radius);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--gray-200);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .counter-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(99, 102, 241, 0.15);
  }

  .counter-card:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(to right, var(--primary), var(--secondary));
  }

  .counter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;
  }

  .counter-header h3 {
    margin: 0;
    color: var(--gray-900);
    font-size: 1.25rem;
    font-weight: 600;
  }

  .portal-badge {
    background: linear-gradient(to right, var(--secondary-dark), var(--primary-dark));
    color: white;
    font-size: 0.7rem;
    padding: 0.2rem 0.5rem;
    border-radius: 2rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    box-shadow: 0 2px 4px rgba(99, 102, 241, 0.2);
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
  }

  .counter-value {
    font-size: 3.5rem;
    font-weight: 700;
    text-align: center;
    margin: 1.25rem 0;
    color: var(--primary-dark);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    line-height: 1;
  }

  .counter-button {
    background: var(--primary);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    padding: 0.75rem 1.25rem;
    margin: 0.75rem 0 1.25rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    box-shadow: 0 2px 4px rgba(99, 102, 241, 0.2);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  .counter-button:hover {
    background: var(--primary-dark);
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(99, 102, 241, 0.25);
  }

  .counter-button:active {
    transform: translateY(1px);
  }

  .counter-details {
    margin-top: auto;
    font-size: 0.85rem;
    border-top: 1px solid var(--gray-200);
    padding-top: 0.75rem;
  }

  summary {
    cursor: pointer;
    color: var(--secondary);
    font-weight: 500;
    padding: 0.5rem 0;
    transition: color 0.2s ease;
    outline: none;
  }

  summary:hover {
    color: var(--secondary-dark);
  }

  summary:focus {
    outline: none;
  }

  .details-content {
    background-color: var(--gray-50);
    border-radius: var(--radius-sm);
    padding: 0.75rem;
    margin-top: 0.75rem;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .detail-row {
    display: flex;
    margin-bottom: 0.75rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .detail-label {
    font-weight: 600;
    color: var(--gray-700);
    margin-right: 0.5rem;
    min-width: 100px;
  }

  .detail-value {
    color: var(--gray-800);
    word-break: break-all;
  }

  .portal-access {
    display: inline-block;
    padding: 0.15rem 0.5rem;
    border-radius: 0.25rem;
    margin-right: 0.3rem;
    margin-bottom: 0.3rem;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.03em;
  }

  .has-access {
    background-color: var(--success);
    color: white;
    box-shadow: 0 1px 2px rgba(16, 185, 129, 0.2);
  }

  .no-access {
    background-color: var(--gray-300);
    color: var(--gray-800);
  }
</style>