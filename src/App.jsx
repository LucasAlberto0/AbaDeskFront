import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/pages/LoginPage';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import TicketListPage from './features/tickets/pages/TicketListPage';
import TicketDetailsPage from './features/tickets/pages/TicketDetailsPage';
import TicketCreatePage from './features/tickets/pages/TicketCreatePage';
import UserManagementPage from './features/admin/pages/UserManagementPage';
import useAuthStore from './features/auth/hooks/useAuthStore';

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
          <Route index element={<DashboardPage />} />
          <Route path="tickets" element={<TicketListPage />} />
          <Route path="tickets/new" element={<TicketCreatePage />} />
          <Route path="tickets/:id" element={<TicketDetailsPage />} />
          <Route path="admin/users" element={<UserManagementPage />} />
          {/* Outras rotas entrarão aqui depois */}
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
