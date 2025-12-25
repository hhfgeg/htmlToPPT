import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'HtmlToPPT',
      fileName: 'html-to-ppt',
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['vue', 'pptxgenjs'],
      output: {
        globals: {
          'vue': 'Vue',
          'pptxgenjs': 'PptxGenJS'
        }
      }
    }
  },
  server: {
    open: true
  }
})