/**
 * Custom Tiny Canvas Confetti Burst (Zero External Dependencies)
 * Respects prefers-reduced-motion and cleans up automatically.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  rotation: number;
  rotationSpeed: number;
}

export function triggerConfetti(durationMs = 2500): void {
  if (typeof window === 'undefined') return;

  // Check prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }

  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const colors = ['#D4AF37', '#EC4899', '#C95D73', '#FFE599', '#38BDF8', '#10B981'];
  const particleCount = typeof navigator !== 'undefined' && navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4 ? 40 : 80;

  const particles: Particle[] = Array.from({ length: particleCount }).map(() => ({
    x: width / 2,
    y: height / 2 + 100,
    vx: (Math.random() - 0.5) * 16,
    vy: (Math.random() - 0.8) * 18,
    color: colors[Math.floor(Math.random() * colors.length)] || '#D4AF37',
    size: Math.random() * 8 + 4,
    alpha: 1,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 10,
  }));

  const startTime = Date.now();
  let animationFrameId: number;

  function render() {
    const elapsed = Date.now() - startTime;
    if (elapsed > durationMs) {
      cancelAnimationFrame(animationFrameId);
      canvas.remove();
      return;
    }

    ctx?.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // Gravity
      p.rotation += p.rotationSpeed;
      p.alpha = Math.max(0, 1 - elapsed / durationMs);

      if (ctx) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.4);
        ctx.restore();
      }
    }

    animationFrameId = requestAnimationFrame(render);
  }

  animationFrameId = requestAnimationFrame(render);
}
