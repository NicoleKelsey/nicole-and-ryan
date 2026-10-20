/**
 * RSVP backend for Nicole & Ryan's wedding website.
 * Runs on Google Apps Script (free). Paste this into a script attached to a PRIVATE Google Sheet.
 * See README.md → "Set up RSVP" for step-by-step instructions.
 *
 * What it does
 *  - Receives RSVP submissions (POST) and re-validates EVERYTHING on the server.
 *  - Enforces the guest limit per invitation (so guests can't edit the form to bring more people).
 *  - Rejects spam (honeypot, too-fast submissions, rate limiting).
 *  - Saves to the "RSVPs" sheet. A repeat submission with the same name (and code) updates the
 *    earlier row instead of creating a duplicate.
 *  - Never returns guest data. GET only returns a harmless "service is running" message.
 *
 * Private settings live in Project Settings → Script Properties (never in the website):
 *  DEFAULT_MAX_GUESTS   (default 2)  – limit when no invitation code is used
 *  REQUIRE_CODE         ("true"/"false", default false)
 *  CHILDREN_INVITED     ("true"/"false", default false)
 *  MAX_SONGS_PER_GUEST  (default 3) – song requests allowed per name
 *  RSVP_DEADLINE_ISO    (optional, e.g. 2027-06-30T23:59:59+02:00) – submissions after this are refused
 *
 * Optional "Invitations" sheet (private): column A = code, B = max guests, C = label.
 * If REQUIRE_CODE is true, only codes listed there are accepted and each code's own limit applies.
 */

var HEADERS = ['Received', 'Updated', 'Name', 'Invitation code', 'Attending', 'Party size', 'Additional guests',
  'Children', 'Children details', 'Dietary', 'Allergies', 'Accessibility', 'Message', 'Song request'];

function doGet() {
  return json_({ ok: true, service: 'wedding-rsvp' });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
  } catch (err) {
    return json_({ ok: false, error: 'The service is busy. Please try again in a moment.' });
  }
  try {
    var d;
    try { d = JSON.parse(e.postData.contents); } catch (err2) { return json_({ ok: false, error: 'Invalid submission.' }); }

    var props = PropertiesService.getScriptProperties();
    var defaultMax = parseInt(props.getProperty('DEFAULT_MAX_GUESTS') || '2', 10);
    var requireCode = props.getProperty('REQUIRE_CODE') === 'true';
    var childrenInvited = props.getProperty('CHILDREN_INVITED') === 'true';
    var deadline = props.getProperty('RSVP_DEADLINE_ISO');

    // --- spam protection ---
    if (d.type === 'song') return handleSong_(d);
    if (d.website) return json_({ ok: true });                       // honeypot: pretend success, store nothing
    if (typeof d.elapsedMs === 'number' && d.elapsedMs < 3000) return json_({ ok: false, error: 'That was very quick, please try again.' });
    var cache = CacheService.getScriptCache(), rlKey = 'rl-' + clean_(d.name, 100).toLowerCase();
    if (cache.get(rlKey)) return json_({ ok: false, error: 'Please wait a minute before submitting again.' });

    if (deadline && new Date() > new Date(deadline)) return json_({ ok: false, error: 'The RSVP deadline has passed. Please contact us directly.' });

    // --- validation ---
    var name = clean_(d.name, 100);
    if (name.length < 2) return json_({ ok: false, error: 'Please enter your full name.' });
    if (d.attending !== 'yes' && d.attending !== 'no') return json_({ ok: false, error: 'Please tell us whether you can attend.' });

    var code = clean_(d.code, 30), max = defaultMax;
    var inv = lookupInvitation_(code);
    if (requireCode) {
      if (!inv) return json_({ ok: false, error: 'That invitation code was not recognised.' });
      max = inv.max;
    } else if (inv) {
      max = inv.max;
    }

    var yes = d.attending === 'yes';
    var party = 0, extras = [], kids = 0;
    if (yes) {
      party = parseInt(d.partySize, 10);
      if (!(party >= 1)) return json_({ ok: false, error: 'Please enter the number of guests.' });
      if (party > max) return json_({ ok: false, error: 'Your invitation allows up to ' + max + ' guest' + (max === 1 ? '' : 's') + ' (including you).' });
      kids = childrenInvited ? Math.max(0, parseInt(d.children, 10) || 0) : 0;
      if (kids > party - 1) return json_({ ok: false, error: 'Number of children is more than your party allows.' });
      var expected = party - 1 - kids;
      extras = (Array.isArray(d.additionalGuests) ? d.additionalGuests : []).slice(0, 20).map(function (n) { return clean_(n, 100); }).filter(String);
      if (extras.length !== expected) return json_({ ok: false, error: 'Please enter the name of each additional guest.' });
    }

    // --- save (update if same name+code already replied) ---
    var sheet = sheet_('RSVPs', HEADERS);
    var now = new Date();
    var row = [now, '', name, code, yes ? 'Yes' : 'No', party, extras.join('; '), kids,
      yes ? clean_(d.childrenDetails, 300) : '', yes ? clean_(d.dietary, 300) : '', yes ? clean_(d.allergies, 300) : '',
      yes ? clean_(d.accessibility, 300) : '', clean_(d.message, 600), clean_(d.song, 120)];
    row = row.map(safeCell_);

    var key = name.toLowerCase() + '|' + code.toLowerCase(), updated = false;
    var last = sheet.getLastRow();
    if (last > 1) {
      var vals = sheet.getRange(2, 1, last - 1, 4).getValues();
      for (var i = 0; i < vals.length; i++) {
        if (String(vals[i][2]).toLowerCase() + '|' + String(vals[i][3]).toLowerCase() === key) {
          row[0] = vals[i][0]; row[1] = now;
          sheet.getRange(i + 2, 1, 1, row.length).setValues([row]);
          updated = true; break;
        }
      }
    }
    if (!updated) sheet.appendRow(row);
    SpreadsheetApp.flush();
    cache.put(rlKey, '1', 60);
    return json_({ ok: true, updated: updated });
  } catch (err3) {
    console.error(err3);
    return json_({ ok: false, error: 'Something went wrong while saving. Please try again.' });
  } finally {
    lock.releaseLock();
  }
}

