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
      // Evitar auto-login en páginas públicas de invitación
      const isInvitationContext = (
        location.pathname.toLowerCase().includes('invitation') ||
        location.search.toLowerCase().includes('invitation=')
      );

      if (isInvitationContext) {
        setIsCheckingAuth(false);
        return; // No intentar auto-login aquí para evitar ruido (401 esperado)
      }

      try {
        const response = await autoLoginByToken() as UserResponse;

        setFirstName(response.user.firstName);
        setLastName(response.user.lastName);
        setEmail(response.user.email);
        setImageUrl(response.user.imageUrl);
        setType(response.user.type);
        setState(response.user.state);
        setIsAuthenticated(true);

        await loadUserTags();

        if (location.pathname === '/') {
          navigate('/dashboard', { replace: true });
        }

      } catch (error) {
        // No hay sesión activa
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