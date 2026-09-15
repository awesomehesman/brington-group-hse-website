import { defineConfig } from 'vite';

export default defineConfig({
  server: { watch: { useFsEvents: false, usePolling: true } },
  build: { outDir: 'dist/client' }
});
