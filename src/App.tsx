// src/App.tsx
import MainPage from "./pages/MainPage/MainPage";
import RegisterPage from "./modules/auth/register/RegisterPage";
import LoginPage from "./modules/auth/login/LoginPage";
import UserPage from "./pages/UserPage/UserPage";
import ClientPage from "./pages/ClientPage/ClientPage";
import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // const publicRoutes = ["/", "/login", "/register"];

  useEffect(() => {
    const verificarToken = async () => {
      const jwt = localStorage.getItem("jwt");
      const publicRoutes = ["/", "/login", "/register"];


      if (!jwt) {
        if (!publicRoutes.includes(location.pathname)) {
          navigate("/");
        }
        return;
      }

      try {
        const res = await fetch("http://localhost:4000/api/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (res.ok) {
          if (location.pathname !== "/client") {
            navigate("/client");
          }
        } else {
          if (!publicRoutes.includes(location.pathname)) {
            navigate("/");
          }
        }
      } catch {
        if (!publicRoutes.includes(location.pathname)) {
          navigate("/");
        }
      }
    };

    verificarToken();
  }, [navigate, location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/user" element={<UserPage />} />
      <Route path="/client" element={<ClientPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
