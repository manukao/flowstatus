<script lang="ts">
  import { onMount } from 'svelte';
  import { flowStore } from '../lib/stores';

  import WelcomeScreen from '../components/WelcomeScreen.svelte';
  import SessionSetup from '../components/SessionSetup.svelte';
  import TransitionAnimation from '../components/TransitionAnimation.svelte';
  import ActiveSession from '../components/ActiveSession.svelte';
  import SessionComplete from '../components/SessionComplete.svelte';
  import SessionReview from '../components/SessionReview.svelte';
  import Scoreboard from '../components/Scoreboard.svelte';
  import ThemeToggle from '../components/ThemeToggle.svelte';

  // App states
  type AppState =
    | 'welcome'
    | 'setup'
    | 'transition-in'
    | 'active'
    | 'complete'
    | 'review'
    | 'scoreboard';
  let currentState: AppState = 'welcome';

  // Session data
  let sessionName = '';
  let focusedGoal = '';
  let sessionDuration = 0;
  let formattedDuration = '';

  // Store data
  let sessions: any[] = [];
  let streak = 0;
  let totalScore = 0;

  // Subscribe to store
  const unsubscribe = flowStore.subscribe((state: any) => {
    sessions = state.sessions;
    streak = state.streak;
    totalScore = state.totalScore;
  });

  onMount(() => {
    // Check if we should go directly to scoreboard (if there are previous sessions)
    if (sessions.length > 0) {
      currentState = 'scoreboard';
    }

    return unsubscribe;
  });

  // Event handlers
  function handleStartSession() {
    currentState = 'setup';
  }

  function handleBeginFocus(event: CustomEvent<{ sessionName: string; focusedGoal: string }>) {
    sessionName = event.detail.sessionName;
    focusedGoal = event.detail.focusedGoal;
    currentState = 'transition-in';
  }

  function handleTransitionComplete() {
    currentState = 'active';
  }

  function handleEndSession(event: CustomEvent<{ duration: number; formattedDuration: string }>) {
    sessionDuration = event.detail.duration;
    formattedDuration = event.detail.formattedDuration;
    currentState = 'complete';
  }

  function handleCompletionAnimationDone() {
    currentState = 'review';
  }

  function handleReviewComplete(event: CustomEvent<{ focusRating: number }>) {
    // Add session to store
    flowStore.addSession({
      sessionName,
      focusedGoal,
      duration: sessionDuration,
      formattedDuration,
      focusRating: event.detail.focusRating,
    });

    currentState = 'scoreboard';
  }

  function handleStartNewSession() {
    // Reset session data
    sessionName = '';
    focusedGoal = '';
    sessionDuration = 0;
    formattedDuration = '';

    currentState = 'setup';
  }
</script>

<main class="relative flex h-full w-full flex-col items-center justify-center">
  <ThemeToggle />

  <div class="flex h-full w-full items-center justify-center">
    {#if currentState === 'welcome'}
      <WelcomeScreen on:startSession={handleStartSession} />
    {:else if currentState === 'setup'}
      <SessionSetup on:beginFocus={handleBeginFocus} />
    {:else if currentState === 'transition-in'}
      <TransitionAnimation on:transitionComplete={handleTransitionComplete} />
    {:else if currentState === 'active'}
      <ActiveSession {sessionName} {focusedGoal} on:endSession={handleEndSession} />
    {:else if currentState === 'complete'}
      <SessionComplete
        {sessionName}
        {formattedDuration}
        on:animationComplete={handleCompletionAnimationDone}
      />
    {:else if currentState === 'review'}
      <SessionReview
        {sessionName}
        {focusedGoal}
        duration={sessionDuration}
        {formattedDuration}
        on:reviewComplete={handleReviewComplete}
      />
    {:else if currentState === 'scoreboard'}
      <Scoreboard {sessions} {streak} {totalScore} on:startNewSession={handleStartNewSession} />
    {/if}
  </div>
</main>

<style>
  :global(body) {
    overflow-x: hidden;
  }
</style>
