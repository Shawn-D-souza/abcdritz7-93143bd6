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
    rollupOptions: {
      output: {
        manualChunks: {
          // Splits large libraries into a separate cached chunk
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@tanstack/react-query', 'lucide-react']
        }
      }
    }
  },
});
