import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, Plus, PlayCircle } from 'lucide-react';
import { getTestCases, createTestCase, executeTestCase } from '../api/testCaseService';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { formatDate } from '../../../lib/utils';
import useAuthStore from '../../auth/hooks/useAuthStore';

export function TestCasesPanel({ ticketId, onTestUpdated }) {
  const [testCases, setTestCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTestTitle, setNewTestTitle] = useState('');
  const [newTestDesc, setNewTestDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthStore();

  const fetchTests = async () => {
    try {
      const data = await getTestCases(ticketId);
      setTestCases(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, [ticketId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTestTitle.trim()) return;
    setIsSubmitting(true);
    try {
      await createTestCase({ ticketId, title: newTestTitle, description: newTestDesc });
      setNewTestTitle('');
      setNewTestDesc('');
      await fetchTests();
      if (onTestUpdated) onTestUpdated();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExecute = async (id, status) => {
    const notes = window.prompt("Insira observações da execução (Opcional):");
    if (notes === null) return; // cancelou
    
    try {
      await executeTestCase(id, status, notes);
      await fetchTests();
      if (onTestUpdated) onTestUpdated();
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'PASSED': return <CheckCircle2 className="text-status-resolvido" size={20} />;
      case 'FAILED': return <XCircle className="text-status-rejeitado" size={20} />;
      default: return <AlertCircle className="text-status-analise" size={20} />;
    }
  };

  if (isLoading) return <div className="text-sm text-text-muted">Carregando testes...</div>;

  return (
    <div className="space-y-4">
      {user?.role !== 'User' && (
        <form onSubmit={handleCreate} className="bg-surface-dim/30 border border-border-subtle rounded-lg p-4 space-y-3">
          <h4 className="text-sm font-semibold text-text-primary">Adicionar Novo Caso de Teste</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input 
              placeholder="Título do Teste" 
              value={newTestTitle} 
              onChange={e => setNewTestTitle(e.target.value)} 
              required
            />
            <Input 
              placeholder="Critério de Aceitação / Descrição" 
              value={newTestDesc} 
              onChange={e => setNewTestDesc(e.target.value)} 
            />
          </div>
          <div className="flex justify-end">
            <Button size="sm" type="submit" isLoading={isSubmitting} className="gap-2">
              <Plus size={16} /> Adicionar
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {testCases.map((tc) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={tc.id} 
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-border-subtle rounded-lg shadow-sm gap-4"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getStatusIcon(tc.status)}</div>
              <div>
                <h5 className="text-sm font-semibold text-text-primary">{tc.title}</h5>
                <p className="text-xs text-text-secondary mt-1">{tc.description}</p>
                {tc.executedAt && (
                  <p className="text-[10px] text-text-muted mt-2">
                    Executado por {tc.executedByName} em {formatDate(tc.executedAt)}
                    {tc.executionNotes && <span className="block italic mt-0.5">"{tc.executionNotes}"</span>}
                  </p>
                )}
              </div>
            </div>
            
            {user?.role !== 'User' && tc.status !== 'PASSED' && (
              <div className="flex gap-2 shrink-0">
                <Button size="sm" variant="secondary" onClick={() => handleExecute(tc.id, 'FAILED')} className="text-status-rejeitado hover:bg-status-rejeitado-bg hover:border-status-rejeitado/30">
                  Reprovar
                </Button>
                <Button size="sm" onClick={() => handleExecute(tc.id, 'PASSED')} className="bg-status-resolvido hover:bg-green-700">
                  Aprovar
                </Button>
              </div>
            )}
          </motion.div>
        ))}
        {testCases.length === 0 && (
          <div className="text-center p-6 border border-dashed border-border-subtle rounded-lg text-text-muted text-sm">
            Nenhum caso de teste cadastrado para esta demanda.
          </div>
        )}
      </div>
    </div>
  );
}
