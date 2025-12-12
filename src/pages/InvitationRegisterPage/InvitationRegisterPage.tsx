/* src/pages/InvitationRegisterPage/InvitationRegisterPage.tsx */

// #section Imports
import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AuthenticatorWithGoogle } from '../../modules/authenticatorWithGoogle';
import type { GoogleUser } from '../../modules/authenticatorWithGoogle';
import { registerUserWithInvitation } from '../../services/authentication/authentication';
import type { RegisterUserData } from '../../services/authentication/authentication.types';
import { useInvitationValidation } from '../../hooks/useInvitationValidation';
import { useUserDataStore } from '../../store/UserData.store';
import { getServerErrorMessage, detectServerErrorType } from '../../utils/detectServerError/detectServerError';
import ServerErrorBanner from '../../components/ServerErrorBanner';
import styles from './InvitationRegisterPage.module.css';
import '/src/styles/button.css';
// #end-section

// #interface RegisterFormData
interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}
// #end-interface

// #component InvitationRegisterPage
/**
 * Página de registro por invitación.
 * 
 * Permite registrar usuarios como empleados usando un token de invitación.
 * Valida el token automáticamente y muestra información de la sucursal/empresa.
 * Soporta registro con email/password o con Google.
 * 
 * IMPORTANTE: Si el usuario ya tiene sesión activa (JWT presente), muestra
 * un mensaje indicando que debe cerrar sesión primero.
 */
