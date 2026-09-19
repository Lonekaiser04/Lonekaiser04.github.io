# Kaiser Mohiuddin — Portfolio

Personal portfolio at **[kaisermohiuddin.me](https://kaisermohiuddin.me)**.
Static site, no build step, no framework — plain HTML, CSS and vanilla JavaScript.

## Structure

```
kaisermohiuddin-portfolio/
├── assets/
│   ├── images/          all photos, icons and favicons
│   └── docs/
│       └── Kaiser_resume.pdf
├── css/
│   └── styles.css       single stylesheet, token-driven
├── js/
│   └── main.js          interactions: scroll-spy, filtering, copy, form
├── index.html
├── privacy.html
├── terms.html
├── favicon.ico          kept at root for the browser's default request
├── site.webmanifest
├── robots.txt
├── sitemap.xml
├── CNAME
└── .nojekyll
```

Every `src`, `href` and `url()` is relative, so the site works when opened
straight from disk as well as when served from a domain root.

## Running it locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` by double-clicking also works; a server is only needed if
you want the clipboard API to use its native path rather than the fallback
(browsers restrict `navigator.clipboard` to secure contexts).

## Editing common things

| What | Where |
|---|---|
| Colours, type scale, spacing | `css/styles.css` → section 1, `:root` |
| Availability pill text | `index.html` → `.status-pill` |
| Hero metrics | `index.html` → `.metrics`, values in `data-count` |
| Experience entries | `index.html` → `#experience`, each `<article class="role">` |
| Projects | `index.html` → `#projectGrid`, each `<article class="project">` |
| Contact details | `index.html` → `#contact` |

### Adding a project

Copy an existing `<article class="project">` block and set `data-tags` to any
combination of `genai`, `cv`, `fullstack`, `mobile`. The filter buttons pick it
up automatically — no JavaScript changes needed.

## Interaction notes

- **Scroll-spy** uses `IntersectionObserver` and picks the section nearest the
  viewport centre, which is steadier than "last one to fire" on fast scrolls.
- **Reveal animations**, **counters** and **filter fades** all check
  `prefers-reduced-motion` and fall back to instant rendering.
- **There is no contact form.** The contact section points at a `mailto:` link,
  the resume and the social profiles, with copy-to-clipboard buttons on both
  email addresses. Nothing is submitted anywhere and no third-party endpoint is
  involved.

## Deploying

Push to the `main` branch of the GitHub Pages repository. `CNAME` keeps the
custom domain bound and `.nojekyll` stops Jekyll from touching the output.

## Licence

Code is MIT. The written content, photographs and the SiratSync brand are not —
please ask before reusing them.
