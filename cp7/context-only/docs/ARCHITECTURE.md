# Arquitectura y Fases del Proyecto

Sitio web de startup: alcance redactado en `AGENTS.md`. Este documento define la arquitectura y el desglose en fases; el estado real de cada fase se anota en `docs/PROGRESS.md`.

## Decisiones de arquitectura (estado actual)

| Área | Decisión | Notas |
|---|---|---|
| Stack | Astro (estático) + TypeScript estricto + Tailwind v4 CSS-first | Sin SSR; `output: 'static'` |
| Estilos | Tokens en `@theme` dentro de `src/styles/global.css` | Sin `tailwind.config.js` |
| Contenido | Astro Content Collections (`src/content/`) | Copy nunca en componentes |
| JS | Zero-JS por defecto; islands solo para interacción real | — |
| Imágenes | `astro:assets` siempre que sea posible | `public/` solo para favicon/OG/estáticos |
| Rendimiento | Budget CWV definido en la skill `performance-testing` | Objetivo Lighthouse móvil ≥90 |

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