import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

// Статична збірка для GitHub Pages: сайт живе у підпапці /wonder-cake
export default defineConfig({
  output: 'static',
  base: '/wonder-cake',
  server: { port: 4321 },
  vite: { plugins: [tailwindcss()] },
})
