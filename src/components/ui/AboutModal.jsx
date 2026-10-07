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
            <div className="p-8 md:p-10 space-y-10 overflow-y-auto max-h-[65vh] bg-white">
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="text-lg text-slate-600 leading-relaxed font-medium"
              >
                O AbaDesk foi desenhado para revolucionar a comunicação entre clientes e equipe técnica, garantindo que nenhuma solicitação seja perdida em um fluxo moderno, colaborativo e transparente.
              </motion.p>

              <div className="space-y-8">
                <motion.div 
                  initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                  className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-1 before:bg-[#c8101e] before:rounded-full"
                >
                  <h3 className="text-xl font-bold text-slate-800 mb-2 tracking-tight">Para Usuários Finais</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Um canal direto e sem burocracias. Abra chamados para reportar bugs, solicitar melhorias ou tirar dúvidas. Acompanhe cada etapa do seu atendimento em tempo real e interaja diretamente com a equipe responsável.
                  </p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                  className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-1 before:bg-slate-800 before:rounded-full"
                >
                  <h3 className="text-xl font-bold text-slate-800 mb-2 tracking-tight">Para a Equipe de Suporte</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Produtividade em foco. Analise demandas através de listas detalhadas ou pelo painel visual Kanban. Atribua prioridades, registre o andamento técnico e movimente os tickets pelos estágios vitais do fluxo operacional.
                  </p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                  className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-1 before:bg-slate-300 before:rounded-full"
                >
                  <h3 className="text-xl font-bold text-slate-800 mb-2 tracking-tight">Administração e Controle</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Gestão centralizada. Administradores possuem uma visão tática para gerenciar permissões de acesso (Suporte, Admin, Usuário comum), além de supervisionar métricas vitais e gargalos em todos os tickets ativos.
                  </p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                  className="bg-slate-50/50 rounded-2xl p-6 mt-4 border border-slate-100"
                >
                  <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#c8101e] text-[20px]">sync</span>
                    Fluxo de Trabalho Estruturado
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-5">
                    O sistema garante o cumprimento das regras de negócio guiando os chamados por etapas claras, sequenciais e imutáveis:
                  </p>
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs font-semibold text-slate-600">
                    <span className="px-4 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm hover:border-[#c8101e]/30 transition-colors cursor-default">Novo</span>
                    <span className="material-symbols-outlined text-slate-300 text-[14px]">arrow_forward_ios</span>
                    <span className="px-4 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm hover:border-[#c8101e]/30 transition-colors cursor-default">Análise</span>
                    <span className="material-symbols-outlined text-slate-300 text-[14px]">arrow_forward_ios</span>
                    <span className="px-4 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm hover:border-[#c8101e]/30 transition-colors cursor-default">Progresso</span>
                    <span className="material-symbols-outlined text-slate-300 text-[14px]">arrow_forward_ios</span>
                    <span className="px-4 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm hover:border-[#c8101e]/30 transition-colors cursor-default">Resolvido</span>
                  </div>
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
