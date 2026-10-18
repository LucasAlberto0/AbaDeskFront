import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';

export function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirmar', 
  cancelText = 'Cancelar', 
  isDestructive = true, 
  isLoading = false 
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
          >
            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 sm:mb-2">{title}</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{message}</p>
            </div>
            <div className="px-4 py-3 sm:px-6 sm:py-4 bg-slate-50 border-t border-slate-100 flex flex-col-reverse xs:flex-row justify-end gap-2 sm:gap-3">
              <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading} className="w-full xs:w-auto">
                {cancelText}
              </Button>
              <Button 
                type="button" 
                onClick={onConfirm} 
                isLoading={isLoading}
                className={`w-full xs:w-auto ${isDestructive ? 'bg-red-600 hover:bg-red-700 text-white border-none' : ''}`}
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
