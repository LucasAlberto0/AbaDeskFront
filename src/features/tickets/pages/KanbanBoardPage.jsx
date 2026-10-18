import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { getTickets, startAnalysis, startProgress, waitForUser, resolveTicket, reopenTicket } from '../api/ticketService';
import { getStatusLabel, getCategoryLabel } from '../../../lib/utils';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../auth/hooks/useAuthStore';
import toast from 'react-hot-toast';
import { SolutionModal } from '../../../components/ui/SolutionModal';
import { ReopenModal } from '../../../components/ui/ReopenModal';

const KANBAN_COLUMNS = [
  { id: 'Open', title: 'Aberto' },
  { id: 'InAnalysis', title: 'Em Análise' },
  { id: 'InProgress', title: 'Em Atendimento' },
  { id: 'WaitingUser', title: 'Aguardando Usuário' },
  { id: 'Resolved', title: 'Resolvido' }
];

export default function KanbanBoardPage() {
  const [columns, setColumns] = useState({
    Open: [],
    InAnalysis: [],
    InProgress: [],
    WaitingUser: [],
    Resolved: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [resolveModalData, setResolveModalData] = useState(null);

  const [isReopenModalOpen, setIsReopenModalOpen] = useState(false);
  const [reopenModalData, setReopenModalData] = useState(null);

  const navigate = useNavigate();
  const { user } = useAuthStore();

  const isTechnicianOrAdmin = user?.role === 'Admin' || user?.role === 'Attendant' || user?.role === 1 || user?.role === 2;

  const fetchTickets = async () => {
    try {
      const data = await getTickets({ pageSize: 100 });
      
      const newColumns = {
        Open: [],
        InAnalysis: [],
        InProgress: [],
        WaitingUser: [],
        Resolved: []
      };

      data.items.forEach(ticket => {
        if (newColumns[ticket.status]) {
          newColumns[ticket.status].push(ticket);
        }
      });

      setColumns(newColumns);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 30000);
    return () => clearInterval(interval);
  }, []);

  const isValidTransition = (sourceStatus, destStatus) => {
    if (sourceStatus === 'Open' && (destStatus === 'InAnalysis' || destStatus === 'InProgress')) return true;
    if (sourceStatus === 'InAnalysis' && destStatus === 'InProgress') return true;
    if (sourceStatus === 'InProgress' && (destStatus === 'WaitingUser' || destStatus === 'Resolved')) return true;
    if (sourceStatus === 'WaitingUser' && destStatus === 'InProgress') return true;
    if (sourceStatus === 'Resolved' && (destStatus === 'Open' || destStatus === 'InProgress')) return true;
    return false;
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    if (!isTechnicianOrAdmin) {
      toast.error('Apenas atendentes e administradores podem movimentar o fluxo no Kanban.');
      return;
    }

    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;
    const ticketId = draggableId;

    if (!isValidTransition(sourceStatus, destStatus)) {
      toast.error(`Movimentação não permitida: ${getStatusLabel(sourceStatus)} → ${getStatusLabel(destStatus)}.`);
      return;
    }

    const sourceList = Array.from(columns[sourceStatus]);
    const targetTicket = sourceList[source.index];

    if (!targetTicket) return;

    if (destStatus === 'Resolved') {
      setResolveModalData({
        ticket: targetTicket,
        source,
        destination
      });
      setIsResolveModalOpen(true);
      return;
    }

    if (sourceStatus === 'Resolved') {
      setReopenModalData({
        ticket: targetTicket,
        source,
        destination,
        targetStatus: destStatus
      });
      setIsReopenModalOpen(true);
      return;
    }

    const destList = Array.from(columns[destStatus]);
    const [movedTicket] = sourceList.splice(source.index, 1);
    movedTicket.status = destStatus;

    if (destStatus === 'InProgress' && !movedTicket.assignedToName) {
      movedTicket.assignedToName = user?.name || 'Suporte Técnico';
    }

    destList.splice(destination.index, 0, movedTicket);

    setColumns({
      ...columns,
      [sourceStatus]: sourceList,
      [destStatus]: destList
    });

    try {
      if (destStatus === 'InAnalysis') {
        await startAnalysis(ticketId);
        toast.success(`Chamado #${movedTicket.protocolNumber} entrou em análise técnica.`);
      } else if (destStatus === 'InProgress') {
        await startProgress(ticketId);
        toast.success(`Chamado #${movedTicket.protocolNumber} assumido por você e em atendimento.`);
      } else if (destStatus === 'WaitingUser') {
        await waitForUser(ticketId);
        toast.success(`Chamado #${movedTicket.protocolNumber} aguardando retorno do solicitante.`);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erro ao mover o chamado.';
      toast.error(errorMsg);
      await fetchTickets();
    }
  };

  const handleConfirmResolve = async (solution) => {
    if (!resolveModalData) return;
    const { ticket, source, destination } = resolveModalData;
    setIsSubmittingAction(true);
    try {
      await resolveTicket(ticket.id, solution);

      const sourceList = Array.from(columns[source.droppableId]);
      const destList = Array.from(columns[destination.droppableId]);
      const [movedTicket] = sourceList.splice(source.index, 1);
      movedTicket.status = 'Resolved';
      movedTicket.solution = solution;
      destList.splice(destination.index, 0, movedTicket);

      setColumns({
        ...columns,
        [source.droppableId]: sourceList,
        [destination.droppableId]: destList
      });

      toast.success(`Chamado #${ticket.protocolNumber} resolvido com sucesso!`);
      setIsResolveModalOpen(false);
      setResolveModalData(null);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erro ao resolver o chamado.';
      toast.error(errorMsg);
      await fetchTickets();
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleConfirmReopen = async (justification, targetStatus) => {
    if (!reopenModalData) return;
    const { ticket, source, destination } = reopenModalData;
    setIsSubmittingAction(true);
    try {
      await reopenTicket(ticket.id, justification, targetStatus);

      const sourceList = Array.from(columns[source.droppableId]);
      const destList = Array.from(columns[destination.droppableId]);
      const [movedTicket] = sourceList.splice(source.index, 1);
      movedTicket.status = targetStatus;

      if (targetStatus === 'InProgress' && !movedTicket.assignedToName) {
        movedTicket.assignedToName = user?.name || 'Suporte Técnico';
      }

      destList.splice(destination.index, 0, movedTicket);

      setColumns({
        ...columns,
        [source.droppableId]: sourceList,
        [destination.droppableId]: destList
      });

      toast.success(`Chamado #${ticket.protocolNumber} reaberto com sucesso!`);
      setIsReopenModalOpen(false);
      setReopenModalData(null);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erro ao reabrir o chamado.';
      toast.error(errorMsg);
      await fetchTickets();
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50';
      case 'Medium': return 'text-amber-600 bg-amber-50';
      case 'Low': return 'text-green-600 bg-green-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getTimeAgo = (dateString) => {
    const diff = new Date() - new Date(dateString);
    const hours = Math.floor(diff / 1000 / 60 / 60);
    if (hours < 1) return 'Agora pouco';
    if (hours === 1) return 'Há 1 hora';
    if (hours < 24) return `Há ${hours} horas`;
    const days = Math.floor(hours / 24);
    return `Há ${days} dia${days > 1 ? 's' : ''}`;
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-[#9d0012] border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="flex flex-col min-h-[500px] h-[calc(100vh-8rem)]">
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Kanban de Chamados</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">
            Arraste os cards para atualizar o status respeitando o fluxo de atendimento.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 min-w-max h-full">
            {KANBAN_COLUMNS.map(column => (
              <div key={column.id} className="w-[280px] sm:w-[320px] flex flex-col bg-slate-100/50 rounded-xl border border-slate-200/60 overflow-hidden">
                <div className="p-3 border-b border-slate-200/60 bg-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      column.id === 'Open' ? 'bg-blue-500' :
                      column.id === 'InAnalysis' ? 'bg-purple-500' :
                      column.id === 'InProgress' ? 'bg-amber-500' :
                      column.id === 'WaitingUser' ? 'bg-orange-500' :
                      'bg-emerald-500'
                    }`} />
                    <h2 className="font-semibold text-slate-700 text-sm">{column.title}</h2>
                  </div>
                  <span className="bg-white text-slate-600 text-xs font-semibold px-2 py-0.5 rounded-full shadow-2xs border border-slate-200/50">
                    {columns[column.id].length}
                  </span>
                </div>
                
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div 
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 p-3 overflow-y-auto flex flex-col gap-3 transition-colors ${
                        snapshot.isDraggingOver ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      {columns[column.id].map((ticket, index) => (
                        <Draggable 
                          key={ticket.id} 
                          draggableId={ticket.id} 
                          index={index}
                          isDragDisabled={!isTechnicianOrAdmin}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => navigate(`/tickets/${ticket.id}`)}
                              className={`bg-white p-4 rounded-xl border ${
                                snapshot.isDragging ? 'border-[#9d0012] shadow-xl rotate-1 scale-[1.02]' : 'border-slate-200 shadow-sm hover:border-[#9d0012]/40 hover:shadow-md'
                              } transition-all cursor-pointer group select-none`}
                            >
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                  #{ticket.protocolNumber}
                                </span>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getPriorityColor(ticket.priority)}`}>
                                  {ticket.priority === 'High' ? 'Alta' : ticket.priority === 'Medium' ? 'Média' : 'Baixa'}
                                </span>
                              </div>
                              
                              <h3 className="text-sm font-semibold text-slate-800 leading-snug mb-2.5 group-hover:text-[#9d0012] transition-colors">
                                {ticket.title}
                              </h3>
                              
                              <div className="flex flex-col gap-1.5 text-xs text-slate-500">
                                <div className="flex items-center gap-1.5">
                                  <span className="material-symbols-outlined text-[14px]">person</span>
                                  <span className="truncate">{ticket.createdByName}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                                  <span>{getTimeAgo(ticket.createdAt)}</span>
                                </div>
                              </div>

                              <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-col gap-1.5">
                                {ticket.assignedToName ? (
                                  <div className="flex items-center gap-1.5 text-blue-700 bg-blue-50/80 border border-blue-100 px-2 py-1 rounded-lg font-medium text-[11px]">
                                    <span className="material-symbols-outlined text-[14px] text-blue-600">support_agent</span>
                                    <span className="truncate">Resp: {ticket.assignedToName}</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5 text-slate-400 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg text-[11px]">
                                    <span className="material-symbols-outlined text-[14px] text-slate-400">person_off</span>
                                    <span>Sem responsável</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      <SolutionModal
        isOpen={isResolveModalOpen}
        onClose={() => {
          setIsResolveModalOpen(false);
          setResolveModalData(null);
        }}
        onConfirm={handleConfirmResolve}
        isLoading={isSubmittingAction}
        ticket={resolveModalData?.ticket}
      />

      <ReopenModal
        isOpen={isReopenModalOpen}
        onClose={() => {
          setIsReopenModalOpen(false);
          setReopenModalData(null);
        }}
        onConfirm={handleConfirmReopen}
        isLoading={isSubmittingAction}
        ticket={reopenModalData?.ticket}
        targetStatus={reopenModalData?.targetStatus || 'Open'}
      />
    </div>
  );
}
