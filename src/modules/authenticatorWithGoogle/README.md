<h2 id="0">Índice</h2>
<ul>
  <li><a href="#1">1. Introducción</a></li>
  <li><a href="#2">2. Instalación y requisitos previos</a></li>
  <li><a href="#3">3. Uso del componente</a></li>
  <li><a href="#4">4. Crear un CLIENT ID de Google</a></li>
  <li><a href="#5">5. Google One Tap</a></li>
  <li><a href="#6">6. Notas de seguridad</a></li>
</ul>

<h2 id="1" style="margin-top: 80px">1. Introducción</h2> 
<h3>Propósito del componente</h3>

**AuthenticatorWithGoogle** es un componente de React que permite autenticar usuarios mediante Google OAuth 2.0 usando la librería @react-oauth/google.
Su función principal es obtener y decodificar el token JWT emitido por Google, y entregar la información del usuario autenticado a través del callback onAuth.

El componente está diseñado para ser utilizado tanto en flujos de inicio de sesión como de registro de nuevos usuarios.

<h3>Flujo general de autenticación</h3>

1. El usuario interactúa con el botón de Google o bien se activa Google One Tap.

2. Google devuelve una respuesta (CredentialResponse) con el token JWT en la variable **credential**.

3. El token se decodifica mediante el método **decodeGoogleToken**, obteniendo los datos del usuario (GoogleUser).

4. El resultado se envía al callback **onAuth**. Si ocurre un error o no existe token, se pasa **null** como respuesta.

<h3>¿Cuando usarlo? (login/singup)</h3>

El componente **AuthenticatorWithGoogle** siempre obtiene y decodifica el token de Google, y entrega el objeto GoogleUser al callback **onAuth**.

***Modo login o signup***: La prop **mode** solo modifica el texto del botón. No hay lógica interna distinta para iniciar sesión o registrar un usuario. La decisión de crear una cuenta o iniciar sesión debe manejarla la aplicación que usa el componente, a partir de los datos de GoogleUser.

***Google One Tap***: Si el usuario tiene sesión activa en Google y tu dominio está autorizado, se puede activar automáticamente un login o registro. En este caso se puede usar el callback opcional onAutoLogin, que recibe el mismo objeto GoogleUser.


<h2 id="2" style="margin-top: 80px">2. Instalación y requisitos previos</h2> 

### Instalación de librerias
Para utilizar AuthenticatorWithGoogle, se requiere instalar la librería oficial de Google OAuth para React:

```
npm install @react-oauth/google
```
Además, si no la tenés instalada, asegurate de contar con React 18+ y TypeScript configurado en tu proyecto, ya que el componente está tipado.

### Configuración de las variables de entorno
El componente requiere un Client ID de Google OAuth. Para que funcione correctamente, se debe crear un archivo .env en la raíz de tu proyecto (o usá el que ya tengas) y luego definir la variable:

```
VITE_GOOGLE_CLIENT_ID=tu_client_id_de_google
```
Luego, el componente importa y utiliza automáticamente esta variable desde authenticatorWithGoogle.config.ts:
```ts
import { googleConfig } from "./authenticatorWithGoogle.config";

export const googleConfig: GoogleConfig = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
};
```
Esto asegura que el componente tenga acceso a las credenciales necesarias para inicializar el flujo de autenticación y es un paso obligatorio para que el componente funcione. Más adelante se detalla como obtener el Client ID desde la consola de google.



<h2 id="3" style="margin-top: 80px">3. Uso del componente</h2> 

### Importaciones necesarias
Para usar AuthenticatorWithGoogle en tu proyecto, importa el componente y sus tipos desde su módulo:
```ts
import { AuthenticatorWithGoogle } from './modules/authenticatorWithGoogle';
import type { GoogleUser } from './modules/authenticatorWithGoogle';
```

### Props
El componente recibe las siguientes props:

| Prop | Tipo | Descripción | Requerido |
|------|------|-------------|-----------|
|onAuth|(user: GoogleUser \| null) => void|Callback que recibe el usuario decodificado luego de un login exitoso. En caso de error, recibe null.|Sí|
|mode|"login"\|"singup"|Define el texto que google coloca en el botón. No cambia la lógica del componente.|Sí|

### Ejemplo de uso
En el siguiente ejemplo se hace uso del componente para capturar los datos de usuario de google. Posteriormente se hace uso de los mismos para mostrarlos en pantalla mediante el uso de las propiedades del estado **user**.

```ts
import { useState } from 'react';
import { AuthenticatorWithGoogle } from './modules/authenticatorWithGoogle';
import type { GoogleUser } from './modules/authenticatorWithGoogle';

const App = () => {
  // Se define un estado para guardar los datos del usuario
  const [user, setUser] = useState<GoogleUser | null>(null);

  return (
    <div className="app-container">

      <AuthenticatorWithGoogle onAuth={setUser} mode="login"/>
      
      {user && (
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <h3>Usuario autenticado</h3>
          <img
            src={user.picture}
            alt={user.name}
            width={80}
            height={80}
            style={{ borderRadius: '50%' }}
          />
          <p><strong>Nombre:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}
    </div>
  );
};

export default App;
```

