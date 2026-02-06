// src/hooks/useAutoLogin.ts
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { autoLogin } from '../services/authentication/authentication';
import type { UserResponse } from '../services/authentication/authentication.types';
import { useUserDataStore } from '../store/userData/UserData.store';
import { useCompaniesStore } from '../store/Companies.store';
import { getAllCompanies } from '../services/companies/companies.service';

export const useAutoLogin = () => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const getUserDataFromServer = useUserDataStore(state => state.getUserDataFromServer);
  const hydrateCompanies = useCompaniesStore(state => state.hydrateCompanies);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await autoLogin() as UserResponse;
        getUserDataFromServer(response.data);

        // Si el usuario está autenticado, cargar compañías inmediatamente
        if (response.data) {
          try {
            const companiesResp = await getAllCompanies(); // Trae todas (activas e inactivas)
            hydrateCompanies(companiesResp.companies);
          } catch (err) {
            // Error crítico: bloquear app y mostrar mensaje global
            alert('Error en el servidor. Por favor intente conectarse más tarde.');
            hydrateCompanies([]); // Dejar el store vacío pero hidratado
            // Opcional: podrías redirigir a una página de error
            return;
          }
        }

        // Solo navegar al dashboard si hay usuario autenticado
        if (response.data && location.pathname === '/') {
          navigate('/dashboard', { replace: true });
        }

      } catch {
        getUserDataFromServer(null);
        hydrateCompanies([]); // No hay usuario, limpiar compañías
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
