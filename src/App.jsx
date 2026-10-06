import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Placeholder Components for routing test
const LoginPlaceholder = () => <div className="flex h-screen items-center justify-center bg-surface-dim"><h1 className="text-3xl font-bold text-primary">Login Placeholder</h1></div>;
const LayoutPlaceholder = ({ children }) => <div className="flex h-screen"><aside className="w-64 bg-surface-card border-r shadow-sm p-4">Sidebar</aside><main className="flex-1 p-8 bg-surface">{children}</main></div>;
const DashboardPlaceholder = () => <div><h1 className="text-2xl font-bold">Dashboard</h1><p className="text-text-secondary mt-2">Bem vindo ao AbaDesk Enterprise.</p></div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPlaceholder />} />
        
        {/* Protected routes placeholder */}
        <Route path="/" element={<LayoutPlaceholder><DashboardPlaceholder /></LayoutPlaceholder>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
