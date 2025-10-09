import styles from './MainPage.module.css'
import { AuthenticatorWithGoogle } from '../../modules/authenticatorWithGoogle';
import type { GoogleUser } from '../../modules/authenticatorWithGoogle';
import { useEffect, useState } from 'react';

// #component MainPage
const MainPage = () => {
  // #state [showLoginModal, setShowLoginModal]
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  // #end-state
  // #state [showRegisterModal, setShowRegisterModal]
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  // #end-state
  // #state [user, setUser]
  const [user, setUser] = useState<GoogleUser | null>(null);
  // #end-state

  // #event onAuthWithGoogle
  const onAuthWithGoogle = (googleUser:GoogleUser | null) => {
    setUser(googleUser);
  }
  // #end-event

  useEffect(()=>{
    console.log({user})
  },[user])
  
  
  // #section return
  return(
    <div className={styles['page-container']}>
      {/* #section Header */}
      <header>
        <div className={styles['header-logo']}>
          <div className={styles['modal-logo']+' '+styles['logo-md']}></div>
        </div>
        <div className={styles['header-buttons']}>
          {/* #section register button */}
          <button 
            className='button-primary button button-md'
            onClick={()=>{setShowRegisterModal(true)}}
            >Registrar</button>
          {/* #end-section */}
          {/* #section login button */}
          <button 
            className='button-primary button button-md'
            onClick={()=>{setShowLoginModal(true)}}
            >Ingresar</button>
          {/* #end-section */}
        </div>
      </header>
      {/* #end-section */}
      {/* #section Register modal */}
      {showRegisterModal && 
        <div className={styles['register-modal-container']} onClick={()=>{setShowRegisterModal(false)}}>
          <div className={styles['register-modal']}>
            <div 
              className={styles['modal-logo']+' '+styles['logo-lg']}
              style={{margin:'1rem auto'}}></div>
            <button 
              className='button-primary button button-md'
              >Crear cuenta</button>
            <AuthenticatorWithGoogle 
              mode='signup' 
              onAuth={(user:GoogleUser|null) => {onAuthWithGoogle(user)}}/>            
            <button 
              className='button-close button button-md'
              onClick={()=>{setShowRegisterModal(false)}}
              >x</button>
          </div>
        </div>
      }
      {/* #end-section */}
      {/* #section Login modal */}
      {showLoginModal &&
        <div className={styles['login-modal-container']} onClick={()=>{setShowLoginModal(false)}}>
          <div className={styles['login-modal']}>
            <div 
              className={styles['modal-logo']+' '+styles['logo-lg']}
              style={{margin:'1rem auto'}}></div>
            <button 
              className='button-primary button button-md'
              >Ingresar</button>
            <AuthenticatorWithGoogle 
              mode='login' 
              onAuth={(user:GoogleUser|null) => {onAuthWithGoogle(user)}}/>            
            <button 
              className='button-close button button-md'
              onClick={()=>{setShowLoginModal(false)}}
              >x</button>
          </div>
        </div>
      }
      {/* #end-section */}
    </div>
  )
  // #end-section
}
export default MainPage
// #end-component