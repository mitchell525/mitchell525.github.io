# mitchell525.gitlab.io

Personal portfolio website for hosting and showcasing my mobile apps. Built with Jekyll and deployed via GitLab Pages.

### Live site
`https://mitchell525.gitlab.io`

### Tech stack
- **Jekyll 3.9.5** - Static site generator
- **Bootstrap 5.3.2** - CSS framework via CDN
- **Bootstrap Icons 1.11.3** - Icon library
- **Vanilla JavaScript** - DOM interactions and cookie consent management
- **Google Analytics 4** - Site analytics with cookie consent
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
- **`_layouts/`**: Jekyll layouts (`default.html`, `app.html`, `legal.html`, `support.html`)
- **`_includes/`**: Reusable HTML fragments (`navbar.html`, `footer.html`, `cookie-banner.html`)
- **`pages/`**: Static content pages (`about.html`, `legal.html`)
- **`support/`**: Support pages (FAQs, subscription support)
- **`css/mitchell525.css`**: Global styles
- **`js/mitchell525.js`**: Cookie consent management and screenshot lightbox functionality
- **`img/`**: Shared images (icons, store badges, previews)
- **`legal/`**: Legal documents (privacy policies, terms)

### Adding a new app
1. Add app metadata to `_data/apps.yml`:
   ```yaml
   - name: "App Name"
     slug: "appname"
     tagline: "App tagline"
     description: "App description"
     icon: "/img/appname/icon.png"
     color: "#HEXCOLOR"
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

3. Add app images to `img/appname/` directory
4. Add legal documents to `legal/` directory
5. Add support pages to `support/` directory if needed (using `support.html` layout)

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
- Google Analytics tracking with cookie consent
- Navigation and footer
- Cookie consent banner
- Responsive container layout

This approach reduces maintenance overhead and ensures consistency across all pages.

### Jekyll Features
- **Collections**: Apps are managed as a Jekyll collection for easy iteration
- **Data Files**: Centralized app metadata in `_data/apps.yml`
- **SEO**: Automatic meta tags, Open Graph, and Twitter Card support via Jekyll SEO Tag
- **Sitemap**: Automatic XML sitemap generation via Jekyll Sitemap
- **RSS Feed**: Automatic RSS feed at `/feed.xml` (via Jekyll Feed plugin)
- **Live Reload**: Development server with automatic browser refresh
- **Cookie Consent**: GDPR-compliant cookie consent banner with granular preferences
- **Screenshot Lightbox**: Interactive lightbox for viewing app screenshots

### Deployment
This repository is configured for GitLab Pages with Jekyll. The `.gitlab-ci.yml` file defines the build pipeline. Pushes to `main` branch automatically trigger a Jekyll build and deploy to `https://mitchell525.gitlab.io/`.

The CI pipeline:
1. Uses Ruby 3.1 image
2. Installs Bundler and dependencies
3. Builds the Jekyll site to `public/` directory
4. Deploys to GitLab Pages

### License
See [`LICENSE`](./LICENSE).
