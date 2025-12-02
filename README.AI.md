# Reglas de trabajo

## Filosofia de la estructura del proyecto

### src/store 

Debe contener los  `store` que serán usados en el proyecto, así como sus tipos e interfaces.

Un `store` solo debería contener la información que interesa mantener de forma global en la aplicación y los métodos para modificarlos y pedirlos.

Los stores deberian contener sus tipos e interfaces. 

### src/hooks

Debe contener hooks globales que puedan ser aprovechados en más de un componente del proyecto. Estos hooks no son agnosticos o reutilizables, están pensados para funcionar en el contexto de este proyecto.

### src/api

Contiene inicializaciones de instancias de otros modulos que requieran ser utilizados dentro del proyecto.

### src/config

Aquí se definen constantes y variables de uso común que no sean sensibles y dignas de ir a un archivo .env. Por ejemplo rutas, valores que definan el comportamiento de la página, etc.

### src/services

Debe contener servicios globales que efectuen tareas y algoritmos concretos y propios de la aplicación. La tarea puede hacer uso de varios pasos lógicos que cumplen una tarea más grande y compleja.

### src/styles

Contiene estilos de uso global que podrian ser utilizados en varios componentes. Como estilos para cards, acordeones, ventanas modales, etc. La idea es que se definan estructuras y variables que puedan ser reutilizadas a lo largo del proyecto para mantener una coherencia visual y para modificar los colores facilmente.

### src/modules

Contiene componentes o módulos que buscan ser agnósticos y reutilizables. Se usa sobre todo si se pueden establecer soluciones que se puedan abstraer de la lógica de esta aplicación y permiten ser utilizados en otras aplicaciones con contextos diferentes. Pueden ser modulos totalmente funcionales o pueden presentarse como componentes.

### src/constants

Contiene valores inmutables y enumeraciones:
- Códigos de error
- Opciones de select
- Regex patterns
- Se diferencia de config en que son valores, no configuraciones

### src/pages

Contiene las páginas que serán visibles en la aplicación. Las páginas hacen uso de los componentes y módulos definidos dentro del proyecto.

### src/utils

Debe contener utilidades agnosticas de uso global. Deben ser funciones pequeñas que resuelvan problemas simples y frecuentes.

### src/components

Debe contener una lista de componente propios de la aplicación. No interesa demasiado que sean agnosticos o reutilizables. Lo que interesa es que cumplan con algún proposito bien marcado dentro de la aplicación.

Cada componente esta dentro de su propio directorio, su nombre usa upper camel case y puede contener archivos locales y propios del componente para separar el contenido del componente. Estas carpetas no siempre son obligatorias y serán:
* **index.ts**
* **README.md**
* **[ComponenteName].config.ts** - Contiene objetos de configuración e inicialización del componente si los necesita.
* **[ComponenteName].hooks.ts** - Contiene hooks locales del componente
* **[ComponenteName].types.ts** - Contiene los tipos e interfaces locales del componente
* **[ComponenteName].utils.ts** - Contiene utilidades locales del componente
* **[ComponenteName].test.ts** - Contiene test del componente
* **[ComponenteName].errors.ts** - Contiene funciones para manejar la lógica de los errores del componente
* **[ComponenteName].tsx** - Contiene y define al componente 
* **[ComponenteName].module.css** - Estilos locales del componente 

## Guía de etiquetas y bloques comentados (Color Suit Comments)

Estas etiquetas permiten crear bloques comentados “colapsables” y fácilmente reconocibles en el código.

- Encabezado: // #tag [nombre|id] - descripción breve
- Cuerpo: contenido del bloque (código, notas, pasos, etc.)
- Cierre: // #end-tag
- Reglas:
  - Una etiqueta por línea en el encabezado.
  - La descripción debe ser concisa (≤ 80 caracteres).
  - El [nombre|id] es opcional salvo en casos que aporten claridad (p.ej. nombre de función).
  - Para pasos numerados usar: // #step N - descripción … // #end-step

### Ejemplos
// #function getUserById - obtiene un usuario por id
// …código, consideraciones, precondiciones…
// #end-function

// #component UserCard - card de usuario con avatar y acciones
// …props, estados internos, slots…
// #end-component

// #step 1 - validar entrada del formulario
// …validaciones sincrónicas…
// #end-step

