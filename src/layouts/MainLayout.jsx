import React, { useState } from 'react';
import { Outlet, Navigate, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Ticket, ListChecks, Users, LogOut, Menu, ShieldCheck } from 'lucide-react';
import useAuthStore from '../features/auth/hooks/useAuthStore';
import { cn } from '../lib/utils';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/tickets', icon: Ticket, label: 'Chamados' },
  { path: '/homologation', icon: ListChecks, label: 'Homologação' },
];

const adminItems = [
  { path: '/admin/users', icon: Users, label: 'Usuários' }
];

export default function MainLayout() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 72 }}
        className="bg-surface-card border-r border-border-subtle flex flex-col z-20 shrink-0"
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-border-subtle shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
              <ShieldCheck size={20} strokeWidth={2.5} />
            </div>
            {isSidebarOpen && (
              <motion.span 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="font-bold text-text-primary whitespace-nowrap"
              >
                ABA Desk
              </motion.span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 h-10 rounded-md text-sm font-medium transition-colors overflow-hidden whitespace-nowrap",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-text-secondary hover:bg-surface-dim hover:text-text-primary"
              )}
            >
              <item.icon size={18} className="shrink-0" />
              {isSidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}

          {user?.role === 'Admin' && (
            <>
              {isSidebarOpen && <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mt-6 mb-2 px-3">Admin</div>}
              {adminItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-3 h-10 rounded-md text-sm font-medium transition-colors overflow-hidden whitespace-nowrap",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-text-secondary hover:bg-surface-dim hover:text-text-primary"
                  )}
                >
                  <item.icon size={18} className="shrink-0" />
                  {isSidebarOpen && <span>{item.label}</span>}
                </NavLink>
              ))}
            </>
          )}
        </div>

        <div className="p-3 border-t border-border-subtle shrink-0">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-3 h-10 w-full rounded-md text-sm font-medium text-status-rejeitado hover:bg-status-rejeitado-bg transition-colors overflow-hidden whitespace-nowrap"
          >
            <LogOut size={18} className="shrink-0" />
            {isSidebarOpen && <span>Sair</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-surface-card border-b border-border-subtle flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar}
              className="text-text-secondary hover:text-primary transition-colors focus:outline-none"
            >
              <Menu size={20} />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-text-primary">{user?.name}</div>
              <div className="text-xs text-text-secondary">{user?.role}</div>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6 bg-surface">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
