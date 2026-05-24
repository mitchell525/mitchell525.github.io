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

### [ ] Fix `og:type` on app pages
**Issue:** App pages can still emit `og:type=article` in social previews because Jekyll infers file dates on collection documents, even though JSON-LD is set to `WebPage`.

- Ensure app pages classify as website/product pages in Open Graph output
- May require stripping or overriding `date` earlier in the build (extend `_plugins/app_seo_generator.rb`)

**Files:** `_plugins/app_seo_generator.rb`

---

### [ ] Decide indexing policy for hidden and legacy apps
**Issue:** Indexing strategy is inconsistent.

- **AvatarForge** is `hidden_from_home: true` but still live and indexable at `/avatarforgeai/`
- **Legacy apps** are not on the homepage but still have full landing pages

**Decision needed — pick one approach:**
1. Keep everything indexable (max discoverability for old apps)
2. Add `noindex` for hidden/legacy pages
3. Link legacy apps from a "Legacy apps" section on the homepage for internal linking

**Files:** `_data/apps.yml`, `_plugins/app_seo_generator.rb`, `index.html`

---

### [ ] Migrate standalone legal pages to shared layout
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
- App page SEO auto-derived via `_plugins/app_seo_generator.rb`
