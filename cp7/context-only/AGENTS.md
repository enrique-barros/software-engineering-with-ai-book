# Web Startup — Astro + Tailwind CSS

Sitio web estático de una startup: sencillo en alcance, pero con un acabado UI/UX muy cuidado y carga muy rápida.

## Stack
- Astro con salida estática (`output: 'static'`)
- TypeScript en modo estricto
- Tailwind CSS v4 (tema CSS-first con `@theme`, sin `tailwind.config.js`)
- Astro Content Collections para todo el copy editable

## Comandos
- `npm install` — instalar dependencias
- `npm run dev` — servidor de desarrollo
- `npm run build` — build de producción (estático)
- `npm run preview` — previsualizar el build
- `npx astro check` — typecheck de Astro/TypeScript
- Formato: usa el formatter configurado en el proyecto (p.ej. Prettier)

## Estructura objetivo
- `src/pages/` — rutas (páginas)
- `src/layouts/` — layouts (BaseLayout, etc.)
- `src/components/` — componentes Astro reutilizables
- `src/content/` — Content Collections (copy, secciones, legal)
- `src/styles/global.css` — `@import "tailwindcss"` + `@theme` (tokens)
- `src/content.config.ts` — schemas de las collections
- `public/` — favicon, OG, y assets no gestionados por `astro:assets`

## Convecciones
- Zero-JS por defecto: HTML+CSS primero; las "islands" (Astro Islands) solo para interacción real.
- Imágenes con `astro:assets`, nunca `<img>` con rutas sueltas de `public/`.
- Todo el copy editable vive en Content Collections, no hardcodeado en componentes.
- Toda medida visual sale de los tokens del sistema de diseño (`src/styles/global.css` + `docs/DESIGN.md`).

## Cómo trabajamos (importante)
1. Trabajamos **por fases** definidas en `docs/ARCHITECTURE.md`, en orden, una a una.
2. Al empezar una sesión: lee `docs/PROGRESS.md` (dónde estamos), la fase actual en `docs/ARCHITECTURE.md` y `docs/DESIGN.md` si toca diseño.
3. Carga skills solo cuando apliquen (auto-descubribles desde `.agents/skills/`): `frontend-design` (UI/UX), `astro` (Astro), `tailwind-4-docs` (Tailwind v4), `performance-testing` (Lighthouse/CWV).
4. Al terminar una fase (o tomar decisiones relevantes): **anota los cambios** en `docs/PROGRESS.md` (qué se hizo, decisiones, verificación) y actualiza `docs/ARCHITECTURE.md` / `docs/DESIGN.md` si esas decisiones cambian el sistema.
5. Una fase no se cierra sin verificación: `npm run build` mínimo (y `npx astro check` con código Astro/TS).
6. No adelantes alcance de fases futuras; mantenemos el contexto de la sesión enfocado en la fase actual.