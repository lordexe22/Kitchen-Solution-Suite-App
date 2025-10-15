// src/pages/MainPage/MainPage.tsx
// #section Imports
import styles from './MainPage.module.css';
import '/src/styles/button.css';
import '/src/styles/modal.css';
import { AuthenticatorWithGoogle } from '../../modules/authenticatorWithGoogle';
import type { GoogleUser } from '../../modules/authenticatorWithGoogle';
import { useEffect, useState } from 'react';
// #end-section

// #component MainPage
const MainPage = () => {
  // #state [showModal, setShowModal]
  const [showModal, setShowModal] = useState<boolean>(false);
  // #end-state
  // #state [activeTab, setActiveTab]
  const [activeTab, setActiveTab] = useState<number>(1);
  // #end-state
  // #state [user, setUser]
  const [user, setUser] = useState<GoogleUser | null>(null);
  // #end-state
  // #event onAuthWithGoogle
  const onAuthWithGoogle = (googleUser: GoogleUser | null) => {
    setUser(googleUser);
  };
  // #end-event

  useEffect(() => {
    console.log({ user });
  }, [user]);

  const userLogoUrl = `${import.meta.env.BASE_URL}${`user.svg`}`;
  const appLogoUrl = `${import.meta.env.BASE_URL}${`page_icon.jpg`}`;

  // #section return
  return (
    <div className={styles['page-container']}>
      {/* #section Header */}
      <header>
        <div className={styles['header-logo']}>
          <img src={appLogoUrl} alt="App Logo" />
        </div>
        <div className={styles['header-buttons']}>
          <button
            className='btn-sec btn-lg'
            onClick={() => {
              setActiveTab(1);
              setShowModal(true);
            }}
          >
            <img className='btn-icon' src={userLogoUrl} alt="Logo 1" />
            <span>Login</span>
          </button>
        </div>
      </header>
      {/* #end-section */}
      {/* #section Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-container modal--fixed" onClick={(e) => e.stopPropagation()}>
            {/* #section Header */}
            <div className="modal-header">
              <div className={styles["tabs-container"]}>
                <div 
                  className={`${styles["tab"]} ${activeTab===1 && styles["active"]}`}
                  onClick={()=>{setActiveTab(1)}}
                  >Login</div>
                <div 
                  className={`${styles["tab"]} ${activeTab===2 && styles["active"]}`}
                  onClick={()=>{setActiveTab(2)}}
                  >Register</div>
              </div>
              <button
                className="btn-close"
                onClick={() => setShowModal(false)}
                aria-label="Cerrar ventana"
              >
                ×
              </button>
            </div>
            {/* #end-section */}
            {/* #section Logo */}
            <div className="modal-logo">
              <img src={appLogoUrl} alt="Logo modal" />
            </div>
            {/* #end-section */}
            {/* #section Body */}
            <div className='modal-body'>
              <AuthenticatorWithGoogle mode='login' onAuth={onAuthWithGoogle}/>
            </div>
            {/* #end-section */}
            {/* #section Footer */}
            <div className='modal-footer'>
              <button 
                className="btn-sec"
                onClick={()=>{setShowModal(false)}}
                >Cancelar</button>
              <button className="btn-pri">Confirmar</button>
            </div>
            {/* #end-section */}
          </div>
        </div>
      )}
      {/* #end-section */}
    </div>
  );
  // #end-section
};

export default MainPage;
// #end-component
