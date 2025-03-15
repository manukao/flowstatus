<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function startSession() {
    dispatch('startSession');
  }
</script>

<div class="flex flex-col items-center justify-center gap-8 p-8 text-center">
  <h1 class="text-4xl font-medium tracking-tight">Ready to flow?</h1>
  <p class="text-base-content/70 max-w-md text-center">
    Enter a focused state through structured sessions and calm visuals.
  </p>

  <button
    on:click={startSession}
    class="bg-primary text-primary-content hover:bg-primary/90 focus-visible:ring-primary inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-medium shadow transition-colors focus-visible:ring-1 focus-visible:outline-none"
  >
    Start Session
  </button>
</div>
