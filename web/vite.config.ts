import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    checker({
      eslint: {
        lintCommand: 'eslint src --ext .js,.jsx,.ts,.tsx',
      },
      typescript: true,
    }),
  ],
})
