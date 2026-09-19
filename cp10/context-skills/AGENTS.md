# agents.md — Orquestación del Sistema Multiagente

> **Contrato raíz del harness.** Cargado como instrucción global por `opencode.json` (`instructions`).
> Define la topología del grafo, el bucle de retroalimentación, la gestión de memoria compartida, las reglas de anti-bucle/coste y los contratos de datos estrictos. Los agentes se referencian con `@Nombre` y están definidos en el harness.

## 1. Propósito y Objetivo del Proyecto

Este repositorio es el proyecto práctico del libro *Sistemas Multiagente y Context Engineering*: la construcción guiada de una aplicación web completa — **PostgreSQL** (datos), **FastAPI** (API REST) y **React + Tailwind CSS** (cliente web) — ejecutada por un grafo de agentes con bucles de retroalimentación.

El grafo no es una metáfora: sus nodos son agentes reales configurados en `opencode.json`, cada uno con roles y permisos propios. Sus aristas son **contratos de datos JSON estrictos** (Section 6). Ejecutar este proyecto equivale a ejecutar el caso de estudio del libro.

- **Memoria compartida (MC):** `state/estado.json` — la única fuente de verdad.
- **Orquestador (MO):** `@MasterOrchestrator` — estratega, único nodo con acceso de escritura a MC.
- **Ejecutores:** `@DataEngineer`, `@BackendCoder`, `@FrontendCoder` — cada uno con un dominio exclusivo.
- **Validador:** `@Reviewer` — ejecuta linters/builds/tests en entorno aislado; no modifica código.

## 2. Topología Central del Grafo

El diagrama canónico vive en `docs/diagrama.md` (se carga como instrucción global del harness). Resumen:

```
             ┌─────────────────────────────────────────┐
             │            MEMORIA COMPARTIDA (MC)       │
             │         state/estado.json (estado-v1)    │
             └────────────────────┬────────────────────┘
                                  │ <--> (única conexión)
                     ┌────────────▼────────────┐
                     │   @MasterOrchestrator    │
                     └──────┬──────┬──────┬─────┘
                            │      │      │
                    TaskContract (entrada filtrada)
                            │      │      │
                 ┌──────────▼─┐ ┌──▼────────┐ ┌──▼──────────────┐
                 │ DataEngineer│ │BackendCoder│ │  FrontendCoder │
                 └──────────┬─┘ └──┬────────┘ └──┬──────────────┘
                            │      │      │
                    DeliverableContract (resultado)
                            │      │      │
                     ┌────────▼──────▼──────▼────────┐
                     │          @Reviewer             │
                     └──────────────┬────────────────┘
                                    │ ReviewReport (veredicto + evidencia)
                                    ▼
                               @MasterOrchestrator  ──► MC (estado actualizado)
```

**Reglas topológicas (invariantes):**

1. **Sin aristas laterales.** Los ejecutores no se comunican entre sí ni con MC directamente. Toda interacción transita por MO.
2. **El reviewer es terminal y sin estado.** No reescribe código y no elige él mismo la corrección; su salida alimenta a MO, que decide.
3. **El dominio es exclusivo.** Cada ejecutor solo puede escribir dentro de su ámbito (`db/**`, `src/backend/**`, `src/frontend/**`). Esto se impone por hardware (el harness) y no por convención (ver Section 9).
4. **Iteración acotada.** Toda ruta MO→ejecutor→REV→MO consume un intento; el techo es 3 reintentos por subtarea.

## 3. Flujo General de Ejecución

Secuencia canónica para cada objetivo de alto nivel:

