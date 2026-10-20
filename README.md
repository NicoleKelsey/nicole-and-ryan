# Nicole & Ryan - Wedding Website

Saturday, 18 September 2027 · Kirkwood, Eastern Cape

A lightweight, free-to-host wedding website. Plain HTML, CSS and JavaScript - **no build step, no dependencies**.
See [CHECKLIST.md](CHECKLIST.md) for what you still need to fill in.

## Why this stack
- **Single page, static files.** GitHub Pages serves them exactly as they are. Navigation is smooth-scroll anchors (`#story`, `#faq`…), so there are no per-page path problems at `username.github.io/repository/`.
- **Relative paths everywhere** (`css/styles.css`, `js/main.js`) - works at any sub-path, so there is no base-path setting to configure.
- **One config file** (`js/config.js`) holds all content; nothing else needs editing.
- Only external request: Google Fonts (Cormorant Garamond, Jost, Pinyon Script) with system-font fallbacks. Delete the two `fonts.*` `<link>` lines in `index.html` if you'd rather have none.

## Folder structure
```
wedding-website/
├── index.html            Page skeleton (content is filled in from config.js)
├── 404.html              Custom "page not found"
├── css/styles.css        All styling; colours are variables at the top
├── js/
│   ├── config.js         ★ EDIT THIS - all wedding information
│   ├── main.js           Renders sections, countdown, FAQ, gallery, navigation
│   ├── rsvp.js           RSVP form, validation and submission
│   ├── songs.js          Song request form
│   └── magic.js          Falling petals and tap/celebration effects
├── assets/
│   ├── favicon.svg       N&R monogram
│   └── images/           ★ Put your photographs here
├── apps-script/Code.gs   RSVP backend (runs on Google, NOT published on the site)
├── .github/workflows/pages.yml   Deployment (publishes only the website files)
├── CHECKLIST.md          What you still need to provide
└── README.md
```

## Updating the content
1. Open `js/config.js` in any text editor (Notepad is fine).
2. Change values between the quotes. `null` means "not confirmed" and the site shows "To be confirmed".
3. Save, then refresh the page in your browser. To preview locally just double-click `index.html`.
4. To publish the change see "Updating later" below.

Add/remove/reorder: FAQ entries, schedule items, accommodation cards, announcements, gallery photos and story timeline entries are all lists - copy or delete a `{ ... },` block.

## Replace the placeholder photographs
1. Copy your images into `assets/images/` (JPG, ≤1920px wide, ideally <400 KB; compress at squoosh.app; no spaces in names).
2. In `config.js` set e.g. `images.hero: "assets/images/hero.jpg"` and, for the gallery, `src`, `alt` (describe the photo for screen readers) and `caption`.
3. Missing/misspelled files show an elegant placeholder, never a broken icon. Gallery photos open in a keyboard-accessible lightbox.

---

## Set up RSVP (required before sharing)

GitHub Pages is static: it **cannot** store RSVPs. Until you finish this, the form is visibly closed ("RSVPs are not open yet") and can never claim a response was saved.

