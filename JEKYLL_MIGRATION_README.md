# Jekyll Migration Implementation

This document describes the changes made to migrate `mitchell525.github.io` from a static HTML site to a Jekyll-based site, following the plan outlined in `jekyll-migration-plan.md`.

## What Was Implemented

### 1. Jekyll Configuration (`_config.yml`)
- **Site Settings**: Title, description, URL configuration
- **Collections**: Configured `apps` collection for app pages
- **Build Settings**: Markdown processor, permalink structure
- **Plugins**: Added `jekyll-seo-tag` and `jekyll-sitemap`
- **Exclusions**: Excluded old HTML files and vendor directories

### 2. Data Structure (`_data/apps.yml`)
- **Centralized App Data**: All app information moved from hardcoded HTML to YAML
- **App Properties**: Name, slug, tagline, description, icon, color, store URLs, screenshots, legal links
- **10 Apps Included**: All existing apps migrated with complete data

### 3. Layout System
- **`_layouts/default.html`**: Base layout with head, navbar, footer, and Bootstrap
- **`_layouts/app.html`**: App-specific layout using data from `apps.yml`
- **Template Inheritance**: App pages inherit from default layout

### 4. Reusable Components (`_includes/`)
- **`navbar.html`**: Navigation bar with active state detection
- **`footer.html`**: Footer with app links

### 5. App Collection (`_apps/`)
- **Markdown Files**: Each app has a `.md` file with front matter
- **Front Matter**: Layout specification and app identifier
- **Data Binding**: App data automatically loaded from `apps.yml`

### 6. Homepage (`index.html`)
- **Data-Driven**: Uses `site.data.apps` to generate app sections
- **Dynamic Content**: App information, screenshots, and download buttons generated automatically
- **Responsive Design**: Maintains existing Bootstrap layout

### 7. Dependencies (`Gemfile`)
- **Jekyll 3.9.5**: Compatible with system Ruby
- **Plugins**: SEO tags and sitemap generation
- **Local Installation**: Gems installed in `vendor/bundle/`

## File Structure After Migration

```
mitchell525.github.io/
├── _config.yml                 # Jekyll configuration
├── _data/
│   └── apps.yml               # App data (10 apps)
├── _layouts/
│   ├── default.html           # Base layout
│   └── app.html               # App page layout
├── _includes/
│   ├── navbar.html            # Navigation component
│   └── footer.html            # Footer component
├── _apps/                     # App collection (10 .md files)
│   ├── bounceandbound.md
│   ├── dizzyfrog.md
│   ├── pinballoverdrive.md
│   └── ... (7 more apps)
├── index.html                 # New Jekyll-based homepage
├── Gemfile                    # Ruby dependencies
├── css/                       # Existing CSS (unchanged)
├── js/                        # Existing JavaScript (unchanged)
├── img/                       # Existing images (unchanged)
└── legal/                     # Existing legal pages (unchanged)
```

## How to Test the Migration

### Prerequisites
- Ruby 2.6+ (already available on macOS)
- Bundler gem (`gem install bundler`)

## Live Development with Jekyll

### Quick Start for Live Development

Jekyll provides excellent live development capabilities that automatically rebuild and refresh your site as you make changes:

```bash
# Start the development server with live reload
./startServer.sh

# Or manually:
bundle exec jekyll serve --livereload
```

**What happens:**
- Site runs at `http://localhost:4000`
- Automatically rebuilds when you save files
- Browser automatically refreshes (live reload)
- See changes instantly without manual rebuilds

### Development Server Options

```bash
# Basic live development (recommended)
bundle exec jekyll serve --livereload

# With additional features
bundle exec jekyll serve --livereload --drafts --future

# Watch mode only (manual refresh)
bundle exec jekyll serve --watch

# Custom host and port
bundle exec jekyll serve --livereload --host 0.0.0.0 --port 4000
```

### Perfect for Development Workflow

Live development is ideal for:
- **Editing app data** in `_data/apps.yml`
- **Tweaking layouts** in `_layouts/`
- **Modifying components** in `_includes/`
- **Testing changes** without manual rebuilds
- **Real-time error reporting** during development

### Troubleshooting Development Server

- **Bundler not found:** `gem install bundler`
- **Dependencies missing:** Script auto-installs them
- **Port conflicts:** Change port in `startServer.sh` if 4000 is busy
- **Build errors:** Check terminal output for real-time error reporting

### 1. Install Dependencies
```bash
cd /Users/mitch/development/mitchell525.github.io
bundle install --path vendor/bundle
```

### 2. Build the Site
```bash
bundle exec jekyll build
```

**Expected Output**: 
- Build completes without errors
- `_site/` directory created with generated HTML
- App pages generated in `_site/bounceandbound/`, `_site/dizzyfrog/`, etc.

### 3. Test the Homepage
```bash
# Check if homepage was generated
ls -la _site/index.html

# Verify homepage content includes app data
grep -i "bounce and bound" _site/index.html
grep -i "pinball overdrive" _site/index.html
```