1. **Ingesta de objetivo.** MO recibe el objetivo del libro (ej. *"Habilitar GET /api/products"*), consulta MC y lo descompone en subtareas con dependencias topológicas (datos → backend → frontend → revisión).
2. **Planificación de presupuesto.** MO asigna a cada subtarea un `presupuesto_max_tokens`, registra un `checkpoint` (ref de git + snapshot de opencode) y actualiza MC (`estado = EN_COLA`).
3. **Delegación (Context Windowing).** MO emite un `TaskContract` a un único ejecutor con **entrada filtrada estrictamente** — solo los artefactos que necesita para esa subtarea, nunca el contexto global completo.
4. **Ejecución.** El subagente trabaja dentro de su ámbito de permisos y entrega un `DeliverableContract` a MO (`estado = EN_REVISION`).
5. **Validación.** MO reenvía el entregable a `@Reviewer`, que corre linters, builds y tests en el entorno aislado Docker Compose.
6. **Retroalimentación.** REV emite `ReviewReport` a MO:
   - `APROBADO` → MO cierra la subtarea, aplica los cambios al estado y desbloquea dependientes.
   - `RECHAZADO` → MO aplica la política de reintentos (Section 7): re-despacha si quedan intentos, o hace rollback y escala a la humana si el techo se agotó.
7. **Cierre.** MO consolida MC (`presupuesto.consumido`, historial) y, si el objetivo completo pasó su revisión, lo declara listo para la integración final.

## 4. Bucle de Retroalimentación (Feedback Loop)

El bucle es el corazón del libro: **MO → Subagente → Reviewer → Reporte → MO**.

```mermaid
sequenceDiagram
    participant MO as @MasterOrchestrator
    participant S  as @DataEngineer / @BackendCoder / @FrontendCoder
    participant REV as @Reviewer
    participant MC as Memoria (state/estado.json)

    MO->>MC: lee estado v(n)
    MO->>MO: descompone objetivo y fija presupuesto/checkpoint
    MO->>MC: estado v(n+1): TASK-007 = EN_COLA
    MO->>S: TaskContract (entrada filtrada, presupuesto, checkpoint)
    S->>S: ejecuta dentro de su ámbito
    S-->>MO: DeliverableContract (archivos + autochecks)
    MO->>MC: estado: TASK-007 = EN_REVISION
    MO->>REV: DeliverableContract + checklist esperado
    REV->>REV: lint / build / tests en Docker aislado
    REV-->>MO: ReviewReport (APROBADO | RECHAZADO + evidencia)
    alt APROBADO
        MO->>MC: estado: TASK-007 = HECHA (consumo + historial)
        MO-->>S: desbloquea dependientes (si los hay)
    else RECHAZADO
        MO->>MO: intentos < 3 ?
        opt sí (< 3)
            MO->>S: nuevo TaskContract con fallos como entrada adicional
        opt no (= 3)
            MO->>SCG: rollback al checkpoint + escalado humano
        end
    end
```

**Semántica del bucle:**

- **Quién corrige.** El reporte del reviewer es *diagnóstico*, no asignación. MO traduce los fallos en una nueva entrada filtrada para el mismo ejecutor (o uno distinto si el slot de dominio es otro).
- **Anti-memoria selectiva.** Solo el resultado `APROBADO` y su evidencia se consolidan en MC. Los fallos transitorios se descartan del estado global para no contaminar el contexto de otras subtareas.
- **No hay bucles de corrección dentro del subagente.** El subagente no "reintenta a ciegas"; la iteración la gobierna MO con la regla de los 3 intentos.

## 5. Gestión de Memoria Compartida (MC)

MC es **un archivo versionado y transaccional**: `state/estado.json`, esquema `estado-v1`. Es la única conexión del orquestador con la memoria del proyecto.

- **Propiedad exclusiva:** solo MO escribe MC. Los ejecutores y el reviewer no tienen permisos sobre `state/**`.
- **Formato estricto:** si un consumidor exacto del contrato emite un campo inesperado, el contrato se considera roto y la escritura se rechaza (validador de schema en MO).
- **Contenido:** colas de trabajo, tareas con su estado/intentos/presupuesto, checkpoints, presupuesto agregado, historial y versión.

