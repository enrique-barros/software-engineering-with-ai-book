# Ingeniería de software agéntica con inteligencia artificial: Versión OpenCode

Código, prompts y proyectos del libro **«Ingeniería de software agéntica con inteligencia artificial: Versión OpenCode»** de [Enrique Barros Fernández](https://github.com/enrique-barros).

[![Amazon](https://img.shields.io/badge/Amazon-Comprar-FF9900?logo=amazon&logoColor=white)](https://www.amazon.es/dp/B0HKCX7WTB/)
[![Idioma](https://img.shields.io/badge/idioma-espa%C3%B1ol-blue)](#)
[![Licencia](https://img.shields.io/badge/licencia-MIT-green)](#licencia)

---

## Sobre el libro

Corren tiempos difíciles para cualquier desarrollador de software profesional, y mucho peores para los que quieren empezar desde cero ahora mismo. Desde el despliegue masivo de la inteligencia artificial generativa, la forma de trabajar ha cambiado de una manera brutal.

Este libro va desde los fundamentos más básicos de la IA, pasando por **entornos agénticos (OpenCode en esta versión)**, el control de versiones, arquitecturas con IA, hasta las nuevas disciplinas como **context engineering**, **harness engineering**, **loop engineering** y **graph engineering**.

En casi cada capítulo todo lo explicado se pone en práctica en proyectos sencillos y fáciles de entender.

### ¿Para quién es?

- Vibe coders.
- Personas que saben algo de programación a la antigua.
- Desarrolladores junior.
- Desarrolladores mid o senior que solo han tocado chats de IA (ChatGPT, etc.) o han probado un poco los agentes.
- Cualquier persona que quiera algo de luz en todo este lío de la IA.

> Disponible en Amazon: **https://www.amazon.es/dp/B0HKCX7WTB/**

---

## Contenido del repositorio

Este repositorio contiene los materiales prácticos de cada capítulo. Cada carpeta `cpN/` agrupa los prompts, la configuración y los proyectos usados en el capítulo correspondiente.

| Carpeta | Tema                          | Contenido                                                                                                      |
| ------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `cp1/`  | Especificación de requisitos  | Especificación funcional (reset de contraseña) en español (`es/`) e inglés (`en/`).                            |
| `cp4/`  | Primeros pasos con OpenCode   | Entorno virtual Python, API mínima con FastAPI (`main.py`) y `AGENTS.md` para modos _plan_ y _build_.          |
| `cp5/`  | Flujo de trabajo con Git y CI | Prompts de práctica, web convertidor de unidades (HTML/CSS/JS) y workflow de GitHub Actions con OpenCode.      |
| `cp6/`  | Configuración, permisos y MCP | Prompts sobre `opencode.json`, permisos, skills y servidores MCP (Jira).                                       |
| `cp7/`  | Context engineering           | `INIT.md`, proyecto de sitio de startup con Astro + Tailwind v4, skills y documentación de contexto (`docs/`). |
| `cp8/`  | Arquitectura                  | Prompts y `AGENTS.md` de arquitectura limpia (`clean-architecture/`) y diagramas Mermaid.                      |
| `cp9/`  | Harness engineering           | Prompts y harness de validación con AST de Python y rollback automático (`.opencode/harness/`).                |
| `cp10/` | Sistemas multiagente          | Grafo de agentes (orquestador, data engineer, backend, frontend, reviewer), skills y dataset de ejemplo.       |

> Las carpetas `cp2/` y `cp3/` no contienen código; su contenido es teórico y no forma parte de este repositorio.

---

## Cómo usar este repositorio

Cada capítulo es autocontenido. Para reproducir las prácticas:

1. Instala [OpenCode](https://opencode.ai) y el runtime que necesite cada capítulo (Python, Node.js, etc.).
2. Entra en la carpeta del capítulo que quieras practicar.
3. Lee los archivos `prompts*.md` del capítulo: contienen los prompts exactos usados en el libro.
4. Ejecuta los comandos indicados en cada `AGENTS.md` o en la documentación de la carpeta.

### Requisitos habituales

- [OpenCode](https://opencode.ai)
- Python 3.14+ y `venv` (capítulos 4, 5, 6, 9 y 10)
- Node.js 20+ (capítulos 7 y 8)
- Git y una cuenta de GitHub (capítulos 5, 7 y 10)

---

## Recursos enlazados en el libro

- Proyecto del capítulo 7 desplegado en Vercel: https://startup-site-opal.vercel.app/
- Documentación de OpenCode: https://opencode.ai/docs

---

## Autor

**Enrique Barros Fernández** — desarrollador informático con amplia experiencia en distintos ámbitos.

- GitHub: [@enrique-barros](https://github.com/enrique-barros)
- Amazon: [Perfil de autor](https://www.amazon.es/-/en/Enrique-Barros-Fern%C3%A1ndez/e/B0CSPN1DC7)

Si el repositorio te resulta útil, una reseña del libro en Amazon ayuda mucho. Gracias :D ⭐

---

## Licencia

El código de ejemplo de este repositorio se distribuye bajo la licencia **MIT**. El texto del libro y sus explicaciones son propiedad del autor.
