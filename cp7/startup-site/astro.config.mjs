// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// Dominio de producción. Precedencia:
//   1. SITE_URL (variable de entorno, p.ej. el dominio definitivo en Vercel)
//   2. VERCEL_PROJECT_PRODUCTION_URL (Vercel asigna automáticamente)
//   3. Provisional .example hasta que el cliente confirme el dominio real.
// El mismo valor lo usan canonical, OG, sitemap y robots.
const site =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://corriente.example");

// https://astro.build/config
export default defineConfig({
  site,
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
