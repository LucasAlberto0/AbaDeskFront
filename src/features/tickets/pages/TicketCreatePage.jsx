import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { createTicket } from '../api/ticketService';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

export default function TicketCreatePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    companyUnit: '',
    department: '',
    systemName: '',
    category: 'Bug',
    priority: 'Medium'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await createTicket(formData);
      navigate(`/tickets/${result.id}`);
    } catch (error) {
      console.error(error);
      alert('Erro ao criar chamado. Verifique os campos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/tickets" className="text-text-muted hover:text-primary transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Novo Chamado</h1>
          <p className="text-text-secondary mt-1">Preencha os dados abaixo para abrir uma solicitação.</p>
        </div>
      </div>

      <div className="bg-surface-card border border-border-subtle rounded-lg p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-secondary">Título do Problema/Requisição</label>
            <Input name="title" value={formData.title} onChange={handleChange} required placeholder="Ex: Falha ao emitir nota fiscal" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-secondary">Categoria</label>
              <select name="category" value={formData.category} onChange={handleChange} className="flex h-10 w-full rounded-[4px] border border-border-subtle bg-white px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary">
                <option value="Bug">Bug / Falha</option>
                <option value="Improvement">Melhoria</option>
                <option value="NewFeature">Nova Funcionalidade</option>
                <option value="Question">Dúvida</option>
                <option value="Access">Acesso</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-secondary">Prioridade</label>
              <select name="priority" value={formData.priority} onChange={handleChange} className="flex h-10 w-full rounded-[4px] border border-border-subtle bg-white px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary">
                <option value="Low">Baixa</option>
                <option value="Medium">Média</option>
                <option value="High">Alta</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-secondary">Unidade da Empresa</label>
              <Input name="companyUnit" value={formData.companyUnit} onChange={handleChange} required placeholder="Ex: Matriz SP" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-secondary">Departamento</label>
              <Input name="department" value={formData.department} onChange={handleChange} required placeholder="Ex: Financeiro" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-text-secondary">Nome do Sistema</label>
              <Input name="systemName" value={formData.systemName} onChange={handleChange} required placeholder="Ex: ERP Protheus" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-secondary">Descrição Detalhada</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              required 
              rows={6}
              className="flex w-full rounded-[4px] border border-border-subtle bg-white px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary resize-none"
              placeholder="Descreva o passo a passo para reproduzir o problema ou o detalhamento da sua necessidade..."
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-border-subtle">
            <Button type="submit" isLoading={isSubmitting}>
              Registrar Chamado
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
