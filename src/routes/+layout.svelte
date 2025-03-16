<script>
  import '../app.css';
</script>

<div class="flex h-screen w-screen items-center justify-center bg-[#f0f0f0] dark:bg-[#121212]">
  <div
    class="bg-base-100 text-base-content flex h-[600px] w-[360px] flex-col overflow-hidden shadow-lg"
  >
    <div class="flex-1 overflow-hidden">
      <slot />
    </div>
  </div>
</div>

<style>
  :global(body) {
    background-color: #f0f0f0;
    color: #121212;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  :global(.dark body) {
    background-color: #121212;
    color: #f0f0f0;
  }
</style>
