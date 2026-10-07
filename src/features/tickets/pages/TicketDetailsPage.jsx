import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, Clock, Send, PlayCircle, CheckCircle, Check } from 'lucide-react';
import { getTicketDetails, addTicketComment, deleteTicket, startAnalysis, startProgress, waitForUser, resolveTicket } from '../api/ticketService';
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
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
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

  const confirmStatusChange = (newStatus) => {
    setPendingStatus(newStatus);
    setIsStatusModalOpen(true);
  };

  const handleStatusChange = async () => {
    if (!pendingStatus) return;
    setIsSubmitting(true);
    try {
      if (pendingStatus === 'InAnalysis') await startAnalysis(id);
      else if (pendingStatus === 'InProgress') await startProgress(id);
      else if (pendingStatus === 'WaitingUser') await waitForUser(id);
      else if (pendingStatus === 'Resolved') await resolveTicket(id);
      
      await fetchDetails();
      toast.success(`Status alterado para ${getStatusLabel(pendingStatus)}.`);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao alterar status.');
    } finally {
      setIsSubmitting(false);
      setIsStatusModalOpen(false);
      setPendingStatus(null);
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

  const steps = [
    { id: 'Open', label: 'Aberto' },
    { id: 'InAnalysis', label: 'Em Análise' },
    { id: 'InProgress', label: 'Em Atendimento' },
    { id: 'Resolved', label: 'Resolvido' }
  ];

  const getStepIndex = (status) => {
    if (status === 'WaitingUser') return 2; // Treat as InProgress for the linear bar
    const index = steps.findIndex(s => s.id === status);
    return index >= 0 ? index : 0;
  };

  const currentStepIndex = getStepIndex(ticket.status);

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
              <Badge status={ticket.status} label={ticket.status === 'WaitingUser' ? 'Aguardando Usuário' : getStatusLabel(ticket.status)} />
            </div>
            <p className="text-text-secondary mt-1">{ticket.title}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="hidden md:flex items-center justify-start flex-1 max-w-sm ml-10 mr-auto mt-2">
          <div className="flex items-center w-full justify-between relative">
            {/* Background Line */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-gray-200 z-0" />
            
            {/* Animated Progress Line */}
            <motion.div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-primary z-0"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />

            {steps.map((step, idx) => {
              const isCompleted = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              const isWaiting = isCurrent && ticket.status === 'WaitingUser';
              
              let bgColor = "bg-white border-gray-300";
              let textColor = "text-gray-400";
              let ringColor = "";

              if (isCompleted) {
                bgColor = "bg-primary border-primary text-white";
                textColor = "text-primary font-medium";
              } else if (isCurrent) {
                bgColor = isWaiting ? "bg-orange-500 border-orange-500 text-white" : "bg-primary border-primary text-white";
                textColor = isWaiting ? "text-orange-600 font-bold" : "text-primary font-bold";
                ringColor = isWaiting ? "ring-2 ring-orange-200" : "ring-2 ring-red-100";
              }

              return (
                <div key={step.id} className="flex flex-col items-center gap-1 relative z-10">
                  <motion.div 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: isCurrent ? 1.1 : 1 }}
                    className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center text-[9px] transition-colors duration-300 ${bgColor} ${ringColor}`}
                  >
                    {isCompleted ? <Check size={10} strokeWidth={3} /> : (idx + 1)}
                  </motion.div>
                  <span className={`absolute top-6 w-20 text-center text-[9px] uppercase tracking-wider ${textColor}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
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
              <Button onClick={() => confirmStatusChange('InAnalysis')} isLoading={isSubmitting && pendingStatus === 'InAnalysis'} size="sm">
                Iniciar Análise
              </Button>
            )}
            {(ticket.status === 'InAnalysis' || ticket.status === 'WaitingUser') && (
              <Button onClick={() => confirmStatusChange('InProgress')} isLoading={isSubmitting && pendingStatus === 'InProgress'} size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700 border-none text-white">
                <PlayCircle size={16} /> Iniciar Atendimento
              </Button>
            )}
            {ticket.status === 'InProgress' && (
              <>
                <Button onClick={() => confirmStatusChange('WaitingUser')} isLoading={isSubmitting && pendingStatus === 'WaitingUser'} size="sm" className="gap-2 bg-orange-500 hover:bg-orange-600 border-none text-white">
                  <Clock size={16} /> Aguardar Usuário
                </Button>
                <Button onClick={() => confirmStatusChange('Resolved')} isLoading={isSubmitting && pendingStatus === 'Resolved'} size="sm" className="gap-2 bg-green-600 hover:bg-green-700 border-none text-white">
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

      <ConfirmModal
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false);
          setPendingStatus(null);
        }}
        onConfirm={handleStatusChange}
        isLoading={isSubmitting}
        title="Alterar Status"
        message={`Tem certeza que deseja alterar o status do chamado para "${pendingStatus ? getStatusLabel(pendingStatus) : ''}"?`}
        confirmText="Confirmar alteração"
      />
    </div>
  );
}
