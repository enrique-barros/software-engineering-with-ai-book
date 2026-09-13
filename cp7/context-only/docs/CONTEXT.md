# Context Engineering — Protocolo operativo de sesión

Este archivo se carga en contexto en todas las sesiones. Define cómo se organiza y transporta el contexto del proyecto a lo largo de múltiples sesiones y fases.

## Arquitectura del contexto (memoria)

| Archivo | Rol | ¿Cuándo se carga? |
|---|---|---|
| `AGENTS.md` | Baseline: stack, comandos, convenciones | Siempre (automático) |
| `docs/CONTEXT.md` | Protocolo operativo (este archivo) | Siempre (vía `instructions`) |
| `docs/ARCHITECTURE.md` | Fases del proyecto y decisiones de arquitectura | A inicio de sesión / al trabajar una fase |
| `docs/DESIGN.md` | Sistema de diseño y pautas UI/UX | Siempre que se toque UI |
| `docs/PROGRESS.md` | Bitácora: estado real del proyecto, cambios por fase | A inicio de sesión; se actualiza al terminar cada fase |
| Skills (`.agents/skills/*`) | Conocimiento profundo y procedimientos | Bajo demanda, con la herramienta `skill` |

## Rutina al iniciar cada sesión

1. Lee `docs/PROGRESS.md`: identifica la **fase actual**, su estado y los siguientes pasos pendientes.
2. Lee la **fase correspondiente** en `docs/ARCHITECTURE.md` (objetivo, alcance, definición de hecho).
3. Si la fase toca UI: lee `docs/DESIGN.md` y carga los skills `frontend-design` (y `tailwind-4-docs`, `performance-testing` o `astro` según aplique).
4. Resume al usuario: fase actual, lo que toca hacer y plan de trabajo de la sesión.

## Ciclo de trabajo de una fase

Para **cada** fase:

1. **Preparar** — leer objetivos y entregables de `docs/ARCHITECTURE.md`.
2. **Ejecutar** — implementar poco a poco, verificando de forma incremental (no acumular errores).
3. **Verificar** — correr los comandos de la fase (mínimo `npm run build`, y `npx astro check` cuando exista código). Si `docs/PROGRESS.md` define criterios de éxito, comprobar que se cumplen.
4. **Anotar (obligatorio)** — actualizar `docs/PROGRESS.md` con:
   - qué se hizo y archivos/componentes principales tocados;
   - decisiones tomadas (y si cambian el diseño/arquitectura, aplicarlas también en `docs/DESIGN.md` / `docs/ARCHITECTURE.md`);
   - verificación ejecutada y resultado;
   - estado de la fase: `pendiente → en curso → completa` (o `bloqueada` con motivo).
5. **Transicionar** — solo se abre la siguiente fase cuando la actual está completa y verificada.

## Reglas de higiene de contexto

- **Lazy loading**: no cargues skills ni docs que la tarea no necesite; léelos al momento de hacer falta.
- **Una sola fuente de verdad**: si un hecho va a `docs/PROGRESS.md`, no lo dupliques en `AGENTS.md`; referencia el archivo.
- **AGENTS.md escueto**: si crece una regla, muévela a un doc o a una skill, no la acumules en el baseline.
- **Anotar en el momento**: ante una decisión o un gotcha, escríbelo en `docs/PROGRESS.md` de inmediato, no "al final".
- **Nada de código duro con significado**: todo lo editable (copy, tokens) vive donde la arquitectura diga.
- **Compromiso de calidad**: la fase no se cierra sin verificación y sin la anotación en la bitácora.

## Definición de hecho transversal

Una fase queda `completa` solo si:
- su alcance de `docs/ARCHITECTURE.md` está implementado sin conocer trabajo pendiente "obvio",
- `npm run build` pasa sin errores, y `npx astro check` sin errores si hay código Astro/TS,
- `docs/PROGRESS.md` está actualizado con la entrada de la fase, y
- ningún cambio de diseño quedó sin reflejar en `docs/DESIGN.md`.

## Transiciones entre sesiones

Al terminar la sesión deja el estado "reanudable":
- `docs/PROGRESS.md` refleja la fase actual y los siguientes pasos concretos,
- los docs de decisión (ARCHITECTURE/DESIGN) están al día,
- sin cambios sin verificar en el working tree (o committeados, si el usuario lo pide).