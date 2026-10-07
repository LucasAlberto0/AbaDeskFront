import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function AboutModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col"
          >
            {/* Header com fundo de marca */}
            <div className="relative bg-[#c8101e] p-6 text-white overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#c8101e] via-[#b80e1b] to-[#920914] opacity-95"></div>
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "24px 24px" }}></div>
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Bem-vindo ao AbaDesk</h2>
                  <p className="text-white/80 mt-1 text-sm font-medium">Sua central inteligente de atendimento</p>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white/80 hover:text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            </div>

            {/* Conteúdo com scroll */}
            <div className="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[60vh] bg-slate-50">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                  className="bg-white p-5 rounded-xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined">person</span>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Para Usuários</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Abra chamados para reportar bugs, solicitar melhorias ou tirar dúvidas. Acompanhe o status das suas solicitações e interaja diretamente com a equipe técnica.
                  </p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                  className="bg-white p-5 rounded-xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                >
                  <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined">support_agent</span>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Para o Suporte</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Analise os chamados através do modo lista ou Kanban. Atribua prioridades, responda às solicitações e movimente os tickets pelos estágios de atendimento.
                  </p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                  className="bg-white p-5 rounded-xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined">shield_person</span>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Para Administradores</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Tenha o controle total. Gerencie os usuários da plataforma, crie novos acessos (Suporte Técnico, Admins e Usuários), além de supervisionar todos os tickets.
                  </p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                  className="bg-white p-5 rounded-xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                >
                  <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined">account_tree</span>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Fluxo Dinâmico</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    O ciclo de vida do chamado vai de <span className="font-semibold text-slate-800">Aberto</span>, para <span className="font-semibold text-slate-800">Em Análise</span>, <span className="font-semibold text-slate-800">Em Progresso</span> e, finalmente, <span className="font-semibold text-slate-800">Resolvido</span>. Tudo com alertas visuais.
                  </p>
                </motion.div>

              </div>
            </div>

            {/* Footer */}
            <div className="p-5 bg-white border-t border-slate-100 flex justify-end">
              <button 
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors text-sm shadow-md"
              >
                Entendi, vamos lá!
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
