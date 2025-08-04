// src/App.tsx
// #section Imports
import MainPage from "./pages/MainPage/MainPage";
import RegisterPage from "./modules/auth/register/RegisterPage";
import LoginPage from "./modules/auth/login/LoginPage";
import UserPage from "./pages/UserPage/UserPage";
import ClientPage from "./pages/ClientPage/ClientPage";
import { API_FETCH_ACTIONS } from "./modules/company/company.config";
import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
// #end-section
function App() {
  // #hook navigate = useNavigate(); 
  const navigate = useNavigate();
  // #end-hook
  // #hook location = useLocation();
  const location = useLocation();
  // #end-hook
  // #event useEffect
  useEffect(() => {
    const verifyJWT = async () => {
      // #variable jwt - JWT token retrieved from localStorage
      const jwt = localStorage.getItem("jwt");
      // #end-variable
      // #variable publicRoutes - Define public routes that don't require authentication
      const publicRoutes = ["/", "/login", "/register"];
      // #end-variable
      // #step 1 - If no JWT and route is not public, redirect to "/"
      if (!jwt) {
        if (!publicRoutes.includes(location.pathname)) {
          navigate("/");
        }
        return;
      }
      // #end-step
      try {
        // #step 2 - Fetch to validate JWT and user account status
        const res = await fetch(API_FETCH_ACTIONS.getUserByJWT.url, {
          method: API_FETCH_ACTIONS.getUserByJWT.method,
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        // #end-step
        // #step 3 - Get the body of the response
        const bodyRes: { message: string } = await res.json();
        // #end-step        
        // #step 4 - Redirect to /client if response is OK and not already there
        if (res.ok && location.pathname !== "/client") {
          navigate("/client");
        }
        // #end-step
        // #step 5 - Throw exceptions if the res is not ok
        if (!res.ok) {
          throw {
            status: res.status,
            message: bodyRes.message,
          };
        }
        // #end-step
      } catch(err: unknown) {
        // #step 6 - Build error object
          type ErrorResponse = {
            status?: number;
            message?: string;
          };
          const error = err as ErrorResponse;
          // #end-step
        // #step 7 - Show error in console
        console.error("Error:", error.message ?? "Unknown error");
        // #end-step
        // #variable isPublicRoute
        const isPublicRoute = publicRoutes.includes(location.pathname);
        // #end-variable
        // #step 8 - Remove jwt from localStorage
        localStorage.removeItem("jwt");
        // #end-step
        // #step 9 - Redirect user to home if not in a public route
        if (!isPublicRoute) navigate("/");
        // #end-step
      }
    };
    verifyJWT();
  }, [navigate, location.pathname]);
  // #end-event
  // #section return
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
  // #end-section
}

export default App;
