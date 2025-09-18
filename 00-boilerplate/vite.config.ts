import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    restoreMocks: true,
    environment: 'jsdom',
    setupFiles: ['./config/test/setup.ts']
  }
});
