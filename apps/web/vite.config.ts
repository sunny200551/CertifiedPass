import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["@rainbow-me/rainbowkit", "wagmi", "viem", "zod", "react-router-dom"],
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  build: {
    target: "es2020",
    rollupOptions: {
      output: {
        manualChunks: {
          "three": ["three"],
          "react-three": ["@react-three/fiber", "@react-three/drei"],
          "wagmi": ["wagmi", "viem", "@rainbow-me/rainbowkit"],
          "query": ["@tanstack/react-query"],
          "motion": ["framer-motion"],
        },
      },
    },
  },
});
