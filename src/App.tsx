// src\App.tsx

import MainPage from "./pages/MainPage/MainPage"
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import UserPage from "./pages/UserPage/UserPage";
import {useStoreCurrentPage} from "./store/currentPage/currentPage";


function App() {
  const currentPage = useStoreCurrentPage((state) => state.currentPage);
  return (
    <>
      {currentPage === "main" && <MainPage />}
      {currentPage === "register" && <RegisterPage />}
      {currentPage === "login" && <LoginPage />}
      {currentPage === "user" && <UserPage />}
    </>
  );
}

export default App

