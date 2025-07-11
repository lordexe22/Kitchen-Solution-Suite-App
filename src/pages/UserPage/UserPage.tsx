import { type User } from "../../types/User.t";

const UserPage = () => {

  // #note - Se asume que el usuario ya está autenticado y se ha cargado su información en el estado global o contexto.


  // #todo - Hardcodear el usuario por ahora, ya que no se ha implementado la autenticación.


  // #variable - mockUser: User - Usuario simulado (hardcodeado por ahora)
  const mockUser: User = {
    id: 'user_001',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    password: '1234', // Ignorar seguridad en esta etapa
    role: 'admin', // Podés cambiar a 'mozo' o 'cliente' para probar
    accountPlan: "basic",
    companyId: ['company_001'],
    createdAt: new Date(),
    lastLogin: new Date()
  };
  // #end-variable

  // #note - En función del rol del usuario, se mostrarán diferentes componentes o funcionalidades.

  return (
    <div>
      <h1>Bienvenido, {mockUser.name}</h1>
      <h1>Panel de Administración</h1>
      <ul>
        <li><a href="/admin/locales">Gestionar locales</a></li>
        <li><a href="/admin/mesas">Gestionar mesas</a></li>
        <li><a href="/admin/usuarios">Gestionar usuarios</a></li>
        <li><a href="/admin/menu">Gestionar menú</a></li>
        <li><a href="/admin/pedidos">Ver pedidos</a></li>
      </ul>
    </div>
  );
}

export default UserPage;
