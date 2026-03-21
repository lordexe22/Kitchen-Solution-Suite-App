// src\components\AuthLoginModalWindow\AuthLoginModalWindow.tsx
// #section imports
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { AuthenticatorWithGoogle } from "../../modules/authenticatorWithGoogle"
import type { CredentialResponse } from '@react-oauth/google'
import { loginUser } from '../../services/authentication'
import type { UserLoginData } from '../../services/authentication'
import styles from './AuthLoginModalWindow.module.css'
import { useUserDataStore } from '../../store/userData/UserData.store'
import '/src/styles/modal.css'
import '/src/styles/button.css'
import ServerErrorBanner from '../ServerErrorBanner';
import { detectServerErrorType, getServerErrorMessage } from '../../utils/detectServerError'
import { useNavigate } from 'react-router-dom';
import type { LoginFormData, AuthLoginModalWindowProp } from './AuthLoginModalWindow.types';
// #end-section
// #component AuthLoginModalWindow
const AuthLoginModalWindow = (prop: AuthLoginModalWindowProp) => {
  // #variable register, handleSubmit, errors
  const { 
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<LoginFormData>({
    mode: 'onSubmit', // Valida al enviar el formulario
    criteriaMode: 'all' // Captura TODOS los errores, no solo el primero
  });
  // #end-variable
  // #state isLoading - Indica si está procesando el login
  const [isLoading, setIsLoading] = useState(false);
  // #end-state
  // #state serverError - Para errores de servidor/red
  const [serverError, setServerError] = useState<string | null>(null);
  // #end-state
  // #state email
  register(
    "email",
    {
      required: "Email is required",
      pattern: {
        value: /^(?!\.)(?!.*\.\.)([a-zA-Z0-9_\-.'+])+([a-zA-Z0-9_\-.'+])@(?!-)(?!.*--)([a-zA-Z0-9.-])+(?<!\.)(\.[a-zA-Z]{2,6})$/,
        message: "Invalid email format"
      }
    }
  )
  // #end-state
  // #state password
  register(
    "password",
    {
      required: "Password is required",
      minLength: {
        value: 8,
        message: "Password must be at least 8 characters"
      },
      validate: {
        hasLetter: (value) => /[A-Za-z]/.test(value) || "Password must contain at least one letter",
        hasNumber: (value) => /\d/.test(value) || "Password must contain at least one number",
      }
    }
  )
  // #end-state
  // #hook navigate
  const navigate = useNavigate();
  // #end-hook
  // #function renderErrors - Renderiza todos los errores de un campo
  /**
   * @description Renderiza todos los mensajes de error de un campo de formulario.
   * @purpose Centralizar la lógica de presentación de errores para campos validados con react-hook-form.
   * @context Utilizado internamente por AuthLoginModalWindow para mostrar errores bajo cada campo del formulario.
   * @param fieldErrors errores del campo según react-hook-form
   * @returns lista de párrafos con mensajes de error, o null si no hay errores
   * @since 1.0.0
   * @author Walter Ezequiel Puig
   */
  const renderErrors = (fieldErrors: import('react-hook-form').FieldError | undefined) => {
    if (!fieldErrors) return null;
    
    const errorMessages: string[] = [];
    
    // Si hay múltiples validaciones (validate object), usar solo esos
    if (fieldErrors.types) {
      Object.values(fieldErrors.types).forEach((msg) => {
        if (typeof msg === 'string' && !errorMessages.includes(msg)) {
          errorMessages.push(msg);
        }
      });
    } 
    // Si no hay types, usar el mensaje simple
    else if (fieldErrors.message) {
      errorMessages.push(fieldErrors.message);
    }
    
    return errorMessages.map((msg, index) => (
      <p key={index} className={styles.error}>{msg}</p>
    ));
  };
  // #end-function
  // #function handleGoogleAuth - Maneja la autenticación con Google
  /**
   * @description Maneja la autenticación exitosa con Google, enviando el token al servidor para validación.
   * @purpose Centralizar el flujo de login con Google: validación del credential, petición al servidor y actualización del store.
   * @context Utilizado por AuthLoginModalWindow como callback del componente AuthenticatorWithGoogle en modo login.
   * @param response respuesta de GoogleLogin con el credential JWT del usuario
   * @throws Error si el credential es inválido o si la petición al servidor falla
   * @since 1.0.0
   * @author Walter Ezequiel Puig
   */
  const handleGoogleAuth = async (response: CredentialResponse) => {
    // Limpiar errores previos
    setServerError(null);

    if (!response.credential) {
      setError('email', {
        type: 'oauth',
        message: 'Invalid credential from Google. Please try again.'
      });
      return;
    }

    setIsLoading(true);

    try {
      // Enviar el token JWT completo de Google al servidor
      // El servidor se encargará de validar la firma
      const loginData: UserLoginData = {
        platformName: 'google',
        credential: response.credential  // ← Token JWT completo sin modificar
      };

      const loginResponse = await loginUser(loginData);
      // Actualizar el store en un solo paso
      useUserDataStore.getState().getUserDataFromServer(loginResponse.data);
      
      console.log('✅ Store actualizado');
      
      navigate('/dashboard');

      onCloseModal();
      
    } catch (error) {
      // Detectar si es error de servidor/red
      const errorType = detectServerErrorType(error);
      
      if (errorType === 'network' || errorType === 'timeout' || errorType === 'server') {
        // Error de infraestructura → Banner
        const errorMessage = getServerErrorMessage(errorType);
        setServerError(errorMessage);
      } else {
        // Error de validación → Debajo del campo
        if (error instanceof Error) {
          setError('email', {
            type: 'server',
            message: error.message
          });
        } else {
          setError('email', {
            type: 'server',
            message: 'Login failed. Please try again.'
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };
  // #end-function
  // #event onSubmit
  const onSubmit = handleSubmit(async (data) => {
    // Limpiar errores previos
    setServerError(null);
    setIsLoading(true);

    try {
      const loginData: UserLoginData = {
        platformName: 'local',
        email: data.email,
        password: data.password
      };

      const response = await loginUser(loginData);
      // Actualizar el store con los datos del usuario
      useUserDataStore.getState().getUserDataFromServer(response.data);
      
      navigate('/dashboard');

      onCloseModal();
      
    } catch (error) {
      // Detectar si es error de servidor/red
      const errorType = detectServerErrorType(error);
      
      if (errorType === 'network' || errorType === 'timeout' || errorType === 'server') {
    // Error de infraestructura → Banner
        const errorMessage = getServerErrorMessage(errorType);
        setServerError(errorMessage);
      } else {
        // Error de validación → Debajo del campo
        if (error instanceof Error) {
          setError('email', {
            type: 'server',
            message: error.message
          });
        } else {
          setError('email', {
            type: 'server',
            message: 'Login failed. Please try again.'
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  })
  // #end-event
  // #event onCloseModal  
  const {
    onCloseModal,
  } = prop;
  // #end-event
  // #section return
  return(
    <>
        <div className="modal-overlay" onClick={onCloseModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            {/* #section logo */}
            <button
              className="btn-close"
              style={{position:'absolute', top:0, right:0}}
              onClick={onCloseModal}
              aria-label="Cerrar ventana"
            >
              ×
            </button>
            {/* #end-section */}
            {/* #section Body */}
            <div className='modal-body' style={{marginTop:'20px'}}>
              {/* #section Banner de error de servidor */}
              <ServerErrorBanner 
                message={serverError} 
                onClose={() => setServerError(null)} 
              />
              {/* #end-section */}
              <h3 className="modal-title">Login with Form</h3>
              <form onSubmit={onSubmit} style={{width:'100%'}}>
                <div className={styles['form-container']}>
                  {/* #section Email Input */}
                  <input 
                    type="email" 
                    placeholder="Email Address"
                    aria-invalid={errors.email ? "true" : "false"}
                    disabled={isLoading}
                    {...register("email")}
                  />
                  {renderErrors(errors.email)}
                  {/* #end-section */}
                  {/* #section Password Input */}
                  <input
                    type="password" 
                    placeholder="Password"
                    aria-invalid={errors.password ? "true" : "false"}
                    disabled={isLoading}
                    {...register("password")}
                  />
                  {renderErrors(errors.password)}
                  {/* #end-section */}
                  <input 
                    type="submit" 
                    className="btn-pri btn-md"                    
                    style={{margin:'10px 0'}}
                    value={isLoading ? "Logging in..." : "Login"}
                    disabled={isLoading}
                  />
                </div>
              </form>
              <hr className="separator" />
              <h3 className="modal-title">Login with Google</h3>
              <div style={{width:'100%', margin:'2px 0'}}>
                {!isLoading ? (
                  <AuthenticatorWithGoogle
                    mode="login"
                    onAuth={handleGoogleAuth}
                  />
                ) : (
                  <div style={{textAlign: 'center', padding: '10px', color: '#666'}}>
                    Processing...
                  </div>
                )}
              </div>
            </div>
            {/* #end-section */}
          </div>
        </div>
    </>
  )
  // #end-section
}

export default AuthLoginModalWindow;
// #end-component