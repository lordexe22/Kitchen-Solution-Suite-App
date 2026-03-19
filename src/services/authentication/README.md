# authentication

## Propósito

Servicio encargado de las operaciones de autenticación del usuario: registro, login, auto-login y logout. Se comunica con los endpoints públicos del backend y delega todas las validaciones al servidor.

## Operaciones

| Función | Descripción |
|---|---|
| `registerUser(data)` | Registra un nuevo usuario en el sistema |
| `loginUser(data)` | Inicia sesión con credenciales locales o Google |
| `autoLogin()` | Recupera la sesión activa usando el JWT almacenado en cookie |
| `logoutUser()` | Cierra la sesión eliminando el JWT en el servidor |

## Uso

```ts
import { registerUser, loginUser, autoLogin, logoutUser } from '../services/authentication';
```

## Exports

- Funciones: `registerUser`, `loginUser`, `autoLogin`, `logoutUser`
- Tipos: `PlatformName`, `RegisterUserData`, `UserLoginData`, `UserResponse`

## Dependencias

- `httpClient` — cliente HTTP de la aplicación (`api/httpClient.instance`)
