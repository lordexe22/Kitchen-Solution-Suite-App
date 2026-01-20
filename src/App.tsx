/* src/App.tsx */
// #section Imports
import { Routes, Route, Navigate } from "react-router-dom";
import { useAutoLogin } from "./hooks/useAutoLogin";
import MainPage from "./pages/public/MainPage/MainPage";
import WelcomePage from "./pages/dashboard/WelcomePage/WelcomePage";
import DevToolsPage from "./pages/dashboard/DevToolsPage/DevToolsPage";
// #end-section

// #component App
function App() {
  const { isCheckingAuth } = useAutoLogin();
  
  if (isCheckingAuth) {
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
      <Route path="/dashboard" element={<WelcomePage />} />
      <Route path="/dashboard/devtools" element={<DevToolsPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
// #end-component