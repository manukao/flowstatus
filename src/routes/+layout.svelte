<script>
  import '../app.css';
</script>

<div class="flex min-h-screen items-center justify-center bg-[#f0f0f0] dark:bg-[#121212]">
  <div
    class="bg-base-100 text-base-content h-[600px] w-[360px] overflow-hidden rounded-xl border border-[#e0e0e0] shadow-lg dark:border-[#2a2a2a]"
  >
    <slot />
  </div>
</div>

<style>
  :global(body) {
    background-color: #f0f0f0;
    color: #121212;
  }

  :global(.dark body) {
    background-color: #121212;
    color: #f0f0f0;
  }
</style>
