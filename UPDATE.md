# Novedades de OpenCode 2 frente a OpenCode 1

Guía rápida para ponerte al día: qué cambia al pasar de OpenCode 1 (V1) a OpenCode 2 (V2) y qué tienes que tocar tú.

## Resumen en 30 segundos

V2 usa el mismo comando `opencode` que V1 y **tu configuración actual sigue funcionando**: `opencode.json`, los `AGENTS.md`, las carpetas `.opencode/` y tus skills se leen igual que antes. No tienes que reescribir nada por obligación.

Lo que sí notarás al usarlo:

- 🔀 **Cambiar de agente**: antes `Tab`, ahora `Shift+Tab`.
- 🧠 La skill oficial de configuración cambia de nombre: `customize-opencode` → `opencode`.
- ⚙️ La configuración del terminal pasa de `tui.json` (por proyecto) a un único `cli.json` global.
- 🖥️ OpenCode ahora funciona como **cliente + servicio en segundo plano**.
- Solo hay 3 cambios incompatibles de forma intencionada: **plugins**, **API del servidor** y **configuración del terminal**.

## Instalación

V1 y V2 ya **no se instalan lado a lado**. Instala V2 con el instalador oficial de terminal: sustituirá al binario de V1. Si tenías V1 instalado con un gestor de paquetes, desinstálalo antes de instalar V2.

## Atajos de teclado

### Cambiar de agente: `Tab` → `Shift+Tab`

| Acción | V1 | V2 |
| ------ | -- | -- |
| Siguiente agente | `Tab` | `Shift+Tab` |
| Agente anterior | `Shift+Tab` | sin atajo por defecto |

En V2, `Tab` ya no cambia de agente: ahora se usa para completar autocompletados y diálogos. Si quieres el atajo inverso, configúralo tú mismo (ver abajo).

### Dónde se configuran

- **V1**: `tui.json` (global y por proyecto).
- **V2**: un único archivo **global** `~/.config/opencode/cli.json`. En el primer arranque, V2 migra tu `tui.json` automáticamente y deja el archivo de V1 intacto.
- Los nombres de los atajos cambian de convención: `agent_cycle` → `agent.cycle`, `command_list` → `command.palette.show`, `theme_list` → `theme.switch`, etc. (guiones bajos → puntos).
- La forma más fácil de cambiar la mayoría de ajustes del terminal: dentro del TUI, pulsa `Ctrl+P` y elige **Open settings**.

Ejemplo en `cli.json`:

```json
{
  "keybinds": {
    "agent.cycle.reverse": "tab"
  }
}
```

### Otros atajos nuevos o útiles

- `f2` / `shift+f2` — saltar al modelo usado recientemente (siguiente/anterior).
- `ctrl+t` — cambiar de variante del modelo (por ejemplo `high`, `low`).
- `ctrl+a` — listar proveedores desde el diálogo de modelo.
- `ctrl+x` (tecla líder) + `a` — listar agentes.

## Skills

- **Renombrada**: la skill oficial para trabajar con la configuración de OpenCode pasa de `customize-opencode` a **`opencode`**.
- **Ubicación preferida** en V2: `.opencode/skills/<skill-id>/SKILL.md`.
- Siguen descubriéndose automáticamente estas rutas: `skill/`, `.claude/skills/`, `.agents/skills/` y `~/.config/opencode/skills/`.
- **Configuración**: en V1 separabas rutas y URLs (`skills.paths` + `skills.urls`); en V2 es un único array `skills`:

```jsonc
{
  "skills": ["./team-skills", "https://example.com/skills/"]
}
```

- **El ID de una skill** se deduce de su ruta de archivo, no del campo `name` del frontmatter.
- Frontmatter nuevo: `slash` (mostrar u ocultar la skill en el selector `/`) y `metadata.opencode/autoinvoke` (que el modelo no la ofrezca solo).

## Configuración `opencode.json`

V1 sigue siendo válida tal cual. La forma nativa de V2 es opcional y hace algunos campos más explícitos. Renombres principales:

| V1 | V2 |
| -- | -- |
| `agent` | `agents` |
| `mode` | `agents` (entran como agentes *primary*) |
| `command` | `commands` |
| `provider` | `providers` |
| `mcp` | `mcp.servers` |
| `plugin` | `plugins` |
| `reference` | `references` |
| `snapshot` | `snapshots` |
| `attachment` | `media` |
| `autoshare` (booleano) | `share` (`"auto"`, `"manual"`, `"disabled"`) |

