import { defineConfig } from "vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import React from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

const config = defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    viteTsConfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    React(),
    {
      name: "cross-origin-isolation",
      configureServer(server) {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
          next();
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
          next();
        });
      },
    },
  ],

  server: {
    cors: {
      origin: /https?:\/\/([A-Za-z0-9\-\.]+)?(\.ddev\.site)(:\d+)?$/,
    },
    proxy: {
      "/api/consoles": {
        target: "$CLOUDFLARE_WORKER_URL",
        changeOrigin: true,
        followRedirects: true,
        configure: (proxy) => {
          proxy.on("proxyRes", (_proxyRes, _req, res) => {
            res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
            res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
          });
        },
      },
      "/api/games": {
        target: "$CLOUDFLARE_WORKER_URL",
        changeOrigin: true,
        followRedirects: true,
        configure: (proxy) => {
          proxy.on("proxyRes", (_proxyRes, _req, res) => {
            res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
            res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
          });
        },
      },
      "/api/progress": {
        target: "$CLOUDFLARE_WORKER_URL",
        changeOrigin: true,
        followRedirects: true,
        configure: (proxy) => {
          proxy.on("proxyRes", (_proxyRes, _req, res) => {
            res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
            res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
          });
        },
      },
      "/api/playtime": {
        target: "$CLOUDFLARE_WORKER_URL",
        changeOrigin: true,
        followRedirects: true,
        configure: (proxy) => {
          proxy.on("proxyRes", (_proxyRes, _req, res) => {
            res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
            res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
          });
        },
      },
      "/api/recent": {
        target: "$CLOUDFLARE_WORKER_URL",
        changeOrigin: true,
        followRedirects: true,
        configure: (proxy) => {
          proxy.on("proxyRes", (_proxyRes, _req, res) => {
            res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
            res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
          });
        },
      },
      "/api/archive": {
        target: "https://archive.org",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/archive/, ""),
        followRedirects: true,
        configure: (proxy) => {
          proxy.on("proxyRes", (_proxyRes, _req, res) => {
            res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
            res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
          });
        },
      },
    },
  },
});

export default config;
