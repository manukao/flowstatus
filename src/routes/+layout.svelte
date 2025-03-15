<script>
  import '../app.css';
  import ThemeToggle from '../components/ThemeToggle.svelte';
</script>

<div
  class="bg-base-100 text-base-content flex min-h-screen items-center justify-center antialiased"
>
  <div class="border-base-300 h-[600px] w-[360px] overflow-hidden rounded-xl border shadow-lg">
    <slot />
  </div>
</div>

<style>
  :global(body) {
    background-color: hsl(var(--base-100));
    color: hsl(var(--base-content));
  }

  :global(.dark body) {
    background-color: hsl(var(--base-100));
    color: hsl(var(--base-content));
  }
</style>