```json
{
  "esquema": "estado-v1",
  "proyecto": { "nombre": "graph-book-demo", "version": "0.1.0" },
  "colas": {
    "backlog": ["TASK-004", "TASK-008"],
    "en_curso": ["TASK-007"],
    "en_revision": [],
    "bloqueadas": []
  },
  "tasks": {
    "TASK-007": {
      "estado": "EN_REVISION",
      "intentos": 1,
      "presupuesto_max_tokens": 20000,
      "tokens_consumidos": 14500,
      "checkpoint": { "ref": "git@v1.2.3", "snapshot": "snap-TASK-007-1" }
    }
  },
  "presupuesto": { "total": 100000, "consumido": 46200, "reserva_emergencia": 10000 },
  "historial": [
    { "task_id": "TASK-003", "veredicto": "APROBADO", "timestamp": "2026-09-17T09:12:00Z" }
  ],
  "ultima_actualizacion": "2026-09-17T10:52:00Z"
}
```

**Escrituras transitivas:** MO lee `v(n)`, produce una decisión y escribe `v(n+1)`. Si dos decisiones colisionan (no debería pasar con un solo orquestador), gana la escritura con `ultima_actualizacion` posterior y se registra el conflicto en `historial`.

### Context Windowing (filtrado estricto del contexto)

Regla de oro: **un subagente nunca ve el estado completo del proyecto**. La saturación de la ventana de contexto es la causa número uno de deriva de tarea y coste descontrolado. El harness lo impone con tres mecanismos:

1. **Contrato de entrada filtrada (semántico).** El `TaskContract` solo incluye:
   - `objetivo` y `aceptacion` (criterios de éxito explícitos).
   - `archivos_permiso` (dónde puede escribir).
   - `archivos_lectura` (solo los que necesita, con su contenido relevante).
   - `dependencias_ok` (precondiciones ya cumplidas, no su historial).
   - `fuera_de_alcance` (lo que queda explícitamente prohibido).
   - **Prohibido:** descripciones largas de otras subtareas, logs completos, reportes de revisiones anteriores (solo el resumen de fallos), TODO el frontend cuando se trabaja backend y viceversa.

2. **Límites de salida de herramientas (mecánico).** `tool_output` en `opencode.json` (400 líneas / 32 KiB) trunca salidas de terminal, impidiendo que un `pytest -v` de 5000 líneas o un volcado de psql inunden la ventana del subagente.

3. **Compaction asistida (operacional).** `compaction` en `opencode.json` (`tail_turns: 10`, `preserve_recent_tokens: 24000`, `reserved: 4000`) compacta el historial del agente cuando el contexto se acerca al límite y reserva siempre una cabeza térmica para el siguiente turno. Además, `steps` limita las iteraciones agénticas por agente (100 orquestador, 40 ejecutores, 25 reviewer), forzando el cierre de bucles largos.

**Principio de la catedral:** el contexto relevante se *entrega*, no se *deja a la exploración*. Si un ejecutor quiere leer algo fuera de `archivos_lectura`, debe pedirlo en el respuesta del contrato; MO decide si amplía la entrada o desestima la solicitud.

## 6. Prevención de Bucles Infinitos y Costes

| Regla | Valor | Mecánica |
| --- | --- | --- |
| **Reintentos por subtarea** | Máximo **3** | Cada `ReviewReport` RECHAZADO incrementa `task.intentos`. Al llegar a 3, la subtarea queda bloqueada y se escala a la humana. El counter se resetea solo con un cambio de scope de la subtarea (re-planificación real, no maquillaje). |
| **Checkpoints / rollbacks** | Por subtarea | Antes de delegar, MO registra `checkpoint = { ref: git, snapshot: opencode }`. Un RECHAZADO sin remedio claro dispara rollback al checkpoint (recuperar la ref de git y/o restaurar el snapshot de opencode), no una corrección a ciegas sobre código roto. |
| **Presupuesto máximo de tokens por ejecución** | Configurable por tarea (`presupuesto_max_tokens`) | Si un ejecutor excede el presupuesto sin entregar, MO corta, hace rollback al checkpoint y reclasifica la tarea (o la escala). El agregado vive en `MC.presupuesto` con `reserva_emergencia` intocable. |
| **Anti-recursión** | `subagent_depth: 2` + `task: deny` | Los subagentes no pueden lanzar subagentes (`task: deny` en su harness) y la profundidad global está acotada por el harness. Solo MO tiene `task: allow`. |
| **Anti-holgazanería** | `steps` por agente | 100 (MO) / 40 (ejecutores) / 25 (REV) iteraciones como techo duro antes de forzar respuesta textual. |
| **Anti-cascada de revisión** | Reviewer sin corrección propia | REV no edita código, no itera "hasta que pase": emite un dictamen con evidencia. Si un build falla por el propio entorno, MO lo detecta (fallo de infraestructura ≠ fallo del ejecutor) y re-emite sin gastar un intento de tarea. |

