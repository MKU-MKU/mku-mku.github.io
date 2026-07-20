import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Copies static passthrough files (CNAME, robots.txt, sitemap.xml) from the
// project root into dist/ at build time. These files live flat at the repo
// root rather than in a public/ folder, so Vite doesn't pick them up on its
// own — without this they'd silently be missing from the production build.
function copyStaticFiles(): Plugin {
  const files = ['CNAME', 'robots.txt', 'sitemap.xml'];
  return {
    name: 'copy-static-files',
    closeBundle() {
      for (const file of files) {
        copyFileSync(resolve(__dirname, file), resolve(__dirname, 'dist', file));
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), copyStaticFiles()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
