// src\components\AuthRegisterModalWindow\AuthRegisterModalWindow.tsx
// #section imports
import {useForm} from 'react-hook-form'
import { AuthenticatorWithGoogle } from "../../modules/authenticatorWithGoogle"
import styles from './AuthRegisterModalWindow.module.css'
import '/src/styles/modal.css'
import '/src/styles/button.css'
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
  } = useForm<RegisterFormData>({
    mode: 'onSubmit', // Valida al enviar el formulario
    criteriaMode: 'all' // CLAVE: Captura TODOS los errores, no solo el primero
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
  // #function renderErrors - Renderiza todos los errores de un campo
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
  // #event onSubmit
  const onSubmit = handleSubmit((data) => {
    console.log('Se intento enviar el formulario de registro');
    console.log({data});
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
              <h3 className="modal-title">Register with Form</h3>
              <form onSubmit={onSubmit} style={{width:'100%'}}>
                <div className={styles['form-container']}>
                  {/* #section First Name Input */}
                  <input
                    type="text"
                    placeholder="First Name" 
                    aria-invalid={errors.firstName ? "true" : "false"}
                    {...register("firstName")}
                  />
                  {renderErrors(errors.firstName)}
                  {/* #end-section */}
                  
                  {/* #section Last Name Input */}                  
                  <input 
                    type="text" 
                    placeholder="Last Name"
                    aria-invalid={errors.lastName ? "true" : "false"}
                    {...register("lastName")}
                  />
                  {renderErrors(errors.lastName)}
                  {/* #end-section */}
                  
                  {/* #section Email Input */}
                  <input 
                    type="email" 
                    placeholder="Email Address"
                    aria-invalid={errors.email ? "true" : "false"}
                    {...register("email")}
                  />
                  {renderErrors(errors.email)}
                  {/* #end-section */}
                  
                  {/* #section Password Input */}
                  <input
                    type="password" 
                    placeholder="Password"
                    aria-invalid={errors.password ? "true" : "false"}
                    {...register("password")}
                  />
                  {renderErrors(errors.password)}
                  {/* #end-section */}
                  
                  {/* #section Confirm Password Input */}
                  <input 
                    type="password"
                    placeholder="Confirm Password"
                    aria-invalid={errors.confirmPassword ? "true" : "false"}
                    {...register("confirmPassword")}
                  />
                  {renderErrors(errors.confirmPassword)}
                  {/* #end-section */}
                  
                  <input 
                    type="submit" 
                    className="btn-pri btn-md"                    
                    style={{margin:'10px 0'}}
                    value="Register"
                  />
                </div>
              </form>
              <hr className="separator" />
              <h3 className="modal-title">Register with Google</h3>
              <div style={{width:'100%', margin:'2px 0'}}>
                <AuthenticatorWithGoogle
                  mode="register"
                  onAuth={()=>{}}
                />
              </div>
            </div>
            {/* #end-section */}
            {/* #section Footer */}
            <div className='modal-footer'>
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