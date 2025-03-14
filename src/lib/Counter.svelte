<script lang="ts">
  // Accept initialCount as a prop with default value of 0 using Svelte 5 runes syntax
  const props = $props<{initialCount?: number}>();
  
  // Initialize count with the initialCount prop or default to 0
  let count = $state(props.initialCount ?? 0);
  
  const increment = () => {
    count += 1;
  }
</script>

<button style="padding: 0.5rem 1rem; font-size: 0.875rem; border-radius: 0.25rem; background-color: #bee3f8; color: #2c5282; cursor: pointer;" onclick={increment}>
  count is {count}
</button>

<style>
  button:hover {
    background-color: #90cdf4;
  }
</style>
