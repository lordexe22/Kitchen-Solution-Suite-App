// src\App.tsx

import MainPage from "./pages/MainPage/MainPage"
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import {useStoreCurrentPage} from "./store/currentPage/currentPage"


function App() {
  const currentPage = useStoreCurrentPage((state) => state.currentPage);
  const changeCurrentPage = useStoreCurrentPage((state) => state.changeCurrentPage);
  
  // #event - Navegación hacia el registro
  const handleRegister = () => {
    changeCurrentPage("register");
  };
  // #end-event

    // #event - Navegación hacia el login
  const handleLogin = () => {
    changeCurrentPage("login");
  };
  // #end-event
  return (
    <>
      <header>
        <button onClick={handleRegister}>Go to register</button>
        <button onClick={handleLogin}>Go to login</button>
      </header>

      {currentPage === "main" && <MainPage />}
      {currentPage === "register" && <RegisterPage />}
      {currentPage === "login" && <LoginPage />}
    </>
  );
}

export default App

