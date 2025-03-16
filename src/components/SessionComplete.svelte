<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';

  export let duration = 2500; // milliseconds
  export let sessionName = '';
  export let formattedDuration = '0:00';

  const dispatch = createEventDispatcher();

  onMount(() => {
    const timer = setTimeout(() => {
      dispatch('animationComplete');
    }, duration);

    return () => clearTimeout(timer);
  });
</script>

<div class="relative flex h-full w-full items-center justify-center bg-black/90 backdrop-blur-sm">
  <div class="flex max-w-md flex-col items-center justify-center gap-6 p-8 text-center">
    <!-- Session Complete Message -->
    <h2 class="text-3xl font-medium tracking-tight text-white">Session Complete</h2>

    <!-- Session Name -->
    <div class="text-xl font-medium text-white/90">
      {sessionName}
    </div>

    <!-- Duration -->
    <div class="text-5xl font-bold text-white">
      {formattedDuration}
    </div>

    <!-- Message -->
    <div class="mt-8 text-2xl font-medium tracking-tight text-white">Nice work. You showed up.</div>

    <!-- Floating particles -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      {#each Array(20) as _, i}
        <div
          class="absolute h-2 w-2 rounded-full bg-white/30"
          style="
            left: {Math.random() * 100}%; 
            top: {Math.random() * 100}%;
            animation: float-up {1 + Math.random() * 2}s ease-out infinite;
            animation-delay: {Math.random() * 2}s;
          "
        ></div>
      {/each}
    </div>
  </div>
</div>

<style>
  @keyframes float-up {
    0% {
      transform: translateY(0) scale(1);
      opacity: 0.7;
    }
    100% {
      transform: translateY(-40px) scale(0);
      opacity: 0;
    }
  }
</style>
