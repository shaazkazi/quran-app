import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'quran-data': [
            './src/json/arabic.json',
            './src/json/en.sahih.json',
            './src/json/ur.maududi.json'
          ],
          'vendor': [
            'react',
            'react-dom'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
