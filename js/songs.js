/* Song request form. Uses the same backend as the RSVP; "saved" is only shown when the server confirms. */
(function () {
  'use strict';
  var C = window.WEDDING_CONFIG, S = C.songs, sec = document.getElementById('songs'), root = document.getElementById('songs-root');
  if (!S || !S.enabled || !sec) return;
  sec.hidden = false;
  document.getElementById('songs-title').textContent = S.title;
  document.getElementById('songs-intro').textContent = S.intro;
  // add to the nav-free flow: link from the RSVP header
  var live = typeof C.rsvp.endpoint === 'string' && /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(C.rsvp.endpoint.trim());
  var openedAt = Date.now(), count = 0;
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  root.innerHTML = (live ? '' : '<div class="alert alert-info" role="status">Song requests will open together with RSVPs.</div>') +
    '<form class="form song-form" id="song-form" novalidate><fieldset ' + (live ? '' : 'disabled') + '>' +
    '<div class="field"><label for="s-name">Your name <span class="req">*</span></label><input id="s-name" type="text" maxlength="100" autocomplete="name" required></div>' +
    '<div class="field"><label for="s-song">Song and artist <span class="req">*</span></label><input id="s-song" type="text" maxlength="120" placeholder="e.g. Song title — Artist" required></div>' +
    '<div class="hp" aria-hidden="true"><label>Leave empty <input type="text" id="s-hp" tabindex="-1" autocomplete="off"></label></div>' +
    '<p class="err" id="s-err" role="alert" hidden></p>' +
    '<button class="btn btn-block" type="submit" id="s-btn">Add to the playlist</button>' +
    '<p class="fine center">Up to ' + S.maxPerGuest + ' songs each. Stored privately with your name.</p>' +
    '</fieldset></form><ul class="song-list" id="song-list" aria-live="polite"></ul>';

  var form = document.getElementById('song-form'), err = document.getElementById('s-err'), btn = document.getElementById('s-btn');
  function fail(m) { err.textContent = m; err.hidden = false; }

  form.addEventListener('submit', function (e) {
    e.preventDefault(); if (!live) return; err.hidden = true;
    var name = document.getElementById('s-name').value.trim(), song = document.getElementById('s-song').value.trim();
    if (name.length < 2) return fail('Please enter your name.');
    if (song.length < 2) return fail('Please enter a song.');
    if (count >= S.maxPerGuest) return fail('That\'s the maximum of ' + S.maxPerGuest + ' songs — thank you!');
    btn.disabled = true; btn.textContent = 'Sending…';
    var ctrl = ('AbortController' in window) ? new AbortController() : null, t = setTimeout(function () { if (ctrl) ctrl.abort(); }, 20000);
    fetch(C.rsvp.endpoint.trim(), { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, signal: ctrl ? ctrl.signal : undefined,
      body: JSON.stringify({ type: 'song', name: name, song: song, website: document.getElementById('s-hp').value, elapsedMs: Date.now() - openedAt }) })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        clearTimeout(t);
        if (j && j.ok === true) {
          count++; openedAt = Date.now();
          document.getElementById('song-list').insertAdjacentHTML('beforeend', '<li><span aria-hidden="true">♪</span> ' + esc(song) + '</li>');
          document.getElementById('s-song').value = '';
          if (window.WeddingMagic) window.WeddingMagic.celebrate(btn);
          btn.textContent = count >= S.maxPerGuest ? 'Thank you!' : 'Add another song';
          btn.disabled = count >= S.maxPerGuest;
        } else { fail((j && j.error) || 'Something went wrong. Your song was not saved.'); btn.disabled = false; btn.textContent = 'Add to the playlist'; }
      })
      .catch(function () { clearTimeout(t); fail('We couldn\'t reach the service, so your song was not saved. Please try again.'); btn.disabled = false; btn.textContent = 'Add to the playlist'; });
  });
})();