**Expected Results**:
- Homepage should show all 10 apps
- Each app should display correct name, tagline, description
- App store buttons should appear for available apps
- "Coming Soon" should show for Trip Stickers

### 4. Test Individual App Pages
```bash
# Check if app pages were generated
ls -la _site/bounceandbound/
ls -la _site/dizzyfrog/

# Verify app page content
grep -i "jumbotron" _site/bounceandbound/index.html
grep -i "download now" _site/bounceandbound/index.html
```

**Expected Results**:
- Each app should have its own directory with `index.html`
- App pages should show correct app name, tagline, description
- App store download buttons should appear
- Screenshots should display correctly
- Legal links should point to correct privacy policy and terms

### 5. Test Data-Driven Features
```bash
# Check if app data is being loaded
grep -i "bounce and bound" _site/bounceandbound/index.html
grep -i "#33A8FF" _site/bounceandbound/index.html  # App color
grep -i "privacy policy" _site/bounceandbound/index.html
```

**Expected Results**:
- App names, descriptions, and colors should match `apps.yml`
- Store URLs should be correct
- Screenshot paths should work

### 6. Test Navigation and Layout
```bash
# Check if navbar and footer are included
grep -i "navbar" _site/bounceandbound/index.html
grep -i "footer" _site/bounceandbound/index.html

# Verify Bootstrap and CSS are loaded
grep -i "bootstrap" _site/bounceandbound/index.html
grep -i "mitchell525.css" _site/bounceandbound/index.html
```

**Expected Results**:
- All pages should have consistent navbar and footer
- Bootstrap CSS and JS should be loaded
- Custom CSS should be applied

### 7. Test SEO and Meta Tags
```bash
# Check if SEO tags are generated
grep -i "seo" _site/bounceandbound/index.html
grep -i "og:title" _site/bounceandbound/index.html
```

**Expected Results**:
- SEO plugin should generate meta tags
- Open Graph tags should be present
- Page titles should be correct

## Troubleshooting

### Build Errors
- **Gem Issues**: Run `bundle install --path vendor/bundle`
- **Layout Errors**: Check for syntax errors in `_layouts/` files
- **Data Errors**: Verify YAML syntax in `_data/apps.yml`

### Content Not Appearing
- **Layout Not Applied**: Check front matter in app `.md` files
- **Data Not Loading**: Verify app slugs match between `apps.yml` and `.md` files
- **Template Errors**: Check Liquid syntax in layout files

### Missing Pages
- **Collection Issues**: Verify `_config.yml` collection configuration
- **Permalink Issues**: Check collection permalink settings
- **Exclusion Issues**: Ensure app directories are not excluded

## Benefits of the Migration

### For Developers
- **Easy Updates**: Add new apps by editing `apps.yml` + creating one markdown file
- **Consistent Structure**: All pages use same templates and components
- **Data Management**: Centralized app information in one file
- **Template Reuse**: Navbar, footer, and layouts shared across all pages

### For Maintenance
- **Quick Changes**: Update navbar by editing one include file
- **Bulk Updates**: Modify all app pages by changing layout files
- **Version Control**: Better tracking of content vs. presentation changes
- **Automated Builds**: GitHub Pages builds Jekyll automatically

### For SEO
- **Meta Tags**: Automatic generation of title, description, and Open Graph tags
- **Sitemap**: Automatic sitemap generation
- **Structured Data**: Better search engine understanding

## Next Steps

1. **Test Locally**: Verify all functionality works as expected
2. **Deploy**: Push to GitHub for automatic Jekyll build
3. **Monitor**: Check GitHub Pages build logs for any issues
4. **Optimize**: Consider adding more Jekyll features (categories, tags, etc.)

## Files Modified

- ✅ `_config.yml` - Jekyll configuration
- ✅ `_data/apps.yml` - App data
- ✅ `_layouts/default.html` - Base layout
- ✅ `_layouts/app.html` - App layout
- ✅ `_includes/navbar.html` - Navigation component
- ✅ `_includes/footer.html` - Footer component
- ✅ `_apps/*.md` - App collection files (10 files)
- ✅ `index.html` - New homepage
- ✅ `Gemfile` - Dependencies
- ✅ `Gemfile.lock` - Locked versions
- ✅ `startServer.sh` - Development server script with live reload

## Files Excluded from Jekyll

- `bounceandbound/` - Old HTML files
- `dizzyfrog/` - Old HTML files
- `pinballoverdrive/` - Old HTML files
- `pinfinitesmash/` - Old HTML files
- `tapandteleport/` - Old HTML files
- `pinballdefenseforce/` - Old HTML files
- `surgeblast/` - Old HTML files
- `shiftandshatter/` - Old HTML files
- `pockettravelplanner/` - Old HTML files
- `tripstickers/` - Old HTML files

These directories are excluded to prevent conflicts with the new Jekyll collection.

