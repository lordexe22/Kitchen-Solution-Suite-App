# 🌐 HttpClient Module

Cliente HTTP centralizado 100% autónomo para hacer peticiones al backend.

---

## ✨ Características

✅ **100% Autónomo** - Sin dependencias externas del proyecto  
✅ **Sin `any`** - Fuertemente tipado con TypeScript  
✅ **Interceptores** - Request, response y error interceptors  
✅ **Reintentos automáticos** - En errores de red y servidor  
✅ **Errores tipados** - Clases específicas (401, 404, 500, etc.)  
✅ **Timeout integrado** - No requiere utilidades externas  
✅ **Reutilizable** - Listo para copiar a otros proyectos  

---

## 📦 Instalación

Este es un módulo interno. Solo copia la carpeta `httpClient/` a tu proyecto.

---

## 🚀 Uso Básico
```typescript
import { HttpClient } from './modules/httpClient';

const httpClient = new HttpClient({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  withCredentials: true
});

// GET
const users = await httpClient.get<User[]>('/users');

// POST
const newUser = await httpClient.post<User>('/users', {
  name: 'Juan',
  email: 'juan@example.com'
});

// PUT
const updated = await httpClient.put<User>('/users/123', {
  name: 'Juan Pérez'
});

// DELETE
await httpClient.delete('/users/123');
```

---

## ⚙️ Configuración
```typescript
interface HttpClientConfig {
  baseURL: string;           // URL base de la API
  timeout?: number;          // Timeout en ms (default: 10000)
  headers?: Record<string, string>;
  withCredentials?: boolean; // Incluir cookies (default: true)
  retry?: boolean;           // Habilitar reintentos (default: true)
  maxRetries?: number;       // Máximo reintentos (default: 3)
  retryDelay?: number;       // Delay entre reintentos (default: 1000ms)
}
```

---

## 🎯 Interceptores
```typescript
import { 
  createLogInterceptor,
  createAuthInterceptor 
} from './modules/httpClient';

// Log de peticiones
httpClient.addRequestInterceptor(
  createLogInterceptor()
);

// Agregar token automáticamente
httpClient.addRequestInterceptor(
  createAuthInterceptor(() => localStorage.getItem('token'))
);
```

---

## ❌ Manejo de Errores
```typescript
import { 
  AuthenticationError,
  NotFoundError,
  NetworkError 
} from './modules/httpClient';

try {
  const data = await httpClient.get('/users/123');
} catch (error) {
  if (error instanceof AuthenticationError) {
    // 401 - Redirigir a login
  } else if (error instanceof NotFoundError) {
    // 404 - Recurso no existe
  } else if (error instanceof NetworkError) {
    // Sin conexión
  }
}
```

---

## 🔄 Reintentos Automáticos

El cliente reintenta automáticamente en:
- ❌ Error de red (sin conexión)
- ⏱️ Timeout (408)
- 🚫 Too Many Requests (429)
- 💥 Server Error (500, 502, 503, 504)

---

## 📝 Notas

- **Formato de respuesta**: El backend debe devolver `{ success, data, error }`
- **Cookies**: `withCredentials: true` permite enviar cookies HTTP-only
- **TypeScript**: Todo está fuertemente tipado, sin uso de `any`

---

## 🎯 Reutilización

Este módulo es 100% reutilizable. Para usarlo en otro proyecto:

1. Copia la carpeta `httpClient/`
2. Configura el `baseURL`
3. ¡Listo!

No requiere modificaciones.