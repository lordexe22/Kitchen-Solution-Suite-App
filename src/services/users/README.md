# users (userAvatar)

## Propósito

Servicio encargado de la gestión del avatar del usuario autenticado: subida y eliminación de la imagen de perfil.

## Operaciones

| Función | Descripción |
|---|---|
| `uploadUserAvatar(file)` | Sube o reemplaza el avatar del usuario |
| `deleteUserAvatar()` | Elimina el avatar actual del usuario |

## Uso

```ts
import { uploadUserAvatar, deleteUserAvatar } from '../services/users';
```

## Exports

- Funciones: `uploadUserAvatar`, `deleteUserAvatar`
- Tipos: `UserAvatarResponse`

## Dependencias

- `httpClient` — cliente HTTP de la aplicación (`api/httpClient.instance`)
