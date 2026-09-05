# FIXES

Issues found during the 2026-09-05 documentation audit that are **not** fixed yet. Each item was verified directly against the repo (file paths, git state, or config contents) — nothing here is guessed. This file is the backlog for the next cleanup pass; `TODO.md` is the separate feature/enhancement backlog.

---

## High severity

### 1. Custom SEO plugin may not run in production
`_plugins/app_seo_generator.rb` derives title/description/OG image for app pages from `_data/apps.yml`. GitHub Pages' classic "deploy from a branch" build (which this repo uses — confirmed: pushing to `master` deploys to `https://mitchell525.github.io/`) runs Jekyll in *safe mode*, which does not execute custom plugins.
- **Risk:** every app page's SEO metadata may silently be missing/wrong in production even though it looks correct in local `bundle exec jekyll build`.
- **Action:** confirm the repo's Settings → Pages build type. If it's the classic branch build, either (a) move the plugin's logic into Liquid/front-matter defaults so it doesn't need a plugin, or (b) switch to a GitHub Actions-based Pages deployment (`actions/jekyll-build-pages`), which does run custom plugins.
- **Files:** `_plugins/app_seo_generator.rb`

### 2. `.gitlab-ci.yml` is dead config from a prior GitLab Pages setup
Describes a pipeline (`only: [main]`) that can't fire on this repo (no `main` branch exists; only `master`, plus stale `jekyll`/`revert`/`chat-gptupdates`). The real deployment is GitHub Pages from `master`.
- **Action:** delete `.gitlab-ci.yml` unless there's an actual GitLab mirror somewhere this local clone doesn't know about (confirm with the user before deleting).
- **Files:** `.gitlab-ci.yml`

---

## Medium severity

### 3. `vendor/bundle/`, `.bundle/config`, and `.DS_Store` files are committed despite being gitignored
`.gitignore` lists `vendor/`, `.bundle/`, and `.DS_Store`, but all are tracked in git (`vendor/bundle/` alone is ~25MB / 2,625 files). This bloats the repo (`.git` is 127MB) and ships regenerable/OS-junk files in every clone.
- **Action:** `git rm -r --cached vendor .bundle` and remove the 5 tracked `.DS_Store` files, then commit. (Not done here — this is a repo-wide history/size change, not a doc fix.)
- **Files:** `vendor/bundle/`, `.bundle/config`, `./.DS_Store`, `design/.DS_Store`, `img/.DS_Store`, `img/icons/.DS_Store`, `img/previews/.DS_Store`

### 4. `pockettravelplanner` → `pockettripplanner` rename left inconsistent naming
The app was renamed from "Pocket Travel Planner" to "Pocket Trip Planner" (slug `pockettripplanner`), but:
- `img/pockettravelplanner/` is still the live path referenced by `_data/apps.yml` for this app's icon/screenshots — a latent trap if anyone "cleans up" that folder without checking references first.
- Root-level `pockettravelplanner/` folder still exists, containing a redirect stub (`index.html` → `/pockettripplanner/`), a 2.2MB PNG, and a `pocket_travel_planner_icon.icon` directory — an **Xcode 16 Icon Composer project bundle**, i.e. native-app tooling output, not a web asset. Doesn't belong in this repo at all.
- `legal/pocket_travel_planner_privacy_policy_redirect.html` and `legal/pocket_travel_planner_terms_and_conditions_redirect.html` are redirect stubs for the same old naming.
- **Action:** rename `img/pockettravelplanner/` → `img/pockettripplanner/` and update `_data/apps.yml`; decide whether the root `pockettravelplanner/` redirect folder and its `.icon` bundle are still needed (probably keep the HTML redirect for old bookmarks/search results, definitely delete the `.icon` bundle).
- **Files:** `_data/apps.yml`, `img/pockettravelplanner/`, `pockettravelplanner/`, `legal/pocket_travel_planner_*_redirect.html`

### 5. Orphaned "Log It Jog It" app content
`legal/log_it_jog_it_privacy_policy.html`, `img/projects/log_it_jog_it_website_img.png`, and `img/previews/website_preview_screenshots_jog_it_log_it_*.png` exist with **no corresponding entry in `_data/apps.yml`** and **no file in `_apps/`** — the app was fully removed from the live site but its legal/image files were left behind.
- **Action:** confirm the app is truly gone, then delete these files.
- **Files:** `legal/log_it_jog_it_privacy_policy.html`, `img/projects/log_it_jog_it_website_img.png`, `img/previews/website_preview_screenshots_jog_it_log_it_*.png`

### 6. Dead pre-Jekyll page: `design/product.html`
Not linked from `index.html`, the navbar, or any layout. Uses jQuery 3.5.1, Bootstrap 4.3.1 (via `stackpath.bootstrapcdn.com`, not the site's current CDN), an old Universal Analytics ID (`UA-112034969-4`, already marked "OLD" in `_config.yml`), and calls `$("#navbar").load("/templates/navbar.html")` against a `/templates/` directory that doesn't exist anywhere in the repo — this page is broken even if someone found it.
- **Action:** delete `design/product.html` and `design/img/MS_ICON.png` unless there's a reason to keep it archived.
- **Files:** `design/product.html`, `design/img/MS_ICON.png`

### 7. `legal/legal.html` is a dead redirect stub
It's a bare `layout: null` page at `/legal/` that meta-refreshes to `/` (home) rather than to the real legal index, which actually lives at `pages/legal.html` (served at `/pages/legal/`, and is what the navbar/footer link to). Anyone landing on `/legal/` from an old link gets bounced home instead of to the legal page they wanted.
- **Action:** either redirect `/legal/` to `/pages/legal/` instead of `/`, or remove the stub if nothing external links to `/legal/`.
- **Files:** `legal/legal.html`, `pages/legal.html`

---

## Low severity

### 8. Stale git branches
`jekyll`, `revert`, `chat-gptupdates` haven't been touched since 2025 and predate the Jekyll migration landing on `master` (the `jekyll` branch even contains its own now-obsolete `jekyll-migration-plan.md`). `master` is the only actively developed branch.
- **Action:** confirm none are needed for reference, then delete.
- **Files:** n/a (git branches, not files)

### 9. Icon filenames contain spaces
E.g. `img/icons/material/ic_material_product_icon_192px copy 2mdpi.png`, referenced from `_config.yml`'s `logo:` key and elsewhere, requiring URL-encoding everywhere it's used. Already tracked as its own item in `TODO.md` under "Lower impact / polish" — listed here only for cross-reference.
- **Files:** `img/icons/material/`, `_config.yml`

---

## Verify, don't assume, before acting on any of the above
Several of these interact with each other (e.g. don't delete `img/pockettravelplanner/` before checking item 4's note that `_data/apps.yml` still points at it). Re-check current file references with `grep` before deleting or moving anything.
