<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { cubicOut, cubicInOut } from 'svelte/easing';

  export let sessionName = '';
  export let focusedGoal = '';

  const dispatch = createEventDispatcher();

  let seconds = 0;
  let minutes = 0;
  let hours = 0;
  let timerInterval: ReturnType<typeof setInterval>;
  let isPaused = false;
  let isDarkMode = false;
  let lastTime = 0;

  let canvas: HTMLCanvasElement;

  interface Particle {
    x: number;
    y: number;
    size: number;
    speed: number;
    angle: number;
  }

  let particles: Particle[] = [];
  let animationId: number;

  function formatTime(h: number, m: number, s: number): string {
    const hh = h > 0 ? `${h}:` : '';
    const mm = m < 10 && h > 0 ? `0${m}:` : `${m}:`;
    const ss = s < 10 ? `0${s}` : `${s}`;
    return `${hh}${mm}${ss}`;
  }

  function updateTimer() {
    seconds++;
    if (seconds >= 60) {
      seconds = 0;
      minutes++;
      if (minutes >= 60) {
        minutes = 0;
        hours++;
      }
    }
  }

  function togglePause() {
    isPaused = !isPaused;

    if (isPaused) {
      clearInterval(timerInterval);
    } else {
      startTimer();
    }
  }

  function startTimer() {
    timerInterval = setInterval(updateTimer, 1000);
  }

  function endSession() {
    clearInterval(timerInterval);
    dispatch('endSession', {
      duration: hours * 3600 + minutes * 60 + seconds,
      formattedDuration: formatTime(hours, minutes, seconds),
    });
  }

  function checkTheme() {
    isDarkMode = document.documentElement.classList.contains('dark');
  }

  onMount(() => {
    startTimer();
    checkTheme();

    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = 128;
    canvas.height = 128;

    // Create particles
    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 20 + Math.random() * 30;

      particles.push({
        x: canvas.width / 2 + Math.cos(angle) * distance,
        y: canvas.height / 2 + Math.sin(angle) * distance,
        size: 1 + Math.random() * 2,
        speed: 0.2 + Math.random() * 0.3,
        angle,
      });
    }

    // Animation
    const animate = (timestamp: number) => {
      // Clear canvas with semi-transparent background for trail effect
      ctx.fillStyle = isDarkMode ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw center circle
      const time = timestamp * 0.001;
      const pulseSize = 20 + Math.sin(time * 2) * 5;

      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        pulseSize * 1.5
      );

      if (isDarkMode) {
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      } else {
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
        gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      }

      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, pulseSize, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Update and draw particles
      if (!isPaused) {
        particles.forEach(particle => {
          // Move particles in circular motion
          particle.angle += particle.speed * 0.02;

          // Calculate position
          const distance = 20 + Math.sin(time + particle.angle) * 30;
          particle.x = canvas.width / 2 + Math.cos(particle.angle) * distance;
          particle.y = canvas.height / 2 + Math.sin(particle.angle) * distance;

          // Draw particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
          ctx.fill();
        });
      } else {
        // Just draw static particles when paused
        particles.forEach(particle => {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)';
          ctx.fill();
        });
      }

      animationId = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      clearInterval(timerInterval);
      cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  });
</script>

<div class="flex w-full max-w-md flex-col items-center gap-6 p-8 text-center">
  <div class="w-full space-y-1">
    <h2 class="text-2xl font-medium tracking-tight">{sessionName}</h2>
    <p class="text-base-content/70 text-sm">{focusedGoal}</p>
  </div>

  <!-- Animation -->
  <div class="my-8 flex items-center justify-center">
    <div
      class="bg-gradient-radial from-primary/20 to-primary/5 flex h-32 w-32 items-center justify-center rounded-full backdrop-blur-md"
    >
      <canvas bind:this={canvas} class="h-full w-full rounded-full"></canvas>
    </div>
  </div>

  <div class="my-4 text-lg">
    I've been focused for <span class="font-medium">{formatTime(hours, minutes, seconds)}</span>
  </div>

  <div class="mt-4 flex w-full gap-4">
    <button
      on:click={togglePause}
      class="border-base-300 hover:bg-base-200 focus-visible:ring-primary inline-flex h-10 flex-1 items-center justify-center rounded-md border bg-transparent px-4 py-2 text-sm font-medium shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
    >
      {isPaused ? 'Resume' : 'Pause'}
    </button>

    <button
      on:click={endSession}
      class="border-base-300 hover:bg-base-200 focus-visible:ring-primary inline-flex h-10 flex-1 items-center justify-center rounded-md border bg-transparent px-4 py-2 text-sm font-medium shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
    >
      End Session
    </button>
  </div>
</div>
