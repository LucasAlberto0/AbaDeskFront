import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../auth/hooks/useAuthStore';
import { getDashboardSummary } from '../api/dashboardService';
import { getTickets } from '../../tickets/api/ticketService';
import { translateStatus, translateCategory } from '../../../lib/utils';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentTickets, setRecentTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDashboardSummary(),
      getTickets({ pageSize: 5, pageNumber: 1 })
    ])
      .then(([summaryData, ticketsData]) => {
        setStats(summaryData);
        setRecentTickets(ticketsData.items || []);
      })
      .catch((error) => console.error('Erro ao carregar dashboard:', error))
      .finally(() => setIsLoading(false));
  }, []);


  return (
    <div className="space-y-6 md:space-y-8 min-w-0 w-full">
      
      {/* HEADER SECTION */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 flex-wrap min-w-0">
        <div className="min-w-0 flex-1">
          <span className="text-[12px] font-medium tracking-wide uppercase text-slate-400 block mb-1">Visão Geral</span>
          <h1 className="text-[22px] sm:text-[28px] font-semibold tracking-tight text-slate-900 flex flex-wrap items-baseline gap-1">
            <span>Olá, {user?.name?.split(' ')[0] || 'Usuário'}</span>
            <span className="text-slate-400 font-normal text-[16px] sm:text-[20px]">· Operação ABA Infra</span>
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
          <Link to="/tickets/new" className="h-9 px-3.5 rounded-lg bg-[#c8101e] hover:bg-[#a70d18] text-white text-[13px] font-medium flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-[0.98] whitespace-nowrap">
            <span className="material-symbols-outlined text-[17px]">add</span>
            <span>Novo chamado</span>
          </Link>
        </div>
      </section>

      {/* METRICS GRID */}
      <section className="w-full">
        {(user?.role === 'User' || user?.role === 0) ? (
          <div className="w-full flex justify-center mt-1 mb-4">
            <div className="relative w-full max-w-[340px]">
              <svg viewBox="60 60 380 380" className="w-full h-auto drop-shadow-xl overflow-visible">
                {/* Left Shape: Abertos */}
                <g onClick={() => navigate('/tickets?status=Open')} className="group cursor-pointer transition-transform duration-300 hover:-translate-x-1.5 hover:-translate-y-1.5">
                  <path 
                    d="M 240 279 L 240 60 A 400 400 0 0 0 60 383 Z" 
                    className="fill-[#c8101e] transition-all duration-300 group-hover:fill-[#e51a28]" 
                  />
                  <foreignObject x="85" y="140" width="160" height="160">
                    <div className="w-full h-full flex flex-col items-center justify-center text-white p-1">
                      <span className="material-symbols-outlined text-[26px] mb-1 opacity-90 transition-all duration-300 group-hover:scale-125 group-hover:-rotate-12">fiber_new</span>
                      <span className="text-[10px] font-bold tracking-wider uppercase opacity-90 text-center leading-tight transition-opacity duration-300 group-hover:opacity-100">Abertos</span>
                      <span className="text-[48px] font-black mt-1 leading-none transition-transform duration-300 group-hover:scale-110">{stats?.openTickets || 0}</span>
                    </div>
                  </foreignObject>
                </g>

                {/* Right Shape: Em Andamento */}
                <g onClick={() => navigate('/tickets?status=InProgress')} className="group cursor-pointer transition-transform duration-300 hover:translate-x-1.5 hover:-translate-y-1.5">
                  <path 
                    d="M 260 279 L 260 60 A 400 400 0 0 1 440 383 Z" 
                    className="fill-[#9c0c16] transition-all duration-300 group-hover:fill-[#b8101b]" 
                  />
                  <foreignObject x="255" y="140" width="160" height="160">
                    <div className="w-full h-full flex flex-col items-center justify-center text-white p-1">
                      <span className="material-symbols-outlined text-[26px] mb-1 opacity-90 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12">terminal</span>
                      <span className="text-[10px] font-bold tracking-wider uppercase opacity-90 text-center leading-tight transition-opacity duration-300 group-hover:opacity-100">Andamento</span>
                      <span className="text-[48px] font-black mt-1 leading-none transition-transform duration-300 group-hover:scale-110">{stats?.inProgressTickets || 0}</span>
                    </div>
                  </foreignObject>
                </g>

                {/* Bottom Shape: Resolvidos */}
                <g onClick={() => navigate('/tickets?status=Resolved')} className="group cursor-pointer transition-transform duration-300 hover:translate-y-2">
                  <path 
                    d="M 250 296 L 75 397 A 400 400 0 0 0 425 397 Z" 
                    className="fill-[#7a0810] transition-all duration-300 group-hover:fill-[#9c0c16]" 
                  />
                  <foreignObject x="150" y="315" width="200" height="100">
                    <div className="w-full h-full flex flex-col items-center justify-center text-white p-1">
                      <span className="text-[48px] font-black leading-none transition-transform duration-300 group-hover:scale-110">{stats?.resolvedTickets || 0}</span>
                      <span className="text-[10px] font-bold tracking-wider uppercase opacity-90 text-center flex items-center gap-1 mt-1 transition-opacity duration-300 group-hover:opacity-100">
                        <span className="material-symbols-outlined text-[14px] transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">check_circle</span> Resolvidos
                      </span>
                    </div>
                  </foreignObject>
                </g>
              </svg>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center mt-1 mb-4">
            <div className="relative w-full max-w-[400px]">
              <svg viewBox="60 60 380 380" className="w-full h-auto drop-shadow-2xl overflow-visible">
                {/* Left Shape: Abertos + Subs */}
                <g onClick={() => navigate('/tickets?status=Open')} className="group cursor-pointer transition-transform duration-300 hover:-translate-x-1.5 hover:-translate-y-1.5">
                  <path d="M 240 279 L 240 60 A 400 400 0 0 0 60 383 Z" className="fill-[#c8101e] transition-all duration-300 group-hover:fill-[#e51a28]" />
                  <foreignObject x="85" y="130" width="160" height="180">
                    <div className="w-full h-full flex flex-col items-center justify-center text-white p-1">
                      <span className="material-symbols-outlined text-[20px] mb-1 opacity-90 transition-all duration-300 group-hover:scale-125 group-hover:-rotate-12">fiber_new</span>
                      <span className="text-[8px] font-bold tracking-wider uppercase opacity-90 text-center leading-tight transition-opacity duration-300 group-hover:opacity-100">Abertos</span>
                      <span className="text-[36px] font-black leading-none mt-1 transition-transform duration-300 group-hover:scale-110">{stats?.openTickets || 0}</span>
                      
                      <div className="flex gap-4 mt-2 pt-2 border-t border-white/20 w-4/5 justify-center">
                        <div className="flex flex-col items-center group-hover:-translate-y-0.5 transition-transform delay-75">
                          <span className="text-[12px] font-bold leading-none">{stats?.inAnalysisTickets || 0}</span>
                          <span className="text-[6px] font-medium tracking-widest uppercase opacity-80 mt-1">Análise</span>
                        </div>
                        <div className="flex flex-col items-center group-hover:-translate-y-0.5 transition-transform delay-100">
                          <span className="text-[12px] font-bold leading-none">{stats?.waitingUserTickets || 0}</span>
                          <span className="text-[6px] font-medium tracking-widest uppercase opacity-80 mt-1">Ag. Usuário</span>
                        </div>
                      </div>
                    </div>
                  </foreignObject>
                </g>

                {/* Right Shape: Em Andamento + Subs */}
                <g onClick={() => navigate('/tickets?status=InProgress')} className="group cursor-pointer transition-transform duration-300 hover:translate-x-1.5 hover:-translate-y-1.5">
                  <path d="M 260 279 L 260 60 A 400 400 0 0 1 440 383 Z" className="fill-[#9c0c16] transition-all duration-300 group-hover:fill-[#b8101b]" />
                  <foreignObject x="255" y="130" width="160" height="180">
                    <div className="w-full h-full flex flex-col items-center justify-center text-white p-1">
                      <span className="material-symbols-outlined text-[20px] mb-1 opacity-90 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12">terminal</span>
                      <span className="text-[8px] font-bold tracking-wider uppercase opacity-90 text-center leading-tight transition-opacity duration-300 group-hover:opacity-100">Andamento</span>
                      <span className="text-[36px] font-black leading-none mt-1 transition-transform duration-300 group-hover:scale-110">{stats?.inProgressTickets || 0}</span>
                      
                      <div className="flex gap-4 mt-2 pt-2 border-t border-white/20 w-4/5 justify-center">
                        <div className="flex flex-col items-center text-orange-200 group-hover:-translate-y-0.5 transition-transform delay-75">
                          <span className="text-[12px] font-bold leading-none">{stats?.pendingMyAction || 0}</span>
                          <span className="text-[6px] font-medium tracking-widest uppercase opacity-90 mt-1 flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[7px]">notification_important</span> Pendente
                          </span>
                        </div>
                      </div>
                    </div>
                  </foreignObject>
                </g>

                {/* Bottom Shape: Resolvidos + Subs */}
                <g onClick={() => navigate('/tickets?status=Resolved')} className="group cursor-pointer transition-transform duration-300 hover:translate-y-2">
                  <path d="M 250 296 L 75 397 A 400 400 0 0 0 425 397 Z" className="fill-[#7a0810] transition-all duration-300 group-hover:fill-[#9c0c16]" />
                  <foreignObject x="150" y="305" width="200" height="120">
                    <div className="w-full h-full flex flex-col items-center justify-center text-white p-1">
                      <span className="text-[36px] font-black leading-none transition-transform duration-300 group-hover:scale-110">{stats?.resolvedTickets || 0}</span>
                      <span className="text-[8px] font-bold tracking-wider uppercase opacity-90 text-center flex items-center gap-1 mt-1 transition-opacity duration-300 group-hover:opacity-100">
                        <span className="material-symbols-outlined text-[10px] transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">check_circle</span> Resolvidos
                      </span>

                      <div className="flex gap-8 mt-2 pt-2 border-t border-white/20 w-3/5 justify-center">
                        <div className="flex flex-col items-center group-hover:-translate-y-0.5 transition-transform delay-75">
                          <span className="text-[12px] font-bold leading-none">{stats?.totalTickets || 0}</span>
                          <span className="text-[6px] font-medium tracking-widest uppercase opacity-80 mt-1">Total</span>
                        </div>
                        <div className="flex flex-col items-center text-emerald-300 group-hover:-translate-y-0.5 transition-transform delay-100">
                          <span className="text-[12px] font-bold leading-none">{stats?.resolutionRate || 0}%</span>
                          <span className="text-[6px] font-medium tracking-widest uppercase opacity-90 mt-1 flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[7px]">trending_up</span> Taxa
                          </span>
                        </div>
                      </div>
                    </div>
                  </foreignObject>
                </g>
              </svg>
            </div>
          </div>
        )}
      </section>

      {/* CHAMADOS RECENTES SECTION */}
      <section className="bg-white border border-slate-200/70 rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.03)] min-w-0 w-full">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-3 min-w-0">
          <div>
            <h2 className="text-[15px] font-semibold text-slate-900 tracking-tight">Chamados Recentes</h2>
            <p className="text-[13px] text-slate-500 mt-0.5">Últimas solicitações registradas na plataforma</p>
          </div>
          <Link to="/tickets" className="text-[13px] font-medium text-[#c8101e] hover:text-slate-900 transition-colors flex items-center gap-1 shrink-0">
            <span>Ver todos</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
        
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left min-w-[580px]">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4 sm:px-6">ID</th>
                <th className="py-3 px-4 sm:px-6">Assunto</th>
                <th className="py-3 px-4 sm:px-6">Solicitante</th>
                <th className="py-3 px-4 sm:px-6">Categoria</th>
                <th className="py-3 px-4 sm:px-6">Status</th>
                <th className="py-3 px-4 sm:px-6 text-right">Abertura</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[13px]">
              {isLoading && (
                <tr><td colSpan="6" className="py-4 text-center text-slate-500">Carregando...</td></tr>
              )}
              {!isLoading && recentTickets.length === 0 && (
                <tr><td colSpan="6" className="py-4 text-center text-slate-500">Nenhum chamado encontrado.</td></tr>
              )}
              {!isLoading && recentTickets.map((ticket) => {
                const statusInfo = translateStatus(ticket.status);
                const categoryInfo = translateCategory(ticket.category);
                return (
                  <tr 
                    key={ticket.id} 
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                  >
                    <td className="py-3.5 px-4 sm:px-6 font-mono text-[12px] text-slate-500 flex items-center gap-1.5 whitespace-nowrap">
                      <span className="material-symbols-outlined text-[15px] text-[#c8101e]">confirmation_number</span>#{ticket.protocolNumber}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 font-medium text-slate-900">
                      <span className="group-hover:text-[#c8101e] transition-colors block max-w-[220px] truncate">{ticket.title}</span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-slate-600 whitespace-nowrap truncate max-w-[150px]">
                      {ticket.createdByName}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-slate-500 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[15px] text-[#c8101e]">{categoryInfo.icon}</span>
                        {categoryInfo.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 text-[12px] font-medium px-2 py-0.5 rounded-full ${statusInfo.color}`}>
                        <span className="material-symbols-outlined text-[13px]">{statusInfo.icon}</span>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right text-[12px] text-slate-400 whitespace-nowrap">
                      {new Date(ticket.createdAt).toLocaleDateString('pt-BR')} {new Date(ticket.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
