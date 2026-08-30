import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '/api')
            }
        }
    },
    build: {
        outDir: 'dist',
        sourcemap: false,
        // Was 'terser', but the terser package isn't declared as a
        // dependency anywhere in package.json, so `npm install && npm run
        // build` (the exact Render build command) fails on a clean
        // checkout. esbuild is bundled with Vite already, minifies just as
        // effectively for this project's needs, and needs no extra install.
        minify: 'esbuild',
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'react-router-dom'],
                    ui: ['lucide-react', 'framer-motion']
                }
            }
        }
    }
})
