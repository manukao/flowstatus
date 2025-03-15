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

<div class="flex w-full max-w-md flex-col items-center gap-8 p-8 text-center">
  <h2 class="text-3xl font-medium tracking-tight">Session Complete</h2>

  <div class="text-xl font-medium">{sessionName}</div>

  <div class="text-5xl font-bold">{formattedDuration}</div>

  <div class="mt-4 w-full">
    <div class="mb-4 text-xl font-medium">How focused was I?</div>

    <div class="flex justify-center gap-3">
      {#each Array(5) as _, i}
        <button
          on:click={() => (focusRating = i + 1)}
          class="inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors {i <
          focusRating
            ? 'bg-primary text-primary-content'
            : 'border-base-300 text-base-content/50 border'}"
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
    class="bg-primary text-primary-content hover:bg-primary/90 focus-visible:ring-primary mt-8 inline-flex h-14 w-full items-center justify-center rounded-full px-4 py-2 text-lg font-medium shadow transition-colors focus-visible:ring-1 focus-visible:outline-none"
  >
    Finish
  </button>
</div>
