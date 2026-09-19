# Skills del Grafo — Catálogo Verificado (skills.sh)

> **Contrato de capacidades del harness.** Este documento define *únicamente* skills descargadas desde el registro verificado [skills.sh](https://skills.sh) (mantenido por Vercel Labs, CLI oficial `npx skills`) o herramientas/CLIs **oficiales** del ecosistema. Queda prohibida la instalación de skills o herramientas de fuentes no verificadas.
>
> - **Verificación de origen:** página pública de la skill en skills.sh + audits independientes (Gen Agent Trust Hub, Socket, Snyk) + organización mantenedora.
> - **Comando de instalación exacto:** pinneado en este documento; el script `scripts/install-skills.sh` los ejecuta todos.
> - **Alcance:** skills instaladas en el directorio de skills del proyecto para el agente `opencode` (se descubren al iniciar sesión; no requieren tocar `opencode.json`).

## 0. Herramienta de instalación verificada

La única fuente permitida de instalación es la CLI oficial del ecosistema skills:

```sh
npx skills add <owner>/<repo> [--skill <nombre>] [-a opencode] [-g] [-y]
```

- No instala nada de forma global: se ejecuta con `npx`.
- El flag `-a opencode` restringe la instalación al agente opencode del harness.
- Alcance por defecto: proyecto (`.opencode/skills/`); con `-g` instala a usuario (`~/.config/opencode/skills/`).
- Telemetría desactivable con `DISABLE_TELEMETRY=1` (opcional, recomendado en CI).

## 1. Matriz de skills seleccionadas (verificadas)

| Skill | Fuente (skills.sh) | Organización | Audits (Trust Hub / Socket / Snyk) | Agente principal | Comando de instalación exacto |
| --- | --- | --- | --- | --- | --- |
| `supabase-postgres-best-practices` | [supabase/agent-skills](https://skills.sh/supabase/agent-skills/supabase-postgres-best-practices) | Supabase (oficial) | PASS / PASS / PASS | `data-engineer` | `npx skills add supabase/agent-skills --skill supabase-postgres-best-practices -a opencode -y` |
| `fastapi-python` | [mindrally/skills](https://skills.sh/mindrally/skills/fastapi-python) | mindrally | PASS / PASS / PASS | `backend-coder` | `npx skills add mindrally/skills --skill fastapi-python -a opencode -y` |
| `vercel-react-best-practices` | [vercel-labs/agent-skills](https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices) | Vercel (oficial) | PASS / PASS / PASS | `frontend-coder` | `npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices -a opencode -y` |
| `tailwind-design-system` | [wshobson/agents](https://skills.sh/wshobson/agents/tailwind-design-system) | wshobson | PASS / PASS / PASS | `frontend-coder` | `npx skills add wshobson/agents --skill tailwind-design-system -a opencode -y` |
| `docker` | [mindrally/skills](https://skills.sh/mindrally/skills/docker) | mindrally | PASS / PASS / PASS | `reviewer` | `npx skills add mindrally/skills --skill docker -a opencode -y` |
| `verification-before-completion` | [obra/superpowers](https://skills.sh/obra/superpowers/verification-before-completion) | obra | PASS / PASS / PASS | `reviewer` | `npx skills add obra/superpowers --skill verification-before-completion -a opencode -y` |

### Opcionales (evaluadas, con caveat)

| Skill | Fuente (skills.sh) | Audits | Nota | Comando |
| --- | --- | --- | --- | --- |
| `test-driven-development` | [obra/superpowers](https://skills.sh/obra/superpowers/test-driven-development) | PASS / PASS / PASS | Añade disciplina red-green-refactor a los ejecutores de código (backend/frontend). Opcional. | `npx skills add obra/superpowers --skill test-driven-development -a opencode -y` |
| `shadcn` | [shadcn-ui/ui](https://skills.sh/shadcn-ui/ui/shadcn) | PASS / PASS / **WARN** | Skill oficial de shadcn/ui. **Contiene directivas de shell** (`!` comandos). Revisar antes de instalar; NO instalar por defecto. Solo si el cliente adopta shadcn/ui. | `npx skills add shadcn-ui/ui --skill shadcn -a opencode -y` |

> **Criterio de exclusión:** `kaggle/kaggle-skills` (org oficial de Kaggle) existe en el registro, pero sus skills son de *competiciones/benchmarks/hackathons*, no de ingesta de datos. Para la ingesta se usa la **CLI oficial de Kaggle** (ver §3). No se instalan skills sin audits PASS/WARN de origen verificado.

## 2. Skills por agente

### 2.1 @DataEngineer — PostgreSQL + Kaggle

**Skill:** `supabase-postgres-best-practices`
- **Qué aporta:** reglas de desempeño de Postgres priorizadas por impacto: diseño de esquemas y migraciones, índice, conexiones/pooling, RLS, concurrencia, tuning, EXPLAIN.
- **Por qué:** mantenida por los responsables de PostgreSQL en Supabase; profundidad en patrones de migración de esquema (`postgres` plano, sin dependencia de la plataforma).
- **Instalación:**
  ```sh
  npx skills add supabase/agent-skills --skill supabase-postgres-best-practices -a opencode -y
  ```
- **Variables de entorno:** sin credenciales propias; el cliente de BD las consume (ver §3).

### 2.2 @BackendCoder — FastAPI / OpenAPI / Pydantic

**Skill:** `fastapi-python`
- **Qué aporta:** FastAPI (Routers, DI, lifespan), **validación Pydantic v2**, patrones async (`asyncpg`, SQLAlchemy 2.0), manejo de errores, middleware, optimización de throughput.
- **Por qué:** la única skill de FastAPI verificada en el registro con audits PASS; cubre explícitamente la capa de validación de esquemas Pydantic v2.
- **Instalación:**
  ```sh
  npx skills add mindrally/skills --skill fastapi-python -a opencode -y
  ```
- **Variables de entorno:** sin credenciales propias. La vinculación a BD se hace vía `DATABASE_URL` (ver §3).

> **Nota de alcance:** no existe en el registro (a fecha de esta documentación) una skill auditada específica de validación de especificación OpenAPI/`openapi.json`. Conforme a la regla de seguridad, esa validación se cubre con **herramienta oficial**: `openapi-spec-validator` (paquete oficial en PyPI), ejecutada por el reviewer.

### 2.3 @FrontendCoder — React + Tailwind CSS

**Skills:**
1. `vercel-react-best-practices` — 69 reglas de React priorizadas (waterfalls de fetching, memoización, tamaño de bundle, tipos). Mantenida por Vercel.
   ```sh
   npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices -a opencode -y
   ```
2. `tailwind-design-system` — Tailwind CSS v4 CSS-first: tokens `@theme`, OKLCH, dark mode, variantes con CVA y patrones de componentes.
   ```sh
   npx skills add wshobson/agents --skill tailwind-design-system -a opencode -y
   ```
- **Variables de entorno:** ninguna requerida por las skills. El scaffolding usa las herramientas oficiales de Node (`npm create vite`, `npx tailwindcss`) cubiertas por la matriz de permisos del harness.

### 2.4 @Reviewer — Docker Compose, linters y tests

**Skills:**
1. `docker` — mejores prácticas de Docker/Docker Compose: imágenes mínimas, multi-stage, seguridad, orquestación con `compose`.
   ```sh
   npx skills add mindrally/skills --skill docker -a opencode -y
   ```
2. `verification-before-completion` — "evidencia antes de claims": obliga a ejecutar el comando de verificación (lint/build/test) y leer su salida completa antes de emitir cualquier PASS. Alinea 1:1 con el rol de dictaminador del reviewer.
   ```sh
   npx skills add obra/superpowers --skill verification-before-completion -a opencode -y
   ```
- **Linters y suites de tests (herramientas oficiales del ecosistema):**
  | Herramienta | Origen (oficial) | Uso |
  | --- | --- | --- |
  | `docker compose` (+ `docker`) | CLI oficial de Docker | Entorno aislado de revisión |
  | `pytest` | PyPI (oficial) | Suite de tests backend |
  | `ruff` (o `flake8`) | PyPI (oficial) | Linter Python |
  | `eslint` | npm (oficial) | Linter TypeScript/React |
  | `npx tsc --noEmit` / `npm run build` | TypeScript/Vite oficiales | Build de tipado y frontend |
- **Variables de entorno:** sin credenciales; el aislamiento se configura en `docker-compose.yml`.

## 3. Herramientas/CLIs oficiales del ecosistema (no-skill)

Conforme a la regla de seguridad (sección "REGLA DE SEGURIDAD ESTRICTA" del objetivo), donde no existe skill verificada se usan únicamente CLIs oficiales.

| Herramienta | Origen oficial | Agente | Variables de entorno requeridas |
| --- | --- | --- | --- |
| Cliente PostgreSQL (`psql`, `pg_dump`, `pg_restore`) | PostgreSQL (binarios oficiales, o dentro del contenedor oficial `postgres` vía `docker exec`) | `data-engineer` | `POSTGRES_URL` (o `DATABASE_URL`) — ejemplo `postgresql://app:app@localhost:5432/graph_book` |
| CLI Kaggle (`kaggle`) | `pip install kaggle` — paquete oficial del equipo Kaggle | `data-engineer` | `KAGGLE_USERNAME`, `KAGGLE_KEY` (credenciales generadas en kaggle.com/settings → API) |
| `openapi-spec-validator` | PyPI (paquete oficial del proyecto OpenAPI) | `reviewer` | — (validación de `api.openapi.json`) |
| `pytest` / `ruff` / `eslint` / `tsc` | PyPI y npm (oficiales) | `reviewer` | — |

## 4. Orden de instalación (resumen ejecutable)

Todo queda orquestado por `scripts/install-skills.sh`:

```
scripts/install-skills.sh [--global] [--check-only] [--skip-kaggle]
```

1. Preflight: `node`/`npx`, `git` presentes (obligatorio); `docker`, `python3` opcionales con WARN.
2. Instala las 6 skills verifificadas de §1 con la CLI `npx skills` (pinned por nombre).
3. Verifica el resultado con `npx skills list` (todas presentes).
4. Comprueba el entorno previo a orquestar: `docker compose version`, `python`, `psql`, `kaggle` y variables `KAGGLE_USERNAME`/`KAGGLE_KEY` (obligatorias si se usa Kaggle).
5. Reporte final: `OK` / `WARN` / `FAIL` con exit code.

## 5. Notas operativas

- Las skills se instalan en el directorio de skills del proyecto y se **descubren al iniciar una sesión nueva de opencode** (no requerido recargar `opencode.json`).
- Las skills son compartidas entre agentes del harness; la columna "Agente principal" indica quién las consume por rol, a efectos de auditoría.
- Verificación manual de una skill antes de instalarla:
  ```sh
  npx skills list <owner>/<repo>   # lista skills del repo sin instalarlas
  npx skills use <owner>/<repo>@<skill>  # genera el prompt sin instalar
  ```
- Auditorías públicas por skill: `https://skills.sh/<owner>/<repo>/<skill>/security/<auditor>` con `auditor ∈ {agent-trust-hub, socket, snyk}`.