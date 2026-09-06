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

- [ ] **IMG-2 — Critical: Resize source images to display size, convert to WebP**
  Still unfixed — `img/` is 60 MB, zero `.webp` files in the repo. Confirmed
  still oversized:
  - `img/cdchanger/icon.png` — 1024×1024, 2.5 MB, shown at ~120px
  - `img/tapandteleport/icon.png` — 1501×1501, shown at ~120px
  - `img/tripstickers/trip_stickers_preview_1.png` — 1320×2868, 1.7 MB, shown at ~230px
  - `img/profile/profile_photo-01.png` — 1000×1000, 1.4 MB, shown at ~340px

  Action: resize at build time, not in CSS. Icons → 256px, screenshots →
  ~500px, convert to WebP with PNG fallback (`<picture>`) or WebP-only.
  Tooling options that work on GitHub Pages (static output only): a one-off
  `sharp`/ImageMagick pass over `/img`, committing resized/WebP derivatives
  and updating `src` references; or the `jekyll-picture-tag` plugin (note:
  GitHub Pages' classic build runs Jekyll in safe mode and skips non-whitelisted
  plugins — verify this one is on the [supported list](https://pages.github.com/versions/)
  before relying on it, same caveat as the removed `app_seo_generator.rb`).

- [ ] **IMG-3 — High: Add explicit `width`/`height` to every `<img>`**
  Still only the navbar logo (32×32) sets these. Same template edits as
  IMG-1 — do together. Use real pixel dimensions of the (resized) source
  file; let CSS scale visually with `height: auto`.

- [ ] **IMG-4 — High: Fix the lightbox's empty `src`**
  `_includes/lightbox-modal.html` line 6 still ships:
  ```html
  <img id="lightboxImage" src="" alt="" class="lightbox-image">
  ```
  Remove the `src`/`alt` attributes entirely from the markup; have
  `js/mitchell525.js`'s lightbox-open handler set both when it opens an image.

---

## Priority 2 — Crawling & indexing

- [ ] **IDX-2 — High: Redirect stub has a relative canonical, isn't in the sitemap allowlist correctly**
  `pockettravelplanner/index.html` is still a client-side meta-refresh to
  `/pockettripplanner/`, and its canonical is still relative:
  ```html
  <link rel="canonical" href="/pockettripplanner/">
  ```
  It has no `sitemap: false` front matter, so `jekyll-sitemap` still lists
  this redirect stub as its own URL.

  Action: add `sitemap: false` to the front matter, change the canonical to
  the absolute form (`https://mitchell525.github.io/pockettripplanner/`) to
  match every other page, and consider swapping the meta-refresh for the
  `jekyll-redirect-from` plugin (GitHub Pages whitelists it) for a real
  redirect page.

- [ ] **IDX-3 — High: Internal links go through a 301 (missing trailing slash)**
  Still unfixed. `index.html` line 55: app-card titles link to
  `/{{ app.slug }}` (no trailing slash) while the footer correctly links to
  `/{{ app.slug }}/`. Same for `/pages/legal`, `/pages/about` in both navbar
  active-state checks and footer links — GitHub Pages 301s the no-slash form
  to the slash form on every one of these.

  Action: use `{{ app.url | relative_url }}` (collection `.url` already
  includes the trailing slash) or hand-append `/` consistently everywhere a
  slug/path is templated into an `href`.

- [ ] **IDX-4 — High: Four pages share one identical `<meta name="description">`**
  Still unfixed — `index.html`, `blog/index.html`, `pages/about.html`,
  `pages/legal.html` all have no `description:` front matter, so all four
  fall back to the same site-wide default in `_config.yml`. The app pages
  already do this correctly (each has a unique `description:` in front
  matter) — copy that pattern onto these four.

- [ ] **IDX-5 — Advisory: no `robots.txt` source file at all; no custom 404**
  Escalated from the original finding — there is currently **no `robots.txt`
  in the repo** (checked `git log --all` too — nothing tracked). The
  `Sitemap:`-only version the audit saw is presumably still being served live
  from `origin/master`, but it doesn't exist in this working tree, so it will
  disappear (or whatever GitHub Pages does with no source robots.txt) on the
  next deploy unless one is added back. `/404.html` still doesn't exist.

  Action:
  ```
  User-agent: *
  Disallow:

  Sitemap: https://mitchell525.github.io/sitemap.xml
  ```
  as `robots.txt` at the repo root. Add `404.html` with `permalink: /404.html`
  in its front matter, using the site's normal layout so nav/footer render.

---

## Priority 3 — Shared layout / markup & ARIA conformance

- [ ] **DOM-1 — High: Nested `<footer>` elements + unbalanced `</div>`**
  Still unfixed. `_layouts/default.html` wraps
  `<footer role="contentinfo">{% include footer.html %}</footer>` around
  `_includes/footer.html`, which itself still opens with
  `<footer class="ms-footer-modern">` — two nested `<footer>` landmarks. The
  footer include also still closes one more `</div>` than it opens (there's a
  stray extra `</div>` right before its closing `</footer>` tag, after
  `.footer-bottom` is already balanced).

  Action: in `_layouts/default.html`, drop the outer `<footer role="contentinfo">`
  wrapper and just `{% include footer.html %}` directly inside `<main>`'s
  sibling position (the include's own `<footer class="ms-footer-modern">` is
  the real landmark — `role="contentinfo"` on it is implicit and can be
  omitted). Delete the stray extra `</div>` in `_includes/footer.html`.

- [ ] **DOM-3 — Advisory: redundant landmark roles remain (skip link is done)**
  The skip link now exists (`<a href="#main-content" class="skip-link">Skip
  to main content</a>` in `_layouts/default.html`, targeting `<main
  id="main-content">`) — that part of this item is fixed. Still present:
  `role="banner"` on `<header>`, `role="main"` on `<main>`, `role="navigation"`
  on `<nav>` (in `_includes/navbar.html`), and `role="contentinfo"` on
  `<footer>` — all implicit on those elements already, harmless but
  redundant. `role="document"` on `<body>` was already removed.

  Action: delete the four redundant `role` attributes.

---

## Priority 4 — App structured data

- [ ] **APP-1 — High: No `aggregateRating` in any `SoftwareApplication` JSON-LD**
  Still unfixed. `_includes/app-schema.html` has well-formed `name`,
  `offers`, `applicationCategory`, `operatingSystem`, `downloadUrl` — no
  `aggregateRating` on any of the 12 apps.

  Action: for each app page's JSON-LD block, add real numbers pulled from
  App Store Connect / Play Console — do not estimate or invent figures:
  ```json
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.6",
    "ratingCount": "128"
  }
  ```
  Skip an app entirely if it doesn't have enough ratings yet rather than
  inventing a number.

- [ ] **APP-3 — Advisory: page titles overflow the SERP; homepage repeats the site name**
  Still unfixed:
  | Page | Current title |
  |---|---|
  | `pages/legal.html` | `Legal Documents - Terms, Policies, and Legal Information` (70 chars + site name) |
  | `_apps/pinballdefenseforce.md` | `Pinball Defense Force — Classic 2D Pinball Defense Game` (69 chars + site name) |
  | `_apps/pockettripplanner.md` | `Pocket Trip Planner — Simple Trip Planning Made Easy` (66 chars + site name) |
  | `index.html` | `Mitch Smith — Software Engineer & App Developer` + `jekyll-seo-tag`'s auto-appended `\| Mitch Smith` = duplicated site name |

  Action: shorten the legal and Pinball Defense Force titles; for the
  homepage, set `title: "Software Engineer & App Developer"` in front matter
  and let `jekyll-seo-tag` append the site name once.

---

## Priority 5 — Head, sharing & security cleanup

- [ ] **HEAD-1 — High: No `og:image` on homepage, blog, about, or legal pages**
  Still unfixed — `_config.yml` `defaults` has no site-wide `image:`
  fallback, and none of `index.html` / `blog/index.html` /
  `pages/about.html` / `pages/legal.html` set one in front matter.

  Action: add a site-wide fallback under `_config.yml`'s `defaults` (path
  `""` scope), pointing at a real 1200×630 image (e.g. a grid of app icons)
  committed at `/img/social/og-default.png`. App pages and blog posts already
  set `image:` per-page correctly — leave those alone.

