Eres un arquitecto de software de élite especializado en sistemas multiagente, grafos de ejecución con bucles de retroalimentación y Context Engineering para opencode.ai.

Tu objetivo es inicializar la estructura completa de contexto y configuración para un proyecto práctico sobre sistemas multiagente. Debes procesar la arquitectura del diagrama Mermaid y las especificaciones técnicas adjuntas para generar todos los archivos de documentación y configuración necesarios.

---

### TAREAS A REALIZAR:

1. **Crear el archivo del diagrama en docs/diagrama.md:**
   - Guarda el diagrama Mermaid proporcionado al final de este prompt en docs/diagrama.md para referencias futuras del sistema.

2. **Crear la configuración del Harness en opencode.json (en la raíz):**
   - Define los permisos y restricciones para cada agente.
   - Limita las herramientas (tools) de cada subagente ejecutor solo a su ámbito (ejemplo: @FrontendCoder no toca PostgreSQL; @Reviewer solo ejecuta tests/Docker y lee archivos, no tiene permiso de escritura).

3. **Crear el archivo principal de orquestación agents.md (en la raíz):**
   - **Propósito:** Describir la topología centralizada del grafo y el flujo general.
   - **Bucle de retroalimentación (Feedback Loop):** Explicar el ciclo @MasterOrchestrator -> Subagente -> @Reviewer -> Reporte -> @MasterOrchestrator.
   - **Gestión de Memoria Compartida:** Detallar la regla de "Context Windowing" (filtrado estricto de contexto para evitar la saturación de tokens del subagente).
   - **Prevención de Bucles Infinitos y Costes:** Definir la regla de máximo 3 reintentos por subtarea, uso de checkpoints/rollbacks si falla, y presupuesto máximo de tokens por ejecución.
   - **Contratos de Datos:** Explicar que la comunicación se realiza mediante esquemas de datos estructurados estrictos.

4. **Crear la documentación individual en /docs para cada agente:**
   Genera los archivos detallados siguiendo la plantilla estándar descrita abajo:
   - docs/master-orchestrator.md: Estratega, control de estado, evaluación de reportes, control de reintentos y gestión de presupuesto.
   - docs/data-engineer.md: BBDD PostgreSQL y datasets de Kaggle.
   - docs/backend-coder.md: Desarrollo de API REST con FastAPI.
   - docs/frontend-coder.md: Cliente web interactivo con React y Tailwind CSS.
   - docs/reviewer.md: Tester en entorno aislado (Docker Compose). Ejecución de linters, builds y tests. Sin permisos de modificación de código.

---

### PLANTILLA ESTÁNDAR PARA ARCHIVOS EN /docs:

# [Nombre del Agente]

## 1. Rol y Propósito

[Descripción acotada del agente y sus límites dentro del grafo]

## 2. Permisos y Harness (opencode.json)

[Herramientas permitidas, permisos de lectura/escritura y restricciones de ejecución]

## 3. Contrato de Datos (Entradas y Salidas)

- Entrada filtrada: [Formato JSON estricto que recibe del MasterOrchestrator]
- Salida esperada: [Esquema JSON/Estructura que entrega al Reviewer o la Memoria]

## 4. Stack Tecnológico y Entorno

[Tecnologías utilizadas y entorno Docker asociado]

## 5. Bucle de Validación y Manejo de Errores

[Flujo cuando el Reviewer aprueba o rechaza el entregable. Política de corrección]

---

### DIAGRAMA MERMAID DE REFERENCIA:

graph TD
subgraph Memoria compartida
MC[Estado y contexto global del proyecto]
end

    MO["@MasterOrchestrator<br>(Controla estado y delega)"]

    subgraph Subagentes ejecutores
        DE["@DataEngineer<br>(PostgreSQL y Kaggle)"]
        BE["@BackendCoder<br>(FastAPI)"]
        FE["@FrontendCoder<br>(React y Tailwind)"]
    end

    REV["@Reviewer<br>(Valida salidas)"]

    MC <--> MO

    MO -->|Asigna subtarea| DE
    MO -->|Asigna subtarea| BE
    MO -->|Asigna subtarea| FE

    DE -->|Resultado de base de datos| REV
    BE -->|Resultado de API| REV
    FE -->|Resultado de interfaz| REV

    REV -->|Reporte, fallos o aprobación| MO

    style MC fill:#f9f,stroke:#333,stroke-width:2px
    style MO fill:#bbf,stroke:#333,stroke-width:2px
    style REV fill:#ff9,stroke:#333,stroke-width:2px
