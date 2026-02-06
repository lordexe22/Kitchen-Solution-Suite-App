# HttpClient (standalone)

Cliente HTTP escrito en TypeScript sin dependencias externas. Usa `fetch` con timeout, reintentos, interceptores y errores tipados.

## Características
- `fetch` + `AbortController` para timeout configurable.
- Reintentos automáticos con backoff exponencial y lista de códigos reintentables.
- Interceptores de request, response y error.
- Errores tipados (`HttpError`, `NetworkError`, `ValidationError`, `AuthenticationError`, `AuthorizationError`, `NotFoundError`, `ServerError`).
- Soporte de `withCredentials` para cookies (sessions/JWT httpOnly).
- Type guards para `ApiResponse` estándar `{ success, data, error, message }`.
- Sin dependencias (no Axios).

## Uso básico
```ts
import { HttpClient } from './httpClient';

const httpClient = new HttpClient({
  baseURL: 'http://localhost:4000/api',
  withCredentials: true,
});

const user = await httpClient.get<User>('/users/1');
const created = await httpClient.post<User>('/users', { name: 'Alice' });
```

## Interceptores
```ts
import {
  createAuthInterceptor,
  createLogInterceptor,
  createResponseLogInterceptor,
  createErrorLogInterceptor,
} from './httpClient.interceptors';

httpClient.addRequestInterceptor(createAuthInterceptor(() => localStorage.getItem('token')));
httpClient.addRequestInterceptor(createLogInterceptor());
httpClient.addResponseInterceptor(createResponseLogInterceptor());
httpClient.addErrorInterceptor(createErrorLogInterceptor());
```

## Configuración por defecto
Ver [httpClient.config.ts](httpClient.config.ts). Incluye:
- `baseURL`: fallback `http://localhost:4000/api` (debe sobrescribirse).
- `timeout`: 10s.
- `withCredentials`: true.
- `retry`: true, `maxRetries`: 3, `retryDelay`: 1000 ms.
- Headers JSON por defecto.

## Errores tipados
Factory `createHttpError(status, message, response)` devuelve la clase correcta según status. Útil para manejar casos 401/403/404/5xx de forma explícita.

## API
- Métodos: `get`, `post`, `put`, `patch`, `delete`.
- Interceptores: `addRequestInterceptor`, `addResponseInterceptor`, `addErrorInterceptor`.
- Tipos expuestos en [index.ts](index.ts).

## Independencia
- No acopla lógica de negocio ni depende del proyecto; se puede reutilizar en otros apps.
