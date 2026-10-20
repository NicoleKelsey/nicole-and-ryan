# Information still needed

Everything below is currently a placeholder ("To be confirmed"). Update `js/config.js` as each item is decided.

**Before sharing the site (essential)**
- [ ] Set up the RSVP backend (README → "Set up RSVP") and paste the endpoint into `rsvp.endpoint`
- [ ] Decide `maxGuestsPerInvitation`, and whether children are invited (`childrenInvited`); keep the same values in the Apps Script *Script Properties*
- [ ] Contact name + email (and WhatsApp number/link, optional)
- [ ] Your real GitHub address in `site.publicUrl` (for share previews)

**Wedding details**
- [x] Venue (Annerkant Venue, H9RW+F3, Nqweba) and Google Maps link are set
- [ ] Ceremony location / reception location (if different)
- [ ] Guest arrival, ceremony, reception and finish times
- [ ] Dress code, parking, accessibility, weather plan, guest instructions
- [ ] RSVP deadline
- [ ] Confirmed schedule times (then set `schedule.confirmed: true`)

**Travel & accommodation**
- [ ] Accommodation: ten places are listed (all with photos and booking links). Still to add where known: distances from the venue, contact numbers and confirmed prices
- [ ] Travel advice, transport arrangements (shuttles etc.)

**Content & photos**
- [ ] Hero photograph, story photograph, gallery photographs with captions/alt text
- [ ] Our story text (how you met, first date, journey, milestones, proposal) and message to guests
- [ ] FAQ answers (currently "to be confirmed")
- [ ] Gift registry / honeymoon links (never put bank details on the site unless you decide to)
- [ ] Privacy: confirm the retention period in `privacy.retention` (default: delete within 90 days after the wedding)
- [ ] Announcements as plans firm up (venue confirmation, RSVP reminders, etc.)
