# mitchell525.github.io

Personal portfolio website for hosting and showcasing my mobile apps. Built with Jekyll and deployed via GitHub Pages.

### Live site
`https://mitchell525.github.io`

### Tech stack
- **Jekyll 3.9.5** - Static site generator
- **Bootstrap 5.3.2** - CSS framework via CDN
- **Bootstrap Icons 1.11.3** - Icon library
- **Vanilla JavaScript** - DOM interactions and cookie consent management
- **Google Analytics 4** - Site analytics with Consent Mode v2 (cookieless by default, optional opt-in)
- **Jekyll SEO Tag** - Automatic SEO optimization
- **Jekyll Sitemap** - Automatic sitemap generation
- **Jekyll Feed** - RSS feed generation (configured in Gemfile)

### Local development
Run the Jekyll development server:

```bash
./start-dev.sh
# or
bundle exec jekyll serve --livereload --incremental --drafts --unpublished
```

Then open `http://localhost:4000`.

**Alternative npm scripts:**
```bash
npm run dev    # Start development server with live reload
npm run build  # Build the site
npm run serve  # Start server without live reload
npm run clean  # Clean the build directory
```

**Prerequisites:**
- Ruby and Bundler installed
- Run `bundle install` to install dependencies

### Project layout
- **`_config.yml`**: Jekyll configuration and site settings
- **`_data/apps.yml`**: Centralized app data (metadata, URLs, screenshots)
- **`_apps/`**: Jekyll collection containing app pages (Markdown files)
- **`_posts/`**: Blog posts (Markdown with front matter)
- **`blog/`**: Blog index page at `/blog/`
- **`_layouts/`**: Jekyll layouts (`default.html`, `app.html`, `legal.html`, `support.html`, `post.html`)
- **`_includes/`**: Reusable HTML fragments (`navbar.html`, `footer.html`, `cookie-banner.html`, `lightbox-modal.html`, `app-schema.html`, `app-breadcrumb-schema.html`, `seo-vars.html`)
- **`_plugins/app_seo_generator.rb`**: Custom Jekyll plugin that derives SEO title/description/image for app pages from `_data/apps.yml` — see the note under "Deployment" below, its behavior in production is unconfirmed.
- **`pages/`**: Static content pages (`about.html`, `legal.html`)
- **`support/`**: Support pages (FAQs, subscription support)
- **`css/mitchell525.css`**: Global styles (plain CSS, no preprocessor)
- **`js/mitchell525.js`**: Cookie consent management and screenshot lightbox functionality
- **`img/`**: Shared images (icons, store badges, previews, per-app screenshots)
- **`legal/`**: Legal documents (privacy policies, terms)

See `FIXES.md` for known issues in this layout (dead pages, leftover folders, naming inconsistencies) that haven't been cleaned up yet.

### Adding a new app
1. Add app metadata to `_data/apps.yml`:
   ```yaml
   - name: "App Name"
     slug: "appname"
     tagline: "App tagline"
     description: "App description"
     icon: "/img/appname/icon.png"
     color: "#HEXCOLOR"
     schema_category: "GameApplication"  # Schema.org category, e.g. GameApplication, UtilitiesApplication, TravelApplication
     pricing_model: "free"               # free (AdMob games) | freemium (optional IAP) | subscription
     coming_soon: false  # Optional: set to true for apps not yet released
     legacy: false        # Optional: set to true for older/legacy apps
     ios_url: "https://apps.apple.com/..."
     android_url: "https://play.google.com/..."  # Optional: set to null if not available
     screenshots:
       - "/img/appname/screenshot1.png"
       - "/img/appname/screenshot2.png"
     privacy_policy: "/legal/app_privacy_policy.html"
     terms: "/legal/app_terms_and_conditions.html"
     support_pages:      # Optional: additional support pages
       - name: "FAQ"
         url: "/support/appname_faq.html"
       - name: "Subscription Support"
         url: "/support/appname_subscription_support.html"
   ```

2. Create app page in `_apps/appname.md`:
   ```markdown
   ---
   layout: app
   slug: appname
   ---
   ```

   App page SEO (title, meta description, Open Graph image) is auto-derived from `_data/apps.yml` at build time by `_plugins/app_seo_generator.rb`. Optional per-page overrides in front matter: `title`, `description`, `image`. Structured data uses `schema_category` and `pricing_model` from `apps.yml` for SoftwareApplication JSON-LD.

