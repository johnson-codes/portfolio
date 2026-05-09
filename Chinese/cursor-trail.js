/**
 * Subtle cursor trace — soft dots along a smoothed pointer path.
 */
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var canvas = document.getElementById("cursor-trail");
  if (!canvas) return;

  var ctx = canvas.getContext("2d");
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var w = 0;
  var h = 0;
  var particles = [];
  var maxParticles = 48;

  var targetX = 0;
  var targetY = 0;
  var smoothX = 0;
  var smoothY = 0;
  var hasPointer = false;
  var lastSpawn = 0;
  var spawnEveryMs = 32;

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawn(x, y) {
    particles.push({
      x: x + (Math.random() - 0.5) * 4,
      y: y + (Math.random() - 0.5) * 4,
      r: Math.random() * 0.9 + 0.55,
      a: 0.06 + Math.random() * 0.07,
      decay: 0.011 + Math.random() * 0.008,
    });
    if (particles.length > maxParticles) {
      particles.splice(0, particles.length - maxParticles);
    }
  }

  function onMove(e) {
    if (!hasPointer) {
      smoothX = e.clientX;
      smoothY = e.clientY;
    }
    targetX = e.clientX;
    targetY = e.clientY;
    hasPointer = true;
  }

  function onLeave() {
    hasPointer = false;
  }

  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", onMove, { passive: true });
  document.addEventListener("mouseleave", onLeave);

  resize();

  function tick(now) {
    ctx.clearRect(0, 0, w, h);

    if (hasPointer) {
      smoothX += (targetX - smoothX) * 0.14;
      smoothY += (targetY - smoothY) * 0.14;
      if (!lastSpawn || now - lastSpawn >= spawnEveryMs) {
        var dx = targetX - smoothX;
        var dy = targetY - smoothY;
        if (dx * dx + dy * dy > 2) {
          spawn(smoothX, smoothY);
          lastSpawn = now;
        }
      }
    }

    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.a -= p.decay;
      if (p.a <= 0) {
        particles.splice(i, 1);
        continue;
      }
      ctx.fillStyle = "rgba(196, 186, 245, " + p.a + ")";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();
