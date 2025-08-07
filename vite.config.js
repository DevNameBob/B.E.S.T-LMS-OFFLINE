import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  base: '/best-lms-offline/', // 👈 Set this to your GitHub repo name
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
});