import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import useAuthStore from '../features/auth/hooks/useAuthStore';

export default function MainLayout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length > 1) return parts[0][0] + parts[1][0];
    return parts[0][0];
  };

  const baseMenuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { name: 'Meus Chamados', path: '/tickets', icon: 'inbox', roles: ['User'] },
    { name: 'Kanban', path: '/tickets/kanban', icon: 'view_kanban', roles: ['Admin', 'Attendant'] },
    { name: 'Chamados (Lista)', path: '/tickets', icon: 'list', roles: ['Admin', 'Attendant'] },
    { name: 'Novo chamado', path: '/tickets/new', icon: 'add_circle' },
    { name: 'Usuários', path: '/admin/users', icon: 'group', roles: ['Admin'] },
  ];

  const menuItems = baseMenuItems.filter(item => !item.roles || item.roles.includes(user?.role));

  return (
    <div className="bg-[#FAFAFA] font-sans text-slate-800 antialiased selection:bg-red-500/10 selection:text-[#9d0012] min-h-screen">
      
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-[#9d0012] shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between select-none text-white">
        <div className="flex flex-col">
          <div className="px-5 pt-5 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <img alt="ABA Desk" className="h-8 w-auto object-contain mix-blend-screen" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2c4Y60Nywy7aQfTHpkHHqmUdjIUE--2FTMoK7wIFKEyHDL68q196ppPDwAVP9ydkaIDVZTWLJauMTkagUz_5qSg32xMDbvWHzDYlAuHY0MLthz2gDizkPAUaflD9OUnvU-VDWxKjxVDtPZqLooMaicA4-668yYR-T3eVPPxpu7R_YLlXLUJmtJxZ0AWA_0uIq9y9AGKT6ihj8GCE9-icTmtN_okvZ-JmvGnWZ5MMLsFLTBTBxXhpC_uVQ3cEOxqYyew" />
            </div>
            <p className="text-xs text-white/70 leading-tight truncate pl-0.5">Central de Atendimento e Gestão</p>
          </div>
          
          <div className="px-3 pt-1">
            <span className="px-2 text-[11px] font-semibold text-white/60 uppercase tracking-wider block mb-1">
              Navegação Principal
            </span>
            <nav className="flex flex-col gap-0.5">
              {menuItems.map(item => {
                const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                return (
                  <Link 
                    key={item.name}
                    to={item.path} 
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors text-[13px] font-medium ${
                      isActive 
                      ? 'bg-white text-[#9d0012] shadow-sm' 
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-[11px] ${isActive ? 'bg-red-100 text-[#9d0012]' : 'bg-white/20 text-white'}`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User Profile Box */}
        <div className="p-3 mx-3 mb-3 flex flex-col gap-2 bg-black/20 rounded-xl">
          <div className="flex items-center gap-2 px-1 py-1">
            <div className="w-9 h-9 rounded-full bg-white text-[#9d0012] flex items-center justify-center font-bold text-[13px] shadow-sm shrink-0 ring-2 ring-white/30">
              {getInitials(user?.name)}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[12px] font-semibold text-white truncate">{user?.name || 'Lucas Alberto'}</span>
              <span className="text-[11px] text-white/70 truncate leading-tight">Analista Desenvolvedor Jr</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center" title="Configurações">
                <span className="material-symbols-outlined text-[18px]">settings</span>
              </button>
              <button onClick={logout} className="p-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center" title="Sair do Sistema">
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            </div>
            <button className="p-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center" title="Recolher Menu">
              <span className="material-symbols-outlined text-[18px]">dock_to_left</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="pl-72 flex flex-col min-h-screen min-w-0 w-full overflow-x-hidden">
        {/* Header */}
        <header className="fixed top-0 left-72 right-0 h-16 bg-[#c8101e] border-b border-[#a70d18] z-40 flex items-center justify-between px-4 sm:px-6 lg:px-8 gap-4 min-w-0 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
            <span className="text-[13px] text-white/70 font-normal whitespace-nowrap">ABA Infra</span>
            <span className="text-white/40">/</span>
            <span className="text-[13px] text-white font-medium truncate">Central de Atendimento</span>
            <span className="hidden md:inline-flex items-center gap-1.5 ml-2 px-2.5 py-0.5 rounded-full text-[11px] font-medium text-white bg-white/10 border border-white/20 whitespace-nowrap shrink-0 backdrop-blur-sm">Operacional</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-end min-w-0">
            <div className="relative w-full max-w-md min-w-0 flex-1 hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/70 text-[17px]">search</span>
              <input className="w-full h-9 pl-9 pr-10 sm:pr-12 rounded-lg bg-white/15 border border-white/20 text-[13px] text-white placeholder:text-white/70 focus:outline-none focus:bg-white focus:text-slate-900 focus:placeholder:text-slate-400 transition-colors" placeholder="Buscar chamados, protocolos..." type="text" />
              <kbd className="hidden md:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-white/80 font-mono bg-white/10 border border-white/15 px-1.5 py-0.5 rounded">⌘K</kbd>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button className="p-1.5 rounded-md text-white/90 hover:text-white hover:bg-white/10 transition-colors relative" title="Notificações">
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-white ring-2 ring-[#c8101e]"></span>
              </button>
              <button className="p-1.5 rounded-md text-white/90 hover:text-white hover:bg-white/10 transition-colors" title="Ajuda">
                <span className="material-symbols-outlined text-[20px]">help_outline</span>
              </button>
              <div className="h-4 w-px bg-white/20 mx-1"></div>
              <div className="w-7 h-7 rounded-full bg-white text-[#c8101e] flex items-center justify-center text-[11px] font-bold shadow-sm shrink-0">
                {getInitials(user?.name)}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="relative pt-16 w-full flex-1 min-w-0">
          <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
