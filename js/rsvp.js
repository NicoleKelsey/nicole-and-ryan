/* RSVP form. Client-side checks are for friendliness only - the real validation,
   guest-limit enforcement and spam checks happen on the server (apps-script/Code.gs).
   A success message is shown ONLY when the server replies {"ok":true}. */
(function () {
  'use strict';
  var C = window.WEDDING_CONFIG, R = C.rsvp, root = document.getElementById('rsvp-root');
  if (!root) return;

  var MAX = Math.max(1, parseInt(R.maxGuestsPerInvitation, 10) || 1);
  var live = typeof R.endpoint === 'string' && /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(R.endpoint.trim());
  var openedAt = Date.now();
  var STORE = 'wedding-rsvp-submitted';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function $(s, r) { return (r || root).querySelector(s); }

  if (!live) console.warn('[RSVP] No valid endpoint configured in js/config.js - the RSVP form is closed. See README → "Set up RSVP".');

  var sizeOpts = '';
  for (var n = 1; n <= MAX; n++) sizeOpts += '<option value="' + n + '">' + n + (n === 1 ? ' person (just me)' : ' people') + '</option>';

  root.innerHTML =
    (live ? '' : '<div class="alert alert-info" role="status">' + esc(R.closedMessage) + '</div>') +
    '<form id="rsvp-form" class="form" novalidate' + (live ? '' : ' aria-disabled="true"') + '>' +
    '<fieldset ' + (live ? '' : 'disabled') + '>' +
    '<div class="field"><label for="f-name">Full name <span class="req">*</span></label><input id="f-name" name="name" type="text" autocomplete="name" maxlength="100" required><p class="err" id="e-name" hidden></p></div>' +
    (R.requireInvitationCode ? '<div class="field"><label for="f-code">Invitation code <span class="req">*</span></label><input id="f-code" name="code" type="text" maxlength="30" autocomplete="off" required><p class="hint">Printed on your invitation.</p><p class="err" id="e-code" hidden></p></div>' : '') +
    '<div class="field"><span class="label" id="l-att">Will you be attending? <span class="req">*</span></span>' +
    '<div class="radios" role="radiogroup" aria-labelledby="l-att">' +
    '<label class="radio"><input type="radio" name="attending" value="yes"> <span>Joyfully accepts</span></label>' +
    '<label class="radio"><input type="radio" name="attending" value="no"> <span>Regretfully unable to attend</span></label></div><p class="err" id="e-attending" hidden></p></div>' +

    '<div id="yes-fields" hidden>' +
    (MAX > 1 ? '<div class="field"><label for="f-size">Number of people in your party <span class="req">*</span></label><select id="f-size" name="partySize">' + sizeOpts + '</select><p class="hint">Your invitation includes up to ' + MAX + (MAX === 1 ? ' guest' : ' guests') + ' (including you).</p><p class="err" id="e-size" hidden></p></div>' : '<input type="hidden" id="f-size" value="1">') +
    '<div id="extra-wrap" hidden><div class="field"><span class="label">Names of additional guests <span class="req">*</span></span><div id="extra-names"></div><p class="err" id="e-extra" hidden></p></div></div>' +
    (R.childrenInvited && MAX > 1 ? '<div class="field" id="kids-wrap" hidden><label for="f-kids">How many of your party are children?</label><select id="f-kids" name="children"></select>' +
      '<div id="kids-details" hidden><label for="f-kidsinfo">Children\'s names and ages</label><textarea id="f-kidsinfo" name="childrenDetails" rows="2" maxlength="300"></textarea></div></div>' : '') +
    '<div class="field"><label for="f-diet">Dietary requirements <span class="opt">(optional)</span></label><textarea id="f-diet" name="dietary" rows="2" maxlength="300" placeholder="e.g. vegetarian, halal"></textarea></div>' +
    '<div class="field"><label for="f-allergy">Food allergies <span class="opt">(optional)</span></label><textarea id="f-allergy" name="allergies" rows="2" maxlength="300"></textarea></div>' +
    '<div class="field"><label for="f-access">Accessibility or special assistance <span class="opt">(optional)</span></label><textarea id="f-access" name="accessibility" rows="2" maxlength="300"></textarea></div>' +
    '</div>' +

    (C.songs && C.songs.enabled ? '<div class="field"><label for="f-song">A song to get you dancing <span class="opt">(optional)</span></label><input id="f-song" name="song" type="text" maxlength="120" placeholder="Song title and artist"></div>' : '') +
    '<div class="field"><label for="f-msg">Message to Nicole &amp; Ryan <span class="opt">(optional)</span></label><textarea id="f-msg" name="message" rows="3" maxlength="600"></textarea></div>' +
    // Honeypot: hidden from people, irresistible to bots.
    '<div class="hp" aria-hidden="true"><label>Leave this empty <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>' +
    '<p class="err" id="e-form" role="alert" hidden></p>' +
    '<button class="btn btn-block" type="submit" id="rsvp-submit">Send RSVP</button>' +
    '<p class="fine center">Your answers are kept private. <a href="#privacy">Privacy notice</a></p>' +
    '</fieldset></form>' +
    '<div id="rsvp-result" tabindex="-1" aria-live="polite"></div>';

  var form = $('#rsvp-form');
  var already = null; try { already = localStorage.getItem(STORE); } catch (e) {}
  if (live && already) {
    form.insertAdjacentHTML('beforebegin', '<div class="alert alert-info" role="status">You\'ve already sent an RSVP from this device. If your plans change, simply submit again with the same name. Your latest answer replaces the earlier one.</div>');
  }

  function showErr(id, msg) { var e = $('#' + id); if (!e) return; e.textContent = msg; e.hidden = !msg; var inp = e.parentNode.querySelector('input,select,textarea'); if (inp && msg) inp.setAttribute('aria-invalid', 'true'); else if (inp) inp.removeAttribute('aria-invalid'); }
  function attending() { var r = form.querySelector('input[name="attending"]:checked'); return r ? r.value : null; }
  function size() { return Math.min(MAX, Math.max(1, parseInt($('#f-size').value, 10) || 1)); }
  function kids() { var k = $('#f-kids'); return k ? parseInt(k.value, 10) || 0 : 0; }

  function refresh() {
    var yes = attending() === 'yes';
    $('#yes-fields').hidden = !yes;
    var s = size(), k = kids();
    // children selector (0..s-1)
    var kw = $('#kids-wrap');
    if (kw) {
      kw.hidden = !(yes && s > 1);
      var sel = $('#f-kids'), cur = Math.min(k, s - 1), o = '';
      for (var i = 0; i <= s - 1; i++) o += '<option value="' + i + '"' + (i === cur ? ' selected' : '') + '>' + i + '</option>';
      sel.innerHTML = o; k = cur;
      $('#kids-details').hidden = k === 0;
    }
    var adultsExtra = s - 1 - k, box = $('#extra-names'), have = box.querySelectorAll('input').length;
    $('#extra-wrap').hidden = !(yes && adultsExtra > 0);
    if (have !== adultsExtra) {
      var keep = Array.prototype.map.call(box.querySelectorAll('input'), function (i) { return i.value; }), h = '';
      for (var j = 0; j < adultsExtra; j++) h += '<input type="text" class="extra" maxlength="100" aria-label="Additional guest ' + (j + 1) + ' full name" placeholder="Guest ' + (j + 1) + ' full name" value="' + esc(keep[j] || '') + '">';
      box.innerHTML = h;
    }
  }
  form.addEventListener('change', refresh);
  refresh();

  function validate() {
    var ok = true, firstBad = null;
    function bad(id, msg) { showErr(id, msg); ok = false; if (!firstBad) firstBad = $('#' + id).parentNode.querySelector('input,select,textarea'); }
    ['e-name', 'e-code', 'e-attending', 'e-size', 'e-extra', 'e-form'].forEach(function (i) { showErr(i, ''); });
    var name = $('#f-name').value.trim();
    if (name.length < 2) bad('e-name', 'Please enter your full name.');
    if (R.requireInvitationCode && !$('#f-code').value.trim()) bad('e-code', 'Please enter the invitation code from your invitation.');
    if (!attending()) bad('e-attending', 'Please tell us whether you can attend.');
    if (attending() === 'yes') {
      if (size() > MAX) bad('e-size', 'Your invitation allows up to ' + MAX + ' guests.');
      var extras = Array.prototype.slice.call(form.querySelectorAll('.extra'));
      if (extras.some(function (i) { return i.value.trim().length < 2; })) bad('e-extra', 'Please enter the name of each additional guest.');
    }
    if (firstBad) firstBad.focus();
    return ok;
  }

  function collect() {
    var yes = attending() === 'yes', g = function (id) { var e = $('#' + id); return e ? e.value.trim() : ''; };
    return {
      name: g('f-name'),
      code: R.requireInvitationCode ? g('f-code') : '',
      attending: attending(),
      partySize: yes ? size() : 0,
      additionalGuests: yes ? Array.prototype.map.call(form.querySelectorAll('.extra'), function (i) { return i.value.trim(); }) : [],
      children: yes ? kids() : 0,
      childrenDetails: yes ? g('f-kidsinfo') : '',
      dietary: yes ? g('f-diet') : '',
      allergies: yes ? g('f-allergy') : '',
      accessibility: yes ? g('f-access') : '',
      song: g('f-song'),
      message: g('f-msg'),
      website: form.querySelector('input[name="website"]').value, // honeypot
      elapsedMs: Date.now() - openedAt
    };
  }

  function result(type, title, body) {
    var el = $('#rsvp-result');
    el.innerHTML = '<div class="alert alert-' + type + '" role="' + (type === 'error' ? 'alert' : 'status') + '"><h3>' + esc(title) + '</h3><p>' + body + '</p></div>';
    el.focus(); el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (!live) return;
    if (!validate()) return;
    var btn = $('#rsvp-submit'), data = collect();
    btn.disabled = true; btn.textContent = 'Sending…'; $('#rsvp-result').innerHTML = '';
    var ctrl = ('AbortController' in window) ? new AbortController() : null;
    var t = setTimeout(function () { if (ctrl) ctrl.abort(); }, 20000);
    // text/plain avoids a CORS preflight, which Apps Script cannot answer.
    fetch(R.endpoint.trim(), { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(data), signal: ctrl ? ctrl.signal : undefined })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        clearTimeout(t);
        if (j && j.ok === true) {
          try { localStorage.setItem(STORE, new Date().toISOString()); } catch (e) {}
          var yes = data.attending === 'yes';
          form.hidden = true;
          if (window.WeddingMagic) window.WeddingMagic.celebrate();
          result('success', j.updated ? 'Your RSVP has been updated' : 'Thank you, ' + data.name.split(' ')[0] + '!',
            yes ? 'We\'ve received your RSVP and can\'t wait to celebrate with you on ' + esc(C.wedding.displayDate) + '.' : 'We\'ve received your reply. We\'ll miss you, and thank you for letting us know.');
        } else {
          var msg = (j && j.error) ? esc(j.error) : 'Something went wrong on our side.';
          showErr('e-form', 'We couldn\'t save your RSVP: ' + msg);
          result('error', 'Your RSVP was not saved', msg + ' Please check your answers and try again, or contact us directly.');
          btn.disabled = false; btn.textContent = 'Send RSVP';
        }
      })
      .catch(function () {
        clearTimeout(t);
        result('error', 'Your RSVP was not saved', 'We couldn\'t reach the RSVP service (please check your connection). Nothing has been recorded. Please try again in a moment, or contact us directly.');
        btn.disabled = false; btn.textContent = 'Send RSVP';
      });
  });
})();