### Permisos

Antes se agrupaban por herramienta (`permission` + `tools`); ahora es **un solo array ordenado** `permissions`, donde la última regla que coincida gana:

```jsonc
{
  "permissions": [
    { "action": "shell", "resource": "git push *", "effect": "ask" },
    { "action": "edit", "resource": "*", "effect": "allow" }
  ]
}
```

Nombres de acciones renombrados: `bash` → `shell`, `task` → `subagent`, `write`/`patch` → `edit`.

### Agentes y comandos en JSON

- `prompt` → `system`; `disable` → `disabled`; `permission` → `permissions`; `maxSteps` → `steps`.
- La variante se une al modelo: `model` + `variant` → `provider/model#variant`.
- En comandos, `subtask` → `subagent`.

### Proveedores

- `npm` → `package` (con prefijo `aisdk:` para paquetes del AI SDK).
- `api` → `settings.baseURL`.
- `options` se reparten entre `settings`, `headers` y `body`.
- Se fusionaron dos proveedores: `azure-cognitive-services` → `azure` y `google-vertex-anthropic` → `google-vertex`.

### MCP

- Los servidores se agrupan bajo `mcp.servers`; `enabled` pasa a ser su inverso `disabled`; el `timeout` se separa en `catalog` y `execution`.
- Lo más cómodo es usar la CLI: `opencode mcp add`, `opencode mcp list`.
- Los servidores remotos con OAuth se autentican desde `/mcps` (selecciona el servidor y accede).

### Otras notas

- `compaction`: `preserve_recent_tokens`/`reserved` → `keep.tokens`/`buffer`.
- `lsp`: V2 acepta la configuración pero **no ejecuta servidores de lenguaje** ni produce diagnósticos; usa el lint, typecheck o compilador del proyecto.

## Archivos en `.opencode/`

Los directorios antiguos (`agent/`, `agents/`, `mode/`, `modes/`, `command/`, `commands/`) **se siguen descubriendo**. La ubicación preferida en V2:

```text
.opencode/agents/<nombre>.md
.opencode/commands/<nombre>.md
```

- Al mover un archivo de `mode/` o `modes/` a `agents/`, añade `mode: primary` en su frontmatter: esos archivos representaban agentes *primary*.
- En el frontmatter de agentes: `prompt` → `system`, `disable` → `disabled`, `permission` → `permissions`.
- Los comandos delegados (`subagent`) ahora se ejecutan **automáticamente en segundo plano** y reportan resultados a la sesión padre.

## `AGENTS.md`

Sin cambios: tus `AGENTS.md` siguen en su sitio. V2 descubre además `~/.config/opencode/AGENTS.md` y los `AGENTS.md` del directorio actual hacia arriba (hasta tu carpeta personal o la raíz del proyecto, lo que aplique). ❗ V2 ya **no** soporta el fallback de `CLAUDE.md`.

## Servicio en segundo plano

V2 tiene una arquitectura **cliente-servidor**: la interfaz (el TUI, etc.) se conecta a un servicio de fondo que gestiona sesiones, configuración, plugins, permisos y herramientas.

Comandos útiles para diagnosticar:

```sh
opencode service status          # estado del servicio
opencode service restart         # reiniciarlo si se queda colgado
opencode --standalone            # TUI con servidor privado (aisla problemas)
opencode api get /api/info       # comprobar que el servicio responde
```

Logs: `~/.local/share/opencode/log/opencode.log`.

## Lo único realmente incompatible

Solo estos 3 cambios son incompatibles de forma intencionada:

1. **Plugins**: los plugins de V1 **no se ejecutan** en V2. Hay que portarlos a la nueva API de plugins (mover el archivo o cambiar la config no basta).
2. **API del servidor**: la API HTTP cambió; las integraciones que llamaban a la API de V1 deben migrar. Los clientes nuevos se publican como `@opencode/client`.
3. **Configuración del terminal**: `tui.json` (por proyecto) → `cli.json` global (auto-migrado).

Si algo soportado de V1 deja de funcionarte en V2, no es un cambio esperado: es un **bug de compatibilidad** y conviene reportarlo en el repositorio de OpenCode.

## Enlaces oficiales

- Guía de migración V1 → V2: https://opencode.ai/v2/docs/migrate-v1
- Documentación de V2: https://opencode.ai/v2/docs/