/* src/App.tsx */
// #section Imports
import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { useAutoLogin } from "./hooks/useAutoLogin";

// #subsection Public pages - carga inmediata (críticas para SEO/UX)
import MainPage from "./pages/public/MainPage/MainPage";
import MenuPage from "./pages/public/MenuPage/MenuPage";
import ProductDetailPage from "./pages/public/ProductDetailPage/ProductDetailPage";
// #end-subsection

// #subsection Protected components - carga inmediata
import DashboardShell from './components/DashboardShell/DashboardShell';
import ProtectedRoute from "./components/ProtectedRoute";
// #end-subsection

// #subsection Dashboard pages - lazy loading
const WelcomePage = lazy(() => import("./pages/dashboard/WelcomePage/WelcomePage"));
const CompaniesPage = lazy(() => import("./pages/dashboard/CompaniesPage/CompaniesPage"));
const EmployeesPage = lazy(() => import("./pages/dashboard/EmployeesPage/EmployeesPage"));
const BranchManagementPage = lazy(() => import("./pages/dashboard/BranchManagementPage/BranchManagementPage"));
const ToolsPage = lazy(() => import("./pages/dashboard/Tools/ToolsPage"));
const QRCreatorPage = lazy(() => import("./pages/dashboard/Tools/QRCreatorPage"));
const TagCreatorPage = lazy(() => import("./pages/dashboard/Tools/TagCreatorPage"));
const AccordionDemo = lazy(() => import("./components/_demos/AccordionDemo").then(m => ({ default: m.AccordionDemo })));
// #end-subsection
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
            <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Cargando...</div>}>
              <WelcomePage />
            </Suspense>
          </ProtectedRoute>
        } 
      />
      {/* #end-route */}
      
      {/* #route - /dashboard/companies -- <CompaniesPage /> */}
      <Route 
        path="/dashboard/companies" 
        element={
          <ProtectedRoute>
            <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Cargando...</div>}>
              <CompaniesPage />
            </Suspense>
          </ProtectedRoute>
        } 
      />
      {/* #end-route */}
      
      {/* #route - /dashboard/employees -- <EmployeesPage /> */}
      <Route 
        path="/dashboard/employees" 
        element={
          <ProtectedRoute>
            <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Cargando...</div>}>
              <EmployeesPage />
            </Suspense>
          </ProtectedRoute>
        } 
      />
      {/* #end-route */}
      
      {/* #route - /dashboard/branches/:section? -- <BranchManagementPage /> [UNIFIED BRANCH MANAGEMENT] */}
      <Route 
        path="/dashboard/branches/:section?" 
        element={
          <ProtectedRoute>
            <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Cargando...</div>}>
              <BranchManagementPage />
            </Suspense>
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
              <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Cargando herramientas...</div>}>
                <ToolsPage />
              </Suspense>
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
              <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Cargando generador QR...</div>}>
                <QRCreatorPage />
              </Suspense>
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
              <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Cargando creador de etiquetas...</div>}>
                <TagCreatorPage />
              </Suspense>
            </DashboardShell>
          </ProtectedRoute>
        }
      />
      {/* #end-route */}
      
      {/* #route - default */}
      {/* #route - /demo/accordion -- demo pública del acordeón */}
      <Route 
        path="/demo/accordion" 
        element={
          <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Cargando demo...</div>}>
            <AccordionDemo />
          </Suspense>
        } 
      />
      {/* #end-route */}

      <Route path="*" element={<Navigate to="/" />} />
      {/* #end-route */}
    </Routes>
  );
  // #end-section
}

export default App;
// #end-component