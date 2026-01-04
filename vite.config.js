/* eslint-disable no-undef */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import deferNonCriticalCSS from './vite-plugin-defer-css.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh
      fastRefresh: true,
    }), 
    tailwindcss(),
    deferNonCriticalCSS() // Defer CSS loading to prevent render blocking
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Target modern browsers to reduce transpilation
    target: 'esnext',
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 2, // Reduced from 3 to prevent build hanging
      },
      mangle: {
        safari10: true, // Better Safari compatibility
      },
      format: {
        comments: false, // Remove all comments
      },
    },
    // Code splitting configuration
    rollupOptions: {
      output: {
        // Optimized chunking - balance between bundle size and HTTP requests
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // React ecosystem - MUST stay together to avoid duplication
            if (id.includes('/react/') || id.includes('/react-dom/') || 
                id.includes('/react-router') || id.includes('/scheduler/') || 
                id.includes('/react-is/')) {
              return 'react-vendor';
            }
            
            // Radix UI (keep all together - used throughout the app)
            if (id.includes('@radix-ui')) {
              return 'ui-vendor';
            }
            
            // Charts (large, lazy loaded)
            if (id.includes('recharts') || id.includes('d3-')) {
              return 'charts-vendor';
            }
            
            // Markdown & Syntax highlighting (large, lazy loaded in chat)
            if (id.includes('react-markdown') || id.includes('remark-') || 
                id.includes('rehype-') || id.includes('react-syntax-highlighter') || 
                id.includes('refractor') || id.includes('prismjs')) {
              return 'markdown-vendor';
            }
            
            // Framer Motion (large, used for animations)
            if (id.includes('framer-motion')) {
              return 'animation-vendor';
            }
            
            // Table library (large, used in tickets)
            if (id.includes('@tanstack/react-table')) {
              return 'table-vendor';
            }
            
            // Icons (medium, used everywhere)
            if (id.includes('lucide-react') || id.includes('tabler-icons')) {
              return 'icons-vendor';
            }
            
            // All other vendor code together
            return 'vendor';
          }
        },
        // Generate unique names for chunks based on hash
        chunkFileNames: () => {
          // Use shorter names for better caching
          return 'assets/[name]-[hash].js';
        },
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // Separate CSS files
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/[name]-[hash].css';
          }
          return 'assets/[name]-[hash].[ext]';
        },
      },
      // Optimize treeshaking
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
    },
    // Chunk size warnings - more aggressive for mobile
    chunkSizeWarningLimit: 300, // Stricter limit for mobile
    // Source maps for production (disable for faster builds)
    sourcemap: false,
    // CSS code splitting - inline small CSS
    cssCodeSplit: true,
    // Inline small assets (reduced for mobile)
    assetsInlineLimit: 4096, // 4KB - smaller for mobile
    // Optimize module preload
    modulePreload: {
      polyfill: false, // Modern browsers don't need polyfill
    },
    // Report compressed size
    reportCompressedSize: true,
  },
  // Performance optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
    ],
    exclude: [
      '@tanstack/react-table',
      'framer-motion', // Exclude from initial load - only used in authenticated pages
      'recharts', // Defer charts
      'react-markdown', // Defer markdown
      'react-syntax-highlighter', // Defer syntax highlighter
    ],
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://backend-ruddy-eta.vercel.app',
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
  },
})