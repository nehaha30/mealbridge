import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/register": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/login": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/foodposts": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/pickups": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/fetchpost": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/deletepost": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/claim": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/available": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/pickupslist": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/claimedname": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
