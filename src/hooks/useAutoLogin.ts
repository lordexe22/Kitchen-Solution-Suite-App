// src/hooks/useAutoLogin.ts
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { autoLogin } from '../services/authentication/authentication';
import type { UserResponse } from '../services/authentication/authentication.types';
import { useUserDataStore } from '../store/userData/UserData.store';

export const useAutoLogin = () => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const getUserDataFromServer = useUserDataStore(state => state.getUserDataFromServer);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await autoLogin() as UserResponse;

        getUserDataFromServer(response.user);

        if (location.pathname === '/') {
          navigate('/dashboard', { replace: true });
        }

      } catch {
        // No hay sesión activa
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [
    getUserDataFromServer,
    navigate,
    location,
  ]);

  return { isCheckingAuth };
};
