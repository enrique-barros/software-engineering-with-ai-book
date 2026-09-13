// robots.txt generado en build: usa el `site` de astro.config.mjs (SITE_URL o
// provisional) para el sitemap; si se hardcodeara en public/, quedaría pegado
// al dominio provisional.
export function GET() {
  const site = import.meta.env.SITE;
  const body = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${new URL("sitemap-index.xml", site).href}`,
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
