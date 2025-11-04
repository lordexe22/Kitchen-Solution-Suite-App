/* src/App.tsx */
// #section Imports
import { Routes, Route, Navigate } from "react-router-dom";
import MainPage from "./pages/MainPage/MainPage";
import { useAutoLogin } from "./hooks/useAutoLogin";
// #end-section
// #component App
function App() {
  const { isCheckingAuth } = useAutoLogin();

  // #section return
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
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
  // #end-section
}
export default App;
// #end-component