### What I chose: Google Apps Script + a private Google Sheet
| | |
|---|---|
| **Cost** | Free with any Google account |
| **Advantages** | You own the data in a private Sheet; no secrets in the website; server-side validation, guest-limit enforcement, spam checks and duplicate handling (a repeat submission with the same name *updates* the earlier row); easy to view/export |
| **Limitations** | Slightly slow (1–3 s); Google daily quotas (ample for ~100 guests); no automatic email notifications unless you add them (optional: Sheet → *Tools → Notification rules*); the web-app URL is public by nature, so protection is by validation/rate-limiting, not secrecy; guests can't verify who they are unless you use invitation codes |
| **Alternatives** | Formspree / Web3Forms (simpler, but free tiers cap submissions and can't enforce your guest limits server-side) |

### Steps
1. Sign in to Google and create a new **Google Sheet** (name it "Wedding RSVPs"). Keep it private - do not share it publicly.
2. In the Sheet: **Extensions → Apps Script**. Delete the sample code and paste the whole of `apps-script/Code.gs`. Save.
3. **Project Settings (gear icon) → Script Properties → Add**:
   - `DEFAULT_MAX_GUESTS` = e.g. `2` (must match `maxGuestsPerInvitation` in `config.js`)
   - `CHILDREN_INVITED` = `true` or `false` (match `childrenInvited`)
   - `REQUIRE_CODE` = `false` (see codes below)
   - `MAX_SONGS_PER_GUEST` = `3` (song requests per name; match `songs.maxPerGuest`)
   - `RSVP_DEADLINE_ISO` = optional, e.g. `2027-06-30T23:59:59+02:00` - the server refuses late replies
4. **Deploy → New deployment → type: Web app**. Execute as: **Me**. Who has access: **Anyone**. Authorise when asked (Google may show an "unverified app" warning - it's your own script; choose Advanced → Continue).
5. Copy the **Web app URL** (ends in `/exec`) and paste it into `config.js` → `rsvp.endpoint`.
6. Open your site, submit a test RSVP, and confirm a row appears in the Sheet's `RSVPs` tab. Delete the test row.
7. Whenever you change `Code.gs`, use **Deploy → Manage deployments → Edit → New version** (the URL stays the same).

**Per-invitation limits (optional):** create a sheet tab named `Invitations` with column A = code (e.g. `SMITH24`), column B = max guests. Set `REQUIRE_CODE` = `true` and `requireInvitationCode: true` in `config.js`. Each code's own limit is then enforced **on the server**. Without codes, the single limit applies to everyone, and the server rejects any request over it.

### Privacy: public vs private
- **Public:** everything in `config.js`, the site files, and the Apps Script *URL*.
- **Private:** all guest responses (only in your Google Sheet), the Script Properties, and `Invitations` codes. No guest data exists in the repository. `.gitignore` blocks `*.csv`/`*.xlsx` exports from being committed.
- `apps-script/` is excluded from the published site by the workflow. No API keys or tokens are used anywhere.
- The privacy notice on the site describes exactly this setup. If you change service, update `privacy` in `config.js`.

### Song requests
Guests can suggest a song in the RSVP form and in the separate **Request a song** section. They are saved in your private Sheet (`Song request` column and a `Songs` tab). Turn the section off with `songs.enabled: false` in `config.js`. If you already deployed an older `Code.gs`, paste the new one and create a **New version** of the deployment.

### Atmosphere
`effects.petals` and `effects.tapBurst` in `config.js` control the falling petals and tap hearts. Guests can switch petals off with the flower button, and visitors with reduced-motion settings never see them.

---

## Deploy to GitHub Pages (free)

### 1. Prerequisites
A web browser and a free GitHub account. Git is optional (you can upload through the website).

### 2. Create a GitHub account
Go to <https://github.com/signup>, enter your email, choose a password and username, verify. Your username becomes part of your URL.

### 3. Create a repository
Click **+ → New repository**. Name it e.g. `nicole-and-ryan` (this name becomes part of the URL). Choose **Public** (required for free Pages on personal accounts). Don't tick "Add a README". Create.

> A public repo means your files are public: **never** put guest lists, phone numbers or passwords in it.

### 4. Add the files - choose one
**A. Upload in the browser (easiest):** on the empty repo page click **uploading an existing file**, drag in *the contents of the `wedding-website` folder* (so `index.html` is at the top level; include the hidden `.github` folder if your computer lets you - otherwise use option B or the "Deploy from a branch" route below), and **Commit changes**.

**B. Git (recommended):** in a terminal, inside the `wedding-website` folder:
```bash
git init -b main
git add .
git commit -m "Wedding website"
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

### 5. Publish
Repository → **Settings → Pages → Build and deployment → Source: GitHub Actions** (uses the included `pages.yml`).
*No hidden-folder access?* Choose **Deploy from a branch → main → / (root)** instead. (Then `apps-script/` and `.md` files are published too; they contain no secrets, but you can delete the `apps-script` folder from the repo after setting up RSVP.)

### 6. Base path
Nothing to configure: every path is relative. Just put your final address in `site.publicUrl` in `config.js` (used for social previews).

### 7. Check it deployed
- Repository → **Actions** tab: the latest run shows a green tick.
- Your site is at `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/` (also shown in Settings → Pages). First deploy takes ~1–3 minutes.
- Check: styles load, countdown ticks, nav links scroll, RSVP form is open (once configured).

### 8. Updating later
Edit `js/config.js` (the pencil icon on GitHub works, or edit locally) → commit. With Git:
```bash
git add .
git commit -m "Update venue details"
git push
```
The site republishes automatically within a few minutes.

---

## Troubleshooting
| Problem | Fix |
|---|---|
| Site shows 404 | Wait a few minutes; confirm Pages source is set and the repo is public; the URL must include `/YOUR-REPOSITORY/` |
| No styling / blank page | `index.html` must be at the repository's top level (not inside another folder) |
| Changes don't appear | Check the Actions tab for a green run, then hard-refresh (Ctrl+F5) |
| Photo not showing | Check the exact filename and capitals in `config.js` vs `assets/images/` |
| Page blank and `config.js` edited | A missing quote/comma. Open the browser console (F12) to see the error line |
| RSVP says "not open yet" | `rsvp.endpoint` is empty or isn't the `…/exec` URL |
| RSVP says "couldn't reach the service" | Re-deploy as Web app with access **Anyone**; paste the newest `/exec` URL |
| RSVP says "invitation allows up to N" | Guest limit reached - raise it in both `config.js` and Script Properties |
| Countdown wrong | It targets `2027-09-18T00:00:00+02:00` (start of the day, SAST) - edit `wedding.startsAtIso` only if the date changes |

## Notifications
No automated email/SMS system is included (these usually cost money or need paid accounts). Free option: post an announcement in `config.js`, or use the Sheet's built-in notification rules to email you when someone RSVPs.

## Accessibility & features
Semantic HTML, skip link, visible focus, keyboard-accessible menu/FAQ/lightbox (Esc, arrow keys), labelled form fields with `aria-invalid` errors, reduced-motion support, lazy-loaded images with graceful fallbacks, print-friendly details (button in *Wedding Details*), 404 page, favicon and share metadata.

## Opening animation & share preview
- **Envelope intro:** guests tap the wax seal to open the invitation (set in `config.js` under `intro`: `replay: "always"` shows it on every page load, `"session"` only once per visit, and `enabled: false` hides it). It's skipped for visitors who prefer reduced motion, and everyone can press *Skip* or `Esc`. Add `?nointro` to the web address to bypass it while you're editing. The names, date and venue on the letter come from `config.js`.
- **Link preview (WhatsApp, Facebook, etc.):** the preview picture is `assets/share.jpg` and the tags are fixed in `index.html` (they point at `https://nicolekelsey.github.io/nicole-and-ryan/`). To change the picture, replace `assets/share.jpg` (1200×630). **WhatsApp remembers old previews**, so after publishing share the link with `?v=2` on the end to force a fresh preview.