**Fallo infraestructural vs fallo de código:** si el ROJO de REV viene de la infraestructura (contenedor caído, dependencia no instalada, permiso), NO se consume intento; la subtarea se re-emite con el entorno reparado.

## 7. Contratos de Datos (esquemas estructurales estrictos)

La comunicación entre nodos del grafo usa exclusivamente estos esquemas JSON. Campos obligatorios marcados con `✔`; cualquier desviación rompe el contrato y bloquea el flujo en MO.

### 7.1 `TaskContract` — MO → Ejecutor (entrada filtrada)

```json
{
  "esquema": "task-contract-v1",
  "task_id": "TASK-007",
  "destino": "backend-coder",
  "intento": 1,
  "objetivo": "Implementar GET /api/products con paginación",
  "aceptacion": [
    "200 OK devuelve array paginado",
    "campos expuestos: id, name, price",
    "pytest: 5 tests nuevos en verde"
  ],
  "entrada_filtrada": {
    "archivos_permiso": ["src/backend/app/routers/products.py"],
    "archivos_lectura": [
      "src/backend/app/models/product.py",
      "src/backend/app/schemas/product.py"
    ],
    "dependencias_ok": ["TASK-003: schema de products listo en BD"],
    "fuera_de_alcance": ["frontend/**", "db/**", "psql", "npm"]
  },
  "presupuesto_max_tokens": 20000,
  "checkpoint": {
    "ref": "git@v1.2.3",
    "snapshot": "snap-TASK-007-1",
    "timestamp": "2026-09-17T10:00:00Z"
  },
  "emitido_por": "master-orchestrator"
}
```

Campos obligatorios: `esquema`, `task_id`, `destino`, `intento`, `objetivo`, `aceptacion[]` (≥1), `entrada_filtrada.*`, `presupuesto_max_tokens`, `checkpoint.ref`, `emitido_por`.

### 7.2 `DeliverableContract` — Ejecutor → MO (resultado)

```json
{
  "esquema": "deliverable-contract-v1",
  "task_id": "TASK-007",
  "autor": "backend-coder",
  "intento": 1,
  "entregable": {
    "tipo": "codigo",
    "archivos": ["src/backend/app/routers/products.py",
                 "src/backend/tests/test_products.py"],
    "cambios_resumidos": ["Añade router GET /api/products con paginación y tests"],
    "outputs_autocheck": {
      "lint": "ruff check: 0 errores",
      "tests": "pytest: 5 passed"
    }
  },
  "token_estimado": 14500,
  "timestamp": "2026-09-17T10:35:00Z"
}
```

Campos obligatorios: `esquema`, `task_id`, `autor`, `intento`, `entregable.tipo`, `entregable.archivos[]` (≥1), `token_estimado`.

### 7.3 `ReviewReport` — Reviewer → MO (dictamen)

