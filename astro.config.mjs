// @ts-check
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://misakarinowo.github.io',
  base: '/Portfolio',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
