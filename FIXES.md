# mitchell525.github.io — Fix List

Generated from a live audit of `https://mitchell525.github.io/` on 2026-09-06.
Source: Jekyll site deployed to GitHub Pages (`jekyll-seo-tag`, `jekyll-sitemap`, `jekyll-feed`).

Re-reviewed 2026-09-06 against the local (unpushed) working tree — two commits
ahead of `origin/master`. Items confirmed already fixed in the local tree were
removed; everything below is still live in the checked-out code. See the
"Already fixed since the audit" section at the bottom for what was cut and why.

**How to use this file:** work top to bottom — items are ordered by payoff.
Layouts live in `_layouts/*.html`, shared partials in `_includes/*.html`,
per-app content in `_data/apps.yml` + `_apps/*.md`.

---

## Priority 1 — Image delivery (do first, biggest win)

Root cause of everything in this group: full-resolution App Store PNGs are
served straight to the browser, all at once, with no dimensions declared.

- [x] **IMG-1 — Critical: Add `loading="lazy"` to below-the-fold images** —
  Fixed. `_layouts/app.html` screenshot gallery already had `loading="lazy"`.
  Added `loading="lazy" decoding="async"` to the homepage (`index.html`) app
  icons (`.app-icon`) and screenshots (`.screenshot-image`), and to the
  footer (`_includes/footer.html`) brand icon. Hero profile photo, hero icon,
  and navbar logo left eager (above the fold).

- [x] **IMG-2 — Critical: Resize source images to display size, convert to WebP**
  Fixed. Ran a one-off `sharp` pass (installed only in a scratch dir, not
  added to this repo's `package.json`/`node_modules` — no new build
  dependency) over every image actually referenced from a template, `_data/apps.yml`,
  an `_apps/*.md`/`_posts/*.md` front-matter `image:` field, or `_includes/footer.html`
  / `pages/about.html` / `pages/legal.html`: 59 files, `img/` 71 MB → 19 MB.
  Chose WebP-only (no `<picture>`/PNG fallback — ~99% browser support makes the
  extra markup and duplicate files not worth it) and replaced originals outright
  (recoverable via git history, not kept alongside).

  Two deliberate deviations from the sizes suggested above, both because this
  site's lightbox (`_includes/lightbox-modal.html`) displays the *same* file up
  to `90vh`/`90vw`, and several first-in-list screenshots (e.g.
  `cd_changer1.webp`, `avatarforgeai/1.webp`) double as `og:image` via
  front-matter `image:` — both uses need more headroom than the raw gallery
  thumbnail size:
  - Icons → fit inside 512×512 (not 256) — `_apps/*.md`/`apps.yml` icon fields
    and `img/icons/ms_home_icon.png`.
  - Screenshots/photos (app screenshots, blog post images/screenshots, profile
    photo) → fit inside 1600×1600, long edge — not ~500px.

  All resizing uses `fit: inside` + `withoutEnlargement`, so already-small
  sources (e.g. the 450×900 game-app screenshots) were only reformatted, not
  upscaled. `sharp` quality: 85 for icons, 82 for photos.

  Left untouched (out of scope for this item): `img/appstore/*.svg` (vector,
  not the problem), `img/icons/material/*` + the misnamed favicon file (see
  HEAD-3), and files that aren't referenced by any page — `img/tripstickers/trip_stickers_preview_{4,5,6}.png`
  and `img/profile/mitch_smith_icon.png` — since nothing serves them to a
  browser today; a future dead-asset cleanup pass can decide whether to delete
  or wire them up.

- [x] **IMG-3 — High: Add explicit `width`/`height` to every `<img>`**
  Fixed. Measured real pixel dimensions of every resized WebP with `sips`
  and added `icon_width`/`icon_height`/`screenshot_width`/`screenshot_height`
  fields per app in `_data/apps.yml` (dimensions vary per app — icons
  501–512px, screenshots either 739×1600, 736×1600, or 450×900 depending on
  source). Wired those into the `<img>` tags in `index.html`,
  `_layouts/app.html`, and `pages/legal.html`. Added real dimensions
  (512×512 icon, 1000×1000 profile photo) to the static brand-icon/
  profile-image `<img>`s in `index.html`, `pages/about.html`,
  `pages/legal.html`, and `_includes/footer.html`. Left the existing
  `width="80"`/`width="64"` icon attributes in `_layouts/post.html`,
  `_layouts/legal.html`, and `blog/index.html` alone — those classes set
  explicit CSS px sizes with `object-fit: cover`, so the attribute value
  only needs to be square (1:1), which it already is; not part of this
  item's "still missing" list. **Verify:** `bundle exec jekyll build` + spot
  check with `grep -n 'width=' _site/cdchanger/index.html` (done locally —
  512×512 icon, 739×1600 screenshots all present).

