# Prompt 1

Genera los archivos de contexto utilizando @INIT.md como base.

# Prompt 2 - lanza la primera fase del proyecto

Empieza el proyecto siguiendo el protocolo de docs/CONTEXT.md. Lee docs/PROGRESS.md para ubicarte, después ejecuta la fase 0 de docs/ARCHITECTURE.md (scaffolding: Astro estático +
TypeScript estricto + Tailwind v4, estructura de carpetas, build inicial funcional).
Verifica con npm run build y anota el resultado en docs/PROGRESS.md. Usa comandos no interactivos siempre que sea posible.

# Prompt 3 - Cerrar sesión

Antes de terminar la sesión, deja el proyecto reanudable: verifica que docs/PROGRESS.md refleje la fase actual y los siguientes pasos, que ARCHITECTURE/DESIGN estén al día con las decisiones tomadas hoy, y que no queden cambios sin verificar.

# Prompt 4 - Continuar en nueva sesión

Continúa con la siguiente fase pendiente según docs/PROGRESS.md, siguiendo el protocolo de docs/CONTEXT.md. Lee primero la bitácora y la fase correspondiente en docs/ARCHITECTURE.md.
Verifica la fase (npm run build, y npx astro check cuando haya código Astro/TS) y anota los cambios y decisiones en docs/PROGRESS.md antes de terminar.

# Prompt 5 - Siguientes fases

Continúa con la siguiente fase pendiente según docs/PROGRESS.md, siguiendo el protocolo de docs/CONTEXT.md. Lee primero la bitácora y la fase correspondiente en docs/ARCHITECTURE.md.
Verifica la fase (npm run build, y npx astro check cuando haya código Astro/TS) y anota los cambios y decisiones en docs/PROGRESS.md antes de terminar.

# Prompt 6 - Revisión de estado

Lee docs/PROGRESS.md y docs/ARCHITECTURE.md y dime: en qué fase estamos, estado de cada fase anterior, próximos pasos y qué habilita la siguiente fase.

# Prompt 7 - Revisiones de secretos

Revisa si el proyecto tiene alguna filtración de secretos como claves de API o cualquier cosa que no se deba subir a GitHub.

# Prompt 8 - El agente no hace lo que le toca

Revisa docs/PROGRESS.md y corrige el alcance: no adelantes fases futuras. Reverte lo que pertenezca a una fase posterior y deja solo los cambios de la fase actual, siguiendo el protocolo de docs/CONTEXT.md.

# Prompt 9 - Verificación fallida

La verificación (npm run build / npx astro check) ha fallado. Diagnostica el fallo, corrígelo sin salir del alcance de la fase actual, vuelve a verificar hasta que pase y anota el incidente en docs/PROGRESS.md (causa + arreglo).
