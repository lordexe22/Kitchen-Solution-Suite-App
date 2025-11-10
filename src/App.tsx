/* src/App.tsx */
// #section Imports
import { Routes, Route, Navigate } from "react-router-dom";
import MainPage from "./pages/public/MainPage/MainPage";
import WelcomePage from "./pages/dashboard/WelcomePage/WelcomePage";
import CompaniesPage from "./pages/dashboard/CompaniesPage/CompaniesPage";
import EmployeesPage from "./pages/dashboard/EmployeesPage/EmployeesPage";
import ProductsPage from "./pages/dashboard/ProductsPage/ProductsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAutoLogin } from "./hooks/useAutoLogin";
import SchedulesPage from "./pages/dashboard/SchedulePage/SchedulePage";
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
      {/* Rutas públicas */}
      <Route path="/" element={<MainPage />} />
      
      {/* Rutas protegidas del Dashboard */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <WelcomePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/companies" 
        element={
          <ProtectedRoute>
            <CompaniesPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/employees" 
        element={
          <ProtectedRoute>
            <EmployeesPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/products" 
        element={
          <ProtectedRoute>
            <ProductsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/schedules" 
        element={
          <ProtectedRoute>
            <SchedulesPage />
          </ProtectedRoute>
        } />
      
      {/* Ruta por defecto */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
  // #end-section
}

export default App;
// #end-component