import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../auth/hooks/useAuthStore';
import { getDashboardSummary } from '../api/dashboardService';
import { getTickets } from '../../tickets/api/ticketService';

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

  const translateStatus = (status) => {
    const map = {
      'New': { label: 'Novo', icon: 'add_circle', color: 'bg-blue-100 text-blue-700' },
      'InAnalysis': { label: 'Em análise', icon: 'search', color: 'bg-amber-100 text-amber-700' },
      'InDevelopment': { label: 'Em desenvolvimento', icon: 'terminal', color: 'bg-purple-100 text-purple-700' },
      'InTest': { label: 'Em teste', icon: 'rule', color: 'bg-orange-100 text-orange-700' },
      'WaitingHomologation': { label: 'Homologação', icon: 'verified', color: 'bg-indigo-100 text-indigo-700' },
      'Resolved': { label: 'Resolvido', icon: 'check_circle', color: 'bg-emerald-100 text-emerald-700' },
      'Rejected': { label: 'Rejeitado', icon: 'cancel', color: 'bg-red-100 text-red-700' },
    };
    return map[status] || { label: status, icon: 'info', color: 'bg-slate-100 text-slate-700' };
  };

  const translateCategory = (cat) => {
    const map = {
      'Hardware': { label: 'Hardware', icon: 'computer' },
      'Software': { label: 'Software', icon: 'terminal' },
      'Network': { label: 'Rede', icon: 'wifi' },
      'Access': { label: 'Acesso', icon: 'key' },
      'Other': { label: 'Outros', icon: 'more_horiz' },
    };
    return map[cat] || { label: cat, icon: 'category' };
  };

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

      {/* METRICS ROW */}
      <section className="bg-white border border-slate-200/70 rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.03)] w-full min-w-0">
        {user?.role === 'User' ? (
          <div className="grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="p-4 sm:p-6 flex flex-col justify-between min-w-0">
              <span className="text-[12px] font-medium text-slate-500 truncate">Meus Chamados</span>
              <div className="mt-2 sm:mt-4 mb-2">
                <span className="text-[26px] sm:text-[32px] font-semibold tracking-tight text-slate-900 leading-none">{stats?.totalTickets || 0}</span>
              </div>
            </div>
            <div className="p-4 sm:p-6 flex flex-col justify-between min-w-0">
              <span className="text-[12px] font-medium text-slate-500 truncate">Abertos</span>
              <div className="mt-2 sm:mt-4 mb-2">
                <span className="text-[26px] sm:text-[32px] font-semibold tracking-tight text-slate-900 leading-none">{stats?.openTickets || 0}</span>
              </div>
            </div>
            <div className="p-4 sm:p-6 flex flex-col justify-between min-w-0">
              <span className="text-[12px] font-medium text-slate-500 truncate">Em Andamento</span>
              <div className="mt-2 sm:mt-4 mb-2">
                <span className="text-[26px] sm:text-[32px] font-semibold tracking-tight text-slate-900 leading-none">{stats?.inProgressTickets || 0}</span>
              </div>
            </div>
            <div className="p-4 sm:p-6 flex flex-col justify-between min-w-0">
              <span className="text-[12px] font-medium text-slate-500 truncate">Resolvidos</span>
              <div className="mt-2 sm:mt-4 mb-2">
                <span className="text-[26px] sm:text-[32px] font-semibold tracking-tight text-slate-900 leading-none">{stats?.resolvedTickets || 0}</span>
              </div>
            </div>
            <div className="p-4 sm:p-6 flex flex-col justify-between min-w-0 bg-slate-50">
              <span className="text-[12px] font-medium text-[#c8101e] truncate">Minha Homologação</span>
              <div className="mt-2 sm:mt-4 mb-2">
                <span className="text-[26px] sm:text-[32px] font-semibold tracking-tight text-[#c8101e] leading-none">{stats?.pendingMyAction || 0}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="p-4 sm:p-6 flex flex-col justify-between min-w-0">
              <span className="text-[12px] font-medium text-slate-500 truncate">Total</span>
              <div className="mt-2 sm:mt-4 mb-2">
                <span className="text-[26px] sm:text-[28px] font-semibold tracking-tight text-slate-900 leading-none">{stats?.totalTickets || 0}</span>
              </div>
            </div>
            <div className="p-4 sm:p-6 flex flex-col justify-between min-w-0">
              <span className="text-[12px] font-medium text-slate-500 truncate">Abertos</span>
              <div className="mt-2 sm:mt-4 mb-2">
                <span className="text-[26px] sm:text-[28px] font-semibold tracking-tight text-slate-900 leading-none">{stats?.openTickets || 0}</span>
              </div>
            </div>
            <div className="p-4 sm:p-6 flex flex-col justify-between min-w-0">
              <span className="text-[12px] font-medium text-slate-500 truncate">Análise</span>
              <div className="mt-2 sm:mt-4 mb-2">
                <span className="text-[26px] sm:text-[28px] font-semibold tracking-tight text-slate-900 leading-none">{stats?.inAnalysisTickets || 0}</span>
              </div>
            </div>
            <div className="p-4 sm:p-6 flex flex-col justify-between min-w-0">
              <span className="text-[12px] font-medium text-slate-500 truncate">Dev / Test</span>
              <div className="mt-2 sm:mt-4 mb-2">
                <span className="text-[26px] sm:text-[28px] font-semibold tracking-tight text-slate-900 leading-none">{(stats?.inDevelopmentTickets || 0) + (stats?.inTestTickets || 0)}</span>
              </div>
            </div>
            <div className="p-4 sm:p-6 flex flex-col justify-between min-w-0">
              <span className="text-[12px] font-medium text-slate-500 truncate">Homologação</span>
              <div className="mt-2 sm:mt-4 mb-2">
                <span className="text-[26px] sm:text-[28px] font-semibold tracking-tight text-slate-900 leading-none">{stats?.waitingHomologationTickets || 0}</span>
              </div>
            </div>
            <div className="p-4 sm:p-6 flex flex-col justify-between min-w-0">
              <span className="text-[12px] font-medium text-slate-500 truncate">Resolvidos</span>
              <div className="mt-2 sm:mt-4 mb-2">
                <span className="text-[26px] sm:text-[28px] font-semibold tracking-tight text-slate-900 leading-none">{stats?.resolvedTickets || 0}</span>
              </div>
            </div>
            <div className="p-4 sm:p-6 flex flex-col justify-between min-w-0">
              <span className="text-[12px] font-medium text-slate-500 truncate">Taxa Res.</span>
              <div className="mt-2 sm:mt-4 mb-2">
                <span className="text-[26px] sm:text-[28px] font-semibold tracking-tight text-emerald-600 leading-none">{stats?.resolutionRate || 0}%</span>
              </div>
            </div>
            <div className="p-4 sm:p-6 flex flex-col justify-between min-w-0 bg-slate-50">
              <span className="text-[12px] font-medium text-[#c8101e] truncate">Pendente</span>
              <div className="mt-2 sm:mt-4 mb-2">
                <span className="text-[26px] sm:text-[28px] font-semibold tracking-tight text-[#c8101e] leading-none">{stats?.pendingMyAction || 0}</span>
              </div>
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
                      <span className="material-symbols-outlined text-[15px] text-[#c8101e]">confirmation_number</span>#{ticket.id}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 font-medium text-slate-900">
                      <span className="group-hover:text-[#c8101e] transition-colors block max-w-[220px] truncate">{ticket.title}</span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-slate-600 whitespace-nowrap">
                      {ticket.requesterName}
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
                      {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
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
