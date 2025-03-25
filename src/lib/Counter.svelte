<script lang="ts">
  import { appData, appConfig, updateAppData } from '$lib/dataConfig';

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
  
  // Find the counter data in the app store
  $: currentCounter = $appData.find(
    (item: CounterData) => item.label === (props.label ?? 'Default Counter')
  ) as CounterData | undefined;

  // Reactive count state
  $: count = $state(currentCounter?.count ?? (props.initialCount ?? 0));

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

<div class="counter-container">
  <button onclick={increment}>
    {props.label ?? 'Counter'}: {count}
    {#if $appConfig.environment === 'development'}
      <span class="dev-badge">Dev</span>
    {/if}
  </button>
  
  {#if $appConfig.environment === 'development'}
    <div class="counter-details">
      <details>
        <summary>Counter Details</summary>
        <pre>
Store ID: {currentCounter?.id ?? 'Not in store'}
Portal Access: {JSON.stringify(currentCounter?.portalAccess, null, 2)}
Current Portal: {$appConfig.portal}
        </pre>
      </details>
    </div>
  {/if}
</div>

<style>
  .counter-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  button {
    border-radius: 8px;
    border: 1px solid #d6bcfa;
    color: #805ad5;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: transparent;
    cursor: pointer;
    transition: all 0.25s;
    position: relative;
  }

  button:hover {
    border-color: transparent;
    background-color: #805ad5;
    color: white;
  }

  button:active {
    background-color: #6b46c1;
  }

  .dev-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: #ffd700;
    color: black;
    font-size: 0.6em;
    padding: 2px 4px;
    border-radius: 4px;
  }

  .counter-details {
    font-size: 0.8rem;
    background-color: #f4f4f4;
    padding: 0.5rem;
    border-radius: 4px;
    max-width: 100%;
    overflow-x: auto;
  }

  pre {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-all;
  }

  details {
    cursor: pointer;
  }
</style>
