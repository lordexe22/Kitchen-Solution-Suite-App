/* src\components\AuthRegisterModalWindow\AuthRegisterModalWindow.tsx */
// #section imports
import { useState } from 'react'
import {useForm} from 'react-hook-form'
import { AuthenticatorWithGoogle } from "../../modules/authenticatorWithGoogle"
import type { GoogleUser } from '../../modules/authenticatorWithGoogle'
import { API_CONFIG } from '../../config/config'
import { useUserDataStore } from '../../store/UserData.store'
import styles from './AuthRegisterModalWindow.module.css'
import '/src/styles/modal.css'
import '/src/styles/button.css'
import ServerErrorBanner from '../ServerErrorBanner';
import { fetchWithTimeout } from '../../utils/fetchWithTimeout/fetchWithTimeout'
import { getServerErrorMessage, detectServerErrorType } from '../../utils/detectServerError/detectServerError'
// #end-section
// #interface RegisterFormData
interface RegisterFormData{
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}
// #end-interface
// #interface RegisterUserPayload - data to send to server
interface RegisterUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string | null;
  imageUrl: string | null;
  platformToken: string | null;
  platformName: 'local' | 'google';
}
// #end-interface
// #interface AuthRegisterModalWindowProp
interface AuthRegisterModalWindowProp {
  onCloseModal: () => void
}
// #end-interface
// #component AuthRegisterModalWindow
const AuthRegisterModalWindow = (prop:AuthRegisterModalWindowProp) => {
  // #variable register, handleSubmit, errors, watch
  const { 
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError
  } = useForm<RegisterFormData>({
    mode: 'onSubmit',
    criteriaMode: 'all'
  });
  // #end-variable
  // #state firstName
  register(
    "firstName",
    {
      required: "Name is required",
    }
  )
  // #end-state
  // #state lastName
  register(
    "lastName",
    {
      required: "Last Name is required"
    }
  )
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
  // #state confirmPassword
  register(
    "confirmPassword",
    {
      required: "Confirm Password is required",
      validate: {
        matchesPassword: (value) => {
          const password = watch('password');
          return value === password || "Passwords do not match";
        }
      }
    }
  )
  // #end-state
  // #state serverError - Para errores de servidor/red
  const [serverError, setServerError] = useState<string | null>(null);
  // #end-state
  // #state isLoading - Indica si está procesando el registro
  const [isLoading, setIsLoading] = useState(false);
  // #end-state
  // #function buildUserPayload - creates user object to send to server
  const buildUserPayload = (
    formData?: RegisterFormData,
    googleUser?: GoogleUser | null
  ): RegisterUserPayload => {
    if (googleUser) {
      // Registration with Google
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
      // Registration with form
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
  // #function sendRegisterToServer - sends registration data to server
  const sendRegisterToServer = async (userPayload: RegisterUserPayload) => {
    try {
      const response = await fetchWithTimeout(
        `${API_CONFIG.BASE_URL}${API_CONFIG.REGISTER_URL}`,
        {
          credentials: 'include',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userPayload),
        },
        10000 // 10 segundos timeout
      );

      const data = await response.json();

      if (!response.ok) {
        // Errores de servidor (500+)
        if (response.status >= 500) {
          const errorType = detectServerErrorType({ status: response.status });
          const errorMessage = getServerErrorMessage(errorType);
          throw new Error(errorMessage);
        }

        // Manejar errores específicos del backend (400, 409)
        if (response.status === 409) {
          throw new Error('This email is already registered. Please login instead.');
        } else if (response.status === 400) {
          throw new Error(data.error || 'Invalid registration data. Please check your information.');
        } else {
          throw new Error(data.error || `Registration failed: ${response.statusText}`);
        }
      }

      console.log('Registration successful:', data);
      return data;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  };
  // #end-function
  // #function renderErrors - Renderiza todos los errores de un campo
  const renderErrors = (fieldErrors: import('react-hook-form').FieldError | undefined) => {
    if (!fieldErrors) return null;
    
    const errorMessages: string[] = [];
    
    if (fieldErrors.types) {
      Object.values(fieldErrors.types).forEach((msg) => {
        if (typeof msg === 'string' && !errorMessages.includes(msg)) {
          errorMessages.push(msg);
        }
      });
    } 
    else if (fieldErrors.message) {
      errorMessages.push(fieldErrors.message);
    }
    
    return errorMessages.map((msg, index) => (
      <p key={index} className={styles.error}>{msg}</p>
    ));
  };
  // #end-function
  // #event onSubmit - handles form submission
  const onSubmit = handleSubmit(async (data) => {
    // Limpiar errores previos
    setServerError(null);
    setIsLoading(true); // ← AGREGAR

    try {
      console.log('Attempting to register with form...');
      const userPayload = buildUserPayload(data);
      const response = await sendRegisterToServer(userPayload);
      
      console.log('✅ Registration successful:', response);
      
      // Actualizar el store con los datos del usuario
      useUserDataStore.getState().setFirstName(response.data.user.firstName);
      useUserDataStore.getState().setLastName(response.data.user.lastName);
      useUserDataStore.getState().setEmail(response.data.user.email);
      useUserDataStore.getState().setImageUrl(response.data.user.imageUrl);
      useUserDataStore.getState().setType(response.data.user.type);
      useUserDataStore.getState().setState(response.data.user.state);
      useUserDataStore.getState().setIsAuthenticated(true);
      
      console.log('✅ Store actualizado');
      
      // Cerrar el modal
      onCloseModal();
    } catch (error) {
      console.error('Registration with form failed:', error);
      
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
            message: 'Registration failed. Please try again.'
          });
        }
      }
    } finally {
      setIsLoading(false); // ← AGREGAR
    }
  })
  // #end-event
  // #event handleGoogleAuth - handles Google authentication
  const handleGoogleAuth = async (googleUser: GoogleUser | null) => {
    // Limpiar errores previos
    setServerError(null);

    // Si el usuario canceló, no hacer nada
    if (!googleUser) {
      console.log('User cancelled Google authentication');
      return;
    }

    // Validar que Google retornó los datos mínimos necesarios
    if (!googleUser.sub || !googleUser.email || !googleUser.given_name || !googleUser.family_name) {
      console.error('Invalid Google user data:', googleUser);
      setError('email', {
        type: 'oauth',
        message: 'Invalid data received from Google. Please try again or use email registration.'
      });
      return;
    }

    // Validar que el email esté verificado por Google (advertencia, no bloqueo)
    if (!googleUser.email_verified) {
      console.warn('Google email not verified:', googleUser.email);
    }

    setIsLoading(true); // ← AGREGAR

    try {
      console.log('Attempting to register with Google...');
      const userPayload = buildUserPayload(undefined, googleUser);
      const response = await sendRegisterToServer(userPayload);
      
      console.log('✅ Registration successful:', response);
      
      // Actualizar el store con los datos del usuario
      useUserDataStore.getState().setFirstName(response.data.user.firstName);
      useUserDataStore.getState().setLastName(response.data.user.lastName);
      useUserDataStore.getState().setEmail(response.data.user.email);
      useUserDataStore.getState().setImageUrl(response.data.user.imageUrl);
      useUserDataStore.getState().setType(response.data.user.type);
      useUserDataStore.getState().setState(response.data.user.state);
      useUserDataStore.getState().setIsAuthenticated(true);
      
      console.log('✅ Store actualizado');
      
      // Cerrar el modal
      onCloseModal();
    } catch (error) {
      console.error('Registration with Google failed:', error);
      
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
            message: 'Registration failed. Please try again.'
          });
        }
      }
    } finally {
      setIsLoading(false); // ← AGREGAR
    }
  };
  // #end-event
  // #event onCloseModal - handles modal close  
  const {
    onCloseModal,
  } = prop;
  // #end-event
  // #section return
  return(
    <>
        <div className="modal-overlay" onClick={onCloseModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            {/* #section Button-close */}
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
              {/* #section Server Error Banner */}
              <ServerErrorBanner 
                message={serverError} 
                onClose={() => setServerError(null)} 
              />
              <h3 className="modal-title">Register with Form</h3>
              {/* #section form */}
              <form 
                onSubmit={onSubmit} 
                style={{width:'100%'}}
              >
                <div className={styles['form-container']}>
                  {/* #section First Name Input */}
                  <input
                    type="text"
                    placeholder="First Name" 
                    aria-invalid={errors.firstName ? "true" : "false"}
                    disabled={isLoading}
                    {...register("firstName")}
                  />
                  {renderErrors(errors.firstName)}
                  {/* #end-section */}
                  {/* #section Last Name Input */}                  
                  <input 
                    type="text" 
                    placeholder="Last Name"
                    aria-invalid={errors.lastName ? "true" : "false"}
                    disabled={isLoading}
                    {...register("lastName")}
                  />
                  {renderErrors(errors.lastName)}
                  {/* #end-section */}
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
                  {/* #section Confirm Password Input */}
                  <input 
                    type="password"
                    placeholder="Confirm Password"
                    aria-invalid={errors.confirmPassword ? "true" : "false"}
                    disabled={isLoading}
                    {...register("confirmPassword")}
                  />
                  {renderErrors(errors.confirmPassword)}
                  {/* #end-section */}
                  {/* #section Submit Button */}
                  <input 
                    type="submit" 
                    className="btn-pri btn-md"                    
                    style={{margin:'10px 0'}}
                    value={isLoading ? "Registering..." : "Register"}
                    disabled={isLoading}
                  />
                  {/* #end-section */}
                </div>
              </form>
              {/* #end-section */}
              <hr className="separator" />
              <h3 className="modal-title">Register with Google</h3>
              <div style={{width:'100%', margin:'2px 0'}}>
                {!isLoading ? (
                  <AuthenticatorWithGoogle
                    mode="register"
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
export default AuthRegisterModalWindow;
// #end-component