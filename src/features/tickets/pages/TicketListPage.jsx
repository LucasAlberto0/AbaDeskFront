import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { getTickets } from '../api/ticketService';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { formatDate, getStatusLabel, getCategoryLabel } from '../../../lib/utils';

export default function TicketListPage({ title = "Chamados", description = "Gerencie e acompanhe as solicitações da plataforma.", defaultStatus = null }) {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true);
      try {
        const params = { page: 1, pageSize: 50 };
        if (defaultStatus) params.status = defaultStatus;
        
        const data = await getTickets(params);
        setTickets(data.items);
      } catch (error) {
        console.error("Erro ao buscar chamados:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTickets();
  }, [defaultStatus]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">{title}</h1>
          <p className="text-text-secondary mt-1">{description}</p>
        </div>
        <Link to="/tickets/new">
          <Button className="gap-2">
            <Plus size={18} /> Novo Chamado
          </Button>
        </Link>
      </div>

      <div className="bg-surface-card border border-border-subtle rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border-subtle bg-gray-50 flex gap-4">
          <div className="relative max-w-sm w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
              <Search size={16} />
            </div>
            <Input className="pl-9 bg-white" placeholder="Buscar por protocolo ou título..." />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
            </div>
          ) : (
            <table className="w-full text-left text-sm text-text-secondary">
              <thead className="bg-gray-50/50 text-xs uppercase text-text-muted border-b border-border-subtle">
                <tr>
                  <th className="px-6 py-4 font-semibold">Protocolo</th>
                  <th className="px-6 py-4 font-semibold">Título</th>
                  <th className="px-6 py-4 font-semibold">Categoria</th>
                  <th className="px-6 py-4 font-semibold">Solicitante</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Abertura</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {tickets.map((ticket, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={ticket.id} 
                    className="hover:bg-gray-50/80 transition-colors group"
                  >
                    <td className="px-6 py-4 font-mono font-medium text-text-primary">
                      <Link to={`/tickets/${ticket.id}`} className="hover:underline hover:text-primary">
                        #{ticket.protocolNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <Link to={`/tickets/${ticket.id}`} className="font-medium text-text-primary group-hover:text-primary transition-colors">
                        {ticket.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4">{getCategoryLabel(ticket.category)}</td>
                    <td className="px-6 py-4">{ticket.createdByName}</td>
                    <td className="px-6 py-4">
                      <Badge status={ticket.status} label={getStatusLabel(ticket.status)} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(ticket.createdAt)}</td>
                  </motion.tr>
                ))}
                {tickets.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-text-muted">
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
