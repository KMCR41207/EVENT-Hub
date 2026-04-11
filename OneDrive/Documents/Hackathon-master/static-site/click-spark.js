(function () {
  const cfg = {
    sparkColor: '#fff',
    sparkSize: 10,
    sparkRadius: 15,
    sparkCount: 8,
    duration: 400,
    extraScale: 1.0,
  };

  // Create full-page canvas overlay
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:99999;';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  const sparks = [];

  function easeOut(t) { return t * (2 - t); }

  let rafId;
  function draw(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = sparks.length - 1; i >= 0; i--) {
      const spark = sparks[i];
      const elapsed = timestamp - spark.startTime;
      if (elapsed >= cfg.duration) { sparks.splice(i, 1); continue; }

      const progress = elapsed / cfg.duration;
      const eased = easeOut(progress);
      const distance = eased * cfg.sparkRadius * cfg.extraScale;
      const lineLength = cfg.sparkSize * (1 - eased);

      const x1 = spark.x + distance * Math.cos(spark.angle);
      const y1 = spark.y + distance * Math.sin(spark.angle);
      const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
      const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

      ctx.strokeStyle = cfg.sparkColor;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 1 - progress;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    rafId = requestAnimationFrame(draw);
  }
  rafId = requestAnimationFrame(draw);

  document.addEventListener('click', (e) => {
    const now = performance.now();
    for (let i = 0; i < cfg.sparkCount; i++) {
      sparks.push({
        x: e.clientX,
        y: e.clientY,
        angle: (2 * Math.PI * i) / cfg.sparkCount,
        startTime: now,
      });
    }
  });
})();
