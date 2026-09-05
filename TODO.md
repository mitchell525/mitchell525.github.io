# App Pages — Web Standards TODO

Follow-up items from the app setup review (beyond the SEO work already completed). Grouped by priority.

---

## High impact

### [x] Enrich SoftwareApplication JSON-LD
**Issue:** `_includes/app-schema.html` is missing fields that help app discovery in search.

- Add App Store / Play Store URLs as `downloadUrl` (from `ios_url` / `android_url` in `apps.yml`)
- Fix pricing: `"price": "0"` is inaccurate for apps with IAP or subscriptions (e.g. Digital CD Changer Pro, AvatarForge)
- Add per-app `schema_category` in `apps.yml` (e.g. `GameApplication` for pinball games, `UtilitiesApplication` for CD Changer) instead of defaulting everything to `MobileApplication`

**Files:** `_includes/app-schema.html`, `_data/apps.yml`

---

### [x] Fix internal link targets on app pages
**Issue:** Privacy, terms, and support links open in a new tab even though they are same-site pages.

- Remove `target="_blank"` from internal legal/support links in `_layouts/app.html`
- Keep `target="_blank"` only for App Store and Google Play store badges

**Files:** `_layouts/app.html`

---

### [x] Add breadcrumb navigation to app pages
**Issue:** Blog posts have breadcrumbs (`Blog → Post title`); app pages do not.

- Add a trail like `Portfolio → {App Name}` for UX and crawl structure
- Reuse styling/pattern from `_layouts/post.html`

**Files:** `_layouts/app.html`, possibly `css/mitchell525.css`

---

### [ ] Improve app screenshot performance
**Issue:** Large PNG screenshots risk layout shift and slow LCP.

- Add explicit `width` and `height` on screenshot `<img>` tags to prevent CLS
- Add `fetchpriority="high"` on the hero screenshot (likely LCP element)
- Consider WebP variants and/or `srcset` for responsive delivery

**Files:** `_layouts/app.html`, `index.html`, `img/` assets

---

### [x] Upgrade screenshot lightbox accessibility
**Issue:** Lightbox works but lacks patterns expected for accessible modals.

- Add `aria-modal="true"` and `role="dialog"`
- Trap focus while the lightbox is open
- Return focus to the clicked screenshot when closed
- Set dynamic `alt` on `#lightboxImage` from the source screenshot (not generic `"Screenshot"`)

**Files:** `_layouts/app.html`, `js/mitchell525.js`, possibly `css/mitchell525.css`

---

## Medium impact

### [x] Fix per-app SEO metadata not rendering in production
**Issue (2026-09-05 audit, confirmed live):** `_plugins/app_seo_generator.rb` never ran on GitHub Pages' safe-mode build, so every app page's `<title>`, meta description, and `og:image`/`twitter:image` silently fell back to broken/duplicate values in production, even though local `jekyll serve` (which does run custom plugins) looked correct.

- Deleted `_plugins/app_seo_generator.rb`; replaced with static `title`/`description`/`image` front matter on each `_apps/*.md` file (mirrored from `_data/apps.yml`) — safe-mode compatible since jekyll-seo-tag reads these straight from front matter.
- Added a `_config.yml` `defaults:` entry scoped to the `apps` collection setting `seo: { type: "WebPage" }`, fixing the spurious `BlogPosting` JSON-LD type jekyll-seo-tag was emitting.

**Files:** `_apps/*.md`, `_config.yml`, `_includes/seo-vars.html`

---

### [ ] Residual `og:type` gap on app pages
**Issue:** jekyll-seo-tag's `og:type` meta tag is driven by a separate, hardcoded `page.date` truthiness check in its own template — unrelated to the `seo.type` front matter that fixes the JSON-LD `@type` above. Jekyll's `Document#date` auto-populates from the build timestamp when no `date` front-matter key exists, and suppressing that fully requires a `pre_render` hook (a custom plugin), which safe mode won't run.

- Verify actual `og:type` output post-fix (`bundle exec jekyll build --safe`, grep `_site/<slug>/index.html`) before assuming it's still wrong.
- If still wrong, treat as an accepted limitation of safe-mode Jekyll rather than something to hack around with duplicate `<meta>` tags — low severity (affects only the OG type hint in social scrapers, not search indexing).

