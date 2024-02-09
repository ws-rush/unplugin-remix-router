import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Inspect from 'vite-plugin-inspect'
import remixRouter from '../src/vite'

export default defineConfig({
  plugins: [
    react(),
    Inspect(),
    remixRouter(),
  ],
})
