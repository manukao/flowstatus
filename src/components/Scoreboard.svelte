<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';

  interface Session {
    sessionName: string;
    focusedGoal: string;
    duration: number;
    formattedDuration: string;
    focusRating: number;
    score: number;
    timestamp: number;
    isStreakDay: boolean;
  }

  export let sessions: Session[] = [];
  export let streak = 0;
  export let totalScore = 0;
  let isDarkMode = false;

  const dispatch = createEventDispatcher();

  function startNewSession() {
    dispatch('startNewSession');
  }

  function formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  function checkTheme() {
    isDarkMode = document.documentElement.classList.contains('dark');
  }

  onMount(() => {
    checkTheme();

    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      observer.disconnect();
    };
  });
</script>

<div class="flex max-h-[500px] w-full max-w-md flex-col gap-4 overflow-y-auto p-8">
  <div class="flex items-center justify-between">
    <h2 class="text-xl font-medium tracking-tight">My Flow Sessions</h2>

    <button
      on:click={startNewSession}
      class="bg-primary text-primary-content hover:bg-primary/90 focus-visible:ring-primary inline-flex h-9 items-center justify-center rounded-md px-4 text-xs font-medium shadow focus-visible:ring-1 focus-visible:outline-none"
    >
      New Session
    </button>
  </div>

  <!-- Streak and Score -->
  <div class="flex justify-between">
    <div class="border-base-300 flex items-center gap-2 rounded-lg border px-3 py-2 shadow-sm">
      <div class="text-sm">
        <svg
          class="h-4 w-4 {isDarkMode ? 'text-white' : 'text-primary'}"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="none"
        >
          <path
            d="M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 17.03 19.32C18.86 17.66 19.5 15 18.56 12.72L18.43 12.46C18.22 12 17.66 11.2 17.66 11.2M14.5 17.5C14.22 17.74 13.76 18 13.4 18.1C12.28 18.5 11.16 17.94 10.5 17.28C11.69 17 12.4 16.12 12.61 15.23C12.78 14.43 12.46 13.77 12.33 13C12.21 12.26 12.23 11.63 12.5 10.94C12.69 11.32 12.89 11.7 13.13 12C13.9 13 15.11 13.44 15.37 14.8C15.41 14.94 15.43 15.08 15.43 15.23C15.46 16.05 15.1 16.95 14.5 17.5H14.5Z"
          />
        </svg>
      </div>
      <div class="text-xs font-medium">Streak: <span class="font-bold">{streak}</span></div>
    </div>

    <div class="border-base-300 flex items-center gap-2 rounded-lg border px-3 py-2 shadow-sm">
      <div class="text-sm">
        <svg class="text-primary h-4 w-4" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path
            d="M12,17.27L18.18,21l-1.64-7.03L22,9.24l-7.19-0.61L12,2L9.19,8.63L2,9.24l5.46,4.73L5.82,21L12,17.27z"
          />
        </svg>
      </div>
      <div class="text-xs font-medium">Score: <span class="font-bold">{totalScore}</span></div>
    </div>
  </div>

  <!-- Sessions List -->
  <div class="mt-2 flex flex-col gap-3">
    {#if sessions.length === 0}
      <div class="text-base-content/50 py-8 text-center">
        No sessions yet. Start your first flow session!
      </div>
    {:else}
      {#each sessions as session}
        <div class="border-base-300 rounded-lg border p-4 shadow-sm">
          <div class="flex items-center justify-between">
            <div class="font-medium">{session.sessionName}</div>
            <div class="text-base-content/70 text-xs">{formatDate(session.timestamp)}</div>
          </div>

          <div class="text-base-content/70 mt-1 text-sm">{session.focusedGoal}</div>

          <div class="mt-3 flex items-center justify-between">
            <div class="text-sm">
              <span class="text-base-content/70">Duration: </span>
              <span>{session.formattedDuration}</span>
            </div>

            <div class="flex items-center gap-1">
              <div class="flex">
                {#each Array(5) as _, i}
                  <svg
                    class="h-4 w-4 {i < session.focusRating
                      ? isDarkMode
                        ? 'text-white'
                        : 'text-primary'
                      : 'text-base-content/30'}"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="none"
                  >
                    <path
                      d="M12,17.27L18.18,21l-1.64-7.03L22,9.24l-7.19-0.61L12,2L9.19,8.63L2,9.24l5.46,4.73L5.82,21L12,17.27z"
                    />
                  </svg>
                {/each}
              </div>

              <div
                class="bg-primary text-primary-content rounded-full px-2 py-1 text-xs font-medium"
              >
                {session.score} pts
              </div>
            </div>
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>
