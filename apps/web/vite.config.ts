import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
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
        // Chunk Three.js separately — it's large
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
