<script lang="ts">
  // Accept initialCount as a prop with default value of 0 using Svelte 5 runes syntax
  const props = $props<{initialCount?: number}>();
  
  // Initialize count with the initialCount prop or default to 0
  let count = $state(props.initialCount ?? 0);
  
  const increment = () => {
    count += 1;
  }
</script>

<button class="btn btn-sm variant-filled-primary" onclick={increment}>
  count is {count}
</button>
