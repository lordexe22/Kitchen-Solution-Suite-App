// src/hooks/useAutoLogin.ts
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { autoLogin } from '../services/authentication/authentication';
import type { UserResponse } from '../services/authentication/authentication.types';
import { useUserDataStore } from '../store/UserData.store';

export const useAutoLogin = () => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const setId = useUserDataStore(state => state.setId);
  const setFirstName = useUserDataStore(state => state.setFirstName);
  const setLastName = useUserDataStore(state => state.setLastName);
  const setEmail = useUserDataStore(state => state.setEmail);
  const setImageUrl = useUserDataStore(state => state.setImageUrl);
  const setType = useUserDataStore(state => state.setType);
  const setBranchId = useUserDataStore(state => state.setBranchId);
  const setState = useUserDataStore(state => state.setState);
  const setIsAuthenticated = useUserDataStore(state => state.setIsAuthenticated);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await autoLogin() as UserResponse;

        setId(response.user.id);
        setFirstName(response.user.firstName);
        setLastName(response.user.lastName);
        setEmail(response.user.email);
        setImageUrl(response.user.imageUrl);
        setType(response.user.type);
        setBranchId(response.user.branchId ?? null);
        setState(response.user.state);
        setIsAuthenticated(true);

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
    setId,
    setFirstName,
    setLastName,
    setEmail,
    setImageUrl,
    setType,
    setBranchId,
    setState,
    setIsAuthenticated,
    navigate,
    location,
  ]);

  return { isCheckingAuth };
};
