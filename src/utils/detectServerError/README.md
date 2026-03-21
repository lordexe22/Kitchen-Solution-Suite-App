# detectServerError

Utilidad para clasificar y traducir errores de servidor según su origen técnico.

## Responsabilidad

Analizar un error capturado en un bloque `catch` y devolver una categoría estandarizada (`ServerErrorType`), junto con un mensaje descriptivo listo para mostrar al usuario.

## Archivos

| Archivo | Descripción |
|---|---|
| `detectServerError.ts` | Implementación de las dos funciones utilitarias |
| `detectServerError.types.ts` | Tipo `ServerErrorType` e interfaz interna `ErrorWithStatus` |
| `index.ts` | Punto de entrada público del módulo |

## API pública

### `detectServerErrorType(error: unknown): ServerErrorType`

Clasifica un error desconocido en una de las categorías: `'network'`, `'timeout'`, `'server'` o `'unknown'`.

### `getServerErrorMessage(errorType: ServerErrorType): string`

Retorna el mensaje en inglés correspondiente a la categoría de error recibida.

## Uso

```ts
import { detectServerErrorType, getServerErrorMessage } from '../../utils/detectServerError';

try {
  await loginUser(credentials);
} catch (error) {
  const errorType = detectServerErrorType(error);
  const message = getServerErrorMessage(errorType);
  showToast(message);
}
```

## Consumidores

- `AuthLoginModalWindow`
- `AuthRegisterModalWindow`
