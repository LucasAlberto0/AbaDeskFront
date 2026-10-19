import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, Clock, Send, PlayCircle, CheckCircle, Check, RotateCcw } from 'lucide-react';
import { getTicketDetails, addTicketComment, deleteTicket, startAnalysis, startProgress, waitForUser, resolveTicket, reopenTicket } from '../api/ticketService';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { formatDate, getStatusLabel, getCategoryLabel } from '../../../lib/utils';
import useAuthStore from '../../auth/hooks/useAuthStore';
import toast from 'react-hot-toast';
import { ConfirmModal } from '../../../components/ui/ConfirmModal';
import { SolutionModal } from '../../../components/ui/SolutionModal';
import { ReopenModal } from '../../../components/ui/ReopenModal';
import * as signalR from '@microsoft/signalr';
import { API_BASE_URL } from '../../../lib/axios';
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
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [isReopenModalOpen, setIsReopenModalOpen] = useState(false);
  const [reopenTargetStatus, setReopenTargetStatus] = useState('Open');
  const { user } = useAuthStore();
  const [hubConnection, setHubConnection] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const messagesEndRef = useRef(null);

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

    const token = sessionStorage.getItem('abadesk_token');
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/hubs/ticket`, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => {
        connection.invoke("JoinTicketGroup", id);
      })
      .catch(err => console.error("Erro no SignalR:", err));

    connection.on("ReceiveComment", (newComment) => {
      setTicket(prev => {
        if (!prev) return prev;
        if (prev.comments?.find(c => c.id === newComment.id)) return prev;
        return {
          ...prev,
          comments: [...(prev.comments || []), newComment]
        };
      });
      scrollToBottom();
    });

    connection.on("UserTyping", (userName, isTyping) => {
      setTypingUsers(prev => {
        if (isTyping && !prev.includes(userName)) return [...prev, userName];
        if (!isTyping) return prev.filter(u => u !== userName);
        return prev;
      });
    });

    setHubConnection(connection);

    return () => {
      if (connection) {
        connection.invoke("LeaveTicketGroup", id).catch(e => console.error(e));
        connection.stop();
      }
    };
  }, [id]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const confirmStatusChange = (newStatus) => {
    if (newStatus === 'Resolved') {
      setIsResolveModalOpen(true);
      return;
    }
    if (ticket?.status === 'Resolved' && (newStatus === 'Open' || newStatus === 'InProgress')) {
      setReopenTargetStatus(newStatus);
      setIsReopenModalOpen(true);
      return;
    }
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

      await fetchDetails();
      toast.success(`Status alterado para ${getStatusLabel(pendingStatus)}.`);
    } catch (error) {
      console.error(error);
      const errorMsg = error?.response?.data?.message || 'Erro ao alterar status.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
      setIsStatusModalOpen(false);
      setPendingStatus(null);
    }
  };

  const handleConfirmResolve = async (solution) => {
    setIsSubmitting(true);
    try {
      await resolveTicket(id, solution);
      await fetchDetails();
      toast.success('Chamado resolvido com sucesso!');
      setIsResolveModalOpen(false);
    } catch (error) {
      console.error(error);
      const errorMsg = error?.response?.data?.message || 'Erro ao resolver chamado.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmReopen = async (justification, targetStatus) => {
    setIsSubmitting(true);
    try {
      await reopenTicket(id, justification, targetStatus);
      await fetchDetails();
      toast.success('Chamado reaberto com sucesso!');
      setIsReopenModalOpen(false);
    } catch (error) {
      console.error(error);
      const errorMsg = error?.response?.data?.message || 'Erro ao reabrir chamado.';
      toast.error(errorMsg);
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
      const newComment = await addTicketComment(id, commentText);
      setCommentText('');
      if (hubConnection) hubConnection.invoke("Typing", id, user?.name, false).catch(console.error);

      setTicket(prev => {
        if (!prev) return prev;
        if (prev.comments?.find(c => c.id === newComment.id)) return prev;
        return { ...prev, comments: [...(prev.comments || []), newComment] };
      });
      scrollToBottom();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTyping = (e) => {
    setCommentText(e.target.value);

    if (hubConnection) {
      hubConnection.invoke("Typing", id, user?.name, true).catch(console.error);

      if (typingTimeout) clearTimeout(typingTimeout);

      const timeout = setTimeout(() => {
        hubConnection.invoke("Typing", id, user?.name, false).catch(console.error);
      }, 2000);

      setTypingTimeout(timeout);
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
    if (status === 'WaitingUser') return 2;
    const index = steps.findIndex(s => s.id === status);
    return index >= 0 ? index : 0;
  };

  const currentStepIndex = getStepIndex(ticket.status);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
          <Link to="/tickets" className="text-text-muted hover:text-primary transition-colors shrink-0 mt-0.5 sm:mt-0">
            <ArrowLeft size={22} />
          </Link>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-text-primary break-all">#{ticket.protocolNumber}</h1>
              <Badge status={ticket.status} label={ticket.status === 'WaitingUser' ? 'Aguardando Usuário' : getStatusLabel(ticket.status)} />
            </div>
            <p className="text-text-secondary mt-0.5 sm:mt-1 text-sm break-words">{ticket.title}</p>
          </div>
        </div>

        <div className="hidden md:flex items-center justify-start flex-1 max-w-sm ml-10 mr-auto mt-2">
          <div className="flex items-center w-full justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-gray-200 z-0" />

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

        <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
          {((user?.role === 'Admin' || user?.role === 2) || 
            ((user?.role === 'Attendant' || user?.role === 1) && ticket.status === 'Resolved') || 
            ((user?.role === 'User' || user?.role === 0) && ticket.createdBy?.id === user?.id)) && (
            <Button onClick={() => setIsDeleteModalOpen(true)} isLoading={isSubmitting} size="sm" className="bg-red-600 hover:bg-red-700 border-none text-white flex-1 sm:flex-initial">
              Excluir
            </Button>
          )}

          {user?.role !== 'User' && (
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {ticket.status === 'Open' && (
                <Button onClick={() => confirmStatusChange('InAnalysis')} isLoading={isSubmitting && pendingStatus === 'InAnalysis'} size="sm" className="flex-1 sm:flex-initial">
                  Iniciar Análise
                </Button>
              )}
              {(ticket.status === 'InAnalysis' || ticket.status === 'WaitingUser') && (
                <Button onClick={() => confirmStatusChange('InProgress')} isLoading={isSubmitting && pendingStatus === 'InProgress'} size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700 border-none text-white flex-1 sm:flex-initial">
                  <PlayCircle size={16} /> Iniciar Atendimento
                </Button>
              )}
              {ticket.status === 'InProgress' && (
                <>
                  <Button onClick={() => confirmStatusChange('WaitingUser')} isLoading={isSubmitting && pendingStatus === 'WaitingUser'} size="sm" className="gap-2 bg-orange-500 hover:bg-orange-600 border-none text-white flex-1 sm:flex-initial">
                    <Clock size={16} /> Aguardar Usuário
                  </Button>
                  <Button onClick={() => confirmStatusChange('Resolved')} isLoading={isSubmitting && isResolveModalOpen} size="sm" className="gap-2 bg-green-600 hover:bg-green-700 border-none text-white flex-1 sm:flex-initial">
                    <CheckCircle size={16} /> Resolver
                  </Button>
                </>
              )}
              {ticket.status === 'Resolved' && (
                <Button onClick={() => confirmStatusChange('Open')} isLoading={isSubmitting && isReopenModalOpen} size="sm" className="gap-2 bg-amber-600 hover:bg-amber-700 border-none text-white flex-1 sm:flex-initial">
                  <RotateCcw size={16} /> Reabrir Chamado
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-card border border-border-subtle rounded-lg p-4 sm:p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4 border-b border-border-subtle pb-2">Descrição da Demanda</h3>
            <div className="text-text-primary text-sm whitespace-pre-wrap leading-relaxed">
              {ticket.description}
            </div>
            {ticket.solution && (
              ticket.status === 'Resolved' ? (
                <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50/80 p-4">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs sm:text-sm mb-1.5">
                    <CheckCircle size={17} className="text-emerald-600 shrink-0" />
                    <span>Solução Técnica Registrada</span>
                    {ticket.resolvedAt && (
                      <span className="text-[11px] font-normal text-emerald-700/80 ml-auto hidden sm:inline">
                        Finalizado em {formatDate(ticket.resolvedAt)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-950 whitespace-pre-wrap leading-relaxed">
                    {ticket.solution}
                  </p>
                </div>
              ) : (
                <div className="mt-5 rounded-xl border border-amber-300 bg-amber-50/80 p-4">
                  <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs sm:text-sm mb-1.5">
                    <RotateCcw size={17} className="text-amber-600 shrink-0" />
                    <span>Solução Passada</span>
                    <span className="text-[11px] font-medium text-amber-800 ml-auto bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-200">
                      Chamado Reaberto
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-amber-950 whitespace-pre-wrap leading-relaxed">
                    {ticket.solution}
                  </p>
                </div>
              )
            )}
            {ticket.attachmentUrl && (
              <div className="mt-6 border-t border-border-subtle pt-4">
                <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Anexo</h4>
                <a href={`${API_BASE_URL}${ticket.attachmentUrl}`} target="_blank" rel="noreferrer">
                  <img src={`${API_BASE_URL}${ticket.attachmentUrl}`} alt="Anexo do Chamado" className="max-w-full max-h-[400px] object-contain rounded-lg border border-slate-200 shadow-sm cursor-pointer hover:opacity-90 transition-opacity" />
                </a>
              </div>
            )}
          </div>

          <div className="bg-surface-card border border-border-subtle rounded-lg p-0 shadow-sm overflow-hidden flex flex-col h-[450px] sm:h-[500px]">
            <div className="p-3.5 sm:p-4 border-b border-border-subtle bg-gray-50 flex items-center gap-2">
              <MessageSquare size={18} className="text-text-muted" />
              <h3 className="font-semibold text-text-primary">Comentários</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 bg-surface/30">
              {ticket.comments?.map((comment) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={comment.id}
                  className={`flex flex-col max-w-[90%] sm:max-w-[85%] ${comment.user?.email === user?.email ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-text-secondary">{comment.user?.name}</span>
                    <span className="text-[10px] text-text-muted">{formatDate(comment.createdAt)}</span>
                  </div>
                  <div className={`p-3 rounded-lg text-sm ${comment.user?.email === user?.email
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
              {typingUsers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col max-w-[90%] sm:max-w-[85%] mr-auto items-start"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-text-secondary">{typingUsers.join(', ')} digitando...</span>
                  </div>
                  <div className="p-3 bg-white border border-border-subtle rounded-lg rounded-tl-none flex gap-1 items-center h-10">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleCommentSubmit} className="p-3 sm:p-4 border-t border-border-subtle bg-white flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={handleTyping}
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

        <div className="space-y-6">
          <div className="bg-surface-card border border-border-subtle rounded-lg p-4 sm:p-5 shadow-sm space-y-4">
            <div>
              <p className="text-xs text-text-muted uppercase font-semibold">Solicitante</p>
              <p className="text-sm font-medium text-text-primary">{ticket.createdBy?.name}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted uppercase font-semibold">Responsável</p>
              <p className="text-sm font-medium text-text-primary flex items-center gap-1.5 mt-0.5">
                {ticket.assignedTo ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                    <span className="truncate">{ticket.assignedTo.name}</span>
                  </>
                ) : (
                  <span className="text-text-muted font-normal italic text-xs">Ainda não atribuído</span>
                )}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <div className="bg-surface-card border border-border-subtle rounded-lg p-4 sm:p-5 shadow-sm">
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

      <SolutionModal
        isOpen={isResolveModalOpen}
        onClose={() => setIsResolveModalOpen(false)}
        onConfirm={handleConfirmResolve}
        isLoading={isSubmitting}
        ticket={ticket}
      />

      <ReopenModal
        isOpen={isReopenModalOpen}
        onClose={() => setIsReopenModalOpen(false)}
        onConfirm={handleConfirmReopen}
        isLoading={isSubmitting}
        ticket={ticket}
        targetStatus={reopenTargetStatus}
      />
    </div>
  );
}
