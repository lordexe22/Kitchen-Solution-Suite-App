// src\pages\MainPage\MainPage.tsx

import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();

  // #event - Navegación hacia el registro
  const handleRegister = () => {
    navigate("/register");
  };
  // #end-event
  // #event - Navegación hacia el login
  const handleLogin = () => {
    navigate("/login");
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

