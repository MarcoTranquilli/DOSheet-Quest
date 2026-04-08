import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/DOSheet-Quest/',
  plugins: [react()],
});
