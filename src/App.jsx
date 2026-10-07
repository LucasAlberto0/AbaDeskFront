import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/pages/LoginPage';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import TicketListPage from './features/tickets/pages/TicketListPage';
import TicketDetailsPage from './features/tickets/pages/TicketDetailsPage';
import TicketCreatePage from './features/tickets/pages/TicketCreatePage';
import KanbanBoardPage from './features/tickets/pages/KanbanBoardPage';
import UserManagementPage from './features/admin/pages/UserManagementPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import useAuthStore from './features/auth/hooks/useAuthStore';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

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
            <Route path="tickets/kanban" element={<KanbanBoardPage />} />
            <Route path="tickets/new" element={<TicketCreatePage />} />
            <Route path="tickets/:id" element={<TicketDetailsPage />} />
            <Route path="admin/users" element={<UserManagementPage />} />
          </Route>
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-center" />
    </BrowserRouter>
  );
}

export default App;
