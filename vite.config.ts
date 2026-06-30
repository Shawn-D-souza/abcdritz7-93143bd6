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
    // es2019 is required: react-snap's postbuild step uses a bundled Chromium ~v69
    // which cannot parse esnext syntax (optional chaining, nullish coalescing, etc.).
    // Bumping to esnext causes SyntaxError during pre-rendering and breaks the build.
    target: "es2019",
    modulePreload: {
      // Modern browsers support <link rel="modulepreload"> natively;
      // skip the ~2 KB polyfill Vite injects by default.
      polyfill: false,
    },
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

