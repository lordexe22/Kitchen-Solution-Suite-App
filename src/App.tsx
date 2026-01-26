/* src/App.tsx */
// #section Imports
import { Routes, Route, Navigate } from "react-router-dom";
import { useAutoLogin } from "./hooks/useAutoLogin";
import MainPage from "./pages/public/MainPage/MainPage";
import WelcomePage from "./pages/dashboard/WelcomePage/WelcomePage";
import DevToolsPage from "./pages/dashboard/DevToolsPage/DevToolsPage";
import CompaniesPage from "./pages/dashboard/CompaniesPage/CompaniesPage";
import { useUserDataStore } from "./store/userData/UserData.store";
// #end-section

// #component App
function App() {
  const { isCheckingAuth } = useAutoLogin();
  const { user, isHydrated } = useUserDataStore();

  const RequireAuth = ({ children }: { children: JSX.Element }) => {
    if (!isHydrated || isCheckingAuth) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '1.2rem',
          color: '#666'
        }}>
          Cargando...
        </div>
      );
    }

    if (!user) {
      return <Navigate to="/" replace />;
    }

    return children;
  };
  
  if (isCheckingAuth && !isHydrated) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Cargando...
      </div>
    );
  }
  
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/dashboard" element={<RequireAuth><WelcomePage /></RequireAuth>} />
      <Route path="/dashboard/devtools" element={<RequireAuth><DevToolsPage /></RequireAuth>} />
      <Route path="/dashboard/companies" element={<RequireAuth><CompaniesPage /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
// #end-component