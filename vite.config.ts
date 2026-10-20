import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFile } from 'node:fs/promises'
import { resolve } from 'node:path'

// GitHub Pages project sites are served from https://<user>.github.io/<repo>/.
// Change this if the repo is renamed, or set it to '/' for a user/org site
// (https://<user>.github.io) or a custom domain.
const REPO_BASE = '/Portfolio/'

// GitHub Pages serves 404.html for unknown paths. Shipping a copy of index.html
// as 404.html lets React Router resolve deep links such as
// /Portfolio/model_zoo/<slug> on a direct load or refresh.
function spaFallback(): Plugin {
  let outDir = 'dist'

  return {
    name: 'gh-pages-spa-fallback',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
    },
    async closeBundle() {
      await copyFile(resolve(outDir, 'index.html'), resolve(outDir, '404.html'))
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Dev stays at http://localhost:5173/, production builds use the Pages subpath.
  base: command === 'build' ? REPO_BASE : '/',
  plugins: [react(), tailwindcss(), spaFallback()],
}))