```json
{
  "esquema": "review-report-v1",
  "reporte_id": "RPT-042",
  "task_id": "TASK-007",
  "revisor": "reviewer",
  "veredicto": "APROBADO",
  "checklist": [
    { "item": "lint",      "resultado": "PASS", "evidencia": "ruff check -> 0 errores" },
    { "item": "tests",     "resultado": "PASS", "evidencia": "pytest -> 5 passed" },
    { "item": "build",     "resultado": "PASS", "evidencia": "uvicorn import + openapi ok" },
    { "item": "scope_guard","resultado": "PASS","evidencia": "diff limitado a src/backend/**" }
  ],
  "fallos": [],
  "recomendacion": "merge",
  "consumo_tokens_estimado": 3100,
  "timestamp": "2026-09-17T10:50:00Z"
}
```

Campos obligatorios: `esquema`, `reporte_id`, `task_id`, `revisor`, `veredicto ∈ {APROBADO, RECHAZADO}`, `checklist[]` (cada item con `resultado ∈ {PASS, FAIL, N/A}`), `timestamp`. Si `veredicto = RECHAZADO`, `fallos[]` debe tener ≥1 elemento `{ item, severidad, detalle, referencia }`.

**Camino de los datos:** `TaskContract` viaja por la arista MO→Ejecutor; `DeliverableContract` por Ejecutor→MO→Rev; `ReviewReport` por REV→MO; la consolidación siempre termina en `state/estado.json` (MC). No hay otro canal de datos en el grafo.

## 8. Matriz de Permisos del Harness (resumen de `opencode.json`)

| Agente | read/glob/grep/list | edit (write) | bash | task | ml de texto (`webfetch`/`websearch`) |
| --- | --- | --- | --- | --- | --- |
| `master-orchestrator` | allow | solo `state/**` y `**/*.md`; `src/**` deny | solo git de consulta; resto deny | allow | allow |
| `data-engineer` | allow | solo `db/**`, `datasets/**`, `sql/**` | solo docker compose, psql/pg_dump/pg_restore, kaggle; resto deny | deny | deny |
| `backend-coder` | allow | solo `src/backend/**` | solo python/pip/uvicorn/pytest/ruff + git de consulta; resto deny (ni psql ni npm) | deny | deny |
| `frontend-coder` | allow | solo `src/frontend/**`, `public/**` | solo npm, npx (vite/tsc/tailwindcss/eslint), node + git de consulta; resto deny | deny | deny |
| `reviewer` | allow | solo `artifacts/reviews/**` (reportes); código deny | solo docker compose, pytest, ruff, npm test/lint/build/type, npx tsc/eslint, git de consulta; resto deny | deny | deny |

Detalles y snippets JSON en los documentos de cada agente bajo `docs/`. El detalle ejecutable está en `opencode.json` (fuente de verdad del harness, no debe divergir de esta tabla).

## 9. Recomendaciones de modelo

Los agentes no fijan modelo en el harness a propósito (el proveedor depende del lector). Recomendación del libro por agente, en orden de coste-beneficio:

| Agente | Perfil | Temperatura |
| --- | --- | --- |
| `master-orchestrator` | Frontier de razonamiento largo (ej. claude-sonnet-4-6) | 0.4 |
| `data-engineer` | Frontier medio, bueno en SQL | 0.3 |
| `backend-coder` | Frontier medio, bueno en Python/FastAPI | 0.4 |
| `frontend-coder` | Frontier medio, bueno en TS/React | 0.5 |
| `reviewer` | Frontier medio, **determinista** | 0.1 |

## 10. Uso del Harness

1. Editar `opencode.json` y **reiniciar opencode** para que la configuración se cargue (no se recarga en caliente).
2. Arrancar sesión con `opencode` (el `default_agent` es `master-orchestrator`) o explícitamente `opencode --agent master-orchestrator`.
3. Dictar el objetivo de alto nivel (ej. *"Pon en marcha la app: schema, API y cliente"*). MO responderá con el plan de subtareas, presupuestos y checkpoints antes de delegar.
4. Los `state/*.json` se generan en ejecución; los reportes del reviewer caen en `artifacts/reviews/`.
5. En cada ciclo MO→REV→MO, revisar `presupuesto.consumido` y el `historial` de `state/estado.json` para observar el bucle de retroalimentación en vivo: es la evidencia del capítulo 6 del libro.