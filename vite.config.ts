import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allow external connections
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: true, // Use true for HTTPS
        rewrite: (path) => path, // Keep the /api prefix - don't remove it
        configure: (proxy) => {
          proxy.on("error", (err) => {
            console.log("Proxy error", err);
          });
          proxy.on("proxyReq", (_, req) => {
            console.log("Sending Request:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req) => {
            console.log("Received Response:", proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
});