3. Add app images to `img/appname/` directory
4. Add legal documents to `legal/` directory
5. Add support pages to `support/` directory if needed (using `support.html` layout)

### Adding a blog post
1. Create a new file in `_posts/` named `YYYY-MM-DD-post-slug.md`:
   ```markdown
   ---
   layout: post
   title: "Post title"
   date: 2026-05-21
   tags: [ios, release]
   excerpt: "Short summary for the blog listing and SEO."
   image: /img/blog/my-post/header.png   # optional header image (left of title)
   image_alt: "Optional alt text for header image"
   app_slug: cdchanger                   # optional: use app icon from _data/apps.yml
   screenshots:
     - src: /img/blog/my-post/screenshot1.png
       alt: "Screenshot description"
       caption: "Optional caption shown below the image"
   ---

   Write your post in Markdown. Use [links](https://example.com) and inline images:

   ![Alt text](/img/blog/my-post/inline.png)
   ```

2. Add images under `img/blog/` (or reuse existing app screenshots under `img/<app>/`).
3. Optional `image` or `app_slug` shows a header icon to the left of the title (release posts can use `app_slug` to pull the app icon automatically).
4. Optional `screenshots` front matter renders a clickable gallery at the end of the post (uses the site lightbox).
5. Posts appear on `/blog/` and in the RSS feed at `/feed.xml`.

### Page Templates
The site uses Jekyll layouts to eliminate HTML duplication:

#### Legal Pages (`_layouts/legal.html`)
Legal pages contain only front matter and unique content:
```yaml
---
layout: legal
title: "App Name: Privacy Policy"
---
```

#### Support Pages (`_layouts/support.html`)
Support pages (FAQs, subscription support) use the same pattern:
```yaml
---
layout: support
title: "App Name: FAQ"
---
```

All templates automatically provide:
- Common HTML structure (DOCTYPE, head, meta tags)
- Bootstrap CSS and Bootstrap Icons
- Google Analytics 4 with Consent Mode v2 (cookieless default, optional opt-in)
- Navigation and footer
- Cookie consent banner
- Responsive container layout

This approach reduces maintenance overhead and ensures consistency across all pages.

### Jekyll Features
- **Collections**: Apps are managed as a Jekyll collection for easy iteration
- **Data Files**: Centralized app metadata in `_data/apps.yml`
- **SEO**: App pages auto-populate title, description, and OG image from `_data/apps.yml` via `_plugins/app_seo_generator.rb` (local builds only — see the plugin note under Deployment); Jekyll SEO Tag handles meta tags, Open Graph, Twitter Cards, and canonical URLs
- **Sitemap**: Automatic XML sitemap generation via Jekyll Sitemap
- **Blog**: Markdown posts in `_posts/` with listing at `/blog/` and per-post pages
- **RSS Feed**: Automatic RSS feed at `/feed.xml` (via Jekyll Feed plugin)
- **Live Reload**: Development server with automatic browser refresh
- **Cookie Consent**: Google Consent Mode v2 — anonymous cookieless traffic measurement runs by default; analytics cookies require explicit opt-in via the banner or footer "Cookie preferences" link
- **Screenshot Lightbox**: Interactive lightbox for viewing app screenshots

### Deployment
This site is served by **GitHub Pages** from the `master` branch at `https://mitchell525.github.io/` — pushing to `master` deploys automatically.

**Known open question:** GitHub Pages' classic "deploy from a branch" build runs Jekyll in *safe mode*, which does not execute custom plugins. This repo has one custom plugin, `_plugins/app_seo_generator.rb`, that derives app-page SEO metadata. Whether it actually runs on the live GitHub Pages build (vs. only in local `bundle exec jekyll build`) has not been confirmed — check the repo's Settings → Pages build type, or diff the live HTML `<head>` of an app page against a local build. See `FIXES.md`.

There is also a `.gitlab-ci.yml` in this repo left over from an earlier GitLab Pages setup. It is not used by the current GitHub Pages deployment and its `_config.yml`/branch assumptions are stale — see `FIXES.md`.

### License
See [`LICENSE`](./LICENSE).
