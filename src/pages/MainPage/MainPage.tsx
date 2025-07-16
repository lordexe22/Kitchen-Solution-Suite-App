// src\pages\MainPage\MainPage.tsx

import { useStoreCurrentPage } from "../../store/currentPage/currentPage";

const MainPage = () => {
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
  return(
    <>
      <header>
        <button onClick={handleRegister}>Go to register</button>
        <button onClick={handleLogin}>Go to login</button>
      </header>
      <h1>Main Page</h1>
    </>
  )
}

export default MainPage

