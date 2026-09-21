import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file dựa trên mode (development | production)
  const env = loadEnv(mode, process.cwd(), '')

  const API_BASE_URL = env.VITE_API_BASE_URL || 'http://localhost:4400'

  return {
    plugins: [react()],

    // ===== PATH ALIASES (scalable imports) =====
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@pages': path.resolve(__dirname, './src/Pages'),
        '@components': path.resolve(__dirname, './src/Pages/Components'),
        '@context': path.resolve(__dirname, './src/context'),
        '@data': path.resolve(__dirname, './src/data'),
      }
    },

    // ===== DEV SERVER =====
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: API_BASE_URL,
          changeOrigin: true,
          secure: false,
        }
      }
    },

    // ===== PRODUCTION BUILD OPTIMIZATION =====
    build: {
      // Code splitting tự động theo chunks
      rollupOptions: {
        output: {
          manualChunks: {
            // Tách vendor libraries ra bundle riêng (cache lâu hơn)
            'react-vendor': ['react', 'react-dom'],
            'router-vendor': ['react-router-dom'],
            'ui-vendor': ['react-hot-toast'],
          }
        }
      },
      // Cảnh báo nếu chunk > 500kb
      chunkSizeWarningLimit: 500,
      // Minify output
      minify: 'esbuild',
      // Source map chỉ bật khi development
      sourcemap: mode === 'development',
    },

    // ===== PERFORMANCE =====
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'react-hot-toast']
    }
  }
})
