import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ChevronDown, 
  UploadCloud, 
  Check, 
  Trash2, 
  Eye, 
  X,
  FileText,
  Layers,
  Flag,
  Building2,
  Building,
  Monitor,
  AlignLeft,
  Image as ImageIcon,
  FileCheck2,
  Send
} from 'lucide-react';
import { createTicket } from '../api/ticketService';
import toast from 'react-hot-toast';

export default function TicketCreatePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [attachmentInfo, setAttachmentInfo] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    companyUnit: '',
    department: '',
    systemName: '',
    category: '',
    priority: '',
    attachmentBase64: ''
  });

  const companyUnits = [
    { id: 'ABA Infra', label: 'ABA Infra', desc: 'Santos/SP e São Paulo', logo: '/img/companies/aba-infra.jpg' },
    { id: 'FCA Log', label: 'FCA Log', desc: 'Santos/SP', logo: '/img/companies/fca-log.jpg' },
    { id: 'Eudmarco', label: 'Eudmarco', desc: 'Santos/SP', logo: '/img/companies/eudmarco.png' },
    { id: 'Adonai Quimica', label: 'Adonai Quimica', desc: 'Ilha Barnabé Santos/SP', logo: '/img/companies/adonai-quimica.png' },
    { id: 'Concais', label: 'Concais', desc: 'Santos/SP', logo: '/img/companies/concais.png' }
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCompanyDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const processFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Selecione um arquivo de imagem válido (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB.');
      return;
    }

    const sizeFormatted = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, attachmentBase64: reader.result }));
      setAttachmentInfo({
        name: file.name,
        size: sizeFormatted
      });
      toast.success('Imagem anexada com sucesso.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleRemoveAttachment = () => {
    setFormData(prev => ({ ...prev, attachmentBase64: '' }));
    setAttachmentInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success('Anexo removido.');
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const completedFields = [
    formData.title.trim(),
    formData.category,
    formData.priority,
    formData.companyUnit,
    formData.department.trim(),
    formData.systemName.trim(),
    formData.description.trim(),
    formData.attachmentBase64
  ].filter(Boolean).length;
  const progressPercent = Math.round((completedFields / 8) * 100);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category) {
      toast.error('Por favor, selecione uma categoria.');
      return;
    }

    if (!formData.priority) {
      toast.error('Por favor, selecione uma prioridade.');
      return;
    }

    if (!formData.companyUnit) {
      toast.error('Por favor, selecione a unidade da empresa.');
      return;
    }

    if (!formData.attachmentBase64) {
      toast.error('O anexo de imagem é obrigatório para registrar o chamado.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createTicket(formData);
      toast.success('Chamado criado com sucesso.');
      navigate(`/tickets/${result.id}`);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erro ao criar chamado. Verifique os campos.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="max-w-3xl mx-auto space-y-6 pb-12 select-none"
    >
      <div className="flex items-center gap-3.5">
        <Link 
          to="/tickets" 
          className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer group shadow-2xs shrink-0"
          title="Voltar aos chamados"
        >
          <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Novo Chamado</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Preencha os dados abaixo para abrir uma solicitação.</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, delay: 0.05 }}
        className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-3 bg-slate-50/70 border-b border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-2 font-medium text-slate-700">
            <FileCheck2 size={15} className="text-[#c8101e]" />
            <span>Preenchimento do chamado</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">{completedFields} de 8 campos</span>
            <span className="text-slate-300">•</span>
            <span className={`font-mono font-bold ${progressPercent === 100 ? 'text-emerald-600' : 'text-[#c8101e]'}`}>
              {progressPercent}%
            </span>
          </div>
        </div>

        <div className="h-1.5 w-full bg-slate-100 relative overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#9d0012] via-[#c8101e] to-rose-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold text-slate-700">
              Título do Problema/Requisição <span className="text-[#c8101e]">*</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
                <FileText size={16} />
              </div>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Ex: Falha ao emitir nota fiscal no faturamento"
                className="w-full h-11 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/40 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#c8101e] focus:ring-4 focus:ring-red-500/10 transition-all shadow-2xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-semibold text-slate-700">
                Categoria <span className="text-[#c8101e]">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
                  <Layers size={16} />
                </div>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className={`w-full h-11 pl-10 pr-9 text-sm bg-slate-50/40 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#c8101e] focus:ring-4 focus:ring-red-500/10 transition-all cursor-pointer shadow-2xs appearance-none ${
                    !formData.category ? 'text-slate-400' : 'text-slate-900 font-medium'
                  }`}
                >
                  <option value="" disabled>Selecione uma categoria...</option>
                  <option value="Bug">Bug / Falha no Sistema</option>
                  <option value="Improvement">Melhoria Operacional</option>
                  <option value="NewFeature">Nova Funcionalidade</option>
                  <option value="Question">Dúvida / Esclarecimento</option>
                  <option value="Access">Solicitação de Acesso</option>
                </select>
                <ChevronDown size={16} className="absolute right-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-semibold text-slate-700">
                Prioridade <span className="text-[#c8101e]">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
                  <Flag size={16} />
                </div>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                  className={`w-full h-11 pl-10 pr-9 text-sm bg-slate-50/40 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#c8101e] focus:ring-4 focus:ring-red-500/10 transition-all cursor-pointer shadow-2xs appearance-none ${
                    !formData.priority ? 'text-slate-400' : 'text-slate-900 font-medium'
                  }`}
                >
                  <option value="" disabled>Selecione a prioridade...</option>
                  <option value="Low">Baixa (impacto reduzido)</option>
                  <option value="Medium">Média (impacto moderado)</option>
                  <option value="High">Alta (impacto crítico/urgente)</option>
                </select>
                <ChevronDown size={16} className="absolute right-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5 relative" ref={dropdownRef}>
              <label className="text-xs sm:text-sm font-semibold text-slate-700">
                Unidade da Empresa <span className="text-[#c8101e]">*</span>
              </label>
              <div
                onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
                className="relative flex items-center h-11 w-full pl-10 pr-9 text-sm bg-slate-50/40 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-xl focus:bg-white focus:outline-none hover:border-slate-300 cursor-pointer transition-all shadow-2xs"
              >
                <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
                  <Building2 size={16} />
                </div>
                {formData.companyUnit ? (
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-5 h-5 rounded bg-white border border-slate-200 p-0.5 flex items-center justify-center shrink-0">
                      <img 
                        src={companyUnits.find(u => u.id === formData.companyUnit)?.logo} 
                        alt="" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="font-medium text-slate-900 truncate">
                      {companyUnits.find(u => u.id === formData.companyUnit)?.label}
                    </span>
                    <span className="text-slate-400 text-xs truncate hidden xs:inline">
                      • {companyUnits.find(u => u.id === formData.companyUnit)?.desc}
                    </span>
                  </div>
                ) : (
                  <span className="text-slate-400">Selecione uma empresa do grupo...</span>
                )}
                <ChevronDown size={16} className={`absolute right-3.5 text-slate-400 transition-transform duration-200 ${isCompanyDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              <AnimatePresence>
                {isCompanyDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.16 }}
                    className="absolute z-50 mt-1 w-full max-h-56 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl py-1 divide-y divide-slate-50"
                  >
                    {companyUnits.map((unit) => (
                      <div
                        key={unit.id}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, companyUnit: unit.id }));
                          setIsCompanyDropdownOpen(false);
                        }}
                        className={`flex items-center gap-3 px-3.5 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                          formData.companyUnit === unit.id ? 'bg-red-50/60' : ''
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden p-0.5">
                          <img 
                            src={unit.logo} 
                            alt={unit.label} 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-xs font-semibold text-slate-900 truncate">{unit.label}</span>
                          <span className="text-[10px] text-slate-500 truncate">{unit.desc}</span>
                        </div>
                        {formData.companyUnit === unit.id && (
                          <Check size={14} className="text-[#c8101e] shrink-0" />
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-semibold text-slate-700">
                Departamento <span className="text-[#c8101e]">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
                  <Building size={16} />
                </div>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Financeiro, Logística, Operações..."
                  className="w-full h-11 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/40 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#c8101e] focus:ring-4 focus:ring-red-500/10 transition-all shadow-2xs"
                />
              </div>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs sm:text-sm font-semibold text-slate-700">
                Nome do Sistema <span className="text-[#c8101e]">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
                  <Monitor size={16} />
                </div>
                <input
                  type="text"
                  name="systemName"
                  value={formData.systemName}
                  onChange={handleChange}
                  required
                  placeholder="Ex: ERP Protheus, WMS, VPN, Portal RH..."
                  className="w-full h-11 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/40 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#c8101e] focus:ring-4 focus:ring-red-500/10 transition-all shadow-2xs"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold text-slate-700">
              Descrição Detalhada <span className="text-[#c8101e]">*</span>
            </label>
            <div className="relative rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/40 focus-within:bg-white focus-within:border-[#c8101e] focus-within:ring-4 focus-within:ring-red-500/10 transition-all shadow-2xs">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Descreva o passo a passo para reproduzir o problema, mensagens exibidas na tela e o impacto na sua rotina..."
                className="w-full p-3.5 text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none resize-none leading-relaxed"
              />
              <div className="flex items-center justify-between px-3.5 py-2 border-t border-slate-100 text-[11px] text-slate-400 bg-white/60 rounded-b-xl">
                <span className="flex items-center gap-1.5">
                  <AlignLeft size={13} className="text-slate-400" />
                  Forneça detalhes para agilizar o diagnóstico
                </span>
                <span>{formData.description.length} caracteres</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-1">
              Anexo de Imagem (Obrigatório) <span className="text-[#c8101e]">*</span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <AnimatePresence mode="wait">
              {!formData.attachmentBase64 ? (
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5 ${
                    isDragging
                      ? 'border-[#c8101e] bg-red-50/40 scale-[1.01]'
                      : 'border-slate-200 hover:border-[#c8101e] bg-slate-50/50 hover:bg-red-50/15'
                  }`}
                >
                  <motion.div 
                    animate={isDragging ? { y: -3, scale: 1.08 } : { y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#c8101e] shadow-xs"
                  >
                    <UploadCloud size={24} />
                  </motion.div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Arraste e solte uma captura de tela aqui ou{' '}
                      <span className="text-[#9d0012] underline decoration-red-300 underline-offset-2">procure no dispositivo</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Formatos aceitos: PNG, JPG ou WEBP (tamanho máximo de 5MB)
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="attachment-preview"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/80 flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div 
                      onClick={() => setIsPreviewModalOpen(true)}
                      className="relative w-14 h-14 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0 cursor-pointer group shadow-2xs"
                    >
                      <img
                        src={formData.attachmentBase64}
                        alt="Anexo"
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                        <Eye size={16} />
                      </div>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-xs bg-emerald-500 shrink-0" />
                        <span className="text-xs font-bold text-slate-800 truncate">
                          {attachmentInfo?.name || 'Evidência anexada'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 mt-0.5">
                        {attachmentInfo?.size || 'Pronto para envio'} • Imagem pronta para o chamado
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsPreviewModalOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Eye size={14} />
                      <span className="hidden xs:inline">Visualizar</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveAttachment}
                      className="p-1.5 rounded-lg bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors shadow-2xs cursor-pointer"
                      title="Remover anexo"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-5 border-t border-slate-100">
            <Link 
              to="/tickets"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium text-sm text-center transition-colors cursor-pointer"
            >
              Cancelar
            </Link>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-[#9d0012] to-[#c8101e] hover:from-[#880010] hover:to-[#b00d19] text-white font-semibold text-sm shadow-md shadow-red-950/15 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Registrando Chamado...</span>
                </>
              ) : (
                <>
                  <Send size={15} />
                  <span>Registrar Chamado</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>

      <AnimatePresence>
        {isPreviewModalOpen && formData.attachmentBase64 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsPreviewModalOpen(false)}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl max-h-[85vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
                <span className="text-xs font-medium truncate max-w-md">
                  {attachmentInfo?.name || 'Pré-visualização do Anexo'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>
              <div className="p-2 bg-slate-950 flex items-center justify-center overflow-auto max-h-[75vh]">
                <img 
                  src={formData.attachmentBase64} 
                  alt="Anexo ampliado" 
                  className="max-w-full max-h-[70vh] object-contain rounded-lg"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
