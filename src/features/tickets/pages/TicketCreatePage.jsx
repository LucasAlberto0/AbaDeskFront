import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';
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

  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const companyUnits = [
    { id: 'ABA Infra', label: 'ABA Infra', desc: 'Santos/SP e São Paulo', logo: '/logos/aba-infra.jpg' },
    { id: 'FCA Log', label: 'FCA Log', desc: 'Santos/SP', logo: '/logos/fca-log.jpg' },
    { id: 'Eudmarco', label: 'Eudmarco', desc: 'Santos/SP', logo: '/logos/eudmarco.png' },
    { id: 'Adonai Quimica', label: 'Adonai Quimica', desc: 'Ilha Barnabé Santos/SP', logo: '/logos/adonai-quimica.png' },
    { id: 'Concais', label: 'Concais', desc: 'Santos/SP', logo: '/logos/concais.png' }
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCompanyDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
            <div className="space-y-2 relative" ref={dropdownRef}>
              <label className="text-sm font-semibold text-text-secondary">Unidade da Empresa</label>
              
              <div 
                onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
                className="flex items-center justify-between h-10 w-full rounded-[4px] border border-border-subtle bg-white px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary cursor-pointer hover:bg-slate-50 transition-colors"
              >
                {formData.companyUnit ? (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{companyUnits.find(u => u.id === formData.companyUnit)?.label}</span>
                    <span className="text-slate-500 text-xs truncate max-w-[120px]">{companyUnits.find(u => u.id === formData.companyUnit)?.desc}</span>
                  </div>
                ) : (
                  <span className="text-slate-400">Selecione uma empresa</span>
                )}
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${isCompanyDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {isCompanyDropdownOpen && (
                <div className="absolute z-50 mt-1 w-full max-h-64 overflow-y-auto bg-white border border-border-subtle rounded-lg shadow-lg py-1">
                  {companyUnits.map((unit) => (
                    <div
                      key={unit.id}
                      onClick={() => {
                        setFormData({ ...formData, companyUnit: unit.id });
                        setIsCompanyDropdownOpen(false);
                      }}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-red-50 cursor-pointer transition-colors"
                    >
                      <div className="w-8 h-8 rounded bg-white border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                        <img 
                          src={unit.logo} 
                          alt={unit.label} 
                          className="w-full h-full object-contain p-1"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="hidden w-full h-full items-center justify-center text-slate-400 text-[10px] font-bold">
                          {unit.label.substring(0, 2).toUpperCase()}
                        </div>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-slate-900 truncate">{unit.label}</span>
                        <span className="text-[11px] text-slate-500 truncate">{unit.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
