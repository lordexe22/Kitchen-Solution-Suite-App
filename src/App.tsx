/* src/App.tsx */
// #section Imports
import { Routes, Route, Navigate } from "react-router-dom";
import { useAutoLogin } from "./hooks/useAutoLogin";
import MainPage from "./pages/public/MainPage/MainPage";
import WelcomePage from "./pages/dashboard/WelcomePage/WelcomePage";
import CompaniesPage from "./pages/dashboard/CompaniesPage/CompaniesPage";
import EmployeesPage from "./pages/dashboard/EmployeesPage/EmployeesPage";
import ProductsPage from "./pages/dashboard/ProductsPage/ProductsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import SchedulesPage from "./pages/dashboard/SchedulePage/SchedulePage";
import SocialsPage from "./pages/dashboard/SocialsPage/SocialsPage";
// #end-section
// #component App
function App() {
  const { isCheckingAuth } = useAutoLogin();
  // #section render load window while is loading user
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
  // #end-section
  // #section render pages
  return (
    <Routes>
      {/* #route - public -- <MainPage /> */}
      <Route path="/" element={<MainPage />} />
      {/* #end-route */}
      {/* #route - /dashboard -- <WelcomePage /> */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <WelcomePage />
          </ProtectedRoute>
        } 
      />
      {/* #end-route */}
      {/* #route - /dashboard/companies -- <CompaniesPage /> */}
      <Route 
        path="/dashboard/companies" 
        element={
          <ProtectedRoute>
            <CompaniesPage />
          </ProtectedRoute>
        } 
      />
      {/* #end-route */}
      {/* #route - /dashboard/employees -- <EmployeesPage /> */}
      <Route 
        path="/dashboard/employees" 
        element={
          <ProtectedRoute>
            <EmployeesPage />
          </ProtectedRoute>
        } 
      />
      {/* #end-route */}
      {/* #route - /dashboard/products -- <ProductsPage /> */}
      <Route 
        path="/dashboard/products" 
        element={
          <ProtectedRoute>
            <ProductsPage />
          </ProtectedRoute>
        } 
      />
      {/* #end-route */}
      {/* #route - /dashboard/schedules -- <SchedulesPage /> */}
      <Route 
        path="/dashboard/schedules" 
        element={
          <ProtectedRoute>
            <SchedulesPage />
          </ProtectedRoute>
        } 
      />
      {/* #end-route       */}
      {/* #route - /dashboard/socials -- <SocialsPage /> */}
        <Route 
          path="/dashboard/socials" 
          element={
            <ProtectedRoute>
              <SocialsPage />
            </ProtectedRoute>
          } 
        />
      {/* #end-route       */}
      {/* #route - default       */}
      <Route path="*" element={<Navigate to="/" />} />
      {/* #end-route       */}
    </Routes>
  );
  // #end-section
}

export default App;
// #end-component