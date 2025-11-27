/* src/App.tsx */
// #section Imports
import { Routes, Route, Navigate } from "react-router-dom";
import { useAutoLogin } from "./hooks/useAutoLogin";
import MainPage from "./pages/public/MainPage/MainPage";
import MenuPage from "./pages/public/MenuPage/MenuPage";
import ProductDetailPage from "./pages/public/ProductDetailPage/ProductDetailPage";
import WelcomePage from "./pages/dashboard/WelcomePage/WelcomePage";
import CompaniesPage from "./pages/dashboard/CompaniesPage/CompaniesPage";
import EmployeesPage from "./pages/dashboard/EmployeesPage/EmployeesPage";
import BranchManagementPage from "./pages/dashboard/BranchManagementPage/BranchManagementPage";
import ToolsPage from "./pages/dashboard/Tools/ToolsPage";
import QRCreatorPage from "./pages/dashboard/Tools/QRCreatorPage";
import DashboardShell from './components/DashboardShell/DashboardShell';
import ProtectedRoute from "./components/ProtectedRoute";
import TagCreatorPage from "./pages/dashboard/Tools/TagCreatorPage";
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
      
      {/* #route - /branch/:branchId/table/:tableNumber -- <MenuPage /> [RUTA PÚBLICA DEL MENÚ] */}
      <Route 
        path="/branch/:branchId/table/:tableNumber" 
        element={<MenuPage />} 
      />
      {/* #end-route */}
      
      {/* #route - /branch/:branchId/table/:tableNumber/product/:productId -- <ProductDetailPage /> [RUTA PÚBLICA DE DETALLE] */}
      <Route 
        path="/branch/:branchId/table/:tableNumber/product/:productId" 
        element={<ProductDetailPage />} 
      />
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
      
      {/* #route - /dashboard/branches/:section? -- <BranchManagementPage /> [UNIFIED BRANCH MANAGEMENT] */}
      <Route 
        path="/dashboard/branches/:section?" 
        element={
          <ProtectedRoute>
            <BranchManagementPage />
          </ProtectedRoute>
        } 
      />
      {/* #end-route */}
      
      {/* #route - /dashboard/tools -- tools list */}
      <Route
        path="/dashboard/tools"
        element={
          <ProtectedRoute>
            <DashboardShell>
              <ToolsPage />
            </DashboardShell>
          </ProtectedRoute>
        }
      />
      {/* #end-route */}
      
      {/* #route - /dashboard/tools/qr -- QR Creator */}
      <Route
        path="/dashboard/tools/qr"
        element={
          <ProtectedRoute>
            <DashboardShell>
              <QRCreatorPage />
            </DashboardShell>
          </ProtectedRoute>
        }
      />
      {/* #end-route */}
      
      {/* #route - /dashboard/tools/tags -- Tag Creator */}
      <Route
        path="/dashboard/tools/tags"
        element={
          <ProtectedRoute>
            <DashboardShell>
              <TagCreatorPage />
            </DashboardShell>
          </ProtectedRoute>
        }
      />
      {/* #end-route */}
      
      {/* #route - default */}
      <Route path="*" element={<Navigate to="/" />} />
      {/* #end-route */}
    </Routes>
  );
  // #end-section
}

export default App;
// #end-component