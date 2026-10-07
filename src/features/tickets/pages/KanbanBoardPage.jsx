import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { getTickets, startAnalysis, startProgress, waitForUser, resolveTicket } from '../api/ticketService';
import { getStatusLabel, getCategoryLabel } from '../../../lib/utils';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../auth/hooks/useAuthStore';

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
  const navigate = useNavigate();
  const { user } = useAuthStore();

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

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;
    const ticketId = draggableId;

    const isValidTransition = () => {
      if (sourceStatus === 'Open' && destStatus === 'InAnalysis') return true;
      if (sourceStatus === 'InAnalysis' && destStatus === 'InProgress') return true;
      if (sourceStatus === 'InProgress' && destStatus === 'WaitingUser') return true;
      if (sourceStatus === 'WaitingUser' && destStatus === 'InProgress') return true;
      if (sourceStatus === 'InProgress' && destStatus === 'Resolved') return true;
      return false;
    };

    if (!isValidTransition()) {
      alert(`Movimentação inválida: ${getStatusLabel(sourceStatus)} → ${getStatusLabel(destStatus)}`);
      return;
    }

    const sourceList = Array.from(columns[sourceStatus]);
    const destList = Array.from(columns[destStatus]);
    
    const [movedTicket] = sourceList.splice(source.index, 1);
    movedTicket.status = destStatus;
    destList.splice(destination.index, 0, movedTicket);

    setColumns({
      ...columns,
      [sourceStatus]: sourceList,
      [destStatus]: destList
    });

    try {
      if (destStatus === 'InAnalysis') await startAnalysis(ticketId);
      else if (destStatus === 'InProgress') await startProgress(ticketId);
      else if (destStatus === 'WaitingUser') await waitForUser(ticketId);
      else if (destStatus === 'Resolved') await resolveTicket(ticketId);
      
    } catch (error) {
      alert('Erro ao mover o chamado: ' + (error.response?.data?.message || error.message));
      fetchTickets();
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
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Kanban de Chamados</h1>
          <p className="text-sm text-slate-500 mt-1">Arraste os cards para atualizar o status.</p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 min-w-max h-full">
            {KANBAN_COLUMNS.map(column => (
              <div key={column.id} className="w-80 flex flex-col bg-slate-100/50 rounded-xl border border-slate-200/60 overflow-hidden">
                <div className="p-3 border-b border-slate-200/60 bg-slate-100 flex items-center justify-between">
                  <h2 className="font-semibold text-slate-700 text-sm">{column.title}</h2>
                  <span className="bg-white text-slate-500 text-xs font-medium px-2 py-0.5 rounded-full shadow-sm">
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
                        <Draggable key={ticket.id} draggableId={ticket.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => navigate(`/tickets/${ticket.id}`)}
                              className={`bg-white p-4 rounded-xl border ${
                                snapshot.isDragging ? 'border-[#9d0012] shadow-lg rotate-2' : 'border-slate-200 shadow-sm hover:border-[#9d0012]/30 hover:shadow-md'
                              } transition-all cursor-pointer group`}
                            >
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                  #{ticket.protocolNumber}
                                </span>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getPriorityColor(ticket.priority)}`}>
                                  {ticket.priority === 'High' ? 'Alta' : ticket.priority === 'Medium' ? 'Média' : 'Baixa'}
                                </span>
                              </div>
                              
                              <h3 className="text-sm font-semibold text-slate-800 leading-snug mb-3 group-hover:text-[#9d0012] transition-colors">
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
    </div>
  );
}
