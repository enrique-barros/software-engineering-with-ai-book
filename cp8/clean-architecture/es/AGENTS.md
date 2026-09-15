# Arquitectura del proyecto:

Este proyecto sigue los principios de Clean Architecture de Robert C. Martin. Todo el código fuente debe ubicarse dentro de `src/` y organizarse estrictamente en las siguientes capas, desde el centro hacia el exterior:

## domain/

Contiene exclusivamente:

- Entidades de negocio.
- Objetos de valor (value objects).
- Interfaces de repositorios (puertos de salida).
- Excepciones/Errores propios del dominio.

Esta capa representa el núcleo del dominio y no conoce ninguna tecnología, framework ni mecanismo de persistencia.

## application/

Contiene exclusivamente:

- Casos de uso (una operación del sistema por caso de uso).
- Modelos de entrada y salida de los casos de uso (DTOs o tipos primitivos).

Los casos de uso implementan la lógica de aplicación y coordinan el dominio, pero no conocen detalles de infraestructura.

## infrastructure/

Contiene exclusivamente:

- Implementaciones concretas de los repositorios.
- Acceso a bases de datos y ORMs.
- Configuración técnica y variables de entorno.
- Servicios externos.

## presentation/

Contiene exclusivamente:

- Controladores HTTP.
- Definición de rutas.
- Conversión entre tipos HTTP (`req`, `res`) y los DTOs de los casos de uso.
- Middlewares de presentación y formateo de errores HTTP.

Los controladores únicamente reciben la petición, invocan un caso de uso y construyen la respuesta HTTP. No contienen lógica de negocio.

---

# Reglas de arquitectura

## Regla de dependencias

Las dependencias siempre apuntan hacia el interior.

- `domain/` no depende de ninguna otra capa ni de bibliotecas externas.
- `application/` solo puede depender de `domain/`.
- `infrastructure/` puede depender de `application/` y `domain/`.
- `presentation/` solo puede depender de `application/` y `domain/`.

## Punto de Ensamblaje / Inyección de Dependencias

- Existirá un punto de entrada global (ej. `src/main.ts` o `src/container.ts`) fuera de las capas de negocio donde se instanciarán las dependencias concretas de `infrastructure/` y se inyectarán en los casos de uso de `application/` y controladores de `presentation/`.

## Inversión de dependencias

Todo acceso a datos debe realizarse mediante interfaces definidas en `domain/`. Los casos de uso nunca deben depender de implementaciones concretas.

## Aislamiento del framework

Ningún archivo dentro de `domain/` o `application/` puede importar:

- Frameworks web (Express, Fastify, Nest, etc.).
- Librerías de BD o ORMs (SQLite, PostgreSQL, Prisma, TypeORM, etc.).
- Objetos HTTP (`req`, `res`, `Request`, `Response`).
- Decoradores de validación de librerías de terceros (ej. `class-validator`).

Las capas internas deben ser totalmente testables de forma unitaria sin necesidad de levantar bases de datos ni servidores.

## Prioridad de estas reglas

Si durante la generación del proyecto alguna decisión de implementación entra en conflicto con estas reglas, deben prevalecer siempre las reglas de arquitectura, aunque ello implique generar más archivos o una estructura más extensa.
