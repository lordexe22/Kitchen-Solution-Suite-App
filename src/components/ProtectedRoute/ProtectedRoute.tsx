// src/components/ProtectedRoute/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useUserDataStore } from '../../store/UserData.store';

/**
 * Componente que protege rutas privadas
 * Redirige a "/" si el usuario no está autenticado
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = useUserDataStore(state => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;