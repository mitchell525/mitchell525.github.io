# mitchell525.github.io

Personal portfolio website for hosting and showcasing my mobile apps. Built with Jekyll and deployed via GitHub Pages.

### Live site
`https://mitchell525.github.io`

### Tech stack
- **Jekyll 3.9.5** - Static site generator
- **Bootstrap 4.3.1** - CSS framework via CDN
- **jQuery 3.5.1** - DOM interactions and animations
- **Google Analytics (UA)** - Site analytics
- **Jekyll SEO Tag** - Automatic SEO optimization
- **Jekyll Sitemap** - Automatic sitemap generation
- **Jekyll Feed** - RSS feed generation

### Local development
Run the Jekyll development server:

```bash
./start-dev.sh
# or
bundle exec jekyll serve --livereload --incremental
```

Then open `http://localhost:4000`.

**Prerequisites:**
- Ruby and Bundler installed
- Run `bundle install` to install dependencies

### Project layout
- **`_config.yml`**: Jekyll configuration and site settings
- **`_data/apps.yml`**: Centralized app data (metadata, URLs, screenshots)
- **`_apps/`**: Jekyll collection containing app pages (Markdown files)
- **`_layouts/`**: Jekyll layouts (`default.html`, `app.html`)
- **`_includes/`**: Reusable HTML fragments (`navbar.html`, `footer.html`)
- **`pages/`**: Static content pages (`about.html`, `legal.html`)
- **`css/mitchell525.css`**: Global styles
- **`js/mitchell525.js`**: Scroll/fade-in effects
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
     ios_url: "https://apps.apple.com/..."
     android_url: "https://play.google.com/..."
     screenshots:
       - "/img/appname/screenshot1.png"
       - "/img/appname/screenshot2.png"
     privacy_policy: "/legal/app_privacy_policy.html"
     terms: "/legal/app_terms_and_conditions.html"
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

### Jekyll Features
- **Collections**: Apps are managed as a Jekyll collection for easy iteration
- **Data Files**: Centralized app metadata in `_data/apps.yml`
- **SEO**: Automatic meta tags, Open Graph, and Twitter Card support
- **Sitemap**: Automatic XML sitemap generation
- **RSS Feed**: Automatic RSS feed at `/feed.xml`
- **Live Reload**: Development server with automatic browser refresh

### Deployment
This repository is configured for GitHub Pages with Jekyll. Merges to `master` automatically trigger a Jekyll build and deploy to `https://mitchell525.github.io/`.

### License
See [`LICENSE`](./LICENSE).
