import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// @ts-ignore – plain JS plugin, no type declarations needed
import { sitemapPlugin } from "./scripts/vite-plugin-sitemap.js";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), sitemapPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2019",
    cssMinify: 'lightningcss',
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React — cached long-term
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // UI libraries — separate chunk
          ui: ['@tanstack/react-query', 'lucide-react'],
          // Framer Motion — large animation library, lazy-loaded sections will pull this
          motion: ['framer-motion'],
          // Three.js ecosystem — very large, deferred via Background3D
          three: ['three', '@react-three/fiber'],
          // Carousel libraries
          carousel: ['embla-carousel-react', 'embla-carousel-auto-scroll', 'swiper'],
        }
      }
    }
  },
});

