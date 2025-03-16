<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let sessionName = '';
  export let focusedGoal = '';
  export let duration = 0;
  export let formattedDuration = '0:00';

  const dispatch = createEventDispatcher();

  let focusRating = 1;

  function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }

  function completeReview() {
    dispatch('reviewComplete', {
      sessionName,
      focusedGoal,
      duration,
      focusRating,
    });
  }
</script>

<div class="flex w-full max-w-md flex-col items-center gap-6 p-8 text-center">
  <h2 class="text-sm font-medium tracking-tight">Nice work. You showed up.</h2>

  <div class="text-base font-medium">{sessionName}</div>

  <div class="text-base-content/70 text-xs">{focusedGoal}</div>

  <div class="text-3xl font-bold">{formattedDuration}</div>

  <div class="mt-2 w-full">
    <div class="mb-3 text-sm font-medium">How focused was I?</div>

    <div class="flex justify-center gap-3">
      {#each Array(5) as _, i}
        <button
          on:click={() => (focusRating = i + 1)}
          class="inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors
          {i < focusRating
            ? 'bg-primary text-primary-content hover:bg-primary/90 dark:bg-primary dark:text-primary-content dark:hover:bg-primary/80'
            : 'border-base-300 text-base-content/50 hover:border-primary hover:bg-primary/10 hover:text-primary dark:border-base-700 dark:text-base-content/50 dark:hover:border-primary dark:hover:bg-primary/20 dark:hover:text-primary border'}"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path
              d="M12,17.27L18.18,21l-1.64-7.03L22,9.24l-7.19-0.61L12,2L9.19,8.63L2,9.24l5.46,4.73L5.82,21L12,17.27z"
            />
          </svg>
        </button>
      {/each}
    </div>
  </div>

  <button
    on:click={completeReview}
    class="bg-primary text-primary-content hover:bg-primary/90 focus-visible:ring-primary mt-6 inline-flex h-9 w-full items-center justify-center rounded-md px-4 py-2 text-xs font-medium shadow transition-colors focus-visible:ring-1 focus-visible:outline-none"
  >
    Finish
  </button>
</div>
