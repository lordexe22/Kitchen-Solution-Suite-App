# TODO list
## App
### 🔐 Autenticación y rutas protegidas
1. [ ] Todas las rutas deben revisar si existe el JWT, si existe se debe obtener la informacion del usuario directamente desde ahi y redireccionar automaticamente al usuario
2. [ ] Se deberia poner una fecha de expiracion en el jwt
3. [ ] Como se usa react-router-dom, ya no se navega por medio del estado global creado en la store de zustand, se deberia actializar o borrar ese store
4. [ ] Crear un `PrivateRoute` que encapsule rutas protegidas como `/user`.

### 📦 Manejo de estado
5. [ ] Eliminar o refactorizar el store `useStoreCurrentPage` de Zustand que manejaba navegación por estado.
6. [ ] Ajustar todos los componentes que dependían de `changeCurrentPage()` para usar `useNavigate()`.

### 🕓 JWT
7. [ ] Asegurar que el token tenga una fecha de expiración adecuada (`exp`) (esto ya está del lado del server).
8. [ ] Implementar verificación de expiración del token en el cliente.
9. [ ] Desloguear automáticamente al usuario si el token está vencido (opcional).

## Server
### 🔐 JWT
1. [ ] Incluir expiración en el token JWT (`expiresIn: "7d"` ya está hecho, verificar consistencia).
2. [ ] Asegurarse de que el payload del JWT tenga solo los campos necesarios (ej. `id`, `email`, `role`).
3. [ ] Crear un middleware `verifyToken` para rutas protegidas que lea el token del header `Authorization`.
4. [ ] Desde el middleware `verifyToken`, consultar la base de datos para validar:
   - Que el usuario exista.
   - Que su cuenta esté activa.
   - Que no haya vencido su plan (`planEndDate`, etc.).

### 📚 Rutas protegidas
5. [ ] Usar `verifyToken` en todas las rutas privadas (como `/api/pedidos`, `/api/users/me`, etc.).
6. [ ] Implementar endpoint `/api/usuarios/me` que devuelva la info del usuario desde el token.


### 🧪 Otros
7. [ ] Revisar que la contraseña esté correctamente hasheada en registro (`bcrypt.hash()`).
8. [ ] Agregar control de errores más estricto en login y registro.