### Formato del objeto GoogleUser retornado
El callback `onAuth` recibe un objeto con la siguiente estructura cuando la autenticación es exitosa:
```ts
interface GoogleUser {
  iss: string;             // Issuer (iss): Emisor del token, generalmente "accounts.google.com" o "https://accounts.google.com"
  nbf: number;             // Not Before (nbf): fecha/hora a partir de la cual el token es válido (timestamp en segundos)
  aud: string;             // Audience (aud): Client ID de la app para la que se emitió el token
  azp: string;             // Authorized Party (azp): Client ID del cliente que autorizó el token
  sub: string;             // Subject (sub): ID único del usuario en Google
  email: string;           // Email (email): Correo electrónico del usuario
  email_verified: boolean; // Email Verified (email_verified): Indica si el email del usuario ha sido verificado por Google
  name: string;            // Name (name): Nombre completo del usuario
  picture: string;         // Picture (picture): URL de la foto de perfil del usuario
  given_name: string;      // Given Name (given_name): Primer nombre del usuario
  family_name: string;     // Family Name (family_name): Apellido del usuario
  iat: number;             // Issued At (iat): fecha/hora de emisión del token (timestamp en segundos)
  exp: number;             // Expiration (exp): fecha/hora de expiración del token (timestamp en segundos)
  jti: string;             // JWT ID (jti): identificador único del token
}
```
Si ocurre un error en la autenticación o no se recibe un token válido, se envía null.

<h2 id="4" style="margin-top: 80px">4. Crear un CLIENT ID de google</h2> 

⚠️ **Nota:** Se recomienda configurar un **ID de proyecto diferente para cada aplicación** que vaya a usar este módulo. Estos pasos sirven como registro para documentar cómo hacerlo.

1. Ingresar a la **Google Cloud Console**: [https://console.cloud.google.com/](https://console.cloud.google.com/).  
2. Crear un nuevo **proyecto** (o seleccionar uno existente).  
3. En el menú de navegación (arriba a la izquierda), ir a **APIs y servicios > Credenciales**.  
4. Crear una nueva credencial de tipo **OAuth Client ID** (esto redirige a un formulario de configuración del proyecto).  
5. Completar los campos requeridos:  
   - Información de la aplicación  
   - Público objetivo  
   - Información de contacto  
   - Finalizar  
6. Al finalizar, se redirige a **Google Cloud Platform**, en la sección “Descripción general”. Allí seleccionar **Crear cliente de OAuth**.  
   - Tipo de aplicación → `Aplicación Web`  
   - Nombre del cliente → el que quieras que aparezca en la lista de IDs  
   - Orígenes autorizados de JavaScript → por ejemplo: `http://localhost:5173`  
   - URIs de redireccionamiento autorizados → por ejemplo: `http://localhost:5173`  
7. Al guardar, Google generará un **Client ID** y un **Client Secret**. Estos valores se necesitarán para configurar la conexión en Auth0.  

    Ejemplo:
      
        ID: 79473940445-jnmnb1k90487g26m7brj8dnto93f5k92.apps.googleusercontent.com

        Secret: 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


8. Guardar estos valores de manera segura.  
   - El **User Secret** nunca debe ser expuestos en el frontend, solo en el backend.  
   
<h2 id="5" style="margin-top: 80px">5. Google One Tap</h2> 
Google One Tap es un mecanismo de autenticación que permite a los usuarios iniciar sesión o registrarse con Google de forma automática, sin necesidad de interactuar explícitamente con un botón.

### En AuthenticatorWithGoogle:

Está activado por defecto mediante la prop ***useOneTap={true}*** de la librería @react-oauth/google. Si el usuario tiene sesión activa en Google y tu dominio está autorizado, se mostrará un prompt de inicio de sesión o registro automáticamente. Al completarse la autenticación, el componente obtiene el token JWT y llama al callback onAuth con el objeto GoogleUser.

### Consideraciones:

* One Tap solo funciona en dominios autorizados y con sesiones activas en Google.

* No requiere configuración adicional en el componente; basta con definir correctamente el Client ID en las variables de entorno.

* Se recomienda probar el comportamiento en distintos navegadores y dispositivos, ya que la experiencia puede variar según la sesión de Google del usuario.

<h2 id="6" style="margin-top: 80px">6. Notas de seguridad</h2> 

* **Tokens JWT**: El componente decodifica el token de Google en el cliente y entrega el objeto GoogleUser vía onAuth. Este token no se valida automáticamente contra Google, por lo que cualquier verificación de autenticidad debe hacerse en el backend si se requiere seguridad adicional.

* **Exposición de datos**: Todos los datos de GoogleUser se manejan en el frontend. No almacenar información sensible en el cliente más allá de lo estrictamente necesario para la sesión.

* **Errores de autenticación**: En caso de que el token sea inválido o falte, onAuth recibe null. Esto permite manejar fallos sin que el componente exponga información adicional ni rompa la aplicación.

* **Configuración segura**: La única variable de entorno utilizada por el componente es VITE_GOOGLE_CLIENT_ID, que no es sensible, y se usa únicamente para inicializar el flujo de autenticación.

<!-- Botón flotante redondo con icono hacia arriba -->
<a href="#0"
   style="
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      background-color: #007BFF;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      font-size: 24px;
      z-index: 1000;
   ">
   👆
</a>
