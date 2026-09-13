# INIT — Generador de contexto del proyecto

Eres un ingeniero de contexto. Voy a construir un sitio web estático de startup con Astro estático (`output: 'static'`) + TypeScript estricto + Tailwind CSS v4 (CSS-first con `@theme`, sin `tailwind.config.js`) + Astro Content Collections para todo el copy. Aún no hay código de aplicación; se trabajará por fases y con contexto entre sesiones.

Despliega exactamente esta estructura:

```
.agents/skills/        # generado al instalar las skills (ver Skills)
docs/
  CONTEXT.md
  ARCHITECTURE.md
  DESIGN.md
  PROGRESS.md
AGENTS.md
opencode.json
skills-lock.json       # generado por skills.sh, NO a mano
```

1. **`AGENTS.md`** — baseline escueto: stack y comandos (`npm install`, `npm run dev`, `npm run build`, `npm run preview`, `npx astro check`, formatter); estructura objetivo (`src/pages|layouts|components|content`, `src/styles/global.css` con `@import "tailwindcss"` + `@theme`, `src/content.config.ts`, `public/`); convenciones (zero-JS por defecto, islands solo para interacción real, imágenes con `astro:assets`, copy editable en collections nunca hardcodeado, tokens visuales solo desde `global.css` + `docs/DESIGN.md`); y "Cómo trabajamos" (por fases de `docs/ARCHITECTURE.md` en orden; al iniciar sesión leer `docs/PROGRESS.md`, la fase actual y `docs/DESIGN.md` si toca UI; cargar skills solo cuando apliquen; anotar en `docs/PROGRESS.md` y actualizar ARCHITECTURE/DESIGN; no cerrar fase sin `npm run build` y `npx astro check`; no adelantar alcance).

2. **`docs/CONTEXT.md`** — protocolo operativo que se carga siempre (vía `instructions`): tabla de arquitectura del contexto, rutina de inicio de sesión, ciclo de cada fase (preparar → ejecutar incremental → verificar → anotar en `PROGRESS.md` con estado `pendiente|en curso|completa|bloqueada` → transicionar solo con la fase completa), reglas de higiene (lazy loading, una sola fuente de verdad, `AGENTS.md` escueto, anotar en el momento, nada de código duro con significado), definición de hecho transversal y transiciones entre sesiones.

3. **`docs/ARCHITECTURE.md`** — tabla de decisiones actuales (stack Astro estático + TS estricto + Tailwind v4, estilos en `@theme`, contenido en collections, zero-JS, `astro:assets`, budget CWV Lighthouse móvil ≥90), árbol de estructura, y 8 fases (0 Scaffolding, 1 Sistema de diseño, 2 Layout y navegación, 3 Arquitectura de contenido, 4 Página principal, 5 Páginas secundarias, 6 Acabado UI/UX, 7 Rendimiento y lanzamiento) cada una con Objetivo/Alcance/Definición de hecho; sección de cambios de arquitectura.

4. **`docs/DESIGN.md`** — identidad (pendiente, Fase 1), 4 principios, tokens en `@theme` (pendientes), componentes del sistema, pautas de composición (incl. evitar clichés: eyebrows ALL-CAPS, acentos terracota/crema, cards con sombra gris, flechas `→`), lista de control UI/UX (AA, focus, landmarks, reduced-motion, 320px/desktop).

5. **`docs/PROGRESS.md`** — tabla de las 8 fases en `pendiente`, entrada de Inicialización fechada hoy (2026-09-13) listando los archivos de contexto y las skills instaladas; estados válidos; registro en cronología inversa.

6. **`opencode.json`**:
   ```json
   { "$schema": "https://opencode.ai/config.json", "instructions": ["docs/CONTEXT.md"] }
   ```

7. **Skills** — instala las 4 skills con **`skills.sh`** desde sus fuentes (esto genera `.agents/skills/` y `skills-lock.json`; no los escribas a mano): `astro` ← `mindrally/skills`, `frontend-design` ← `anthropics/skills`, `performance-testing` ← `petrkindlmann/qa-skills`, `tailwind-4-docs` ← `lombiq/tailwind-agent-skills`.