// src/hooks/useAutoLogin.ts
import { useEffect, useState } from 'react';
import { autoLoginByToken } from '../services/authentication/authentication';
import { useUserDataStore } from '../store/UserData.store';

export const useAutoLogin = () => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // ✅ Selectores de Zustand: retornan funciones estables
  const setFirstName = useUserDataStore(state => state.setFirstName);
  const setLastName = useUserDataStore(state => state.setLastName);
  const setEmail = useUserDataStore(state => state.setEmail);
  const setImageUrl = useUserDataStore(state => state.setImageUrl);
  const setType = useUserDataStore(state => state.setType);
  const setState = useUserDataStore(state => state.setState);
  const setIsAuthenticated = useUserDataStore(state => state.setIsAuthenticated);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 Verificando autenticación automática...');

        const response = await autoLoginByToken();

        setFirstName(response.user.firstName);
        setLastName(response.user.lastName);
        setEmail(response.user.email);
        setImageUrl(response.user.imageUrl);
        setType(response.user.type);
        setState(response.user.state);
        setIsAuthenticated(true);

        console.log('✅ Auto-login exitoso');
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
  ]);

  return { isCheckingAuth };
};
