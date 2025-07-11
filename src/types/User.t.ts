export interface User {
  /** Identificador unico del usuario */
  id: string;
  /** Nombre del usuario */
  name: string;
  /** Correo electronico del usuario */
  email: string;
  /** Contraseña */
  password: string;
  /** Rol del usuario en el sistema */
  role: 'cliente' | 'mozo' | 'admin';
  /** Plan contratado para la cuenta */
  accountPlan: 'free' | 'basic' | 'pro' | 'enterprise';
  /** Identificadores de las empresas a la que pertenece el usuario */
  companyId: string[];
  /** Fecha de creacion del usuario */
  createdAt: Date;
  /** Última conexión del usuario */
  lastLogin?: Date;
}