**Files:** n/a (Jekyll/gem internals, no safe-mode fix available)

---

### [x] Decide indexing policy for hidden and legacy apps
**Resolved (2026-09-05):** Added `robots: "noindex, follow"` front matter to `avatarforgeai.md` (hidden from home) and the 5 legacy game pages (`bounceandbound`, `dizzyfrog`, `shiftandshatter`, `surgeblast`, `tapandteleport`) — all six had zero markdown body content, so they were thin/duplicate-content pages fully indexable at their own URLs. `,follow` preserves link equity while removing them from search results. `_layouts/default.html` renders `<meta name="robots">` from `page.robots` when set.

**Files:** `_apps/avatarforgeai.md`, `_apps/bounceandbound.md`, `_apps/dizzyfrog.md`, `_apps/shiftandshatter.md`, `_apps/surgeblast.md`, `_apps/tapandteleport.md`, `_layouts/default.html`, `_config.yml`

---

### [x] Migrate standalone legal pages to shared layout
**Issue:** `legal/pocket_trip_planner_privacy_policy.html` and `legal/pocket_trip_planner_terms_and_conditions.html` bypass the shared layout.

- No navbar, cookie banner, or consistent SEO
- Feel like a separate site from the rest of the portfolio

**Files:** `legal/pocket_trip_planner_*.html` → convert to `layout: legal` pattern

---

### [ ] Add a custom 404 page
**Issue:** No `404.html` exists.

- Bad URLs and old redirects (e.g. `/pockettravelplanner/`) get a generic host 404
- A helpful 404 with links back to portfolio and popular apps improves UX and crawl efficiency

**Files:** `404.html` (new)

---

### [ ] Smart App Banner (optional)
**Issue:** iOS app landing pages do not prompt Safari users to open/install from the App Store.

- Add `apple-itunes-app` meta tag on app pages with an iOS URL
- Derive `app-id` from `ios_url` in `apps.yml`

**Files:** `_layouts/app.html` or `_includes/`, `_data/apps.yml`

---

## Lower impact / polish

### [ ] Rename icon files with spaces in paths
**Issue:** Icon paths like `ic_material_product_icon_192px copy 2mdpi.png` contain spaces and require URL encoding (`%20`) everywhere.

- Rename to URL-safe filenames
- Update references in `_config.yml`, `_layouts/default.html`, `_includes/navbar.html`, etc.

**Files:** `img/icons/material/`, `_config.yml`, `_layouts/default.html`, `_includes/navbar.html`

---

### [ ] Replace inline styles and emoji on support/legal buttons
**Issue:** Support and legal buttons in `app.html` use inline `style=` and emoji prefixes (🔒 📋 💬).

- Harder to maintain than CSS classes
- Screen readers may announce emoji oddly

- Move styles to `css/mitchell525.css`
- Use accessible text labels (icons via CSS or Bootstrap Icons if desired)

**Files:** `_layouts/app.html`, `css/mitchell525.css`

---

### [ ] Add build-time guard when app slug lookup fails
**Issue:** If an `_apps/*.md` slug drifts from `_data/apps.yml`, the page renders empty with no error.

- Add a guard in `app.html` (or a Jekyll plugin) when `app` is nil
- Fail the build or show a clear error in development

**Files:** `_layouts/app.html` or `_plugins/`

---

### [ ] Review app page content overlap
**Issue:** Hero already displays `apps.yml` `description`; the About markdown body often repeats the same copy.

- Make body content additive: features, use cases, platform requirements
- Avoid restating the tagline/description verbatim

**Files:** `_apps/*.md` (content edits per app)

---

## Already in good shape (no action needed)

- Semantic HTML (`<main>`, sections, heading hierarchy)
- Store badges with `aria-label`, `rel="noopener"`, meaningful `alt`
- Cookie consent before analytics
- `prefers-reduced-motion` for hero animation
- Basic lightbox keyboard support (Enter / Space / Escape)
- `focus-visible` styles in CSS
- Centralized app data in `_data/apps.yml`
- App page SEO metadata via static front matter on `_apps/*.md` (mirrored from `_data/apps.yml`)