- [ ] **HEAD-2 — Advisory: security meta tags do less than they appear to**
  Still unfixed in `_layouts/default.html`:
  - Line 16, `<meta http-equiv="X-XSS-Protection" content="1; mode=block">`
    — no effect via meta tag; browsers removed the feature. Delete.
  - Line 15 CSP still allowlists `code.jquery.com` and `cdnjs.cloudflare.com`
    in `script-src`, and lines 25–26 still `dns-prefetch` both — neither is
    actually loaded by any page (only `googletagmanager.com` and
    `cdn.jsdelivr.net` are). Remove both from the CSP and the prefetch hints.
  - No `<meta name="referrer" content="strict-origin-when-cross-origin">`
    anywhere — one of the few security policies that does work via meta tag
    on GitHub Pages. Add it.
  - Longer-term: the inline Google Analytics bootstrap is still inline in
    `<head>` (lines 46–81), which is why `script-src 'unsafe-inline'` is
    still needed. Moving it to `/js/` would let that be dropped eventually.

- [ ] **HEAD-3 — Advisory: filenames with spaces on brand assets; wrong touch-icon size**
  Still unfixed. `ic_material_product_icon_192px copy 2mdpi.png` is still
  referenced unencoded for both `<link rel="icon">` and `apple-touch-icon` in
  `_layouts/default.html`, and the touch icon is still the 192px file
  declared with `sizes="180x180"`. `site.webmanifest` still doesn't exist.

  Action: rename to `icon-192.png` / generate a real 180×180
  `apple-touch-icon-180.png`, update the three references (favicon link,
  apple-touch-icon link, JSON-LD publisher logo in `_config.yml`'s `logo:`),
  add a small `site.webmanifest`.

- [ ] **HEAD-4 — Advisory: Atom feed exists but isn't linked; footer year is stale**
  Still unfixed. No `{% feed_meta %}` tag anywhere in `_layouts/default.html`
  (jekyll-feed is in the plugins list but its auto-discovery tag was never
  added). `_includes/footer.html` still hardcodes `&copy; 2025` while today
  is 2026-09-06.

  Action: add `{% feed_meta %}` inside `<head>`. Change the footer to
  `&copy; {{ site.time | date: "%Y" }} Mitchell Smith. All rights reserved.`

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
