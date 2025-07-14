# TODO list
## App
### Registro de usuarios
1. ✅ Crear un formulario de registro de usuario
    <div style='background-color:#ffffff10; padding: 5px'>
    Se crea el componente RegisterPage el cual contiene el formulario de registro de usuarios.
    </div>

2. ✅ Conectar
---
### Login de los usuarios


## Server
### Registro de usuarios
1. ✅ Crear una base de datos en postgressSQL
    <div style='background-color:#ffffff10; padding: 5px'>
    Se crea db/pool.ts y db/init.ts para crear la base de datos y la tabla donde se almacenarán los usuarios registrados.
    </div>
2. ✅ Crear los endpoints para comunicarse con el cliente y los  middlewares correspondientes para efectuar dicha operación
    <div style='background-color:#ffffff10; padding: 5px'>
    Se crea db/pool.ts y db/init.ts para crear la base de datos y la tabla donde se almacenarán los usuarios registrados.
    Luego se crean los endpoints en server.ts y finalmente los middlewares en src/routes/usuarios.ts
    </div>
---
### Login de los usuarios