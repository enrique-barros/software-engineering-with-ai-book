import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Content layer de Astro: el copy del sitio vive en colecciones, nunca en
// componentes. Editar contenido aquí no toca el código.

const site = defineCollection({
  loader: glob({ pattern: "config.json", base: "./src/content/site" }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    tagline: z.string(),
    locale: z.string(),
  }),
});

const navMain = defineCollection({
  loader: glob({ pattern: "config.json", base: "./src/content/navMain" }),
  schema: z.object({
    items: z.array(
      z.object({
        label: z.string(),
        href: z.string(),
      }),
    ),
  }),
});

const navLegal = defineCollection({
  loader: glob({ pattern: "config.json", base: "./src/content/navLegal" }),
  schema: z.object({
    items: z.array(
      z.object({
        label: z.string(),
        href: z.string(),
      }),
    ),
  }),
});

// Una entrada por ruta del sitio; `route` es el pathname exacto (BaseLayout lo
// resuelve con Astro.url.pathname). Fase 5 crea las páginas que ya apuntan aquí.
const pages = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/pages" }),
  schema: z.object({
    route: z.string().startsWith("/"),
    title: z.string(),
    description: z.string(),
  }),
});

// Bloques de landing (Fase 4) y secciones de texto (Fase 5). El superset está
// definido ahora; el contenido se siembra en sus fases.
const sections = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/sections" }),
  schema: z.discriminatedUnion("type", [
    z.object({
      type: z.literal("hero"),
      id: z.string().optional(),
      eyebrow: z.string().optional(),
      title: z.string(),
      lead: z.string().optional(),
      cta: z
        .object({
          label: z.string(),
          href: z.string(),
        })
        .optional(),
      secondaryCta: z
        .object({
          label: z.string(),
          href: z.string(),
        })
        .optional(),
    }),
    z.object({
      type: z.literal("features"),
      id: z.string().optional(),
      title: z.string().optional(),
      intro: z.string().optional(),
      items: z.array(
        z.object({
          title: z.string(),
          description: z.string(),
          icon: z.enum(["terminal", "transfer", "ledger"]).optional(),
        }),
      ),
    }),
    z.object({
      type: z.literal("testimonials"),
      id: z.string().optional(),
      title: z.string().optional(),
      items: z.array(
        z.object({
          quote: z.string(),
          author: z.string(),
          role: z.string().optional(),
        }),
      ),
    }),
    z.object({
      type: z.literal("cta"),
      id: z.string().optional(),
      title: z.string(),
      lead: z.string().optional(),
      cta: z.object({
        label: z.string(),
        href: z.string(),
      }),
    }),
    z.object({
      type: z.literal("content"),
      id: z.string().optional(),
      title: z.string().optional(),
      intro: z.string().optional(),
      meta: z.string().optional(),
      blocks: z
        .array(
          z.object({
            heading: z.string().optional(),
            paragraphs: z.array(z.string()).optional(),
            bullets: z.array(z.string()).optional(),
            links: z
              .array(
                z.object({
                  label: z.string(),
                  href: z.string(),
                }),
              )
              .optional(),
          }),
        )
        .default([]),
    }),
  ]),
});

export const collections = { site, navMain, navLegal, pages, sections };