/* ---------- helpers ---------- */
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
function clean_(v, maxLen) {
  return String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f]+/g, ' ').trim().slice(0, maxLen);
}
// Stop spreadsheet formula injection: text starting with = + - @ is stored as plain text.
function safeCell_(v) {
  return (typeof v === 'string' && /^[=+\-@]/.test(v)) ? "'" + v : v;
}
function sheet_(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet(), sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.appendRow(headers); sh.setFrozenRows(1); }
  return sh;
}
function lookupInvitation_(code) {
  if (!code) return null;
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Invitations');
  if (!sh || sh.getLastRow() < 1) return null;
  var vals = sh.getRange(1, 1, sh.getLastRow(), 2).getValues();
  for (var i = 0; i < vals.length; i++) {
    if (String(vals[i][0]).trim().toLowerCase() === code.toLowerCase()) {
      var m = parseInt(vals[i][1], 10);
      if (m >= 1) return { max: m };
    }
  }
  return null;
}

/* ---------- song requests (separate form on the website) ---------- */
function handleSong_(d) {
  if (d.website) return json_({ ok: true });
  if (typeof d.elapsedMs === 'number' && d.elapsedMs < 2000) return json_({ ok: false, error: 'That was very quick - please try again.' });
  var name = clean_(d.name, 100), song = clean_(d.song, 120);
  if (name.length < 2) return json_({ ok: false, error: 'Please enter your name.' });
  if (song.length < 2) return json_({ ok: false, error: 'Please enter a song.' });
  var maxPer = parseInt(PropertiesService.getScriptProperties().getProperty('MAX_SONGS_PER_GUEST') || '3', 10);
  var sh = sheet_('Songs', ['Received', 'Name', 'Song']), last = sh.getLastRow(), count = 0, dup = false;
  if (last > 1) {
    sh.getRange(2, 2, last - 1, 2).getValues().forEach(function (r) {
      if (String(r[0]).toLowerCase() === name.toLowerCase()) {
        count++;
        if (String(r[1]).toLowerCase() === song.toLowerCase()) dup = true;
      }
    });
  }
  if (dup) return json_({ ok: true });
  if (count >= maxPer) return json_({ ok: false, error: "You've already requested " + maxPer + ' songs - thank you!' });
  sh.appendRow([new Date(), safeCell_(name), safeCell_(song)]);
  SpreadsheetApp.flush();
  return json_({ ok: true });
}
