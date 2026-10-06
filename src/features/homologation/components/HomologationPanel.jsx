import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { submitHomologation } from '../api/homologationService';
import { Button } from '../../../components/ui/Button';

export function HomologationPanel({ ticketId, onHomologationDone }) {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (isApproved) => {
    if (!isApproved && !comment.trim()) {
      alert("Para reprovar, é obrigatório informar o motivo na observação.");
      return;
    }
    if (!window.confirm(`Deseja realmente ${isApproved ? 'APROVAR' : 'REPROVAR'} a entrega?`)) return;

    setIsSubmitting(true);
    try {
      await submitHomologation(ticketId, isApproved, comment);
      if (onHomologationDone) onHomologationDone();
    } catch (error) {
      console.error(error);
      alert('Erro ao enviar homologação.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-status-homologacao-bg border border-status-homologacao/30 rounded-lg p-6 shadow-sm space-y-4"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-status-homologacao/10 text-status-homologacao flex items-center justify-center shrink-0">
          <CheckCircle size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-text-primary">Avaliação Final (Homologação)</h3>
          <p className="text-sm text-text-secondary mt-1">
            Esta demanda foi enviada para sua aprovação. Por favor, valide a entrega e registre seu parecer.
          </p>
        </div>
      </div>

      <div className="space-y-2 mt-4">
        <label className="text-sm font-semibold text-text-secondary">Observações (Obrigatório em caso de recusa)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Descreva se encontrou algum problema ou deixe um comentário final..."
          className="flex w-full rounded-[4px] border border-border-subtle bg-white px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-status-homologacao resize-none"
          rows={3}
          disabled={isSubmitting}
        />
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button 
          variant="secondary" 
          onClick={() => handleSubmit(false)} 
          isLoading={isSubmitting}
          className="text-status-rejeitado hover:bg-status-rejeitado-bg border-status-rejeitado/20 gap-2"
        >
          <XCircle size={18} /> Recusar Entrega
        </Button>
        <Button 
          onClick={() => handleSubmit(true)} 
          isLoading={isSubmitting}
          className="bg-status-resolvido hover:bg-green-700 text-white gap-2"
        >
          <CheckCircle size={18} /> Aprovar e Finalizar
        </Button>
      </div>
    </motion.div>
  );
}
