import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const base = '/neetcode-with-frenz/'

// https://vite.dev/config/
export default defineConfig(({ command, mode, isPreview }) => ({
  base,
  plugins: [
    react(),
    tailwindcss(),
    command === 'serve' && !isPreview && mode === 'fixtures' && {
      name: 'github-fixtures',
      transformIndexHtml() {
        return [{
          tag: 'script',
          attrs: { type: 'module', src: `${base}tests/install-github-fixtures.mjs` },
          injectTo: 'head-prepend',
        }]
      },
    },
  ],
}))
