/* Atmosphere: falling petals, tap bursts, celebration. Purely decorative (aria-hidden canvas),
   off for visitors who prefer reduced motion, paused when the tab is hidden. */
(function () {
  'use strict';
  var C = window.WEDDING_CONFIG, E = C.effects || {};
  var canvas = document.getElementById('petals');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.WeddingMagic = { burst: function () {}, celebrate: function () {} };
  if (!canvas || reduce || (!E.petals && !E.tapBurst)) { if (canvas) canvas.hidden = true; return; }

  var ctx = canvas.getContext('2d'), W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  var COLORS = ['#f6a58a', '#f9c9b6', '#f5b02a', '#ef6a73', '#fbd3c4'];
  var petals = [], bursts = [], running = false, enabled = E.petals !== false, last = 0;
  var COUNT = window.innerWidth < 600 ? 14 : 26;

  function resize() { W = innerWidth; H = innerHeight; canvas.width = W * dpr; canvas.height = H * dpr; canvas.style.width = W + 'px'; canvas.style.height = H + 'px'; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  function rand(a, b) { return a + Math.random() * (b - a); }
  function newPetal(top) {
    return { x: rand(0, W), y: top ? rand(-H, 0) : rand(-40, -10), r: rand(5, 11), vy: rand(22, 52), sway: rand(.5, 1.6), ph: rand(0, 6.28), rot: rand(0, 6.28), vr: rand(-1.2, 1.2), c: COLORS[(Math.random() * COLORS.length) | 0], a: rand(.45, .85) };
  }
  for (var i = 0; i < COUNT; i++) petals.push(newPetal(true));

  function petal(p) {
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = p.a; ctx.fillStyle = p.c;
    ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * .55, 0, 0, 6.283); ctx.fill(); ctx.restore();
  }
  function heart(p) {
    var s = p.r; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot * .15); ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.c; ctx.beginPath();
    ctx.moveTo(0, s * .3); ctx.bezierCurveTo(-s, -s * .5, -s * .5, -s * 1.1, 0, -s * .5); ctx.bezierCurveTo(s * .5, -s * 1.1, s, -s * .5, 0, s * .3); ctx.fill(); ctx.restore();
  }

  function frame(t) {
    if (!running) return;
    var dt = Math.min(.05, (t - last) / 1000 || .016); last = t;
    ctx.clearRect(0, 0, W, H);
    if (enabled) petals.forEach(function (p) {
      p.y += p.vy * dt; p.ph += p.sway * dt; p.x += Math.sin(p.ph) * 22 * dt; p.rot += p.vr * dt;
      if (p.y > H + 20) Object.assign(p, newPetal(false));
      petal(p);
    });
    bursts = bursts.filter(function (b) { return b.life > 0; });
    bursts.forEach(function (b) {
      b.x += b.vx * dt; b.y += b.vy * dt; b.vy += 220 * dt; b.vx *= .985; b.life -= dt * .9; b.rot += b.vr * dt;
      if (b.heart) heart(b); else { var a = b.a; b.a = Math.max(0, b.life); petal(b); b.a = a; }
    });
    requestAnimationFrame(frame);
  }
  function start() { if (!running) { running = true; last = performance.now(); requestAnimationFrame(frame); } }
  function stop() { running = false; }
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
  window.addEventListener('resize', resize);

  function burst(x, y, n, hearts) {
    for (var i = 0; i < n; i++) {
      var ang = rand(0, 6.283), sp = rand(60, 260);
      bursts.push({ x: x, y: y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 140, r: rand(6, 12), rot: rand(0, 6.28), vr: rand(-4, 4), c: COLORS[(Math.random() * COLORS.length) | 0], a: .9, life: 1, heart: hearts && Math.random() < .55 });
    }
  }
  window.WeddingMagic.burst = burst;
  window.WeddingMagic.celebrate = function (el) {
    var r = el && el.getBoundingClientRect ? el.getBoundingClientRect() : null;
    var x = r ? r.left + r.width / 2 : W / 2, y = r ? r.top + r.height / 2 : H / 3;
    burst(x, y, 40, true); setTimeout(function () { burst(x, y - 30, 30, true); }, 250);
  };

  if (E.tapBurst !== false) {
    document.addEventListener('pointerdown', function (e) {
      if (!e.target.closest || e.target.closest('input,textarea,select,label,.faq-q,.lightbox,.menu-toggle,.site-nav')) return;
      burst(e.clientX, e.clientY, 9, true);
    });
  }

  // Let guests switch the petals off (accessibility / preference).
  if (E.petals !== false) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'petal-toggle'; b.setAttribute('aria-pressed', 'true'); b.setAttribute('aria-label', 'Falling petals: on');
    b.innerHTML = '<span aria-hidden="true">❀</span>';
    b.addEventListener('click', function () { enabled = !enabled; b.setAttribute('aria-pressed', String(enabled)); b.setAttribute('aria-label', 'Falling petals: ' + (enabled ? 'on' : 'off')); b.classList.toggle('off', !enabled); });
    document.body.appendChild(b);
  }

  resize(); start();
})();
