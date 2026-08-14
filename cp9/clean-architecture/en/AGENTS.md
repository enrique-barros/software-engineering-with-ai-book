# Project Architecture:

This project follows the principles of Robert C. Martin's Clean Architecture. All source code must be located inside `src/` and strictly organized into the following layers, from the inside out:

## domain/

Contains exclusively:

- Business entities.
- Value Objects.
- Repository interfaces (output ports).
- Domain-specific exceptions/errors.

This layer represents the core of the domain and is completely agnostic of technologies, frameworks, or persistence mechanisms.

## application/

Contains exclusively:

- Use cases (one system operation per use case).
- Input and output models for the use cases (DTOs or primitive types).

Use cases implement application logic and coordinate the domain, but they do not know infrastructure details.

## infrastructure/

Contains exclusively:

- Concrete implementations of repositories.
- Database access and ORMs.
- Technical configuration and environment variables.
- External services.

## presentation/

Contains exclusively:

- HTTP controllers.
- Route definitions.
- Conversion between HTTP types (`req`, `res`) and use case DTOs.
- Presentation middlewares and HTTP error formatting.

Controllers only receive requests, invoke a use case, and build the HTTP response. They contain no business logic.

---

# Architecture Rules

## Dependency Rule

Dependencies always point inward.

- `domain/` does not depend on any other layer or external libraries.
- `application/` can only depend on `domain/`.
- `infrastructure/` can depend on `application/` and `domain/`.
- `presentation/` can only depend on `application/` and `domain/`.

## Composition Root / Dependency Injection

- There will be a global entry point (e.g., `src/main.ts` or `src/container.ts`) outside the business layers where concrete dependencies from `infrastructure/` will be instantiated and injected into `application/` use cases and `presentation/` controllers.

## Dependency Inversion

All data access must be performed through interfaces defined in `domain/`. Use cases must never depend on concrete implementations.

## Framework Isolation

No file inside `domain/` or `application/` may import:

- Web frameworks (Express, Fastify, Nest, etc.).
- Database libraries or ORMs (SQLite, PostgreSQL, Prisma, TypeORM, etc.).
- HTTP objects (`req`, `res`, `Request`, `Response`).
- Validation decorators from third-party libraries (e.g., `class-validator`).

Inner layers must be fully unit-testable without needing to spin up databases or servers.

## Priority of these rules

If, during project generation, any implementation decision conflicts with these rules, the architecture rules must always prevail—even if it means generating more files or a larger directory structure.
