// @ts-check
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://MisakaRinOwO.github.io',
  base: '/portfolio',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
