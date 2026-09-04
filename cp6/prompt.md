# Prompt 1

Crea un proyecto mínimo con FastAPI que exponga dos endpoints: uno para consultar una lista de tareas guardada en memoria y otro para añadir una tarea nueva a esa lista. Configura el entorno virtual, instala las dependencias necesarias y, al terminar, dime exactamente qué comando tengo que ejecutar para arrancar el servidor y qué dirección debo abrir en el navegador para comprobar que funciona.

# Prompt 2

Ejecuta el servidor y dame el enlace o enlaces para probar la API.

# Prompt 3

Genera un archivo .gitignore adecuado para este proyecto, teniendo en cuenta que usa un entorno virtual de Python.

# Prompt 4

Escribe un commit breve que explique los cambios que hemos hecho en esta sesión.

# prompt 5

Añade un nuevo endpoint GET /tasks/{id} que busque una tarea por su ID. Si la tarea no existe, debe devolver un error HTTP 404 usando HTTPException. Mantén el uso de response_model=TaskOut.
