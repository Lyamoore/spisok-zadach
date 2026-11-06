import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1]
const base = process.env.GITHUB_PAGES === 'true' && repository ? `/${repository}/` : '/'

export default defineConfig({
  base,
  plugins: [react()],
})