- [x] **IMG-4 — High: Fix the lightbox's empty `src`** — Fixed. Removed the
  empty `src=""`/`alt=""` attributes from `_includes/lightbox-modal.html`.
  `js/mitchell525.js`'s `openLightbox`/`closeLightbox` (already present)
  set `.src`/`.alt` on open and `removeAttribute('src')` on close, so no JS
  change was needed. **Verify:** open a screenshot lightbox on an app page
  and confirm the image loads/closes cleanly (not re-tested in a real
  browser here — build succeeds and the JS logic was already attribute-safe).

---

## Priority 2 — Crawling & indexing

- [x] **IDX-2 — High: Redirect stub has a relative canonical, isn't in the sitemap allowlist correctly** — Fixed.
  Added `sitemap: false` to `pockettravelplanner/index.html`'s front matter
  (confirmed with `bundle exec jekyll build` — `grep -c pockettravelplanner
  _site/sitemap.xml` now returns 0) and changed the canonical to the
  absolute form (`https://mitchell525.github.io/pockettripplanner/`) to
  match every other page. Left the meta-refresh mechanism as-is rather than
  swapping in `jekyll-redirect-from` — that would add a new Gemfile
  dependency, and this repo's custom plugin behavior on the live GitHub
  Pages safe-mode build is already flagged as unconfirmed elsewhere in this
  file, so a new plugin's live behavior would need the same live-build
  verification before relying on it. **Worth a follow-up if you want a real
  redirect, but not done here.**

