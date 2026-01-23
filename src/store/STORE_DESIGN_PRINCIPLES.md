# Store Design Principles

Documentación de patrones y decisiones de diseño para stores de estado global.

Referencia: `UserData.store.ts`

---

## 1. Estructura de Entidad (No Fragmentación)

### ❌ Incorrecto: Campos sueltos

```typescript
interface UserDataStore {
  id: number | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  // ... 9 propiedades sueltas
}
```

**Problema**: El estado no refleja la realidad. "¿Hay un usuario o no?" es imposible de responder sin inferencias externas.

### ✅ Correcto: Entidad completa

```typescript
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  // ... todas las propiedades requeridas
}

interface UserDataStore {
  user: User | null;  // Una sola fuente de verdad
}
```

**Beneficio**: 
- El estado describe directamente el mundo: hay usuario O no lo hay.
- Imposible representar estados inválidos.
- Toda lógica que dependa del usuario está centralizada.

---

## 2. Separación: Campos Estructurales vs Editables

### Campos Estructurales (Inmutables desde el cliente)

Definen la **identidad** del usuario. Solo el servidor puede modificarlos.

```typescript
id              // Identificador único
type            // admin | employee | guest | ownership
state           // pending | active | suspended
belongToCompanyId
belongToBranchId
```

**Regla**: `update()` NUNCA puede tocar estos campos.

### Campos Editables (Modificables por el cliente)

El usuario puede actualizarlos localmente, pero siempre después de hidratación.

```typescript
firstName
lastName
email
imageUrl
```

**Tipo dedicado**:
```typescript
export type EditableUserFields = Pick<User, 'firstName' | 'lastName' | 'email' | 'imageUrl'>;
```

**Razón**: Type-safety. Solo se aceptan estos campos en `update()`.

---

## 3. Validación en Dos Capas

### Capa 1: Validar usuario completo desde servidor

```typescript
validateAndNormalizeUser(candidate): ValidationResult<User>
```

**Casos de uso**:
- Después de login/register
- Después de autologin
- Cuando el servidor devuelve datos de usuario

**Valida**:
- Tipos básicos (id es número > 0, etc.)
- Enums (type, state dentro de valores permitidos)
- **Coherencia**: si `type === 'employee'`, entonces `belongToCompanyId` y `belongToBranchId` son obligatorios.

### Capa 2: Validar campos editables en contexto

```typescript
validateAndNormalizeEditableFields(partial, existing): ValidationResult<User>
```

**Casos de uso**:
- `update()` en el cliente
- Solo después de que `user` sea no-null

**Valida**:
- Campos no-vacíos
- Coherencia con el usuario existente
- Rechaza si `user` es null (no se pueden editar campos si no hay usuario)

### Normalización

```typescript
normalizeString(s)      // trim()
normalizeEmail(s)       // trim() + toLowerCase()
normalizeImageUrl(s)    // trim() + null si vacío
```

**Razón**: Datos inconsistentes desde la API o entrada manual se unifican.

---

## 4. Hidratación: Un Viaje de Una Vía

### Estado Inicial (No Hidratado)

```typescript
{
  user: null,
  isHydrated: false
}
```

**Acciones permitidas**:
- `getUserDataFromServer()` (esperar respuesta del servidor)
- `logout()` (sin efecto, pero permitido)

**Acciones bloqueadas**:
- `update()` → rechazada con warning

### Después de Hidratación (Hidratado)

```typescript
{
  user: User | null,  // Puede ser null si no hay sesión
  isHydrated: true
}
```

**Acciones permitidas**:
- `update()` (si user es no-null)
- `logout()` → limpia user pero mantiene `isHydrated: true`
- `getUserDataFromServer()` (refrescar datos)

### Transición: Solo False → True

```typescript
// ✅ Válido: servidor respondió
getUserDataFromServer(user | null) → isHydrated: true

// ❌ Inválido: simulación artificial
markAsHydrated() // ELIMINADO
setHydrated(false) // NUNCA
```

**Regla de oro**: `isHydrated` solo puede establecerse en `true` a través de una respuesta del servidor.

---

## 5. Comunicación Servidor-Cliente

### Contrato de Respuesta Consistente

Todos los endpoints de autenticación devuelven:

```typescript
{
  success: true,
  user: User | null
}
```

**Casos**:
- **Login exitoso**: `{ success: true, user: {...} }`
- **Usuario sin sesión (autologin)**: `{ success: true, user: null }`
- **Registro**: `{ success: true, user: {...} }`
- **Error de validación**: Error HTTP (no llega al store)

