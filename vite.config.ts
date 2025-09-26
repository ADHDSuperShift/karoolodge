import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  define: {
    global: "globalThis"
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis"
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Removed AWS cognito chunk - no longer needed
        }
      }
    },
    // Help with build issues on different architectures
    target: 'esnext',
    minify: 'esbuild'
  },
  server: {
    host: "::",
    port: 8080,
    headers: {
      "Content-Security-Policy": [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cognito-idp.us-east-1.amazonaws.com",
        "connect-src 'self' https://cognito-idp.us-east-1.amazonaws.com https://cognito-identity.us-east-1.amazonaws.com https://*.appsync-api.us-east-1.amazonaws.com https://*.amazonaws.com https://www.google.com https://maps.googleapis.com https://maps.gstatic.com http://localhost:4000 http://localhost:4001 https: http: ws: wss:",
        "img-src 'self' data: https://maps.googleapis.com https://maps.gstatic.com https://*.googleusercontent.com https: http: blob:",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com data:",
        "frame-src 'self' https://www.google.com https://maps.google.com"
      ].join('; ')
    }
  },
  plugins: [
    react()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
