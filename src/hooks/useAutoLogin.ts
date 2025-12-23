// src/hooks/useAutoLogin.ts
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { autoLoginByToken } from '../services/authentication/authentication';
import type { UserResponse } from '../services/authentication/authentication.types';
import { useUserDataStore } from '../store/UserData.store';
import { useTagsStore } from '../store/Tags.store';

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
  const setBranchName = useUserDataStore(state => state.setBranchName);
  const setCompanyId = useUserDataStore(state => state.setCompanyId);
  const setCompanyName = useUserDataStore(state => state.setCompanyName);
  const setCompanyLogoUrl = useUserDataStore(state => state.setCompanyLogoUrl);
  const setPermissions = useUserDataStore(state => state.setPermissions);
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

        setId(response.user.id);
        setFirstName(response.user.firstName);
        setLastName(response.user.lastName);
        setEmail(response.user.email);
        setImageUrl(response.user.imageUrl);
        setType(response.user.type);
        setBranchId(response.user.branchId ?? null);
        setBranchName(response.user.branchName ?? null);
        setCompanyId(response.user.companyId ?? null);
        setCompanyName(response.user.companyName ?? null);
        setCompanyLogoUrl(response.user.companyLogoUrl ?? null);
        setPermissions(response.user.permissions ?? null);
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
    setId,
    setFirstName,
    setLastName,
    setEmail,
    setImageUrl,
    setType,
    setBranchId,
    setBranchName,
    setCompanyId,
    setCompanyName,
    setPermissions,
    setState,
    setIsAuthenticated,
    loadUserTags,
    navigate,
    location,
  ]);

  return { isCheckingAuth };
};