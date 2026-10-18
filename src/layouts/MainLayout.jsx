import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import useAuthStore from '../features/auth/hooks/useAuthStore';
import { AboutModal } from '../components/ui/AboutModal';
import { SettingsModal } from '../components/ui/SettingsModal';
import { HeaderSearch } from './HeaderSearch';

export default function MainLayout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length > 1) return parts[0][0] + parts[1][0];
    return parts[0][0];
  };

  const getPageTitle = () => {
    if (location.pathname.startsWith('/dashboard')) return 'Dashboard';
    if (location.pathname.startsWith('/assistant')) return 'Assistente IA';
    if (location.pathname.startsWith('/admin/users')) return 'Gestão de Usuários';
    if (location.pathname === '/tickets/kanban') return 'Kanban de Chamados';
    if (location.pathname === '/tickets/new') return 'Novo Chamado';
    if (location.pathname.startsWith('/tickets/')) return 'Detalhes do Chamado';
    if (location.pathname.startsWith('/tickets')) return 'Lista de Chamados';
    return 'Central de Atendimento';
  };

  const baseMenuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { name: 'Meus Chamados', path: '/tickets', icon: 'inbox', roles: ['User'] },
    { name: 'Kanban', path: '/tickets/kanban', icon: 'view_kanban', roles: ['Admin', 'Attendant'] },
    { name: 'Chamados (Lista)', path: '/tickets', icon: 'list', roles: ['Admin', 'Attendant'] },
    { name: 'Novo chamado', path: '/tickets/new', icon: 'add_circle', roles: ['Admin', 'User'] },
    { name: 'Assistente IA', path: '/assistant', icon: 'smart_toy' },
    { name: 'Usuários', path: '/admin/users', icon: 'group', roles: ['Admin'] },
  ];

  const userRoleStr = user?.role === 0 ? 'User' : user?.role === 1 ? 'Attendant' : user?.role === 2 ? 'Admin' : user?.role;
  const menuItems = baseMenuItems.filter(item => !item.roles || item.roles.includes(userRoleStr));

  return (
    <div className="bg-[#FAFAFA] font-sans text-slate-800 antialiased selection:bg-red-500/10 selection:text-[#9d0012] min-h-screen">
      
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)} 
          className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-xs transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      <aside className={`fixed left-0 top-0 h-full ${isCollapsed ? 'lg:w-20' : 'lg:w-72'} w-72 max-w-[85vw] bg-[#9d0012] shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between select-none text-white transition-all duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col">
          <div className={`pt-5 pb-3 ${isCollapsed ? 'lg:px-2 px-5 flex lg:justify-center justify-between items-center' : 'px-5 flex justify-between items-center'}`}>
            <div className="flex items-center gap-2 mb-1 justify-center">
              {isCollapsed ? (
                <>
                  <img alt="ABA Logo" className="h-8 w-8 object-contain hidden lg:block" src="/img/brand/logo-icon.png" />
                  <img alt="ABA Desk" className="h-12 w-auto object-contain mix-blend-screen lg:hidden" src="/img/brand/logo-white.png" />
                </>
              ) : (
                <img alt="ABA Desk" className="h-12 sm:h-14 w-auto object-contain mix-blend-screen" src="/img/brand/logo-white.png" />
              )}
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              title="Fechar menu"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>
          {(!isCollapsed || isMobileMenuOpen) && (
            <p className="text-xs text-white/70 leading-tight truncate px-5 -mt-1 mb-2 hidden sm:block">Central de Atendimento e Gestão</p>
          )}
          
          <div className="px-3 pt-1">
            {(!isCollapsed || isMobileMenuOpen) && (
              <span className="px-2 text-[11px] font-semibold text-white/60 uppercase tracking-wider block mb-1">
                Navegação Principal
              </span>
            )}
            <nav className="flex flex-col gap-0.5">
              {menuItems.map(item => {
                let isActive = location.pathname === item.path;
                if (!isActive && item.path !== '/') {
                  if (item.path === '/tickets') {
                    isActive = location.pathname.startsWith('/tickets/') && 
                               !location.pathname.startsWith('/tickets/kanban') && 
                               !location.pathname.startsWith('/tickets/new') &&
                               !location.pathname.startsWith('/admin');
                  } else {
                    isActive = location.pathname.startsWith(item.path);
                  }
                }

                return (
                  <Link 
                    key={item.name}
                    to={item.path} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center ${isCollapsed ? 'lg:justify-center justify-between' : 'justify-between'} px-3 py-2.5 rounded-xl transition-colors text-[13px] font-medium ${
                      isActive 
                      ? 'bg-white text-[#9d0012] shadow-sm' 
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <div className={`flex items-center ${isCollapsed ? 'lg:justify-center gap-3' : 'gap-3'}`}>
                      {item.customIcon ? (
                        <img src={item.customIcon} alt="" className="w-5 h-5 object-contain shrink-0 rounded" />
                      ) : (
                        <span className="material-symbols-outlined text-[20px] shrink-0">{item.icon}</span>
                      )}
                      <span className={isCollapsed ? 'lg:hidden' : ''}>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-[11px] ${isCollapsed ? 'lg:hidden' : ''} ${isActive ? 'bg-red-100 text-[#9d0012]' : 'bg-white/20 text-white'}`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        <div className={`p-3 mx-3 mb-3 flex ${isCollapsed ? 'lg:flex-col lg:items-center flex-col' : 'flex-col'} gap-2 bg-black/20 rounded-xl overflow-hidden`}>
          <div className={`flex items-center ${isCollapsed ? 'lg:justify-center w-full gap-2 px-1 py-1' : 'gap-2 px-1 py-1'}`}>
            <div className="w-9 h-9 rounded-full bg-white text-[#9d0012] flex items-center justify-center font-bold text-[13px] shadow-sm shrink-0 ring-2 ring-white/30">
              {getInitials(user?.name)}
            </div>
            <div className={`flex flex-col min-w-0 flex-1 justify-center ${isCollapsed ? 'lg:hidden' : ''}`}>
              <span className="text-[12px] font-semibold text-white truncate leading-tight mb-0.5">{user?.name || 'Lucas Alberto'}</span>
              
              {user?.role === 'Admin' ? (
                <span className="text-[11px] text-white/70 truncate leading-tight">Administrador</span>
              ) : user?.role === 'Attendant' ? (
                <span className="text-[11px] text-white/70 truncate leading-tight">Suporte Técnico</span>
              ) : (
                <div className="flex flex-col leading-tight gap-0.5">
                  <span className="text-[11px] text-white/70 truncate">
                    {user?.jobTitle || 'Usuário'}
                  </span>
                  {user?.companyUnit && (
                    <span className="text-[10px] text-white/50 truncate">
                      {user.companyUnit}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className={`flex items-center ${isCollapsed ? 'lg:flex-col lg:gap-2 justify-between pt-1' : 'justify-between pt-1'}`}>
            <div className={`flex items-center gap-1 ${isCollapsed ? 'lg:flex-col' : ''}`}>
              <button 
                onClick={() => { setIsSettingsModalOpen(true); setIsMobileMenuOpen(false); }}
                className={`p-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center ${isCollapsed ? 'lg:hidden' : ''}`} 
                title="Configurações"
              >
                <span className="material-symbols-outlined text-[18px]">settings</span>
              </button>
              <button onClick={logout} className="p-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center" title="Sair do Sistema">
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            </div>
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)} 
              className="hidden lg:flex p-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors items-center justify-center" 
              title={isCollapsed ? "Expandir Menu" : "Recolher Menu"}
            >
              <span className="material-symbols-outlined text-[18px]">{isCollapsed ? 'dock_to_right' : 'dock_to_left'}</span>
            </button>
          </div>
        </div>
      </aside>

      <div className={`${isCollapsed ? 'lg:pl-20' : 'lg:pl-72'} pl-0 flex flex-col ${location.pathname.startsWith('/assistant') ? 'h-screen max-h-screen overflow-hidden' : 'min-h-screen overflow-x-hidden'} min-w-0 w-full transition-all duration-300`}>
        <header className={`fixed top-0 ${isCollapsed ? 'lg:left-20' : 'lg:left-72'} left-0 right-0 h-16 bg-[#c8101e] border-b border-[#a70d18] z-40 flex items-center justify-between px-3 sm:px-6 lg:px-8 gap-2 sm:gap-4 min-w-0 shadow-sm transition-all duration-300`}>
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 shrink">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-1.5 -ml-1 text-white hover:bg-white/10 rounded-lg flex items-center justify-center shrink-0"
              title="Abrir menu"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
            <span className="text-[13px] text-white/70 font-normal whitespace-nowrap hidden sm:inline">ABA Infra</span>
            <span className="text-white/40 hidden sm:inline">/</span>
            <span className="text-[13px] text-white font-medium truncate max-w-[140px] sm:max-w-none">{getPageTitle()}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-4 flex-1 justify-end min-w-0">
            <HeaderSearch />
            <div className="flex items-center gap-1 shrink-0">
              <button 
                onClick={() => setIsAboutModalOpen(true)}
                className="p-1.5 rounded-md text-white/90 hover:text-white hover:bg-white/10 transition-colors" 
                title="Ajuda e Sobre"
              >
                <span className="material-symbols-outlined text-[20px]">help_outline</span>
              </button>
              <button 
                onClick={() => setIsSettingsModalOpen(true)}
                className="lg:hidden p-1.5 rounded-md text-white/90 hover:text-white hover:bg-white/10 transition-colors" 
                title="Configurações"
              >
                <span className="material-symbols-outlined text-[20px]">settings</span>
              </button>
              <div className="h-4 w-px bg-white/20 mx-0.5 sm:mx-1"></div>
              <div className="w-7 h-7 rounded-full bg-white text-[#c8101e] flex items-center justify-center text-[11px] font-bold shadow-sm shrink-0">
                {getInitials(user?.name)}
              </div>
            </div>
          </div>
        </header>

        <main className={`relative pt-16 w-full flex-1 min-w-0 ${location.pathname.startsWith('/assistant') ? 'h-full max-h-full bg-white overflow-hidden flex flex-col' : ''}`}>
          {location.pathname.startsWith('/assistant') ? (
            <div className="w-full flex-1 min-w-0 flex flex-col h-full bg-white overflow-hidden">
              <Outlet />
            </div>
          ) : (
            <div className="p-3 sm:p-6 lg:p-8 max-w-[1440px] mx-auto w-full min-w-0">
              <Outlet />
            </div>
          )}
        </main>
      </div>
      <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />
    </div>
  );
}
