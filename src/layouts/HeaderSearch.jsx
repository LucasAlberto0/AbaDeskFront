import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getTickets } from '../features/tickets/api/ticketService';
import { translateStatus, translateCategory } from '../lib/utils';

export function HeaderSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) && !inputRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsLoading(true);
        try {
          const res = await getTickets({ search: query, pageSize: 5 });
          setResults(res.items || []);
          setIsOpen(true);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        if (query.length === 0) setIsOpen(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (id) => {
    navigate(`/tickets/${id}`);
    setIsOpen(false);
    setQuery('');
    inputRef.current?.blur();
  };

  const containerVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95, transformOrigin: 'top center' },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 0.5,
        staggerChildren: 0.05
      }
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="relative w-full max-w-md min-w-0 flex-1 hidden sm:block">
      <span className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[17px] transition-colors ${isOpen || query ? 'text-slate-400 z-50' : 'text-white/70'}`}>
        search
      </span>
      <input 
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          if (query.trim().length >= 2 || results.length > 0) setIsOpen(true);
        }}
        className={`w-full h-9 pl-9 pr-10 sm:pr-12 rounded-lg text-[13px] transition-all duration-300 focus:outline-none ${
          isOpen || query ? 'bg-white text-slate-900 border-white shadow-lg placeholder:text-slate-400 relative z-50' : 'bg-white/15 border border-white/20 text-white placeholder:text-white/70'
        }`} 
        placeholder="Buscar chamados, protocolos..." 
        type="text" 
      />
      
      {!isOpen && !query && (
        <kbd className="hidden md:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-white/80 font-mono bg-white/10 border border-white/15 px-1.5 py-0.5 rounded pointer-events-none">
          ⌘K
        </kbd>
      )}

      {isLoading && (
        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[16px] animate-spin z-50">
          progress_activity
        </span>
      )}

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-[1px] z-40" />
          <AnimatePresence>
            <motion.div 
              ref={dropdownRef}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50"
            >
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Resultados
                </div>
                
                {results.length === 0 && !isLoading ? (
                  <motion.div variants={itemVariants} className="p-4 text-center text-sm text-slate-500">
                    Nenhum chamado encontrado para "{query}"
                  </motion.div>
                ) : (
                  <div className="flex flex-col gap-1">
                    {results.map(ticket => {
                      const status = translateStatus(ticket.status);
                      const category = translateCategory(ticket.category);
                      
                      return (
                        <motion.div
                          key={ticket.id}
                          variants={itemVariants}
                          onClick={() => handleSelect(ticket.id)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer group transition-colors"
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${status.color.replace('text-', 'bg-').replace('600', '100')} ${status.color}`}>
                            <span className="material-symbols-outlined text-[18px]">{status.icon}</span>
                          </div>
                          <div className="flex flex-col min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2 mb-0.5">
                              <span className="text-[11px] font-mono font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                #{ticket.protocolNumber}
                              </span>
                              <span className="text-[10px] text-slate-400 whitespace-nowrap">
                                {new Date(ticket.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-slate-800 truncate group-hover:text-[#c8101e] transition-colors">
                              {ticket.title}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-slate-500 truncate flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">person</span>
                                {ticket.createdByName}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              {results.length > 0 && (
                <div className="bg-slate-50 border-t border-slate-100 p-3 text-center">
                  <button onClick={() => {
                      setIsOpen(false);
                      navigate('/tickets', { state: { search: query } });
                    }} 
                    className="text-xs font-medium text-[#c8101e] hover:text-[#9d0012] transition-colors flex items-center justify-center gap-1 w-full"
                  >
                    Ver todos os resultados
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
