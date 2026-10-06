import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/pages/LoginPage';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import TicketListPage from './features/tickets/pages/TicketListPage';
import TicketDetailsPage from './features/tickets/pages/TicketDetailsPage';
import TicketCreatePage from './features/tickets/pages/TicketCreatePage';
import UserManagementPage from './features/admin/pages/UserManagementPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import useAuthStore from './features/auth/hooks/useAuthStore';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />} 
        />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="tickets" element={<TicketListPage />} />
            <Route path="tickets/development" element={<TicketListPage title="Fila de Desenvolvimento" description="Chamados em codificação ou infraestrutura" defaultStatus="InDevelopment" />} />
            <Route path="tickets/tests" element={<TicketListPage title="Fila de Testes" description="Chamados aguardando validação técnica" defaultStatus="InTest" />} />
            <Route path="tickets/homologations" element={<TicketListPage title="Aguardando Homologação" description="Chamados aguardando aprovação do solicitante" defaultStatus="WaitingHomologation" />} />
            <Route path="tickets/new" element={<TicketCreatePage />} />
            <Route path="tickets/:id" element={<TicketDetailsPage />} />
            <Route path="admin/users" element={<UserManagementPage />} />
          </Route>
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