- [x] **IDX-3 — High: Internal links go through a 301 (missing trailing slash)** — Fixed.
  `index.html` app-card titles now link to `/{{ app.slug }}/`, and
  `_includes/footer.html`'s `/pages/legal`/`/pages/about` links now carry
  the trailing slash (the navbar's `contains` active-state checks weren't
  actually broken — those are substring checks on `page.url`, not hrefs, and
  the navbar's own hrefs already had trailing slashes). Also fixed one more
  instance of the same bug not called out here: `_layouts/legal.html`'s
  breadcrumb fallback linked to the literal `/pages/legal.html`, which
  doesn't exist under this site's `permalink: pretty` config (the page
  actually serves at `/pages/legal/`) — changed to `/pages/legal/`.
  **Verify:** `bundle exec jekyll build` then
  `grep -rhoE 'href="/(pages/[a-z]+|blog|[a-z0-9]+)"' _site` — confirmed
  empty (no more no-slash internal hrefs in the built output).

- [x] **IDX-4 — High: Four pages share one identical `<meta name="description">`** — Fixed.
  Added a unique `description:` front-matter field to `index.html`,
  `blog/index.html`, `pages/about.html`, and `pages/legal.html`, matching
  the pattern already used on app pages. **Verify:** built and confirmed
  each of `/`, `/blog/`, `/pages/about/`, `/pages/legal/` now renders a
  distinct `<meta name="description">` — worth also reading the copy back
  to make sure the wording matches how you'd want each page described in
  search results.

- [x] **IDX-5 — Advisory: no `robots.txt` source file at all; no custom 404** — Fixed.
  Added `robots.txt` at the repo root (allow-all + sitemap pointer, as
  specified). Added `404.html` using `layout: default` (so nav/footer
  render) with `permalink: /404.html`, `robots: "noindex, follow"`, and
  `sitemap: false`. **Verify after deploy** — confirm
  `https://mitchell525.github.io/robots.txt` and
  `https://mitchell525.github.io/404.html` are actually served live (GitHub
  Pages needs `404.html` at the repo root with that literal path to use it
  as the custom error page, and this repo already overrides pretty
  permalinks explicitly for it, but it's worth a post-deploy check that a
  broken URL actually renders this page instead of GitHub's default 404).

---

## Priority 3 — Shared layout / markup & ARIA conformance

- [x] **DOM-1 — High: Nested `<footer>` elements + unbalanced `</div>`** — Fixed.
  `_layouts/default.html` now includes `_includes/footer.html` directly
  (dropped the outer `<footer role="contentinfo">` wrapper), so there's a
  single `<footer class="ms-footer-modern">` landmark. Also deleted the
  stray extra `</div>` in `_includes/footer.html` (it was closing nothing —
  `.container` was already closed earlier and `.footer-bottom` was already
  balanced). **Verify:** built and confirmed `<footer` and `</footer>` each
  appear exactly once in the built homepage, and div open/close counts
  match (175/175).

- [x] **DOM-3 — Advisory: redundant landmark roles remain (skip link is done)** — Fixed.
  Removed `role="banner"` from `<header>` and `role="main"` from `<main>`
  in `_layouts/default.html`, and `role="navigation"` from `<nav>` in
  `_includes/navbar.html` — all implicit on those elements already.
  `role="contentinfo"` on `<footer>` was already removed as part of DOM-1.
  **Verify:** built and confirmed none of `role="banner"`, `role="main"`,
  `role="navigation"`, `role="contentinfo"`, `role="document"` appear
  anywhere in the built homepage.

---

## Priority 4 — App structured data

- [x] **APP-1 — High: No `aggregateRating` in any `SoftwareApplication` JSON-LD**
  Fixed. Pulled real, currently-live numbers from each app's public App
  Store listing (not App Store Connect/Play Console — no login access to
  those; the star rating and rating count Apple displays on the public
  listing page are the same underlying numbers and don't require auth) on
  2026-09-06. Added `rating_value`/`rating_count` fields to `_data/apps.yml`
  for the three apps with a rating sample worth publishing, and made
  `_includes/app-schema.html` emit `aggregateRating` only when both fields
  are present:
  - `pinballoverdrive` — 4.6, 46 ratings
  - `pinfinitesmash` — 4.3, 10 ratings
  - `pinballdefenseforce` — 4.8, 13 ratings

  Deliberately **not** added for the other 9 apps:
  - `pockettripplanner` (5.0/2), `tripstickers` (5.0/2), `dizzyfrog` (5.0/3)
    — Apple does display these publicly, but a 2–3 rating sample is too
    thin to be a meaningful `aggregateRating` and risks reading as
    manipulated to Google; skipped per this item's own "skip rather than
    invent" guidance, treating "enough ratings" as the bar rather than
    "any number Apple happens to show."
  - `cdchanger` — App Store explicitly states it hasn't received enough
    ratings to display an overview; no number exists to pull.
  - `avatarforgeai`, `tapandteleport`, `surgeblast`, `bounceandbound`,
    `shiftandshatter` — no longer have a live App Store listing at all (see
    new **LINK-1** below); nothing to pull.

  **Verify:** `bundle exec jekyll build` then confirmed via a small script
  parsing each `_site/<slug>/index.html`'s JSON-LD that the three apps above
  render a well-formed `aggregateRating` block with these exact values and
  that all 12 app pages' `SoftwareApplication` JSON-LD still parses cleanly
  (no syntax breakage from the new conditional). Worth re-pulling these
  numbers periodically — they'll drift as new ratings come in.

- [x] **APP-3 — Advisory: page titles overflow the SERP; homepage repeats the site name** — Fixed.
  | Page | New title (front matter) |
  |---|---|
  | `pages/legal.html` | `Legal Documents & Policies` |
  | `_apps/pinballdefenseforce.md` | `Pinball Defense Force — 2D Pinball Defense Game` |
  | `_apps/pockettripplanner.md` | `Pocket Trip Planner — Simple Trip Planning` |
  | `index.html` | `Software Engineer & App Developer` (was the full "Mitch Smith — ..." string, which `jekyll-seo-tag` then duplicated with its auto-appended site name) |

  **Verify:** built and confirmed the rendered `<title>` tags —
  `Software Engineer & App Developer \| Mitch Smith` (66 chars, no more
  duplication), `Legal Documents & Policies \| Mitch Smith` (59),
  `Pinball Defense Force — 2D Pinball Defense Game \| Mitch Smith` (76),
  `Pocket Trip Planner — Simple Trip Planning \| Mitch Smith` (71) — all
  shorter than before, though the two app titles are still on the long
  side; worth a look if you want them tighter still.

---

## Priority 0 — Broken store links (discovered and resolved 2026-09-06)

- [x] **LINK-1 — Critical: every `android_url` in `apps.yml` 404s; 5 apps are gone from the App Store entirely**
  Fixed 2026-09-06, per explicit direction: the Android links are confirmed
  gone from Google Play (not a temporary blip), so all 8 `android_url`
  values were set to `null` in `_data/apps.yml`
  (`pinballoverdrive`, `pinfinitesmash`, `pinballdefenseforce`, `dizzyfrog`,
  `tapandteleport`, `surgeblast`, `bounceandbound`, `shiftandshatter`).
  Both `index.html` and `_layouts/app.html` already gate the "Get it on
  Google Play" badge on `{% if app.android_url %}`, and
  `_includes/app-schema.html` gates `operatingSystem`/`downloadUrl`'s
  Android entry the same way, so nulling the field was enough — no template
  changes needed. `avatarforgeai` (iOS listing also gone) was marked
  `legacy: true` in `_data/apps.yml`, matching the other four delisted
  games; both `index.html` and `_layouts/app.html` wrap the entire
  store-buttons block in `{% unless app.legacy %}`, so this fully hides its
  (dead) download button without needing to touch `ios_url`.

  **Verify:** `bundle exec jekyll build`, confirmed
  `grep -rl "google-play-badge" _site/` returns nothing site-wide,
  `avatarforgeai/index.html` renders zero `store-button` elements, and
  `pinballoverdrive`'s JSON-LD now reports `"operatingSystem": ["iOS"]` with
  a `downloadUrl` containing only the App Store link. All 12 app pages'
  `SoftwareApplication` JSON-LD still parses cleanly.

  **Follow-up (also done 2026-09-06):** the residual dead `ios_url`s were
  cleaned up too. Nulled `ios_url` in `_data/apps.yml` for the four apps
  confirmed 404 on iOS as well as Android — `avatarforgeai`,
  `tapandteleport`, `surgeblast`, `bounceandbound`, `shiftandshatter` —
  leaving `dizzyfrog` alone since its iOS listing is still live
  (4.6★/3 ratings). This exposed a latent bug in
  `_includes/app-schema.html`: `operatingSystem` was hardcoded to always
  include `"iOS"` regardless of whether `app.ios_url` was actually set (it
  only branched on `android_url`), which would have kept asserting an iOS
  release for these five apps even with both URLs null. Fixed
  `operatingSystem` to build from `app.ios_url`/`app.android_url` the same
  way `downloadUrl` already did, and to omit the field entirely (like
  `downloadUrl` already does) when neither URL is set.

  **Verify:** rebuilt and confirmed via a script parsing every
  `_site/<slug>/index.html`'s JSON-LD that `avatarforgeai`, `bounceandbound`,
  `shiftandshatter`, `surgeblast`, and `tapandteleport` now omit both
  `operatingSystem` and `downloadUrl` entirely; the other 7 apps (including
  `dizzyfrog`, iOS-only) are unaffected and still report
  `"operatingSystem": ["iOS"]` with their real App Store `downloadUrl`. All
  12 pages' JSON-LD still parses, and all five delisted apps render zero
  `store-button` elements on their page (legacy flag already handled that).

---

## Priority 5 — Head, sharing & security cleanup

- [x] **HEAD-1 — High: No `og:image` on homepage, blog, about, or legal pages** — Fixed.
  Generated a real 1200×630 `img/social/og-default.png` (a grid of 8 app
  icons over "Mitch Smith — Software Engineer & App Developer", built with
  Pillow from the already-resized app icons — Pillow used only as a
  scratch/one-off tool, not added as a project dependency). Added it as a
  site-wide fallback via `_config.yml`'s `defaults` (`scope: path: ""`).
  **Verify:** built and confirmed `/`, `/blog/`, `/pages/about/`, and
  `/pages/legal/` now render `og:image` pointing at the new file; app pages
  (e.g. `/cdchanger/`) keep their own per-page screenshot image, unaffected
  by the new default (front matter takes precedence over site defaults).
  Also worth pasting a homepage/app-page URL into the Facebook and Twitter
  card debuggers once deployed, per the verification checklist below.

- [x] **HEAD-2 — Advisory: security meta tags do less than they appear to** — Mostly fixed.
  In `_layouts/default.html`: deleted the no-op
  `X-XSS-Protection` meta tag; removed `code.jquery.com` and
  `cdnjs.cloudflare.com` from the CSP `script-src` and dropped their
  `dns-prefetch` hints (confirmed via repo-wide grep that neither host is
  actually referenced by any page); added
  `<meta name="referrer" content="strict-origin-when-cross-origin">`.
  **Not done** (explicitly called out as longer-term in the original
  finding): the inline Google Analytics bootstrap in `<head>` still needs
  `script-src 'unsafe-inline'` — moving it to `/js/` to drop that directive
  is a separate, more invasive change and wasn't attempted here. **Verify:**
  built and confirmed the CSP/referrer meta tags render as expected on the
  homepage.

- [x] **HEAD-3 — Advisory: filenames with spaces on brand assets; wrong touch-icon size** — Fixed.
  Generated `img/icons/material/icon-192.png` (real 192×192, downscaled
  from the 769×769 `...4xxxhdpi.png` source — the old "2mdpi" file this
  replaces was actually only 144×144 despite its name) and a real 180×180
  `apple-touch-icon-180.png`, both from the same high-res source so neither
  was upscaled. Removed the old `ic_material_product_icon_192px copy
  2mdpi.png` (git-tracked deletion, recoverable via history). Updated the
  three references: favicon link and `apple-touch-icon` link in
  `_layouts/default.html`, and the JSON-LD publisher `logo:` in
  `_config.yml`. Added `site.webmanifest` (referencing `icon-192.png`) and
  linked it with `<link rel="manifest">`. Left the navbar's own logo image
  (`...4xxxhdpi.png`, still has a space in its filename) untouched — it
  wasn't one of the three references called out here, and renaming it is a
  separate cleanup. **Verify:** built and confirmed all three references
  plus `/site.webmanifest` render correctly.

- [x] **HEAD-4 — Advisory: Atom feed exists but isn't linked; footer year is stale** — Fixed.
  Added `{% feed_meta %}` inside `<head>` in `_layouts/default.html`.
  Changed the footer copyright to
  `&copy; {{ site.time | date: "%Y" }} Mitchell Smith. All rights reserved.`
  **Verify:** built and confirmed the built homepage now has a
  `<link type="application/atom+xml" rel="alternate" href=".../feed.xml">`
  tag and the footer renders "© 2026" (today's build date).

---

## Resolved — appears intentional, not a bug (verify before re-closing)

- **IDX-1 (was: six app pages missing from sitemap)** — `avatarforgeai`,
  `bounceandbound`, `dizzyfrog`, `shiftandshatter`, `surgeblast`,
  `tapandteleport` all now carry `robots: "noindex, follow"` +
  `sitemap: false` in their `_apps/*.md` front matter. This lines up exactly
  with `legacy: true` (four of them) / `hidden_from_home: true`
  (avatarforgeai) in `_data/apps.yml` — reads as a deliberate decision to
  deindex old/hidden apps, not an accidental omission. **If that wasn't the
  intent, this needs re-opening** — right now Google will drop these pages
  from search entirely, not just from the sitemap.

- **APP-2 (was: six app descriptions run 2× the SERP truncation length)** —
  same six apps as IDX-1 above, same root cause. Since they're `noindex`,
  Google won't generate a search snippet for them at all, so trimming these
  descriptions for SERP length is moot unless IDX-1 gets reversed.

---

## What's already correct — do not "fix" these

- Zero broken links or assets across all pages crawled; no console errors.
- Every image on the homepage has a descriptive `alt` attribute.
- Exactly one `<h1>` per page; no skipped heading levels.
- Canonicals are absolute and self-referential on every real page (except
  the `pockettravelplanner` redirect stub — see IDX-2); `lang="en"` set; no
  duplicate `id`s.
- `applicationCategory` correctly differentiated per app
  (`GameApplication`, `TravelApplication`, `UtilitiesApplication`,
  `DesignApplication`), `operatingSystem` correctly lists Android only where
  a Play Store link actually exists.
- `BreadcrumbList` JSON-LD on all 12 app pages; every JSON-LD block parses
  without error.
- All external store links carry `rel="noopener"`; Bootstrap loaded with SRI
  hashes (now 5.3.8 / Icons 1.13.1).
- Consent Mode v2 correctly implemented — analytics denied by default, ad
  storage never granted, `allow_google_signals: false`.
- Nav ARIA (`role="menubar"`/`menuitem`/`none`) removed; `aria-current` is
  now always a valid token (`"page"` or `"false"`), never empty.
- Cookie-preferences control is a real `<button>`, not a link to `#`.

---

## Verification checklist (run after each priority group)

- [ ] Homepage total transfer size (DevTools Network tab, disable cache) —
      target under 3 MB after Priority 1.
- [ ] `curl -s https://mitchell525.github.io/sitemap.xml | grep -c '<loc>'`
      — confirm count matches indexable pages after IDX-2/IDX-4 changes
      (14, unless IDX-1 gets reversed).
- [ ] Validate a sample page at https://validator.w3.org/nu/ once
      accessible — 0 errors on `/` and one app page after DOM-1/DOM-3.
- [ ] Re-fetch `/`, `/blog/`, `/pages/about/`, `/pages/legal/` and confirm
      four distinct `<meta name="description">` values after IDX-4.
- [ ] Paste a homepage and app-page URL into
      https://developers.facebook.com/tools/debug/ and
      https://cards-dev.twitter.com/validator to confirm `og:image` renders
      after HEAD-1.
- [ ] Confirm `robots.txt` and `404.html` are actually live post-deploy
      after IDX-5 (this repo currently has neither as a source file).
