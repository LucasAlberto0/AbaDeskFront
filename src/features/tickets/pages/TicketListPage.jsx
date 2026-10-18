import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { getTickets } from '../api/ticketService';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { formatDate, getCategoryLabel, translateStatus } from '../../../lib/utils';

export default function TicketListPage({ title = "Chamados", description = "Gerencie e acompanhe as solicitações da plataforma.", defaultStatus = null }) {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
                  <th className="px-3 sm:px-6 py-3 sm:py-4 font-semibold">Protocolo</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 font-semibold">Título</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 font-semibold">Categoria</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 font-semibold">Solicitante</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 font-semibold">Status</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 font-semibold">Abertura</th>
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
                      <td className="px-3 sm:px-6 py-3 sm:py-4 font-mono font-medium text-text-primary">
                        <Link to={`/tickets/${ticket.id}`} className="hover:underline hover:text-primary">
                          #{ticket.protocolNumber}
                        </Link>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <Link to={`/tickets/${ticket.id}`} className="font-medium text-text-primary group-hover:text-primary transition-colors">
                          {ticket.title}
                        </Link>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">{getCategoryLabel(ticket.category)}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">{ticket.createdByName}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-0.5 rounded-full ${statusInfo.color}`}>
                          <span className="material-symbols-outlined text-[13px]">{statusInfo.icon}</span>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">{formatDate(ticket.createdAt)}</td>
                    </motion.tr>
                  );
                })}
                {filteredTickets.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-3 sm:px-6 py-8 text-center text-text-muted">
                      Nenhum chamado encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
