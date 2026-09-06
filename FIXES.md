# FIXES

Issues found during the 2026-09-05 documentation audit that are **not** fixed yet. Each item was verified directly against the repo (file paths, git state, or config contents) — nothing here is guessed. This file is the backlog for the next cleanup pass; `TODO.md` is the separate feature/enhancement backlog.

---

## High severity

### 1. ~~Custom SEO plugin may not run in production~~ — FIXED 2026-09-05
Confirmed live (via direct `curl` of production HTML) that `_plugins/app_seo_generator.rb` never ran under GitHub Pages' safe-mode build: all 12 app pages had broken/duplicate `<title>`/description and no `og:image`, plus a spurious `BlogPosting` JSON-LD block conflicting with the correct `SoftwareApplication` schema.
- **Fix applied:** deleted the plugin; moved `title`/`description`/`image` to static front matter on each `_apps/*.md` (mirrored from `_data/apps.yml`), and added a `_config.yml` collection default (`seo.type: WebPage` for `apps`) — both safe-mode compatible.
- **Residual gap:** `og:type` itself is driven by a separate hardcoded `page.date` check in jekyll-seo-tag's template that can't be fully fixed without a real plugin; tracked as an accepted limitation in `TODO.md`.
- **Files:** `_apps/*.md`, `_config.yml`, `_includes/seo-vars.html` (plugin deleted)

### 2. ~~`.gitlab-ci.yml` is dead config from a prior GitLab Pages setup~~ — FIXED 2026-09-06
Confirmed with the user there's no GitLab mirror; deleted `.gitlab-ci.yml`.
- **Files:** `.gitlab-ci.yml`

---

## Medium severity

### 3. ~~`vendor/bundle/`, `.bundle/config`, and `.DS_Store` files are committed despite being gitignored~~ — FIXED 2026-09-06
Ran `git rm -r --cached vendor .bundle` plus the 5 tracked `.DS_Store` files and committed. Files remain on disk (still covered by the existing `.gitignore` entries) but are no longer tracked, so future commits won't carry them. Note: this untracks going forward — it does not rewrite existing git history, so past commits/`.git` size are unchanged.
- **Files:** `vendor/bundle/`, `.bundle/config`, `./.DS_Store`, `design/.DS_Store`, `img/.DS_Store`, `img/icons/.DS_Store`, `img/previews/.DS_Store`

### 4. ~~`pockettravelplanner` → `pockettripplanner` rename left inconsistent naming~~ — FIXED 2026-09-05
`img/pockettravelplanner/` renamed to `img/pockettripplanner/`, `_data/apps.yml` updated to match. The root-level `pockettravelplanner/index.html` redirect stub was kept (for old bookmarks/search results); the unused `pocket_travel_planner_icon.icon` Xcode Icon Composer bundle and its stray 2.2MB PNG were deleted (native-app tooling output, never a web asset). The `legal/pocket_travel_planner_*_redirect.html` stubs were left in place — they still correctly redirect to the current privacy/terms URLs.
- **Files:** `_data/apps.yml`, `img/pockettripplanner/`, `pockettravelplanner/`

### 5. ~~Orphaned "Log It Jog It" app content~~ — FIXED 2026-09-05
Deleted `legal/log_it_jog_it_privacy_policy.html`, `img/projects/log_it_jog_it_website_img.png`, `img/previews/website_preview_screenshots_jog_it_log_it_*.png`, and `img/icons/jog_it_log_it.png` (one extra orphan found beyond the original list) — confirmed no references anywhere in the repo before deleting.

### 6. ~~Dead pre-Jekyll page: `design/product.html`~~ — FIXED 2026-09-05
Deleted `design/product.html` and `design/img/MS_ICON.png` — confirmed no inbound links from `index.html`, the navbar, or any layout.

### 7. ~~`legal/legal.html` is a dead redirect stub~~ — FIXED 2026-09-05
Now redirects to `/pages/legal/` (the real legal index) instead of `/`.
- **Files:** `legal/legal.html`

---

## Low severity

### 8. ~~Stale git branches~~ — FIXED 2026-09-06
Confirmed with the user and deleted `jekyll`, `revert`, `chat-gptupdates` (all local-only; no matching `origin/*` refs existed to delete). `chat-gptupdates` predated the Jekyll migration (pre-Jekyll static HTML, old `pockettravelplanner` naming, no Jekyll structure) and wasn't fully merged, so it required a force-delete after confirming its contents were obsolete.
- **Files:** n/a (git branches, not files)

### 9. Icon filenames contain spaces
E.g. `img/icons/material/ic_material_product_icon_192px copy 2mdpi.png`, referenced from `_config.yml`'s `logo:` key and elsewhere, requiring URL-encoding everywhere it's used. Already tracked as its own item in `TODO.md` under "Lower impact / polish" — listed here only for cross-reference.
- **Files:** `img/icons/material/`, `_config.yml`

---

## Verify, don't assume, before acting on any of the above
Several of these interact with each other (e.g. don't delete `img/pockettravelplanner/` before checking item 4's note that `_data/apps.yml` still points at it). Re-check current file references with `grep` before deleting or moving anything.
