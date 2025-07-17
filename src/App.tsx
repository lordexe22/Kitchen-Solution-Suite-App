// src\App.tsx

import { Routes, Route, Navigate } from "react-router-dom";
import MainPage from "./pages/MainPage/MainPage"
import RegisterPage from "./modules/auth/register/RegisterPage";
import LoginPage from "./modules/auth/login/LoginPage";
import UserPage from "./pages/UserPage/UserPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/user" element={<UserPage />} />
      {/* Redireccionar cualquier ruta desconocida a la principal */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App

