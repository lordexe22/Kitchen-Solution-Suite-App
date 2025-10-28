// src\components\AuthLoginModalWindow\AuthLoginModalWindow.tsx
// #section imports
import { useForm } from 'react-hook-form'
import { AuthenticatorWithGoogle } from "../../modules/authenticatorWithGoogle"
import styles from './AuthLoginModalWindow.module.css'
import '/src/styles/modal.css'
import '/src/styles/button.css'
// #end-section
// #interface LoginFormData
interface LoginFormData {
  email: string;
  password: string;
}
// #end-interface
// #interface AuthLoginModalWindowProp
interface AuthLoginModalWindowProp {
  onCloseModal: () => void
}
// #end-interface
// #component AuthLoginModalWindow
const AuthLoginModalWindow = (prop: AuthLoginModalWindowProp) => {
  // #variable register, handleSubmit, errors
  const { 
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    mode: 'onSubmit', // Valida al enviar el formulario
    criteriaMode: 'all' // Captura TODOS los errores, no solo el primero
  });
  // #end-variable
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
    console.log('Se intento enviar el formulario de login');
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
              <h3 className="modal-title">Login with Form</h3>
              <form onSubmit={onSubmit} style={{width:'100%'}}>
                <div className={styles['form-container']}>
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

                  <input 
                    type="submit" 
                    className="btn-pri btn-md"                    
                    style={{margin:'10px 0'}}
                    value="Login"
                  />
                </div>
              </form>
              <hr className="separator" />
              <h3 className="modal-title">Login with Google</h3>
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

export default AuthLoginModalWindow;
// #end-component