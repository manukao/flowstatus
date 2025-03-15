<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';

  export let message = "I'm letting go of distractions...";
  export let duration = 3000; // milliseconds

  const dispatch = createEventDispatcher();
  let canvas: HTMLCanvasElement;

  interface Star {
    x: number;
    y: number;
    z: number;
    radius: number;
  }

  onMount(() => {
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create stars
    const stars: Star[] = [];
    for (let i = 0; i < 400; i++) {
      stars.push({
        x: Math.random() * canvas.width - canvas.width / 2,
        y: Math.random() * canvas.height - canvas.height / 2,
        z: Math.random() * 1000,
        radius: Math.random() * 1.5,
      });
    }

    // Animation
    let animationId: number;
    let speed = 0;
    const maxSpeed = 15;
    let elapsed = 0;
    const startTime = performance.now();

    const animate = (timestamp: number) => {
      elapsed = timestamp - startTime;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Increase speed gradually
      if (speed < maxSpeed) {
        speed += 0.2;
      }

      // Start slowing down near the end
      if (elapsed > duration * 0.7) {
        speed = Math.max(0, speed - 0.3);
      }

      // Update and draw stars
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);

      stars.forEach(star => {
        // Move stars closer (z decreases)
        star.z -= speed;

        // Reset star if it goes behind the camera
        if (star.z <= 0) {
          star.z = 1000;
          star.x = Math.random() * canvas.width - canvas.width / 2;
          star.y = Math.random() * canvas.height - canvas.height / 2;
        }

        // Calculate position based on perspective
        const x = star.x / (star.z * 0.001);
        const y = star.y / (star.z * 0.001);

        // Size based on distance
        const radius = star.radius * (1000 - star.z) * 0.002;

        // Opacity based on distance
        const opacity = (1000 - star.z) / 1000;

        // Draw star
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      });

      ctx.restore();

      if (elapsed < duration) {
        animationId = requestAnimationFrame(animate);
      } else {
        dispatch('transitionComplete');
      }
    };

    animationId = requestAnimationFrame(animate);

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  });
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center">
  <canvas bind:this={canvas} class="fixed inset-0 z-0 bg-black"></canvas>

  <!-- Message with fade-in animation -->
  <div class="relative z-10 text-center">
    <div class="animate-fade-in-up text-2xl font-light text-white opacity-90">{message}</div>
  </div>
</div>
