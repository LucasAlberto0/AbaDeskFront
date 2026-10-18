import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Trash2, X } from 'lucide-react';
import * as signalR from '@microsoft/signalr';
import toast from 'react-hot-toast';
import useAuthStore from '../../features/auth/hooks/useAuthStore';
import { 
  getNotifications, 
  deleteNotification, 
  clearAllNotifications 
} from '../../features/notifications/api/notificationService';

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasNewAlerts, setHasNewAlerts] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);
  const hubConnectionRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const fetchNotificationList = async () => {
    setIsLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotificationList();
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const token = sessionStorage.getItem('abadesk_token');
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5017/hubs/ticket", {
        accessTokenFactory: () => token || ''
      })
      .withAutomaticReconnect()
      .build();

    hubConnectionRef.current = connection;

    connection.start()
      .then(() => {
        connection.invoke("JoinUserGroup", user.id).catch(() => {});
      })
      .catch(() => {});

    connection.onreconnected(() => {
      connection.invoke("JoinUserGroup", user.id).catch(() => {});
    });

    connection.on("ReceiveNotification", (notification) => {
      setNotifications(prev => [notification, ...prev.filter(n => n.id !== notification.id)]);
      setHasNewAlerts(true);

      toast((t) => (
        <div 
          onClick={() => {
            toast.dismiss(t.id);
            if (notification.ticketId) {
              navigate(`/tickets/${notification.ticketId}`);
            }
          }}
          className="flex items-start gap-2.5 cursor-pointer max-w-sm py-0.5"
        >
          <div className="w-8 h-8 rounded-lg bg-red-100 text-[#c8101e] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <span className="material-symbols-outlined text-[18px]">notifications_active</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-900 truncate leading-snug">{notification.title}</p>
            <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-tight">{notification.message}</p>
          </div>
        </div>
      ), { 
        position: 'top-right', 
        duration: 4500,
        style: {
          background: '#ffffff',
          border: '1px solid #fecaca',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          padding: '10px 12px',
          borderRadius: '12px'
        }
      });
    });

    return () => {
      if (connection) {
        connection.stop().catch(() => {});
      }
    };
  }, [user?.id]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleOpenDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNewAlerts(false);
      fetchNotificationList();
    }
  };

  const handleItemClick = (notification) => {
    setIsOpen(false);
    if (notification.ticketId) {
      navigate(`/tickets/${notification.ticketId}`);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch {
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllNotifications();
      setNotifications([]);
    } catch {
    }
  };

  const getTimeAgo = (dateString) => {
    const diff = new Date() - new Date(dateString);
    const minutes = Math.floor(diff / 1000 / 60);
    if (minutes < 1) return 'Agora mesmo';
    if (minutes < 60) return `Há ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Há ${hours}h`;
    const days = Math.floor(hours / 24);
    return `Há ${days} dia${days > 1 ? 's' : ''}`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 0:
      case 'StatusChanged':
        return { icon: 'sync_alt', bg: 'bg-purple-100 text-purple-700' };
      case 1:
      case 'NewComment':
        return { icon: 'chat', bg: 'bg-blue-100 text-blue-700' };
      case 2:
      case 'InformationRequested':
        return { icon: 'pending_actions', bg: 'bg-orange-100 text-orange-700' };
      case 3:
      case 'TicketResolved':
        return { icon: 'check_circle', bg: 'bg-emerald-100 text-emerald-700' };
      case 4:
      case 'TicketReopened':
        return { icon: 'history', bg: 'bg-amber-100 text-amber-700' };
      default:
        return { icon: 'notifications', bg: 'bg-slate-100 text-slate-700' };
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleOpenDropdown}
        className="relative p-1.5 rounded-md text-white/90 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer"
        title="Notificações"
      >
        <span className="material-symbols-outlined text-[20px]">notifications</span>
        {hasNewAlerts && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-white rounded-full ring-2 ring-[#c8101e] animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-x-2 top-16 sm:inset-x-auto sm:right-0 sm:mt-2 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden flex flex-col max-h-[calc(100vh-5rem)] sm:max-h-[500px]"
          >
            <div className="p-3 sm:p-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 text-sm sm:text-base">Notificações</h3>
                {notifications.length > 0 && (
                  <span className="bg-slate-200 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    {notifications.length}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {notifications.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="text-xs text-slate-500 hover:text-red-600 font-medium flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
                    title="Limpar todas as notificações"
                  >
                    <Trash2 size={13} />
                    <span>Limpar</span>
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="sm:hidden p-1 text-slate-400 hover:text-slate-600 rounded"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="w-6 h-6 border-2 border-[#c8101e] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                    <Bell size={18} />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-slate-700">Nenhuma notificação</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Você será avisado em tempo real sobre atualizações e respostas nos chamados.
                  </p>
                </div>
              ) : (
                notifications.map((item) => {
                  const iconInfo = getNotificationIcon(item.type);
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className="p-3 sm:p-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors cursor-pointer group relative"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconInfo.bg}`}>
                        <span className="material-symbols-outlined text-[16px]">{iconInfo.icon}</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-semibold text-slate-800 leading-tight truncate">
                            {item.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">
                            {getTimeAgo(item.createdAt)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 leading-snug line-clamp-2">
                          {item.message}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, item.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-600 transition-opacity p-0.5 cursor-pointer shrink-0 self-center"
                        title="Remover notificação"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
