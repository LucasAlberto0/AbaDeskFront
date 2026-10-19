import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { getTickets, deleteTicket } from '../api/ticketService';
import useAuthStore from '../../auth/hooks/useAuthStore';
import { ConfirmModal } from '../../../components/ui/ConfirmModal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { formatDate, getCategoryLabel, translateStatus } from '../../../lib/utils';

export default function TicketListPage({ title = "Chamados", description = "Gerencie e acompanhe as solicitações da plataforma.", defaultStatus = null }) {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteTicketData, setDeleteTicketData] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuthStore();

  const isTechnicianOrAdmin = user?.role === 'Admin' || user?.role === 'Attendant' || user?.role === 1 || user?.role === 2;

  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true);
      try {
        const params = { page: 1, pageSize: 50 };
        if (defaultStatus) params.status = defaultStatus;
        
        const data = await getTickets(params);
        setTickets(data.items || []);
      } catch (error) {
        console.error("Erro ao buscar chamados:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTickets();
  }, [defaultStatus]);

  const filteredTickets = useMemo(() => {
    if (!searchTerm.trim()) return tickets;
    const term = searchTerm.toLowerCase();
    return tickets.filter((ticket) => {
      const matchTitle = ticket.title?.toLowerCase().includes(term);
      const matchProtocol = String(ticket.protocolNumber || '').toLowerCase().includes(term);
      return matchTitle || matchProtocol;
    });
  }, [tickets, searchTerm]);

  const handleDelete = async () => {
    if (!deleteTicketData) return;
    setIsDeleting(true);
    try {
      await deleteTicket(deleteTicketData.id);
      toast.success(`Chamado #${deleteTicketData.protocolNumber} excluído com sucesso.`);
      setTickets((prev) => prev.filter((t) => t.id !== deleteTicketData.id));
      setDeleteTicketData(null);
    } catch (error) {
      console.error(error);
      const errorMsg = error?.response?.data?.message || 'Erro ao excluir chamado.';
      toast.error(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">{title}</h1>
          <p className="text-sm text-text-secondary mt-0.5 sm:mt-1">{description}</p>
        </div>
        <Link to="/tickets/new" className="w-full sm:w-auto">
          <Button className="gap-2 w-full sm:w-auto">
            <Plus size={18} /> Novo Chamado
          </Button>
        </Link>
      </div>

      <div className="bg-surface-card border border-border-subtle rounded-lg shadow-sm overflow-hidden">
        <div className="p-3 sm:p-4 border-b border-border-subtle bg-gray-50 flex gap-4">
          <div className="relative max-w-sm w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
              <Search size={16} />
            </div>
            <Input 
              className="pl-9 bg-white" 
              placeholder="Buscar por protocolo ou título..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
            </div>
          ) : (
            <table className="w-full text-left text-sm text-text-secondary min-w-[580px]">
              <thead className="bg-gray-50/50 text-xs uppercase text-text-muted border-b border-border-subtle">
                <tr>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 font-semibold whitespace-nowrap">Protocolo</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 font-semibold whitespace-nowrap">Título</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 font-semibold whitespace-nowrap">Categoria</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 font-semibold whitespace-nowrap">Solicitante</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 font-semibold whitespace-nowrap">Status</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 font-semibold whitespace-nowrap">Abertura</th>
                  {isTechnicianOrAdmin && (
                    <th className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-right whitespace-nowrap">Ações</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredTickets.map((ticket, index) => {
                  const statusInfo = translateStatus(ticket.status);
                  return (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={ticket.id} 
                      className="hover:bg-gray-50/80 transition-colors group"
                    >
                      <td className="px-3 sm:px-6 py-3 sm:py-4 font-mono font-medium text-text-primary whitespace-nowrap">
                        <Link to={`/tickets/${ticket.id}`} className="hover:underline hover:text-primary">
                          #{ticket.protocolNumber}
                        </Link>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 max-w-[160px] sm:max-w-none whitespace-nowrap sm:whitespace-normal">
                        <Link 
                          to={`/tickets/${ticket.id}`} 
                          title={ticket.title}
                          className="font-medium text-text-primary group-hover:text-primary transition-colors block truncate sm:inline sm:whitespace-normal"
                        >
                          {ticket.title}
                        </Link>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">{getCategoryLabel(ticket.category)}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">{ticket.createdByName}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-0.5 rounded-full ${statusInfo.color}`}>
                          <span className="material-symbols-outlined text-[13px]">{statusInfo.icon}</span>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">{formatDate(ticket.createdAt)}</td>
                      {isTechnicianOrAdmin && (
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-right whitespace-nowrap">
                          {ticket.status === 'Resolved' && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteTicketData(ticket);
                              }}
                              title="Excluir Chamado Resolvido"
                              className="text-slate-400 hover:text-red-600 transition-colors p-1.5 rounded-lg hover:bg-red-50 inline-flex items-center justify-center cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          )}
                        </td>
                      )}
                    </motion.tr>
                  );
                })}
                {filteredTickets.length === 0 && (
                  <tr>
                    <td colSpan={isTechnicianOrAdmin ? 7 : 6} className="px-3 sm:px-6 py-8 text-center text-text-muted">
                      Nenhum chamado encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteTicketData}
        onClose={() => setDeleteTicketData(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Excluir Chamado Resolvido"
        message={`Tem certeza que deseja excluir permanentemente o chamado #${deleteTicketData?.protocolNumber} - "${deleteTicketData?.title}"? Esta ação não pode ser desfeita.`}
        confirmText="Sim, excluir"
      />
    </div>
  );
}
