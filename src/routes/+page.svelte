<script lang="ts">
  import * as Accordion from '$lib/components/ui/accordion';
</script>

<main class="flex min-h-screen flex-col items-center justify-center p-8 text-center">
  <h1 class="mb-4 text-4xl font-bold">FlowStatus</h1>

  <p class="mb-8 max-w-2xl text-xl">
    A minimalistic app that helps you stay in the flow and track your productivity throughout the
    day.
  </p>

  <div class="w-full max-w-2xl">
    <Accordion.Root>
      <Accordion.Item value="what-is-flow">
        <Accordion.Trigger>What is Flow State?</Accordion.Trigger>
        <Accordion.Content>
          Flow state, also known as being "in the zone," is a mental state where you are fully
          immersed and focused on your task. It's when productivity and creativity are at their
          peak.
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value="how-it-works">
        <Accordion.Trigger>How does FlowStatus help?</Accordion.Trigger>
        <Accordion.Content>
          FlowStatus helps you track and maintain your flow state by providing a minimalistic
          interface to monitor your productivity patterns and focus periods throughout the day.
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value="features">
        <Accordion.Trigger>Key Features</Accordion.Trigger>
        <Accordion.Content>
          • Simple, distraction-free interface • Track your productive hours • Identify your peak
          performance times • Stay focused on what matters
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  </div>
</main>
