import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import pjson from './package.json'

const homepage = pjson.homepage

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [(react as any)()],
  base: homepage,
} as any)
