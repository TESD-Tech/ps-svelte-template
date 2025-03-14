<script lang="ts">
  // Accept initialCount as a prop with default value of 0 using Svelte 5 runes syntax
  const props = $props<{initialCount?: number}>();
  
  // Initialize count with the initialCount prop or default to 0
  let count = $state(props.initialCount ?? 0);
  
  const increment = () => {
    count += 1;
  }
</script>

<button onclick={increment}>
  count is {count}!
</button>

<style>
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
  }
  button:hover {
    border-color: transparent;
    background-color: #805ad5;
    color: white;
  }
  button:active {
    background-color: #6b46c1;
  }
</style>
