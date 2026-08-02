# Yatharth Pandey — Portfolio

Personal portfolio site for **Yatharth Pandey** — B.Tech CSE (AI & ML) @ VIT Chennai.

A dark, 3D-immersive React + Vite + Tailwind site with React Router, Framer Motion, and a quiet React Three Fiber hero scene. Designed to lead with AI/ML work while keeping Software Engineering clearly available.

- **Live preview:** _add your deployed URL here_
- **Stack:** React 18, Vite 5, Tailwind CSS 3, Framer Motion 11, React Three Fiber 8
- **Pages:** Home, About, Projects, Skills, Contact (+ 404)
- **Accent:** `#B6FF3C` (acid lime) on near-black `#0A0A0A`

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
# → open http://localhost:5173

# 3. Production build
npm run build
npm run preview   # serves the production build locally
```

> Requires **Node.js 18+** (Node 20 LTS recommended).

---

## Project structure

```
src/
├── App.jsx                  # Router + page transitions
├── main.jsx                 # Entry point
├── components/
│   ├── common/              # Reusable building blocks (Reveal, SectionHeader)
│   ├── layout/              # Navbar, Footer, Layout, CustomCursor, ScrollProgress
│   └── three/               # R3F hero scene, 2D fallback, smart switcher
├── data/
│   └── portfolio.js         # SINGLE SOURCE OF TRUTH for content
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Projects.jsx
│   ├── Skills.jsx
│   ├── Contact.jsx
│   └── NotFound.jsx
└── styles/
    └── index.css            # Tailwind base + component layer
```

### Editing content

Almost everything you'd want to change lives in **`src/data/portfolio.js`**:

- `profile` — name, tagline, contact details
- `education` — schools, degrees, periods
- `projects` — case-study content (problem, approach, stack, outcome, links)
- `skillGroups` — skill categories and per-skill levels (1-5)
- `beyond` — certifications, hackathons, languages

No need to touch JSX to update copy.

### Editing the design

- **Colors / type / shadows** — `tailwind.config.js`
- **Global styles, button/utility classes** — `src/styles/index.css`
- **Accent hex** — search for `#B6FF3C` in `tailwind.config.js`, `index.css`, and the 3D scene files

---

## Design direction

**3D / immersive** (chosen), committed to restrained rather than showy:

- One hero scene: floating geometric forms + wireframe globe + sparse particles
- Cursor-reactive parallax on the camera (subtle, ~5% lerp)
- Custom two-layer cursor (dot + lagging ring) on fine-pointer devices only
- 2D animated SVG fallback for mobile, touch, reduced-motion, and missing-WebGL
- Framer Motion page transitions and scroll-in reveals across every page

The hero scene is loaded with `React.lazy` so it never blocks first paint, and the fallback runs before WebGL is probed.

---

## Custom cursor

The custom cursor is gated behind `(pointer: fine) and (hover: hover)` — it won't break on touch devices. Add `data-cursor="view"` to any element to expand the cursor ring into a "VIEW" label (used on the featured project cards).

---

## Contact form

The form is **zero-config by default** — it opens the user's email client with a pre-filled `mailto:` link.

To upgrade to a real backend, set a Formspree form ID in `.env.local`:

```bash
VITE_FORMSPREE_ID=your_form_id_here
```

The form will then `POST` JSON to `https://formspree.io/f/<id>`. No other code changes required.

---

## Deployment

### Vercel

The included `vercel.json` rewrites all routes to `/` so React Router handles them.

1. Push to GitHub
2. Import the repo in Vercel
3. Vercel auto-detects Vite — no config needed beyond the included `vercel.json`

### Netlify

The included `public/_redirects` file handles SPA routing.

1. Push to GitHub
2. Import the repo in Netlify
3. Build command: `npm run build` — Publish directory: `dist`

### Other static hosts

Build with `npm run build` and serve the `dist/` folder. Make sure to rewrite all routes to `/index.html` (the configs above do this for Vercel and Netlify).

---

## Browser support

- Modern evergreen browsers (Chrome, Edge, Firefox, Safari)
- Mobile Safari 14+, Chrome Android (with 2D fallback)
- WebGL is best-effort — the site works fully without it

---

## Accessibility notes

- Color contrast checked against `ink-100` on `ink-900` (≥ 12:1)
- All interactive elements have visible focus rings (`focus:ring-2 focus:ring-lime`)
- `prefers-reduced-motion` disables animations and the 3D scene globally
- The custom cursor is **additive** — it never replaces the native cursor on devices that need it

---

## License

MIT — feel free to fork the structure for your own portfolio. Replace the data in `src/data/portfolio.js` and ship.
