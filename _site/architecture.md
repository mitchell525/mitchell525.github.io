### Architecture and Layout

This site is a static portfolio composed of standalone HTML pages styled with Bootstrap and a small custom CSS file. There is no build step or framework runtime; navigation is conventional links. A minimal amount of jQuery is used for:
- Lazy‑loading a shared footer template
- Adding a scroll‑based fade‑in animation class

#### Directory structure
- `index.html`: Landing page that highlights all apps in vertically stacked sections. Each section links to a dedicated app subsite.
- `about/`, `newsletter/`, `legal/`: Secondary content pages with the same navbar structure. Most of these pages load the shared footer via jQuery.
- `<app>/` directories: One directory per app (e.g., `pinballoverdrive/`, `pinfinitesmash/`, `surgeblast/`, `dizzyfrog/`, `bounceandbound/`, `shiftandshatter/`, `jogit_logit/`, `pockettravelplanner/`, `tripstickers/`, etc.). Each typically contains:
  - `index.html`: App marketing page (hero, description, screenshots, store badges)
  - `product.html` (optional): Redirects to `index.html` for legacy links
  - `img/`: App‑specific images (icons, screenshots)
- `templates/`: Shared HTML fragments:
  - `footer.html`: Global footer with cross‑links to app pages and script tags for Bootstrap and the site JS
  - `header.html`, `navbar.html`: Unused by most current pages; the navbar HTML is usually inlined per page
- `css/mitchell525.css`: Sitewide styles (layout helpers, footer, fade‑in animation, image sizing, etc.)
- `js/mitchell525.js`: Scroll handler that applies the `is-visible` class to elements with `fade-in`
- `img/`: Global assets (store badges, shared icons, preview composites)
- `startServer.sh`: Helper to run a local static server on port 9000

#### Page composition
- All pages include Bootstrap CSS via CDN and `css/mitchell525.css`.
- A consistent navbar is included inline in each page for simplicity.
- Most non‑home pages load the shared footer with jQuery:

```html
<script src="https://code.jquery.com/jquery-3.5.1.min.js" crossorigin="anonymous"></script>
<script>
  $(function () { $("#footer").load("/templates/footer.html"); });
  </script>
...
<div id="footer"></div>
```

The home page inlines a footer block instead of loading the template (historical choice; either approach works).

#### Styling and behavior
- Custom classes like `ms_row`, `ms_row_head`, `ms-footer`, `ms-store-logo`, and `ms-img` control layout and spacing.
- Elements using the `fade-in` class become visible when scrolled into view. Logic lives in `js/mitchell525.js`, styles in `css/mitchell525.css`.

#### Adding a new app section (conventions)
1. Duplicate an existing app directory (e.g., `pinballoverdrive/`) as a starting point.
2. Replace text, links, and images; keep the navbar and footer patterns consistent.
3. Update the global footer links in `templates/footer.html` if you want the app listed there.
4. Optionally add a section to the home page `index.html` to feature the new app.

**Recent addition**: Trip Stickers app (`tripstickers/`) - A travel sticker and journal app currently in development, featuring vintage travel art inspiration and premium features for exporting and exclusive icon packs.

#### SEO and analytics
- Pages include Open Graph tags and JSON‑LD organization markup pointing to the site icon.
- Google Analytics (Universal Analytics) is loaded via the global tag snippet on pages that include it.


