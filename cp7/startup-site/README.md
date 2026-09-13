# Startup Site

Sitio web estático de una startup: sencillo en alcance, acabado UI/UX cuidada y carga muy rápida.

## 🚀 Demo / Despliegue

- **URL en producción:** [https://startup-site-opal.vercel.app](https://startup-site-opal.vercel.app)

## Stack

- Astro (salida estática)
- TypeScript estricto (`astro/tsconfigs/strict`)
- Tailwind CSS v4 (CSS-first, `@tailwindcss/vite`, sin `tailwind.config.js`)
- Astro Content Collections para el copy editable

## Comandos

| Comando                | Acción                                    |
| ---------------------- | ----------------------------------------- |
| `npm install`          | Instalar dependencias                     |
| `npm run dev`          | Servidor de desarrollo                    |
| `npm run build`        | Build de producción (estático en `dist/`) |
| `npm run preview`      | Previsualizar el build                    |
| `npm run check`        | `astro check` (typecheck de Astro/TS)     |
| `npm run format`       | Prettier (formatea todo)                  |
| `npm run format:check` | Prettier (verificación)                   |

## Estructura

```
src/
  pages/          # rutas (páginas)
  layouts/        # BaseLayout, etc.
  components/     # componentes Astro reutilizables
  content/        # Content Collections (copy, secciones, legal)
  styles/global.css  # @import "tailwindcss" + @theme (tokens)
public/           # favicon y assets estáticos
docs/             # contexto, arquitectura, diseño, progreso
```

## Contexto del proyecto

- `AGENTS.md` — stack, comandos y convenciones.
- `docs/CONTEXT.md` — protocolo operativo de sesión.
- `docs/ARCHITECTURE.md` — fases del proyecto.
- `docs/DESIGN.md` — sistema de diseño y pautas UI/UX.
- `docs/PROGRESS.md` — bitácora del estado real.

## Despliegue

### Vercel (recomendado)

- Framework: **Astro** (lo detecta Vercel automáticamente; `vercel.json` fija `npm run build` y salida `dist/`).
- Fuente del dominio: el `site` de `astro.config.mjs` se resuelve en orden:
  1. Variable de entorno **`SITE_URL`** (define el dominio definitivo en producción), o
  2. `VERCEL_PROJECT_PRODUCTION_URL` (Vercel la asigna), o
  3. provisional `https://corriente.example`.
     De ese valor salen canonical, OG image, `sitemap-index.xml` y `robots.txt` (este último lo genera `src/pages/robots.txt.ts` en el build, por eso no se hardcodea el dominio).
- Node: `package.json` exige `>=22.12.0` (`engines`).

### GitHub

- El repo se sube desde un repositorio externo: no hace falta preparar nada más. `node_modules/`, `dist/` y `.astro/` ya están en `.gitignore`.
- Imágenes de marca generadas con herramientas externas: el `favicon.ico` (16/32/48/256) se reconstruye desde `public/favicon.svg` y el template `scripts/og/og.html` sirve para regenerar `public/og.png` (render con Chrome headless a 1200×630). Solo se regeneran cuando cambia la marca; el resto del build no las toca.