const InvitationRegisterPage = () => {
  // #section Hooks and state
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const invitationToken = searchParams.get('invitation');
  const { isLoading: validatingToken, isValid, data, error: validationError } = useInvitationValidation(invitationToken);
  const setFirstName = useUserDataStore(s => s.setFirstName);
  const setLastName = useUserDataStore(s => s.setLastName);
  const setEmail = useUserDataStore(s => s.setEmail);
  const setImageUrl = useUserDataStore(s => s.setImageUrl);
  const setType = useUserDataStore(s => s.setType);
  const setState = useUserDataStore(s => s.setState);
  const setIsAuthenticated = useUserDataStore(s => s.setIsAuthenticated);
  const isAuthenticated = useUserDataStore(s => s.isAuthenticated);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const { 
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    mode: 'onSubmit',
    criteriaMode: 'all'
  });
  // #end-section

  // #section Form validation rules
  register('firstName', {
    required: 'El nombre es requerido',
    minLength: { value: 2, message: 'El nombre debe tener al menos 2 caracteres' }
  });

  register('lastName', {
    required: 'El apellido es requerido',
    minLength: { value: 2, message: 'El apellido debe tener al menos 2 caracteres' }
  });

  register('email', {
    required: 'El email es requerido',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Formato de email inválido'
    }
  });

  register('password', {
    required: 'La contraseña es requerida',
    minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
  });

  register('confirmPassword', {
    required: 'Debe confirmar la contraseña',
    validate: (value) => value === watch('password') || 'Las contraseñas no coinciden'
  });
  // #end-section

  // #function buildUserPayload
  /**
   * Construye el payload de registro dependiendo del método (form o Google).
   */
  const buildUserPayload = (
    formData?: RegisterFormData,
    googleUser?: GoogleUser | null
  ): RegisterUserData => {
    if (googleUser) {
      return {
        firstName: googleUser.given_name,
        lastName: googleUser.family_name,
        email: googleUser.email,
        password: null,
        imageUrl: googleUser.picture,
        platformToken: googleUser.sub,
        platformName: 'google'
      };
    } else if (formData) {
      return {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        imageUrl: null,
        platformToken: null,
        platformName: 'local'
      };
    }
    throw new Error('No data provided for user payload');
  };
  // #end-function

  // #function handleRegister
  /**
   * Maneja el registro (común para form y Google).
   */
  const handleRegister = async (payload: RegisterUserData) => {
    if (!invitationToken) {
      setServerError('Token de invitación no válido');
      return;
    }

    try {
      setIsRegistering(true);
      setServerError(null);

      const response = await registerUserWithInvitation(payload, invitationToken);
      
      // #step 1 - Guardar datos del usuario en store
      setFirstName(response.user.firstName);
      setLastName(response.user.lastName);
      setEmail(response.user.email);
      setImageUrl(response.user.imageUrl);
      setType(response.user.type);
      setState(response.user.state);
      setIsAuthenticated(true);
      // #end-step

      // #step 2 - Redirigir al dashboard normal (el navbar filtra por tipo)
      navigate('/dashboard');
      // #end-step
    } catch (error: unknown) {
      console.error('[InvitationRegisterPage] Error al registrar:', error);
      
      const errorType = detectServerErrorType(error);
      setServerError(getServerErrorMessage(errorType));
    } finally {
      setIsRegistering(false);
    }
  };
  // #end-function

  // #function onFormSubmit
  const onFormSubmit = async (formData: RegisterFormData) => {
    const payload = buildUserPayload(formData);
    await handleRegister(payload);
  };
  // #end-function

  // #function onGoogleSuccess
  const onGoogleSuccess = async (googleUser: GoogleUser) => {
    const payload = buildUserPayload(undefined, googleUser);
    await handleRegister(payload);
  };
  // #end-function

  // #function renderErrors
  const renderErrors = (fieldErrors: import('react-hook-form').FieldError | undefined) => {
    if (!fieldErrors) return null;
    
    const errorMessages: string[] = [];
    
    if (fieldErrors.types) {
      Object.values(fieldErrors.types).forEach((msg) => {
        if (typeof msg === 'string' && !errorMessages.includes(msg)) {
          errorMessages.push(msg);
        }
      });
    } else if (fieldErrors.message) {
      errorMessages.push(fieldErrors.message);
    }

    return errorMessages.map((msg, index) => (
      <p key={index} className={styles.errorMessage}>{msg}</p>
    ));
  };
  // #end-function

  // #section Render loading state
  if (validatingToken) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingBox}>
          <p>Validando invitación...</p>
        </div>
      </div>
    );
  }
  // #end-section

  // #section Render if user already logged in
  if (isAuthenticated) {
    return (
      <div className={styles.container}>
        <div className={styles.errorBox}>
          <h2>⚠️ Ya tienes una sesión activa</h2>
          <p>Actualmente tienes una sesión activa.</p>
          <p>
            Para registrarte con esta invitación, debes cerrar sesión primero
            o abrir este enlace en un navegador diferente o en modo incógnito.
          </p>
          <button
            className="button button-primary"
            onClick={() => navigate('/dashboard')}
          >
            Ir al Dashboard
          </button>
        </div>
      </div>
    );
  }
  // #end-section

  // #section Render invalid token
  if (!isValid) {
    return (
      <div className={styles.container}>
        <div className={styles.errorBox}>
          <h2>❌ Invitación inválida</h2>
          <p>{validationError || 'El token de invitación no es válido o ha expirado.'}</p>
          <button
            className="button button-secondary"
            onClick={() => navigate('/')}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }
  // #end-section

  // #section Render registration form
  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>Registro de Empleado</h1>
        
        {/* #subsection Invitation info */}
        <div className={styles.invitationInfo}>
          <p><strong>Empresa:</strong> {data?.companyName}</p>
          <p><strong>Sucursal:</strong> {data?.branchName}</p>
        </div>
        {/* #end-subsection */}

        {/* #subsection Server error banner */}
        {serverError && <ServerErrorBanner message={serverError} onClose={() => setServerError(null)} />}
        {/* #end-subsection */}

        {/* #subsection Google authenticator */}
        <AuthenticatorWithGoogle
          onAuth={(user) => { if (user) void onGoogleSuccess(user); }}
          mode="register"
        />
        {/* #end-subsection */}

        <div className={styles.divider}>
          <span>o</span>
        </div>

        {/* #subsection Registration form */}
        <form onSubmit={handleSubmit(onFormSubmit)} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="firstName">Nombre</label>
            <input
              id="firstName"
              type="text"
              {...register('firstName')}
              disabled={isRegistering}
            />
            {renderErrors(errors.firstName)}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lastName">Apellido</label>
            <input
              id="lastName"
              type="text"
              {...register('lastName')}
              disabled={isRegistering}
            />
            {renderErrors(errors.lastName)}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              {...register('email')}
              disabled={isRegistering}
            />
            {renderErrors(errors.email)}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              {...register('password')}
              disabled={isRegistering}
            />
            {renderErrors(errors.password)}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              disabled={isRegistering}
            />
            {renderErrors(errors.confirmPassword)}
          </div>

          <button
            type="submit"
            className="button button-primary"
            disabled={isRegistering}
          >
            {isRegistering ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
        {/* #end-subsection */}
      </div>
    </div>
  );
  // #end-section
};
// #end-component

export default InvitationRegisterPage;
