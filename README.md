# mitchell525.github.io

Personal portfolio website for hosting and showcasing my mobile apps. Deployed via GitHub Pages.

### Live site
`https://mitchell525.github.io`

### Tech stack
- HTML + CSS + JavaScript (no build step)
- Bootstrap 4.3.1 via CDN
- jQuery 3.5.1 for light DOM interactions and template injection
- Google Analytics (UA)

### Local development
Run a simple static server from the repo root:

```bash
./startServer.sh
# or
python3 -m http.server 9000
```

Then open `http://localhost:9000`.

### Project layout
- `index.html`: Home/portfolio landing page with sections for each app
- `about/`, `legal/`: Static content pages
- `<app>/` (e.g., `pinballoverdrive/`, `pinfinitesmash/`, etc.): Per‑app landing pages
- `templates/`: Shared HTML fragments (e.g., `footer.html`) loaded via jQuery on most pages
- `css/mitchell525.css`: Global styles
- `js/mitchell525.js`: Small scroll/fade‑in effect
- `img/`: Shared images (icons, store badges, previews)

See the detailed structure and conventions in [`architecture.md`](./architecture.md).

### Adding a new app page
1. Create a new folder at repo root (e.g., `mynewapp/`).
2. Add `index.html` following the pattern in other app folders, including the jQuery snippet to load the shared footer template.
3. Place app screenshots and icons under `mynewapp/img/`.
4. Update links where appropriate (home page section, `templates/footer.html`).

### Deployment
This repository is configured for GitHub Pages. Merges to `master` become live at `https://<user>.github.io/`.

### License
See [`LICENSE`](./LICENSE).
