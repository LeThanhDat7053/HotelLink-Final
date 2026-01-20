import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Tối ưu chunk size
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Manual chunks để tách code tốt hơn
        manualChunks: {
          // Vendor chunks - libraries lớn
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'antd-vendor': ['antd', '@ant-design/icons'],
          'axios-vendor': ['axios'],
        },
        // Tên file output
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // Minify để giảm size
    minify: 'esbuild', // Dùng esbuild thay vì terser cho nhanh hơn
  },
  // Server optimization
  server: {
    hmr: {
      overlay: false, // Tắt error overlay cho performance
    },
  },
  // Preview optimization
  preview: {
    port: 4173,
    strictPort: false,
  },
})