**Nunca**:
- ❌ `{ success: false, user: undefined }` (inconsistente)
- ❌ `{ success: true }` (sin campo user)

### Flujo de Hidratación

```
Cliente: carga página
  ↓
useAutoLogin() → POST /auth/auto-login
  ↓
Servidor: valida JWT en cookie
  ↓
Servidor: responde { success: true, user: User | null }
  ↓
getUserDataFromServer(user | null)
  ↓
Store: { user: ..., isHydrated: true }
  ↓
UI: puede renderizar en base a isHydrated
```

---

## 6. Acciones y Semántica

### `update(partial: Partial<EditableUserFields>): void`

- **Cuándo**: Usuario modifica su perfil en la UI.
- **Validación**: Solo campos editables, solo si `isHydrated && user !== null`.
- **Efecto**: Actualiza campos locales y valida coherencia.
- **Nota**: No sincroniza con servidor automáticamente.

### `getUserDataFromServer(user: User | null): void`

- **Cuándo**: Servidor responde con datos (login, autologin, refresh).
- **Validación**: Valida usuario completo, normaliza.
- **Efecto**: Establece `user` e `isHydrated: true`.
- **Nota**: Única fuente de verdad para hidratación.

### `logout(): void`

- **Cuándo**: Usuario hace logout.
- **Validación**: Ninguna.
- **Efecto**: Limpia `user` pero mantiene `isHydrated: true`.
- **Nota**: La app intenta autologin automático después.

---

## 7. Checklist para Replicar en Otros Stores

Cuando crees un nuevo store siguiendo este patrón:

- [ ] **Entidad completa**: `state.entity: Entity | null` (sin fragmentación).
- [ ] **Hidratación**: `isHydrated: boolean` para rastrear primer intento de servidor.
- [ ] **Validación en capas**: Una para entidad completa, otra para parciales.
- [ ] **Normalización**: Estandariza datos (trim, lowercase, etc.).
- [ ] **Campos editables**: Type dedicado `EditableXXX = Pick<...>` si hay actualizaciones parciales.
- [ ] **Campos estructurales**: Claramente documentados, inmutables desde cliente.
- [ ] **Coherencia de negocio**: Reglas que deben cumplirse (ej: tipo 'employee' requiere company).
- [ ] **Contrato servidor-cliente**: Respuestas consistentes `{ success, data: T | null }`.
- [ ] **Semántica clara**: Acciones nombradas por intención (`logout`, no `reset`).

---

## 8. Ejemplo de Uso en Componentes

### Antes de Hidratación

```typescript
const { isHydrated, user } = useUserDataStore();

if (!isHydrated) {
  return <Spinner />; // Esperando respuesta del servidor
}
```

### Después de Hidratación

```typescript
const { isHydrated, user, update } = useUserDataStore();

if (!isHydrated) return <Spinner />;

if (!user) {
  return <LoginForm />; // Sin sesión activa
}

// Usuario autenticado
return (
  <>
    <UserProfile user={user} />
    <EditProfileForm 
      onSave={(partial) => update(partial)}
    />
  </>
);
```

---

## 9. Antipatrones a Evitar

### ❌ Hidratación desde localStorage

```typescript
// MAL
useEffect(() => {
  const saved = localStorage.getItem('user');
  if (saved) {
    getUserDataFromServer(JSON.parse(saved)); // NO!
  }
});
```

**Problema**: Contradice el principio de "solo servidor hidrata".

### ❌ Campos parciales sin contexto

```typescript
// MAL
const result = validateAndNormalizeUser({ firstName: 'Juan' });
// ¿Qué pasa con los otros campos? ¿Es válido?
```

**Solución**: Usar `validateAndNormalizeEditableFields` que requiere `existing: User`.

### ❌ Acciones sin guardrails

```typescript
// MAL
update(partial) => set(partial) // Sin validación

// BIEN
update(partial) => {
  if (!isHydrated) return; // Guardrail 1
  if (!user) return; // Guardrail 2
  const result = validateAndNormalizeEditableFields(partial, user);
  if (!result.ok) return; // Guardrail 3
  set({ user: result.value });
}
```

---

## Resumen

| Aspecto | Principio |
|---------|-----------|
| **Entidad** | Completa o nula, nunca fragmentada |
| **Hidratación** | Solo desde servidor, una vía (false → true) |
| **Edición** | Solo campos permitidos, solo si hidratado |
| **Validación** | En capas, con normalización |
| **Semántica** | Acciones claras y sin puertas traseras |
| **Contrato** | Servidor siempre responde `{ success, data: T \| null }` |
