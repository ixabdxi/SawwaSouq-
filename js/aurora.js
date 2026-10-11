/* ============================================================
   SaWWA Souq — Aurora Living Background
   Canvas animation · 4 blobs · waves · particles
   ============================================================ */
(() => {
  const canvas = document.getElementById("aurora");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  let w = 0, h = 0, dpr = 1;
  let t = 0;

  const COLORS = [
    { r: 18,  g: 168, b: 155 },  // teal-bright
    { r: 95,  g: 208, b: 197 },  // cyan
    { r: 15,  g: 92,  b: 86  },  // deep-teal
    { r: 232, g: 163, b: 61  },  // amber
    { r: 143, g: 169, b: 165 }   // sage
  ];

  const blobs = [
    { x: 0.18, y: 0.28, r: 0.55, sp: 0.00035, ph: 0,   c: 0, a: 0.55 },
    { x: 0.82, y: 0.22, r: 0.60, sp: 0.00045, ph: 1.5, c: 1, a: 0.50 },
    { x: 0.30, y: 0.82, r: 0.65, sp: 0.00030, ph: 3.0, c: 2, a: 0.60 },
    { x: 0.78, y: 0.72, r: 0.50, sp: 0.00055, ph: 4.5, c: 3, a: 0.30 },
    { x: 0.50, y: 0.50, r: 0.70, sp: 0.00025, ph: 6.0, c: 4, a: 0.35 }
  ];

  const particles = [];
  const PARTICLE_COUNT = 60;

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  };

  const initParticles = () => {
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.8 + 0.5,
        o: Math.random() * 0.5 + 0.15
      });
    }
  };

  const isDark = () => document.documentElement.classList.contains("dark");

  const drawBlobs = () => {
    const dark = isDark();
    const baseAlpha = dark ? 0.65 : 0.40;

    ctx.globalCompositeOperation = "lighter";
    for (const b of blobs) {
      const cx = (b.x + Math.sin(t * b.sp + b.ph) * 0.14) * w;
      const cy = (b.y + Math.cos(t * b.sp * 1.4 + b.ph) * 0.14) * h;
      const radius = b.r * Math.min(w, h) * (1 + Math.sin(t * b.sp * 2 + b.ph) * 0.18);
      const c = COLORS[b.c];
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      const alpha = baseAlpha * b.a;
      grad.addColorStop(0,   `rgba(${c.r},${c.g},${c.b},${alpha})`);
      grad.addColorStop(0.5, `rgba(${c.r},${c.g},${c.b},${alpha * 0.35})`);
      grad.addColorStop(1,   `rgba(${c.r},${c.g},${c.b},0)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }
    ctx.globalCompositeOperation = "source-over";
  };

  const drawWaves = () => {
    const dark = isDark();
    ctx.globalCompositeOperation = dark ? "screen" : "multiply";
    const baseAlpha = dark ? 0.10 : 0.045;

    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      const y0 = (0.30 + i * 0.20) * h;
      ctx.moveTo(0, y0);
      for (let x = 0; x <= w; x += 6) {
        const y = y0 + Math.sin((x * 0.0035) + t * 0.0013 + i * 1.3) * 55
                     + Math.sin((x * 0.0018) - t * 0.0008 + i * 2.1) * 25;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      const g = ctx.createLinearGradient(0, y0, 0, h);
      g.addColorStop(0, `rgba(95,208,197,${baseAlpha})`);
      g.addColorStop(1, "rgba(95,208,197,0)");
      ctx.fillStyle = g;
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
  };

  const drawParticles = () => {
    const dark = isDark();
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = dark
        ? `rgba(143, 209, 197, ${p.o * 0.9})`
        : `rgba(15, 92, 86, ${p.o * 0.6})`;
      ctx.fill();
    }
  };

  const loop = () => {
    ctx.clearRect(0, 0, w, h);
    drawBlobs();
    drawWaves();
    drawParticles();
    t += 16;
    requestAnimationFrame(loop);
  };

  resize();
  initParticles();
  window.addEventListener("resize", () => { resize(); initParticles(); });
  new MutationObserver(() => {}).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  loop();
})();