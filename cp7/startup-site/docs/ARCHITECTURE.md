# Arquitectura y Fases del Proyecto

Sitio web de startup: alcance redactado en `AGENTS.md`. Este documento define la arquitectura y el desglose en fases; el estado real de cada fase se anota en `docs/PROGRESS.md`.

## Decisiones de arquitectura (estado actual)

| Área | Decisión | Notas |
|---|---|---|
| Stack | Astro (estático) + TypeScript estricto + Tailwind v4 CSS-first | Sin SSR; `output: 'static'` |
| Estilos | Tokens en `@theme` dentro de `src/styles/global.css` | Sin `tailwind.config.js` |
| Contenido | Astro Content Collections (`src/content/`) | Copy nunca en componentes |
| JS | Zero-JS por defecto; islands solo para interacción real | Única mejora JS: `<ClientRouter/>` de View Transitions en BaseLayout (Fase 6), estrictamente progresiva (sin JS = navegación normal) |
| Imágenes | `astro:assets` siempre que sea posible | `public/` solo para favicon/OG/estáticos |
| Rendimiento | Budget CWV definido en la skill `performance-testing` | Objetivo Lighthouse móvil ≥90; cumplido en Fase 7 (100/100/100/100 en las 6 rutas + 404) |
| Marca | "Corriente" + logomarca de dos líneas (provisional) | Confirmar con cliente; fuente de verdad colecciones `site`/`navMain`/`navLegal` (content layer). Favicons/OG image generados desde la logomarca (Fase 7) |
| Dominio | Env-driven: `SITE_URL` → `VERCEL_PROJECT_PRODUCTION_URL` → provisional `corriente.example` | Despliegue en Vercel; única fuente de verdad `astro.config.mjs` (canonical, OG, sitemap, robots) |
| SEO técnico | sitemap (`@astrojs/sitemap`) + `robots.txt` dinámico + OG/Twitter con imagen | Todo derivado del `site` en build (Fase 7) |

## Estructura del proyecto

```
src/
  pages/          # rutas
  layouts/        # BaseLayout, etc.
  components/     # componentes Astro
  content/        # collections (site, nav, pages, sections)
  styles/global.css
  content.config.ts   # schemas zod de las collections
public/           # favicon, OG, assets estáticos
docs/             # contexto, arquitectura, diseño, progreso
```

## Fases

### Fase 0 — Scaffolding
- **Objetivo**: proyecto Astro levantado y funcional.
- **Alcance**: `npm create astro` (template minimal, TS estricto), Tailwind v4 integrado, estructura de carpetas, formatter, `.gitignore`, build inicial.
- **Definición de hecho**: `npm run dev` arranca, `npm run build` funciona sin errores.

### Fase 1 — Sistema de diseño
- **Objetivo**: tokens y base visual consistentes.
- **Alcance**: paleta (neutros + primario + acento), tipografía, escalas (spacing/radius/sombra), `@theme` completo, estilos base (body, headings, focus).
- **Definición de hecho**: tokens aplicados de forma consistente; página/fragmento de muestra usa solo tokens.

### Fase 2 — Layout y navegación
- **Objetivo**: shell reutilizable del sitio.
- **Alcance**: BaseLayout, Header, nav (responsive, con menú móvil accesible), Footer, SEO base (title/description/OG/canonical por página), favicon.
- **Definición de hecho**: navegación completa y accesible en todas las vistas; metas por página.

### Fase 3 — Arquitectura de contenido
- **Objetivo**: el copy y las secciones viven en Content Collections.
- **Alcance**: esquemas zod (site config, páginas, secciones), content inicial, consulta desde páginas/componentes.
- **Definición de hecho**: el sitio renderiza copy desde las collections; editar copy no toca componentes.

### Fase 4 — Página principal (Home)
- **Objetivo**: landing completa y convincente.
- **Alcance**: hero, propuesta de valor, features, prueba social, CTA, footer; componentes reutilizables (Button, Section, Card…).
- **Definición de hecho**: home completa, responsive (320px+), accesible, sin JS innecesario.

### Fase 5 — Páginas secundarias
- **Objetivo**: resto de rutas.
- **Alcance**: features/about, pricing/contacto si aplica, legal (privacidad/términos), 404.
- **Definición de hecho**: todas las rutas funcionan, enlazadas y visualmente consistentes.

### Fase 6 — Acabado UI/UX
- **Objetivo**: pulido fino de interacción y detalle.
- **Alcance**: micro-interacciones, focus/active/hover en todos los interactivos, transiciones suaves (View Transitions si aportan y no degradan rendimiento), `prefers-reduced-motion`, revisión responsive y de escalas tipográficas.
- **Definición de hecho**: revisión manual sin defectos visibles; accesibilidad comprobada.

