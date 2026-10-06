import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/pages/LoginPage';
import MainLayout from './layouts/MainLayout';
import useAuthStore from './features/auth/hooks/useAuthStore';

// Temporary Dashboard Placeholder to test the layout
const DashboardPlaceholder = () => (
  <div>
    <h1 className="text-2xl font-bold text-text-primary tracking-tight">Dashboard</h1>
    <p className="text-text-secondary mt-2">Bem vindo ao ABA Desk Enterprise.</p>
  </div>
);

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} 
        />
        
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DashboardPlaceholder />} />
          {/* Outras rotas entrarão aqui depois */}
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
