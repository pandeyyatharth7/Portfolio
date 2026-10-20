# Yatharth Pandey — Portfolio

Personal portfolio website with a "running ML system" aesthetic — designed to feel like an inspectable, live system rather than a generic photo+bio portfolio.

## Tech Stack

- **React** + **TypeScript** — component architecture
- **Vite** — build tool and dev server
- **Tailwind CSS** — utility-first styling with custom design tokens
- **Framer Motion** — scroll animations and hero boot sequence

## Design Philosophy

This portfolio reframes traditional portfolio sections as API endpoints and system components:

- Navigation uses REST-style labels (`GET /about`, `POST /connect`)
- Projects displayed as Hugging Face-style model cards with status indicators
- Skills section styled as a grouped requirements.txt file
- About section formatted as a YAML config block
- Persistent status indicator in the navbar (currently: "status: training")
- Boot sequence animation on hero section

### Design Tokens

```css
bg-base: #0B0E14        /* page background */
bg-surface: #131826     /* cards, panels */
text-primary: #E4E7EC   /* body text */
text-muted: #7B8496     /* secondary text */
accent-violet: #A855F7  /* primary accent */
accent-amber: #F5B942   /* status highlights */
border-subtle: #232833  /* dividers */
```

### Typography

- **Body/Display:** Inter (readable prose)
- **Data/Labels/Code:** JetBrains Mono (nav, status, code blocks, section headers)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dev server will start at `http://localhost:5173` (or the next available port).

## Project Structure

```
portfolio/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx          # REST-style nav with status indicator
│   │   │   ├── StatusIndicator.tsx # Persistent pulsing status dot
│   │   │   └── Footer.tsx
│   │   └── sections/
│   │       ├── Hero.tsx             # Boot sequence animation
│   │       ├── About.tsx            # Config block + bio
│   │       ├── Projects.tsx         # Model card grid
│   │       ├── Skills.tsx           # Grouped requirements list
│   │       └── Contact.tsx          # API call visual with links
│   ├── data/
│   │   └── content.ts               # All portfolio content
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces
│   └── styles/
│       └── index.css                # Tailwind + custom styles
├── tailwind.config.js
└── vite.config.ts
```

## Customization

### Updating Content

All portfolio content lives in `src/data/content.ts`:

- Personal information
- Projects with status, metrics, and URLs
- Skills grouped by category
- Certifications

### Changing Status Indicator

In `src/components/layout/Navbar.tsx`, update the status prop:

```tsx
<StatusIndicator status="training" /> // or "open-to-work", "available", etc.
```

Add new status types in `StatusIndicator.tsx`.

## Accessibility

- Semantic HTML throughout
- Keyboard focus states on all interactive elements
- `prefers-reduced-motion` support — animations disabled for users with that OS setting
- Alt text on images (when applicable)

## Deployment

### GitHub Pages

Deployment is automated by [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml): every push to `main` lints, builds, and publishes `dist/` to GitHub Pages.

One-time setup in the repository:

1. **Settings → Pages → Build and deployment → Source** → select **GitHub Actions**.
2. Push to `main` (or run the **Deploy to GitHub Pages** workflow manually from the **Actions** tab).

The site is published at `https://pandeyyatharth7.github.io/Portfolio/`.

#### How the Pages config works

- `vite.config.ts` sets `base: '/Portfolio/'` for production builds, so asset URLs resolve under the repo subpath. Development still runs at `http://localhost:5173/`.
- `src/App.tsx` passes `basename={import.meta.env.BASE_URL}` to `BrowserRouter`, keeping routes aligned with that subpath.
- The `gh-pages-spa-fallback` Vite plugin copies `dist/index.html` to `dist/404.html`, so deep links like `/Portfolio/model_zoo/<slug>` work on direct load or refresh.
- `public/.nojekyll` stops GitHub Pages from running Jekyll over the build output.

**If you rename the repo**, update `REPO_BASE` in `vite.config.ts`. **If you host this as a user/org site** (`https://<user>.github.io`) or on a custom domain, set `REPO_BASE` to `/`.

### Other hosts

Also deployable to **Vercel**, **Netlify**, or any static host. Build output goes to `dist/`:

```bash
npm run build
# Deploy the dist/ folder
```

For hosts that serve from the domain root, set `REPO_BASE` to `/` so assets are not prefixed with the repo name.

## License

MIT — feel free to fork and adapt for your own portfolio.

---

Built by [Yatharth Pandey](https://github.com/pandeyyatharth7)
