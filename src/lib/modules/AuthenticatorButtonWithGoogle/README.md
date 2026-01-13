# AuthenticatorButtonWithGoogle

Componente React para autenticación con Google OAuth. Totalmente agnóstico y reutilizable en cualquier proyecto.

## 📦 Características

- ✅ Autenticación con Google OAuth
- ✅ Normalización automática de datos de usuario
- ✅ Totalmente configurable (tamaño, forma, idioma, etc.)
- ✅ Manejo estructurado de errores
- ✅ TypeScript completo
- ✅ Sin dependencias de lógica de negocio

## 🚀 Instalación

```bash
npm install @react-oauth/google
```

## 🔧 Configuración

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_GOOGLE_CLIENT_ID=tu-google-client-id-aqui
```

### Obtener Google Client ID

1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear un proyecto nuevo o seleccionar uno existente
3. Ir a "APIs & Services" > "Credentials"
4. Crear "OAuth 2.0 Client ID"
5. Configurar "Authorized JavaScript origins" con tu dominio (ej: `http://localhost:5173`)

## 📖 Uso Básico

```tsx
import AuthenticatorButtonWithGoogle from './modules/AuthenticatorButtonWithGoogle';

function App() {
  const handleSuccess = (response: AuthSuccessResponse) => {
    console.log('Email:', response.email);
    console.log('Nombre:', response.firstName, response.lastName);
    console.log('Token para backend:', response.credential);
    // Aquí envías el credential y los datos al backend
  };

  const handleError = (error) => {
    console.error('Error de autenticación:', error);
  };

  return (
    <AuthenticatorButtonWithGoogle
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}
```

## 🎨 Props

### Obligatorios

| Prop | Tipo | Descripción |
|------|------|-------------|
| `onSuccess` | `(data: AuthSuccessResponse) => void` | Callback ejecutado al autenticar exitosamente |
| `onError` | `(error: ErrorData) => void` | Callback ejecutado en caso de error |

### Opcionales

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `size` | `"large" \| "medium" \| "small"` | `"medium"` | Tamaño del botón |
| `shape` | `"rectangular" \| "pill" \| "circle" \| "square"` | `"rectangular"` | Forma del botón |
| `logo_alignment` | `"left" \| "center"` | `"left"` | Alineación del logo de Google |
| `width` | `string` | Auto | Ancho en pixels (ej: "300") |
| `type` | `"standard" \| "icon"` | `"standard"` | Variación de botón de Google |
| `theme` | `"outline" \| "filled_blue" \| "filled_black"` | `"outline"` | Tema visual de Google |
| `ux_mode` | `"popup" \| "redirect"` | `"popup"` | Flujo UX del login |
| `className` | `string` | - | Clase CSS adicional |

## 📤 Datos de Salida

### AuthSuccessResponse

```typescript
{
  email: string;              // Email del usuario
  emailVerified: boolean;     // Si el email está verificado en Google
  firstName: string;          // Nombre del usuario
  lastName: string;           // Apellido del usuario
  profilePicture: string;     // URL de la foto de perfil
  googleId: string;           // ID único en Google
  credential: string;         // ID token (JWT) para validar en backend
  provider: "google";         // Proveedor (siempre "google")
}
```

### ErrorData

```typescript
{
  message: string;    // Mensaje descriptivo del error
  code: string;       // Código de error (ej: "MISSING_CREDENTIAL")
  timestamp: string;  // Timestamp ISO del error
}
```

## 🎯 Ejemplos

### Uso básico

```tsx
<AuthenticatorButtonWithGoogle
  onSuccess={handleSuccess}
  onError={handleError}
/>
```

### Botón grande

```tsx
<AuthenticatorButtonWithGoogle
  onSuccess={handleSuccess}
  onError={handleError}
  size="large"
/>
```

### Botón Personalizado (Pill, Ancho Fijo)

```tsx
<AuthenticatorButtonWithGoogle
  onSuccess={handleSuccess}
  onError={handleError}
  shape="pill"
  width="350"
/>
```

### Solo Icono, tema filled black

```tsx
<AuthenticatorButtonWithGoogle
  onSuccess={handleSuccess}
  onError={handleError}
  shape="circle"
  type="icon"
  theme="filled_black"
/>
```

## 🔐 Seguridad

- El componente decodifica el JWT de Google en el frontend para mostrar datos al usuario
- **IMPORTANTE**: Siempre valida el token en el backend antes de crear una sesión
- Nunca confíes solo en la decodificación del frontend

## 🧪 Testing

Ver archivo `AuthenticatorButtonWithGoogle.test.ts` (pendiente de implementación)

## 📝 Ver Ejemplos en Vivo

Ruta: `/example/AuthenticatorButtonWithGoogle`

## 🤝 Contribuir

Este módulo es reutilizable y agnóstico. Cualquier mejora debe mantener estas características.

## 📄 Licencia

MIT
