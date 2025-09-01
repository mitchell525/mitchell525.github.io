# Jekyll Migration Plan for mitchell525.github.io

## Overview
Convert the current static HTML site to Jekyll for better maintainability while keeping GitHub Pages compatibility.

## Benefits
- **Templates**: Eliminate repetitive HTML (navbar, footer, head sections)
- **Data Files**: Store app information in `_data/apps.yml` instead of hardcoded HTML
- **Collections**: Use Jekyll collections for app pages
- **Automatic Builds**: GitHub Pages builds Jekyll automatically
- **Easy Updates**: Add new apps by editing YAML files

## Migration Steps

### 1. Create Jekyll Structure
```
├── _config.yml
├── _data/
│   └── apps.yml
├── _includes/
│   ├── head.html
│   ├── navbar.html
│   └── footer.html
├── _layouts/
│   ├── default.html
│   ├── app.html
│   └── page.html
├── _apps/
│   ├── bounceandbound.md
│   ├── dizzyfrog.md
│   └── ...
├── css/
├── js/
├── img/
└── index.html
```

### 2. Data Structure (`_data/apps.yml`)
```yaml
- name: "Bounce and Bound"
  slug: "bounceandbound"
  tagline: "A Retro Themed Puzzle Game"
  description: "Jump into Bounce and Bound, a free, retro-themed puzzle game inspired by the arcade era!"
  icon: "img/ic_material_product_icon_192px copy 2mdpi.png"
  color: "#33A8FF"
  app_store_url: "https://apps.apple.com/us/app/bounce-and-bound/id1511395743"
  play_store_url: "https://play.google.com/store/apps/details?id=com.MitchellSmith.BounceAndBound"
  screenshots:
    - "bounce_and_bound_screenshots_X-1.png"
    - "bounce_and_bound_screenshots_X-2.png"
    - "bounce_and_bound_screenshots_X-4.png"
    - "bounce_and_bound_screenshots_X-5.png"
    - "bounce_and_bound_screenshots_X-6.png"
  privacy_policy: "/legal/bounce_and_bound_privacy_policy.html"
  terms: "/legal/bounce_and_bound_terms_and_conditions.html"
```

### 3. Layout Templates
- **`_layouts/default.html`**: Base layout with head, navbar, footer
- **`_layouts/app.html`**: App-specific layout using data from front matter
- **`_includes/`**: Reusable components (navbar, footer, head)

### 4. App Pages (`_apps/bounceandbound.md`)
```yaml
---
layout: app
app: bounceandbound
---
```

### 5. Homepage (`index.html`)
```yaml
---
layout: default
title: "Mitch Smith: Software Engineer and Hobbyist App Developer"
---
{% raw %}{% for app in site.data.apps %}
<div class="row ms_row">
  <div class="col-md-6 offset-md-1">
    <img src="{{ app.icon }}" height="108" alt="{{ app.name }} icon">
    <h2>{{ app.name }}</h2>
    <p>{{ app.tagline }}</p>
    <p>{{ app.description }}</p>
    <a href="/{{ app.slug }}/" class="btn btn-primary">Learn More</a>
  </div>
</div>
{% endfor %}{% endraw %}
```

## Implementation Priority
1. Set up basic Jekyll structure
2. Create data file with all app information
3. Build reusable layouts and includes
4. Migrate one app page as proof of concept
5. Migrate remaining app pages
6. Update homepage to use data-driven approach
7. Test and deploy

## Benefits After Migration
- **Add new app**: Edit `_data/apps.yml` + create one markdown file
- **Update navbar**: Edit one include file
- **Change styling**: Edit layout files
- **Consistent structure**: All pages use same templates
- **SEO improvements**: Better meta tag management
- **Performance**: Jekyll can optimize assets and generate sitemaps
