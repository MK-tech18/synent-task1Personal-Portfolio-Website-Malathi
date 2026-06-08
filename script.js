(() => {
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Particle background (small moving particles)
  const canvas = document.getElementById("bg");
  const ctx = canvas.getContext("2d", { alpha: true });

  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0;
  let h = 0;

  const settings = {
    count: 70,
    speed: 0.35,
    linkDist: 120,
    particleSize: [1.2, 2.6],
  };

  const particles = [];

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function resize() {
    w = Math.floor(window.innerWidth);
    h = Math.floor(window.innerHeight);
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function makeParticle() {
    const angle = rand(0, Math.PI * 2);
    const speed = rand(settings.speed * 0.7, settings.speed * 1.35);
    return {
      x: rand(0, w),
      y: rand(0, h),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: rand(settings.particleSize[0], settings.particleSize[1]),
      hue: rand(185, 265),
    };
  }

  function init() {
    particles.length = 0;
    const baseCount = settings.count;
    const scaleCount = Math.max(0.7, Math.min(1.35, (w * h) / (1100 * 700)));
    const finalCount = Math.round(baseCount * scaleCount);

    for (let i = 0; i < finalCount; i++) particles.push(makeParticle());
  }

  function step() {
    ctx.clearRect(0, 0, w, h);

    // Soft vignette overlay
    const g = ctx.createRadialGradient(w * 0.35, h * 0.15, 0, w * 0.5, h * 0.45, Math.max(w, h));
    g.addColorStop(0, "rgba(103,232,249,0.10)");
    g.addColorStop(0.6, "rgba(167,139,250,0.06)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // Move + draw
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;
    }

    // Links
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < settings.linkDist) {
          const alpha = (1 - dist / settings.linkDist) * 0.26;
          ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Particles
    for (const p of particles) {
      const fill = `hsla(${p.hue}, 90%, 70%, 0.55)`;
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(step);
  }

  resize();
  init();
  step();

  window.addEventListener("resize", () => {
    resize();
    init();
  });
})();

