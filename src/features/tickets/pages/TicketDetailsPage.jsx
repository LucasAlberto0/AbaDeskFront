import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, Clock, Send, PlayCircle, CheckCircle } from 'lucide-react';
import { getTicketDetails, addTicketComment, deleteTicket } from '../api/ticketService';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { formatDate, getStatusLabel, getCategoryLabel } from '../../../lib/utils';
import useAuthStore from '../../auth/hooks/useAuthStore';
import toast from 'react-hot-toast';
import { ConfirmModal } from '../../../components/ui/ConfirmModal';
export default function TicketDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthStore();

  const fetchDetails = async () => {
    try {
      const data = await getTicketDetails(id);
      setTicket(data);
    } catch (error) {
      console.error("Erro ao buscar detalhes do chamado:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    if (!window.confirm(`Deseja alterar o status para ${getStatusLabel(newStatus)}?`)) return;
    setIsSubmitting(true);
    try {
      if (newStatus === 'InAnalysis') await import('../api/ticketService').then(m => m.startAnalysis(id));
      else if (newStatus === 'InProgress') await import('../api/ticketService').then(m => m.startProgress(id));
      else if (newStatus === 'WaitingUser') await import('../api/ticketService').then(m => m.waitForUser(id));
      else if (newStatus === 'Resolved') await import('../api/ticketService').then(m => m.resolveTicket(id));
      
      await fetchDetails();
    } catch (error) {
      console.error(error);
      alert('Erro ao alterar status.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTicket(id);
      toast.success('Chamado excluído.');
      navigate('/tickets');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao excluir chamado.');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setIsSubmitting(true);
    try {
      await addTicketComment(id, commentText);
      setCommentText('');
      await fetchDetails();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
      </div>
    );
  }

  if (!ticket) return <div>Chamado não encontrado.</div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/tickets" className="text-text-muted hover:text-primary transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-text-primary">#{ticket.protocolNumber}</h1>
              <Badge status={ticket.status} label={getStatusLabel(ticket.status)} />
            </div>
            <p className="text-text-secondary mt-1">{ticket.title}</p>
          </div>
        </div>

        {/* Actions (Delete & Workflow) */}
        <div className="flex gap-2 items-center">
          {(user?.role === 'Admin' || (user?.role === 'User' && ticket.createdBy?.id === user?.id)) && (
            <Button onClick={() => setIsDeleteModalOpen(true)} isLoading={isSubmitting} size="sm" className="bg-red-600 hover:bg-red-700 border-none text-white mr-2">
              Excluir
            </Button>
          )}

          {user?.role !== 'User' && (
          <div className="flex gap-2">
            {ticket.status === 'Open' && (
              <Button onClick={() => handleStatusChange('InAnalysis')} isLoading={isSubmitting} size="sm">
                Iniciar Análise
              </Button>
            )}
            {(ticket.status === 'InAnalysis' || ticket.status === 'WaitingUser') && (
              <Button onClick={() => handleStatusChange('InProgress')} isLoading={isSubmitting} size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700 border-none text-white">
                <PlayCircle size={16} /> Iniciar Atendimento
              </Button>
            )}
            {ticket.status === 'InProgress' && (
              <>
                <Button onClick={() => handleStatusChange('WaitingUser')} isLoading={isSubmitting} size="sm" className="gap-2 bg-orange-500 hover:bg-orange-600 border-none text-white">
                  <Clock size={16} /> Aguardar Usuário
                </Button>
                <Button onClick={() => handleStatusChange('Resolved')} isLoading={isSubmitting} size="sm" className="gap-2 bg-green-600 hover:bg-green-700 border-none text-white">
                  <CheckCircle size={16} /> Resolver
                </Button>
              </>
            )}
          </div>
        )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details & Comments */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-card border border-border-subtle rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4 border-b border-border-subtle pb-2">Descrição da Demanda</h3>
            <div className="text-text-primary text-sm whitespace-pre-wrap leading-relaxed">
              {ticket.description}
            </div>
            {ticket.attachmentUrl && (
              <div className="mt-6 border-t border-border-subtle pt-4">
                <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Anexo</h4>
                <a href={`http://localhost:5017${ticket.attachmentUrl}`} target="_blank" rel="noreferrer">
                  <img src={`http://localhost:5017${ticket.attachmentUrl}`} alt="Anexo do Chamado" className="max-w-full max-h-[400px] object-contain rounded-lg border border-slate-200 shadow-sm cursor-pointer hover:opacity-90 transition-opacity" />
                </a>
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="bg-surface-card border border-border-subtle rounded-lg p-0 shadow-sm overflow-hidden flex flex-col h-[500px]">
            <div className="p-4 border-b border-border-subtle bg-gray-50 flex items-center gap-2">
              <MessageSquare size={18} className="text-text-muted" />
              <h3 className="font-semibold text-text-primary">Comentários</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface/30">
              {ticket.comments?.map((comment) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={comment.id} 
                  className={`flex flex-col max-w-[85%] ${comment.userId === user?.id ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-text-secondary">{comment.user?.name}</span>
                    <span className="text-[10px] text-text-muted">{formatDate(comment.createdAt)}</span>
                  </div>
                  <div className={`p-3 rounded-lg text-sm ${
                    comment.userId === user?.id 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-white border border-border-subtle text-text-primary rounded-tl-none'
                  }`}>
                    {comment.content}
                  </div>
                </motion.div>
              ))}
              {ticket.comments?.length === 0 && (
                <div className="text-center text-text-muted text-sm py-10">Nenhum comentário ainda.</div>
              )}
            </div>

            <form onSubmit={handleCommentSubmit} className="p-4 border-t border-border-subtle bg-white flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Escreva uma mensagem..."
                className="flex-1 bg-surface border border-border-subtle rounded-[4px] px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                disabled={isSubmitting}
              />
              <Button type="submit" isLoading={isSubmitting} disabled={!commentText.trim()} className="px-3">
                <Send size={18} />
              </Button>
            </form>
          </div>
        </div>

        {/* Right Column: Metadata & Timeline */}
        <div className="space-y-6">
          <div className="bg-surface-card border border-border-subtle rounded-lg p-5 shadow-sm space-y-4">
            <div>
              <p className="text-xs text-text-muted uppercase font-semibold">Solicitante</p>
              <p className="text-sm font-medium text-text-primary">{ticket.createdBy?.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-text-muted uppercase font-semibold">Categoria</p>
                <p className="text-sm font-medium text-text-primary">{getCategoryLabel(ticket.category)}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase font-semibold">Sistema</p>
                <p className="text-sm font-medium text-text-primary">{ticket.systemName}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-text-muted uppercase font-semibold">Unidade / Departamento</p>
              <p className="text-sm font-medium text-text-primary">{ticket.companyUnit} - {ticket.department}</p>
            </div>
          </div>

          <div className="bg-surface-card border border-border-subtle rounded-lg p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={18} className="text-text-muted" />
              <h3 className="font-semibold text-text-primary">Timeline</h3>
            </div>
            <div className="relative border-l-2 border-border-subtle ml-3 space-y-6">
              {ticket.histories?.map((history, idx) => (
                <div key={history.id} className="relative pl-6">
                  <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-surface-card border-2 border-primary" />
                  <p className="text-sm font-semibold text-text-primary">{history.action}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{history.description}</p>
                  <p className="text-[10px] text-text-muted mt-1">{formatDate(history.createdAt)} • {history.user?.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Excluir Chamado"
        message="Tem certeza que deseja excluir este chamado? Todos os comentários e históricos associados a ele também serão perdidos. Esta ação não pode ser desfeita."
        confirmText="Sim, excluir chamado"
      />
    </div>
  );
}
