import { defineConfig, loadEnv } from "vite";
import { sites } from "@openai/sites-vite-plugin";
import { existsSync } from "node:fs";
import { renderPage } from "./scripts/render-page.mjs";
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const origin =
    env.SITE_URL ||
    (env.VERCEL_ENV === "production" && env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
      : env.VERCEL_URL
        ? `https://${env.VERCEL_URL}`
        : "");
  return {
    plugins: [
      {
        name: "brington-content",
        transformIndexHtml(html, context) {
          let rendered = renderPage(html, origin);
          if (context.filename && !context.filename.endsWith("/index.html"))
            rendered = rendered.replace(/<link rel="canonical"[^>]+>/g, "");
          return rendered;
        },
      },
      ...(mode !== "vercel" && existsSync(".openai/hosting.json")
        ? [sites()]
        : []),
    ],
    server: { watch: { useFsEvents: false, usePolling: true } },
    build: {
      outDir: "dist/client",
      rolldownOptions: {
        input: {
          main: "index.html",
          privacy: "privacy.html",
          credits: "image-credits.html",
        },
      },
    },
  };
});
