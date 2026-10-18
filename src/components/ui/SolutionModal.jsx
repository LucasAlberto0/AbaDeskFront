import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';
import { Button } from './Button';

export function SolutionModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isLoading = false,
  ticket = null
}) {
  const [solution, setSolution] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSolution('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!solution.trim()) {
      setError('Por favor, informe a descrição da solução aplicada.');
      return;
    }
    if (solution.trim().length < 5) {
      setError('A descrição da solução deve ter pelo menos 5 caracteres.');
      return;
    }
    onConfirm(solution.trim());
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100"
          >
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-tight">Registrar Solução do Chamado</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Descreva a resolução técnica aplicada para finalizar o atendimento.</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={onClose} 
                disabled={isLoading}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {ticket && (
              <div className="px-4 py-3 sm:px-6 bg-slate-50/50 border-b border-slate-100/80 flex items-center gap-2 text-xs">
                <span className="font-mono font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                  #{ticket.protocolNumber}
                </span>
                <span className="font-medium text-slate-700 truncate">
                  {ticket.title}
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="p-4 sm:p-6 space-y-3">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                    Solução Aplicada <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={solution}
                    onChange={(e) => {
                      setSolution(e.target.value);
                      if (error) setError('');
                    }}
                    disabled={isLoading}
                    autoFocus
                    placeholder="Explique os procedimentos e a solução técnica realizada para solucionar o chamado..."
                    className={`w-full rounded-xl border p-3 text-xs sm:text-sm text-slate-800 transition-colors focus:outline-none resize-none ${
                      error ? 'border-red-400 focus:border-red-500 bg-red-50/20' : 'border-slate-200 focus:border-[#9d0012] bg-white'
                    }`}
                  />
                  <div className="flex justify-between items-center mt-1 text-[11px]">
                    <span className={error ? 'text-red-500 font-medium' : 'text-slate-400'}>
                      {error || 'Mínimo de 5 caracteres.'}
                    </span>
                    <span className="text-slate-400">
                      {solution.length} caracteres
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 sm:px-6 sm:py-4 bg-slate-50 border-t border-slate-100 flex flex-col-reverse xs:flex-row justify-end gap-2 sm:gap-3">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={onClose} 
                  disabled={isLoading} 
                  className="w-full xs:w-auto"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  isLoading={isLoading}
                  className="w-full xs:w-auto bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-sm"
                >
                  Concluir e Resolver
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
