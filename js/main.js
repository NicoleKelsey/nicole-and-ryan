/* Renders the whole site from js/config.js. You shouldn't need to edit this file. */
(function () {
  'use strict';
  var C = window.WEDDING_CONFIG;
  var TBC = C.messages.tbc;

  /* ---------- helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function has(v) { return v != null && String(v).trim() !== ''; }
  function val(v, fallback) { return has(v) ? esc(v) : '<span class="tbc">' + esc(fallback || TBC) + '</span>'; }
  function isEmail(e) { return has(e) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
  function isHttp(u) { return has(u) && /^https?:\/\//i.test(String(u).trim()); }
  function link(u, label, cls) {
    return isHttp(u) ? '<a class="' + (cls || 'text-link') + '" href="' + esc(u) + '" target="_blank" rel="noopener noreferrer">' + esc(label) + '</a>' : '';
  }
  function fmtDate(iso) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso || '')) return '';
    var p = iso.split('-');
    var d = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2]));
    return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  }
  /* Image that shows an elegant placeholder instead of a broken icon. */
  function placeholderSvg(label) {
    return '<div class="ph" role="img" aria-label="' + esc(label || 'Photo coming soon') + '"><span class="ph-mono">' + esc(C.couple.monogram) + '</span><span class="ph-text">Photo coming soon</span></div>';
  }
  function imgOrPlaceholder(src, alt, loading) {
    if (!has(src)) return placeholderSvg(alt);
    return '<img src="' + esc(src) + '" alt="' + esc(alt) + '" loading="' + (loading || 'lazy') + '" decoding="async" data-fallback="1">';
  }
  document.addEventListener('error', function (e) {
    var t = e.target;
    if (t && t.tagName === 'IMG' && t.dataset.fallback) {
      var wrap = document.createElement('div');
      wrap.innerHTML = placeholderSvg(t.alt);
      t.replaceWith(wrap.firstChild);
      document.dispatchEvent(new CustomEvent('gallery:refresh'));
    }
  }, true);

  /* ---------- static bindings ---------- */
  var bind = {
    monogram: C.couple.monogram, name1: C.couple.name1, name2: C.couple.name2,
    shortDate: C.wedding.shortDate, displayDate: C.wedding.displayDate, town: C.wedding.town,
    tzLabel: C.wedding.timeZoneLabel, heroWelcome: C.messages.heroWelcome,
    welcomeTitle: C.messages.welcomeTitle, welcomeBody: C.messages.welcomeBody,
    rsvpLabel: C.rsvpButtonLabel
  };
  $$('[data-bind]').forEach(function (el) { var k = el.getAttribute('data-bind'); if (k in bind) el.textContent = bind[k]; });
  document.title = C.site.title;
  (function meta() {
    var d = $('meta[name="description"]'); if (d) d.content = C.site.description;
    var t = $('meta[property="og:title"]'); if (t) t.content = C.site.title;
    var od = $('meta[property="og:description"]'); if (od) od.content = C.site.description;
    if (has(C.site.publicUrl)) {
      var u = document.createElement('meta'); u.setAttribute('property', 'og:url'); u.content = C.site.publicUrl; document.head.appendChild(u);
      if (has(C.site.shareImage)) {
        var base = C.site.publicUrl.replace(/\/?$/, '/');
        var i = document.createElement('meta'); i.setAttribute('property', 'og:image'); i.content = base + C.site.shareImage; document.head.appendChild(i);
        var tw = $('meta[name="twitter:card"]'); if (tw) tw.content = 'summary_large_image';
      }
    }
  })();

  /* ---------- navigation ---------- */
  $('#nav-list').innerHTML = C.nav.map(function (n) {
    return '<li><a href="#' + esc(n.id) + '" data-nav="' + esc(n.id) + '">' + esc(n.label) + '</a></li>';
  }).join('');
  var toggle = $('#menu-toggle'), nav = $('#site-nav');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('menu-open', open);
  }
  toggle.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); toggle.focus(); } });
  document.addEventListener('click', function (e) {
    if (e.target.closest('a[href^="#"]')) setMenu(false);
  });
  // Active section highlight
  if ('IntersectionObserver' in window) {
    var navLinks = $$('[data-nav]');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          navLinks.forEach(function (a) {
            var on = a.dataset.nav === en.target.id;
            a.classList.toggle('active', on);
            if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    C.nav.forEach(function (n) { var s = document.getElementById(n.id); if (s) io.observe(s); });
  }
  var header = $('.site-header'), toTop = $('#to-top');
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('scrolled', y > 40);
    toTop.hidden = y < 700;
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0 }); });

  (function credit() { var el = $('#photo-credit'); if (has(C.images.photoCredit)) { el.textContent = C.images.photoCredit; el.hidden = false; } })();

  /* ---------- hero ---------- */
  (function hero() {
    var bg = $('#hero-bg');
    if (!has(C.images.hero)) return;
    var img = new Image();
    img.onload = function () { bg.style.backgroundImage = 'linear-gradient(rgba(30,28,24,.35),rgba(30,28,24,.5)),url("' + C.images.hero + '")'; document.body.classList.add('hero-photo'); };
    img.src = C.images.hero; // if it fails to load, the soft gradient stays
  })();

  /* ---------- countdown ---------- */
  (function countdown() {
    var target = new Date(C.wedding.startsAtIso).getTime(); // explicit +02:00 offset = SAST
    var els = { d: $('#cd-days'), h: $('#cd-hours'), m: $('#cd-minutes'), s: $('#cd-seconds') };
    var box = $('#countdown'), msg = $('#cd-message'), sr = $('#cd-sr'), lastMin = -1, timer;
    if (isNaN(target)) { box.hidden = true; return; }
    function pad(n) { return n < 10 ? '0' + n : String(n); }
    function tick() {
      var diff = target - Date.now();
      if (diff <= 0) {
        els.d.textContent = els.h.textContent = els.m.textContent = els.s.textContent = '00';
        msg.hidden = false;
        msg.textContent = (Date.now() < target + 864e5) ? C.messages.countdownDone : C.messages.countdownAfter;
        clearInterval(timer);
        return;
      }
      var secs = Math.floor(diff / 1000);
      var d = Math.floor(secs / 86400), h = Math.floor(secs % 86400 / 3600), m = Math.floor(secs % 3600 / 60), s = secs % 60;
      els.d.textContent = d; els.h.textContent = pad(h); els.m.textContent = pad(m); els.s.textContent = pad(s);
      if (m !== lastMin) { lastMin = m; sr.textContent = d + ' days, ' + h + ' hours and ' + m + ' minutes to go.'; }
    }
    tick(); timer = setInterval(tick, 1000);
  })();

  /* ---------- story ---------- */
  (function story() {
    var S = C.story;
    $('#story-intro').textContent = S.intro;
    var ph = $('#story-photo');
    ph.innerHTML = imgOrPlaceholder(C.images.story, C.images.storyPhotoAlt);
    $('#story-timeline').innerHTML = S.timeline.map(function (t) {
      return '<li class="tl-item"><span class="tl-dot" aria-hidden="true"></span><div class="tl-body">' +
        '<h3>' + esc(t.title) + '</h3>' +
        (has(t.when) ? '<p class="tl-when">' + esc(t.when) + '</p>' : '') +
        '<p' + (has(t.text) ? '' : ' class="tbc"') + '>' + esc(has(t.text) ? t.text : S.placeholderText) + '</p></div></li>';
    }).join('');
    var q = $('#story-message');
    if (has(S.messageToGuests)) q.innerHTML = '<p>' + esc(S.messageToGuests) + '</p><footer>— ' + esc(C.couple.name1) + ' &amp; ' + esc(C.couple.name2) + '</footer>';
    else q.innerHTML = '<p class="tbc">A personal message from us will appear here.</p>';
  })();

  /* ---------- details & travel ---------- */
  var D = C.details;
  function mapsHref() {
    if (isHttp(D.mapsUrl)) return D.mapsUrl;
    if (has(D.venueAddress)) return 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(D.venueAddress);
    return null;
  }
  (function details() {
    /* ---- date + venue card ---- */
    var m = /^(\w+),?\s+(\d+)\s+(.+)$/.exec(C.wedding.displayDate) || [];
    $('#date-card').innerHTML =
      '<div class="dc-date"><span class="dc-wd">' + esc(m[1] || '') + '</span><span class="dc-day">' + esc(m[2] || C.wedding.shortDate) + '</span><span class="dc-month">' + esc(m[3] || '') + '</span></div>' +
      '<div class="dc-where"><p class="dc-label">Venue</p>' +
      '<h3>' + (has(D.venueName) ? esc(D.venueName) : '<span class="tbc">Venue to be confirmed</span>') + '</h3>' +
      '<p>' + (has(D.venueAddress) ? esc(D.venueAddress) : '<span class="tbc">Address to be confirmed</span>') + '</p>' +
      '<p class="dc-town">' + esc(C.wedding.town) + '</p></div>';

    /* ---- "at a glance" carousel ---- */
    var ICON = {
      sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
      heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.2l7.8-7.7 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',
      glass: '<path d="M8 2h8l-1 8a3 3 0 0 1-6 0zM12 13v8M8 22h8"/>',
      moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
      shirt: '<path d="M8 3 3 7l3 3 2-1v12h8V9l2 1 3-3-5-4a4 4 0 0 1-8 0z"/>',
      car: '<path d="M3 13l2-5h14l2 5v5H3z"/><circle cx="7.5" cy="18" r="1.5"/><circle cx="16.5" cy="18" r="1.5"/>',
      access: '<circle cx="12" cy="4" r="2"/><path d="M5 8h14M12 8v6m0 0-3 7m3-7 3 7"/>',
      cloud: '<path d="M18 10h-1.3A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>',
      info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>'
    };
    var recep = has(D.receptionLocation) ? D.receptionLocation : (has(D.ceremonyLocation) ? 'Same location as the ceremony' : null);
    var cards = [
      ['sun', 'Guest arrival', D.guestArrivalTime, null],
      ['heart', 'Ceremony', D.ceremonyTime, D.ceremonyLocation],
      ['glass', 'Reception', D.receptionTime, recep],
      ['moon', 'Finish', D.finishTime, null],
      ['shirt', 'Dress code', D.dressCode, null],
      ['car', 'Parking', D.parking, null],
      ['access', 'Accessibility', D.accessibility, null],
      ['cloud', 'Weather plan', D.weatherPlan, null],
      ['info', 'Good to know', D.guestInstructions, null]
    ];
    $('#dcar-track').innerHTML = cards.map(function (c) {
      return '<li class="dcard"><span class="dcard-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + ICON[c[0]] + '</svg></span>' +
        '<h4>' + c[1] + '</h4><p class="dcard-main">' + val(c[2]) + '</p>' + (has(c[3]) ? '<p class="dcard-sub">' + esc(c[3]) + '</p>' : '') + '</li>';
    }).join('');
    (function carousel() {
      var track = $('#dcar-track'), prev = $('#dcar-prev'), next = $('#dcar-next'), dots = $('#dcar-dots');
      var items = $$('.dcard', track), reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      dots.innerHTML = items.map(function (_, i) { return '<button type="button" aria-label="Go to card ' + (i + 1) + '"></button>'; }).join('');
      var dotEls = $$('button', dots);
      function step() { return items.length > 1 ? items[1].offsetLeft - items[0].offsetLeft : track.clientWidth; }
      function goto(i) { track.scrollTo({ left: items[Math.max(0, Math.min(items.length - 1, i))].offsetLeft - items[0].offsetLeft, behavior: reduce ? 'auto' : 'smooth' }); }
      function sync() {
        var i = Math.round(track.scrollLeft / step()), max = track.scrollWidth - track.clientWidth - 2;
        if (track.scrollLeft >= max) i = items.length - 1;
        dotEls.forEach(function (d, k) { d.classList.toggle('on', k === i); if (k === i) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
        prev.disabled = track.scrollLeft <= 2; next.disabled = track.scrollLeft >= max;
      }
      prev.addEventListener('click', function () { track.scrollBy({ left: -step() * (window.innerWidth > 900 ? 2 : 1), behavior: reduce ? 'auto' : 'smooth' }); });
      next.addEventListener('click', function () { track.scrollBy({ left: step() * (window.innerWidth > 900 ? 2 : 1), behavior: reduce ? 'auto' : 'smooth' }); });
      dotEls.forEach(function (d, i) { d.addEventListener('click', function () { goto(i); }); });
      track.addEventListener('scroll', sync, { passive: true });
      track.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { e.preventDefault(); next.click(); } else if (e.key === 'ArrowLeft') { e.preventDefault(); prev.click(); } });
      window.addEventListener('resize', sync); sync();
    })();
    var href = mapsHref(), btn = $('#directions-btn');
    if (href) { btn.href = href; btn.target = '_blank'; btn.rel = 'noopener noreferrer'; btn.hidden = false; }
    $('#print-details').addEventListener('click', function () {
      document.body.classList.add('print-details');
      window.print();
    });
    window.addEventListener('afterprint', function () { document.body.classList.remove('print-details'); });

    var T = C.travel;
    var items = [
      ['Venue address', has(D.venueAddress) ? esc(D.venueAddress) : '<span class="tbc">Venue to be confirmed</span>'],
      ['Directions', href ? '<a class="text-link" href="' + esc(href) + '" target="_blank" rel="noopener noreferrer">Open in Google Maps</a>' : '<span class="tbc">Directions will be added once the venue is confirmed</span>'],
      ['Travelling from outside Kirkwood', val(T.general)],
      ['Parking', val(has(T.parking) ? T.parking : D.parking)],
      ['Transport arrangements', val(T.transport)],
      ['Between accommodation and venue', val(T.accommodationToVenue)]
    ];
    $('#travel-grid').innerHTML = items.map(function (r) { return '<div class="travel-item"><h4>' + r[0] + '</h4><p>' + r[1] + '</p></div>'; }).join('');
    var rem = $('#travel-reminder');
    if (has(T.overnightReminder)) rem.innerHTML = esc(T.overnightReminder) + ' <a href="#accommodation">See accommodation &rarr;</a>'; else rem.hidden = true;
  })();

  /* ---------- schedule ---------- */
  (function schedule() {
    var S = C.schedule, n = $('#schedule-notice');
    if (!S.confirmed && has(S.notice)) n.textContent = S.notice; else n.hidden = true;
    $('#schedule-list').innerHTML = S.items.map(function (i) {
      return '<li class="sch-item"><span class="sch-time">' + (has(i.time) ? esc(i.time) : 'TBC') + '</span><div class="sch-body"><h3>' + esc(i.title) + '</h3>' + (has(i.note) ? '<p>' + esc(i.note) + '</p>' : '') + '</div></li>';
    }).join('');
  })();

  /* ---------- accommodation ---------- */
  (function stay() {
    var A = C.accommodation;
    $('#book-early').textContent = A.bookEarlyMessage;
    $('#stay-disclaimer').textContent = A.disclaimer || '';
    function row(label, value) { return has(value) ? '<div><dt>' + label + '</dt><dd>' + esc(value) + '</dd></div>' : ''; }
    $('#stay-cards').innerHTML = A.items.map(function (a) {
      var links = [link(a.website, 'Website', 'btn btn-small btn-ghost'), link(a.bookingLink, 'Book', 'btn btn-small')].join('');
      var phone = has(a.phone) ? '<a class="text-link" href="tel:' + esc(String(a.phone).replace(/[^\d+]/g, '')) + '">' + esc(a.phone) + '</a>' : '';
      return '<article class="card' + (a.placeholder ? ' is-placeholder' : '') + '">' +
        '<div class="card-img">' + imgOrPlaceholder(a.image, a.imageAlt || a.name) + '</div>' +
        '<div class="card-body">' +
        (has(a.type) ? '<p class="card-type">' + esc(a.type) + '</p>' : '') +
        '<h3>' + esc(a.name) + '</h3>' +
        (a.placeholder ? '<p class="tbc">Placeholder — details to be added once verified.</p>' : '') +
        '<dl class="facts">' + row('Location', a.location) + row('Distance from venue', a.distance) + row('Capacity', a.capacity) + row('Bedrooms', a.bedrooms) +
        row('Approx. price', a.priceRange) + row('Parking', a.parking) + row('Family friendly', a.familyFriendly) + row('Notes', a.notes) +
        (phone ? '<div><dt>Phone</dt><dd>' + phone + '</dd></div>' : '') +
        (isEmail(a.email) ? '<div><dt>Email</dt><dd><a class="text-link" href="mailto:' + esc(a.email) + '">' + esc(a.email) + '</a></dd></div>' : '') + '</dl>' +
        (links ? '<div class="card-actions">' + links + '</div>' : '') +
        '</div></article>';
    }).join('');
  })();

  /* ---------- announcements ---------- */
  (function ann() {
    var list = C.announcements || [], el = $('#ann-list');
    if (!list.length) { el.innerHTML = '<p class="center tbc">No announcements yet — check back soon.</p>'; return; }
    el.innerHTML = list.map(function (a) {
      var d = fmtDate(a.date);
      return '<article class="ann">' + (d ? '<time datetime="' + esc(a.date) + '">' + esc(d) + '</time>' : '') + '<h3>' + esc(a.title) + '</h3><p>' + esc(a.text) + '</p></article>';
    }).join('');
  })();

  /* ---------- FAQ ---------- */
  (function faq() {
    $('#faq-list').innerHTML = C.faq.map(function (f, i) {
      return '<div class="faq-item"><h3><button type="button" class="faq-q" aria-expanded="false" aria-controls="faq-a' + i + '" id="faq-q' + i + '">' + esc(f.q) + '<span class="faq-icon" aria-hidden="true"></span></button></h3>' +
        '<div class="faq-a" id="faq-a' + i + '" role="region" aria-labelledby="faq-q' + i + '" hidden><p>' + esc(f.a) + '</p></div></div>';
    }).join('');
    $('#faq-list').addEventListener('click', function (e) {
      var b = e.target.closest('.faq-q'); if (!b) return;
      var open = b.getAttribute('aria-expanded') === 'true';
      b.setAttribute('aria-expanded', String(!open));
      $('#' + b.getAttribute('aria-controls')).hidden = open;
      b.closest('.faq-item').classList.toggle('open', !open);
    });
  })();

  /* ---------- gallery + lightbox ---------- */
  (function gallery() {
    var G = C.gallery;
    $('#gal-intro').textContent = G.intro || '';
    var grid = $('#gallery-grid');
    grid.innerHTML = G.items.map(function (g, i) {
      var inner = imgOrPlaceholder(g.src, g.alt);
      var cap = has(g.caption) ? '<span class="g-cap">' + esc(g.caption) + '</span>' : '';
      return '<li class="g-item" data-i="' + i + '">' + (has(g.src) ? '<button type="button" class="g-open" aria-label="View larger: ' + esc(g.alt) + '">' + inner + cap + '</button>' : inner + cap) + '</li>';
    }).join('');

    var lb = $('#lightbox'), lbImg = $('#lb-img'), lbCap = $('#lb-cap'), idx = 0, opener = null;
    function shown() { // only real, loadable photos
      return $$('.g-open', grid).map(function (b) { return +b.closest('.g-item').dataset.i; });
    }
    function show(i) {
      var g = G.items[i]; idx = i;
      lbImg.src = g.src; lbImg.alt = g.alt; lbCap.textContent = g.caption || '';
    }
    function open(i, from) { opener = from; show(i); lb.hidden = false; document.body.classList.add('lb-open'); $('.lb-close', lb).focus(); }
    function close() { lb.hidden = true; document.body.classList.remove('lb-open'); if (opener) opener.focus(); }
    function step(d) { var s = shown(); if (!s.length) return; show(s[(s.indexOf(idx) + d + s.length) % s.length]); }
    grid.addEventListener('click', function (e) { var b = e.target.closest('.g-open'); if (b) open(+b.closest('.g-item').dataset.i, b); });
    $('.lb-close', lb).addEventListener('click', close);
    $('.lb-prev', lb).addEventListener('click', function () { step(-1); });
    $('.lb-next', lb).addEventListener('click', function () { step(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'Tab') { // keep focus inside the dialog
        var f = $$('.lb-btn', lb), first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    // A photo that fails to load is swapped for a placeholder: remove its (now pointless) open button.
    document.addEventListener('gallery:refresh', function () {
      $$('.g-open', grid).forEach(function (b) { if (!$('img', b)) { var li = b.closest('.g-item'); li.innerHTML = $('.ph', b).outerHTML + ($('.g-cap', b) ? $('.g-cap', b).outerHTML : ''); } });
    });
  })();

  /* ---------- gifts ---------- */
  (function gifts() {
    var G = C.gifts, html = '';
    if (has(G.personalMessage)) html += '<p class="lead">' + esc(G.personalMessage) + '</p>';
    if (has(G.suggestions)) html += '<p>' + esc(G.suggestions) + '</p>';
    if (has(G.honeymoonNote)) html += '<p>' + esc(G.honeymoonNote) + '</p>';
    var links = (G.registryLinks || []).concat(G.contributionLinks || []).filter(function (l) { return isHttp(l.url); });
    if (links.length) html += '<div class="gift-links">' + links.map(function (l) { return link(l.url, l.label, 'btn btn-ghost'); }).join('') + '</div>';
    else html += '<p class="tbc">' + esc(G.moreDetailsMessage) + '</p>';
    $('#gifts-body').innerHTML = html;
  })();

  /* ---------- contact ---------- */
  (function contact() {
    var K = C.contact, h = '';
    if (has(K.message)) h += '<p class="lead">' + esc(K.message) + '</p>';
    var emailOk = has(K.email) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(K.email);
    var waOk = isHttp(K.whatsappLink);
    var parts = [];
    if (emailOk) parts.push('<a class="btn" href="mailto:' + esc(K.email) + '">Email ' + esc(has(K.name) ? K.name : 'us') + '</a>');
    if (waOk) parts.push('<a class="btn btn-ghost" href="' + esc(K.whatsappLink) + '" target="_blank" rel="noopener noreferrer">WhatsApp' + (has(K.whatsappNumber) ? ' · ' + esc(K.whatsappNumber) : '') + '</a>');
    h += parts.length ? '<div class="gift-links">' + parts.join('') + '</div>' : '<p class="tbc">Contact details coming soon.</p>';
    $('#contact-body').innerHTML = h;
  })();

  /* ---------- privacy ---------- */
  (function privacy() {
    var P = C.privacy, rows = [
      ['What we collect', P.collected], ['Why we collect it', P.purpose], ['Where it is stored', P.storage],
      ['Who can see it', P.access], ['Corrections & deletion', P.corrections], ['How long we keep it', P.retention]
    ];
    $('#privacy-list').innerHTML = rows.map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('');
  })();

  /* ---------- RSVP deadline text ---------- */
  $('#rsvp-deadline').textContent = has(C.rsvp.deadline) ? C.rsvp.deadline : TBC;

  /* ---------- entrance animations ---------- */
  (function reveal() {
    var els = $$('.reveal');
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var o = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target); } }); }, { threshold: 0.08 });
    els.forEach(function (e) { o.observe(e); });
  })();
})();
