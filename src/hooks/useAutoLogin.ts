// src/hooks/useAutoLogin.ts
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { autoLoginByToken } from '../services/authentication/authentication';
import { useUserDataStore } from '../store/UserData.store';
import { useTagsStore } from '../store/Tags.store';

interface UserResponse {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    imageUrl: string | null;
    type: string;
    state: string;
  };
}

export const useAutoLogin = () => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const setFirstName = useUserDataStore(state => state.setFirstName);
  const setLastName = useUserDataStore(state => state.setLastName);
  const setEmail = useUserDataStore(state => state.setEmail);
  const setImageUrl = useUserDataStore(state => state.setImageUrl);
  const setType = useUserDataStore(state => state.setType);
  const setState = useUserDataStore(state => state.setState);
  const setIsAuthenticated = useUserDataStore(state => state.setIsAuthenticated);
  const loadUserTags = useTagsStore(state => state.loadUserTags);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 Verificando autenticación automática...');

        const response = await autoLoginByToken() as UserResponse;

        setFirstName(response.user.firstName);
        setLastName(response.user.lastName);
        setEmail(response.user.email);
        setImageUrl(response.user.imageUrl);
        setType(response.user.type);
        setState(response.user.state);
        setIsAuthenticated(true);

        console.log('✅ Auto-login exitoso');

        console.log('🏷️ Cargando etiquetas personalizadas...');
        await loadUserTags();
        console.log('✅ Etiquetas cargadas');

        if (location.pathname === '/') {
          console.log('🔄 Redirigiendo al dashboard...');
          navigate('/dashboard', { replace: true });
        }

      } catch (error) {
        console.log('ℹ️ No hay sesión activa', error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [
    setFirstName,
    setLastName,
    setEmail,
    setImageUrl,
    setType,
    setState,
    setIsAuthenticated,
    loadUserTags,
    navigate,
    location,
  ]);

  return { isCheckingAuth };
};