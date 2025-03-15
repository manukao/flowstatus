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
      class="bg-primary text-primary-content hover:bg-primary/90 focus-visible:ring-primary inline-flex h-9 items-center justify-center rounded-md px-4 text-xs font-medium shadow transition-colors focus-visible:ring-1 focus-visible:outline-none"
    >
      New Session
    </button>
  </div>

  <!-- Streak and Score -->
  <div class="flex justify-between">
    <div
      class="border-base-300 bg-base-200/50 flex items-center gap-2 rounded-lg border px-3 py-2 shadow-sm"
    >
      <div class="text-sm">🔥</div>
      <div class="text-xs font-medium">Streak: <span class="font-bold">{streak}</span></div>
    </div>

    <div
      class="border-base-300 bg-base-200/50 flex items-center gap-2 rounded-lg border px-3 py-2 shadow-sm"
    >
      <div class="text-sm">⭐</div>
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
        <div class="border-base-300 bg-base-200/50 rounded-lg border p-4 shadow-sm">
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

              <div class="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs font-medium">
                {session.score} pts
              </div>
            </div>
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>
