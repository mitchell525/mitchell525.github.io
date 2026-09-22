# CLAUDE.md

Guidance for Claude Code (or any agent) working in this repo. This is a personal Jekyll portfolio/app-showcase site for Mitch Smith, ~7 years old, deployed via **GitHub Pages** at `https://mitchsmith.app/` (push to `master` deploys automatically). For the full human-facing overview (project layout, how to add an app or blog post, page templates) see `README.md` — this file only covers what an agent needs that the README doesn't.

## Stack at a glance
- Jekyll 3.9.5, kramdown, Liquid, Ruby via Bundler (see `Gemfile`/`Gemfile.lock`)
- Bootstrap 5.3.8 + Bootstrap Icons 1.13.1, loaded via CDN — not installed locally, don't look for them in `node_modules`
- Plain CSS in `css/mitchell525.css` (3000+ lines, one file, no SCSS/preprocessor anywhere in the repo)
- Vanilla JS in `js/mitchell525.js` (cookie consent + screenshot lightbox, no framework, no jQuery in current pages)
- `package.json` scripts are thin wrappers around `bundle exec jekyll ...` — there is no separate JS build pipeline

## Commands
```bash
bundle install                                              # install Ruby deps
./start-dev.sh                                               # dev server w/ live reload (checks/installs bundle first)
bundle exec jekyll serve --livereload --incremental --drafts --unpublished   # same, manual
bundle exec jekyll build                                     # production build → _site/
npm run dev / build / serve / clean                          # npm aliases for the above
```
There is no test suite and no linter configured — verify changes by building and visually checking the rendered page.

## Repo map
- `_data/apps.yml` — single source of truth for all app metadata (name, slug, pricing, store URLs, screenshots, legal/support links). Start here for anything app-related.
- `_apps/*.md` — one file per app, front matter only (`layout: app`, `slug: ...`); most have no markdown body, all real content is driven by `apps.yml`.
- `_layouts/` — `default.html`, `app.html`, `legal.html`, `support.html`, `post.html`.
- `_includes/` — `navbar.html`, `footer.html`, `cookie-banner.html`, `lightbox-modal.html`, `app-schema.html`, `app-breadcrumb-schema.html`, `seo-vars.html`.
- **There is no `_plugins/` directory.** `app_seo_generator.rb` was deleted — GitHub Pages runs Jekyll in safe mode and never executed it, so app pages silently shipped broken `<head>` metadata in production while local `jekyll serve` looked fine. **Consequence:** per-app `title`/`description`/`image` must be hand-mirrored into each `_apps/*.md` front matter; editing only `_data/apps.yml` will NOT update the `<head>`.
- **`sitemap.xml`** at the repo root is a hand-rolled Liquid template, not `jekyll-sitemap` output — the plugin still loads but skips generation when a source `sitemap.xml` exists. It was replaced because the plugin derives `<lastmod>` from file mtime, and a GitHub Pages checkout stamps every file with build time, so every page claimed to change on every push. **Consequence:** `<lastmod>` now comes from a `last_modified_at` front-matter key that must be **updated by hand** when a page's content meaningfully changes (same hand-mirroring rule as per-app `title`/`description`). A page without the key simply emits no `<lastmod>`, which is safe. The template also drops tag archives with fewer than 2 posts.
- `tags/*.html` + `_layouts/tag.html` — tag archive pages at `/blog/tag/<slug>/`, pure Liquid so they work in safe mode. **Adding a new tag to a post requires adding a matching `tags/<slug>.html` file**, or the tag link will 404.
- `_posts/*.md` — blog posts, `YYYY-MM-DD-slug.md`, six as of Sep 2026. Listing at `blog/index.html`, RSS via `jekyll-feed`.
- `legal/`, `support/` — one HTML file per app per policy/support page, `layout: legal` / `layout: support`.

## Things that will bite you if you assume instead of check
- **Custom domain.** `CNAME` makes GitHub Pages serve the site at `mitchsmith.app` and 301 every `mitchell525.github.io/...` URL to the same path there — which only holds while this repo stays named `mitchell525.github.io` and `CNAME` stays. Don't rename the repo or move hosting. The games' App Store listings still name the old host as their developer website; AdMob reads `app-ads.txt` from that host, so check AdMob's app-ads.txt status after any domain change.
- **Never future-date a post.** Jekyll's `future` defaults to `false` and `_config.yml` does not set it, so a post dated ahead of build time is excluded from the build — silently, no warning, exit 0. On a server that self-corrects at the next build; **GitHub Pages only builds on push**, so a future-dated post never appears at all unless someone happens to push again after its date. Do not use `_posts/` as a scheduling queue: keep unpublished drafts in `../social_media/drafts/` and *move* them in on the day. (Hit on 2026-09-14; full record in `../social_media/log.md`.)
- **`_site/`** is a gitignored local build artifact from a prior `jekyll build`. It is not deployed from this clone and may be stale — never treat its contents as ground truth, rebuild first.
- **`img/pockettravelplanner/`** vs the app's actual current slug **`pockettripplanner`** — `_data/apps.yml` still points image paths at the old `pockettravelplanner` folder name. Don't "fix" one side without checking the other; see `FIXES.md` item 4.
- Not every file that looks live actually is — `design/product.html`, `legal/legal.html`, and the "Log It Jog It" legal/image files are dead/orphaned. See `FIXES.md` for the full list before assuming a file is in active use.
- `vendor/` is local-only (not tracked) and excluded from the build. Don't edit vendored gem code — it's regenerated by `bundle install`.
- **Redirect stubs** (`pockettravelplanner/index.html`, `dizzyfrog/product.html`) exist because App Store listings still point at those URLs. Don't delete one until the listing's developer-website URL has been changed in App Store Connect.
- **`_apps/*.md` carry a fixed `date:`** (the page's first commit). Without it Jekyll stamps collection docs with build time, and every push re-published every app page in `og`/JSON-LD.

## Docs in this repo
- `README.md` — human-facing overview, setup, and content-authoring how-tos (adding an app, adding a blog post).
- `style.md` — design system / style guide, cross-checked against `css/mitchell525.css` as of 2026-09-05.
- `TODO.md` — feature/enhancement backlog (SEO, accessibility, perf follow-ups), actively maintained.
- `FIXES.md` — structural/hygiene issues found during doc audits that need a deliberate cleanup pass (dead code, naming mismatches, stale config). Check here before assuming a discovered oddity is intentional.

When you touch any of the above during future work, verify the claim against the actual code before trusting it — this repo has a documented history of docs drifting from reality (see `FIXES.md` item 2 for the canonical example: the README described GitLab Pages deployment for months while the site was actually served by GitHub Pages).
