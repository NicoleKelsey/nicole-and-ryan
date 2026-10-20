/* Envelope opening intro. Shown once per browser session, skipped for reduced-motion visitors
   (the <html> "intro-active" class is only set by the small script in index.html's <head>). */
(function () {
  'use strict';
  var root = document.documentElement, intro = document.getElementById('intro');
  if (!intro) return;
  var C = window.WEDDING_CONFIG;
  if (!root.classList.contains('intro-active')) { intro.remove(); return; }

  /* text comes from config.js */
  document.getElementById('il-names').textContent = C.couple.name1 + ' & ' + C.couple.name2;
  document.getElementById('il-date').textContent = C.wedding.displayDate;
  var d = C.details || {};
  document.getElementById('il-place').textContent = (d.venueName ? d.venueName + ' · ' : '') + C.wedding.town;
  document.getElementById('env-seal-text').textContent = C.couple.monogram;

  var env = document.getElementById('env'), seal = document.getElementById('env-seal'), skip = document.getElementById('intro-skip');
  var opened = false, finished = false;
  setTimeout(function () { seal.focus({ preventScroll: true }); }, 400);

  function finish() {
    if (finished) return; finished = true;
    try { sessionStorage.setItem('wedding-intro-seen', '1'); } catch (e) {}
    intro.classList.add('out');
    setTimeout(function () {
      root.classList.remove('intro-active');
      intro.remove();
      window.scrollTo(0, 0);
      if (window.WeddingMagic && window.WeddingMagic.celebrate) window.WeddingMagic.celebrate();
      var h = document.getElementById('hero-title'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    }, 900);
  }
  function open() {
    if (opened) return; opened = true;
    env.classList.add('open');
    intro.classList.add('opened');
    seal.setAttribute('aria-hidden', 'true'); seal.tabIndex = -1;
    var r = seal.getBoundingClientRect();
    if (window.WeddingMagic && window.WeddingMagic.burst) window.WeddingMagic.burst(r.left + r.width / 2, r.top + r.height / 2, 28, true);
    setTimeout(finish, 3600);
  }
  seal.addEventListener('click', open);
  env.addEventListener('click', open);
  skip.addEventListener('click', finish);
  document.addEventListener('keydown', function (e) { if (!finished && e.key === 'Escape') finish(); });
})();