### Cuándo usar cada etiqueta (descripción breve)
- test: notas de pruebas o casos manuales.
- component: definición/explicación de un componente UI.
- todo: tareas pendientes concretas y accionables.
- event: descripción de eventos emitidos/escuchados.
- type: definición o racional de tipos.
- interface: contratos y expectativas entre capas.
- route: rutas de navegación y guards implicados.
- info: notas informativas que no requieren acción.
- state: explicación de estados globales/compartidos.
- variable: aclaraciones de variables no obvias.
- const: constantes y su razón de ser.
- section: separadores lógicos de grandes archivos.
- key: claves importantes (map keys, cache keys, etc.).
- step: pasos de un flujo o proceso.
- function: funciones relevantes, propósito y pre/postcondiciones.
- middleware: middleware y orden de ejecución.
- hook: hooks y su propósito/efectos colaterales.
- style: decisiones de estilos y convenciones CSS.
- keyframe: animaciones y su intención de uso.
- warning: advertencias y riesgos conocidos.

Convenciones
- Prefijo “#”: todos los encabezados comienzan con “#tag” y cierran con “#end-tag”.
- Nomenclatura: usar kebab-case o camelCase según el contexto (componentes en PascalCase).
- Anidación: permite bloques anidados, siempre cerrando en el orden inverso.
- Brevedad: priorizar descripciones cortas; si se requiere detalle, enlazar a documentación o un bloque “#docs”.

Siempre se pueden recomendar etiquetas si las mismas no estan listadas aquí y claramente puede mejorar la legibilidad del proyecto.

### Notas y buenas prácticas

* Evitar falsos positivos: tags como type, const, variable y key son genéricas. Úsalas con el prefijo “#” en comentarios: // #type User, // #const PAGE_SIZE.
* Consistencia: el cierre debe coincidir exactamente con la etiqueta: #function ↔ #end-function, etc.

## Reglas del código

### Convenciones de nombres
- Funciones y variables: camelCase
- Clases y componentes: PascalCase
- Constantes: UPPER_SNAKE_CASE

### Estructura y organización
- Servicios no importan componentes ni hooks.

### TypeScript
- Prohibido any implícito.
- Usar tipos de retorno explícitos en funciones exportadas.
- Preferir tipos inmutables (Readonly/ReadonlyArray) donde aplique.
- DTOs aislados en /types y nunca mezclados con modelos internos.

### Estado y flujo de datos
- Estado global solo si se comparte entre ≥ 3 zonas o persiste navegación.
- Evitar duplicación de estado derivado (calcular bajo demanda con selectors/memos).
- Efectos secundarios en hooks, no en componentes directamente.

### Async y errores
- Toda llamada async envuelta en try/catch con mapeo de error a tipo interno.
- No lanzar errores crudos de librería al UI.
- Retries solo en operaciones idempotentes.
- Cancelar peticiones obsoletas (AbortController) en hooks que desmontan.

### Logging y métricas
- Error crítico: log + tag #warning o #security si aplica.
- Métricas de tiempo en operaciones > 300ms (performance-sensitive).

### Seguridad
- Nunca interpolar input de usuario sin sanitizar en HTML/DOM.
- Tokens jamás en localStorage si existe alternativa (usar cookies httpOnly).

### Validación
- Schemas únicos por entidad (no duplicar reglas en formularios).
- Mensajes de error consistentes y traducibles (no hardcodear).

### Estilos y UI
- CSS local en module.css; evitar estilos globales salvo tokens.
- Animaciones > 400ms requieren justificación (#decision).
- Accesibilidad: todo interactivo con role y aria-label si no semántico.

### Rendimiento
- Listas > 100 ítems: virtualización o paginación.
- useMemo/useCallback solo si evita renders costosos (> 1ms medir).
- Evitar recrear objetos en props críticas (config, handlers).

### Tests
- Funciones puras → test unitario obligatorio.
- Hook complejo → test de efectos principales.
- Componentes críticos (auth, checkout) → snapshot + interacción.

### Documentación interna
- Aplicar JSDOC siempre, el JSDOC debe estar contenido dentro de los bloques colapsables
- Bloque #function incluye: propósito, parámetros relevantes, invariantes.

### Commits (si aplica)
- Prefijo tipo: feat, fix, perf, refactor, test, docs, chore.
- Mensaje corto ≤ 72 chars; cuerpo opcional con contexto.

### Dependencias
- Auditar nuevas librerías (bundle size, mantenimiento).
- No añadir dependencia si < 30 líneas de utilidad propia equivalen.
