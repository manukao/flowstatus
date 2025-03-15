<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let sessionName = '';
  let focusedGoal = '';

  function beginFocus() {
    if (sessionName.trim() && focusedGoal.trim()) {
      dispatch('beginFocus', { sessionName, focusedGoal });
    }
  }
</script>

<div class="flex w-full max-w-md flex-col gap-6 p-8">
  <div class="space-y-2 text-center">
    <h2 class="text-3xl font-medium tracking-tight">Session Setup</h2>
    <p class="text-base-content/70 text-sm">Create your focus session</p>
  </div>

  <div class="space-y-4">
    <div class="space-y-2">
      <label for="sessionName" class="text-sm font-medium"> Session Name </label>
      <input
        id="sessionName"
        type="text"
        bind:value={sessionName}
        placeholder="Deep Design Work"
        class="border-base-300 placeholder:text-base-content/50 focus:ring-primary flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:ring-1 focus:outline-none"
      />
    </div>

    <div class="space-y-2">
      <label for="focusedGoal" class="text-sm font-medium"> What will I work on today? </label>
      <input
        id="focusedGoal"
        type="text"
        bind:value={focusedGoal}
        maxlength="30"
        placeholder="I will focus on..."
        class="border-base-300 placeholder:text-base-content/50 focus:ring-primary flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:ring-1 focus:outline-none"
      />
      <div class="text-base-content/70 text-right text-xs">
        {focusedGoal.length}/30 characters
      </div>
    </div>
  </div>

  <button
    on:click={beginFocus}
    disabled={!sessionName.trim() || !focusedGoal.trim()}
    class="bg-primary text-primary-content hover:bg-primary/90 focus-visible:ring-primary disabled:bg-primary/50 disabled:text-primary-content/50 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none"
  >
    Begin Focus
  </button>
</div>
