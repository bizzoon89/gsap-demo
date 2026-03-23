import { defineConfig } from 'vite';

export default defineConfig({
  base: '/gsap-demo/',
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
