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

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
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