### Fase 7 — Rendimiento y lanzamiento
- **Objetivo**: rápido y listo para producción.
- **Alcance**: auditoría CWV/Lighthouse (móvil), optimización de imágenes/fuentes, sitemap/robots, verificación SEO, a11y audit, docs finales.
- **Definición de hecho**: Lighthouse móvil ≥90 (performance, a11y, best practices, SEO); build de producción limpio; README/contexto al día.

## Cambios de arquitectura

Cualquier cambio sobre las decisiones anteriores se anota aquí (con fecha y motivo) **y** en `docs/PROGRESS.md`.

- **2026-09-13 · Fase 2 ·** Se define la marca provisional "Corriente" (logomarca de dos líneas) y un dominio provisional `.example` en `astro.config.mjs` (`site`) para canonical/OG. Se añade `src/config/site.ts` como fuente de verdad intermedia de copy de shell (nombre, nav, legal); migrará a Content Collections en Fase 3. La nav apunta a rutas de Fase 5 que aún no existen (pendiente conocido).
- **2026-09-13 · Fase 3 ·** El copy migra a Astro Content Collections (content layer): colecciones `site`, `navMain`, `navLegal`, `pages` y `sections` definidas en `src/content.config.ts` (loaders `glob`, zod 4 vía `astro/zod`) con su contenido inicial en `src/content/`. Se elimina `src/config/site.ts`. `BaseLayout`/`Header`/`Footer` y `index.astro` consultan las colecciones; `BaseLayout` resuelve SEO por ruta contra `pages` con `title` opcional. `sections` queda como unión discriminada (contrato para Fase 4/5), sembrada de momento solo con el hero de la home.
- **2026-09-13 · Fase 4 ·** Home completa con copy real. Componentes nuevos (`Button`, `Section`, `Card`, `HeroPanel`, `FeatureIcon`). El schema de `sections` se reabre: `features.items[]` gana `icon` (enum terminal/transfer/ledger). `index.astro` deja de ser la página de muestra de Fase 1 (ya cumplió su propósito) y renderiza las 4 secciones de la home desde la colección `sections` con orden explícito. El panel del hero es una ilustración de marca (`aria-hidden`).
- **2026-09-13 · Fase 5 ·** Páginas secundarias completas: features, about, contact (nav principal), privacidad, terminos (nav legal) y 404. El tipo `content` de `sections` se reabre al uso real: `body` se sustituye por `intro` + `meta` + `blocks[]` (`heading`/`paragraphs`/`bullets`/`links`). `Section` gana `headingLevel` (`h1`/`h2`) para garantizar un h1 por página. Nuevo componente `ContentSection` que renderiza entradas `content` (hairlines de "libro mayor" entre bloques, bullets con marker primario, `meta` para documentos legales, `links[]` como botones `secondary`). Las 5 páginas + el 404 comparten el mismo esqueleto: orden de ids de secciones + hard-fail si falta la principal. Sin CTA full-bleed en subpáginas (la audacia se queda en la home). Contacto sin formulario (sitio estático sin backend): canales `mailto:`.
- **2026-09-13 · Fase 6 ·** Acabado UI/UX: estados hover/focus/active completos en todos los interactivos y micro-interacción de pulsado única (translate-y 1px + sombra/texto por variante). Morph hamburguesa→X del menú móvil con `group-open` (CSS puro, cero JS). Se incorporan **View Transitions** (`<ClientRouter/>` en `BaseLayout`, crossfade nativo): el sitio admite un único módulo JS de mejora progresiva para navegación (~16 KB min), manteniendo funcionamiento sin JS y cero islands. `prefers-reduced-motion` cubierto por triple vía (regla global de duraciones + guard CSS `::view-transition-*` nuevo + fallback sin-JS del router); no se asume gestión automática del router.
- **2026-09-13 · Fase 7 ·** Lanzamiento. El `site` pasa a ser **env-driven** (`SITE_URL` → `VERCEL_PROJECT_PRODUCTION_URL` → provisional `.example`); se elimina `url` de la colección `site` (una sola fuente de verdad de URLs). SEO técnico: sitemap con `@astrojs/sitemap` (el 404 queda fuera) y `robots.txt` generado en build (`src/pages/robots.txt.ts`) para no hardcodear el dominio. Assets de marca: `favicon.ico` multi-tamaño PNG-embebido y `apple-touch-icon.png` regenerados desde la logomarca; `og.png` (1200×630) creada y referenciada en `og:image`/`twitter:image` (template en `scripts/og/og.html`). Tipografía: preload del woff2 latin (import `?url`). Contraste: token `ink-faint` → `#67736c` (único fallo a11y detectado). Preparación Vercel/GitHub: `vercel.json`, `.gitignore` (+`.vercel/`), README con despliegue. Lighthouse móvil: **100/100/100/100** en las 6 rutas y el 404.