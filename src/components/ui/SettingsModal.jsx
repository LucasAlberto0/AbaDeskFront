import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Save, User, Building2, Briefcase, Info } from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';
import { ConfirmModal } from './ConfirmModal';
import useAuthStore from '../../features/auth/hooks/useAuthStore';
import toast from 'react-hot-toast';

export function SettingsModal({ isOpen, onClose }) {
  const { user, updateProfile } = useAuthStore();
  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [companyUnit, setCompanyUnit] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const userRoleStr = user?.role === 0 ? 'User' : user?.role === 1 ? 'Attendant' : user?.role === 2 ? 'Admin' : user?.role;
  const isAdmin = userRoleStr === 'Admin';
  const isAttendant = userRoleStr === 'Attendant';

  const companies = [
    { id: 'ABA Infra', name: 'ABA Infra', logo: '/img/companies/aba-infra.jpg' },
    { id: 'Adonai Química', name: 'Adonai Química', logo: '/img/companies/adonai-quimica.png' },
    { id: 'Concais', name: 'Concais', logo: '/img/companies/concais.png' },
    { id: 'Eudmarco', name: 'Eudmarco', logo: '/img/companies/eudmarco.png' },
    { id: 'FCA Log', name: 'FCA Log', logo: '/img/companies/fca-log.jpg' },
  ];

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setJobTitle(user.jobTitle || '');
      setCompanyUnit(user.companyUnit || '');
    }
  }, [user, isOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAdmin) return;
    if (!name.trim()) {
      toast.error('O nome completo é obrigatório.');
      return;
    }
    setIsConfirmOpen(true);
  };

  const handleConfirmSave = async () => {
    if (isAdmin) return;
    setIsSubmitting(true);
    try {
      const finalJobTitle = isAttendant ? user?.jobTitle : jobTitle;
      await updateProfile(name, companyUnit, finalJobTitle);
      toast.success('Perfil atualizado com sucesso!');
      setIsConfirmOpen(false);
      onClose();
    } catch (error) {
      console.error(error);
      const errorMsg = error?.response?.data?.message || 'Erro ao atualizar perfil.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center rounded-t-2xl">
                <div>
                  <h3 className="font-bold text-slate-800 text-base sm:text-lg">Configurações de Perfil</h3>
                  <p className="text-xs sm:text-sm text-slate-500">Atualize seus dados pessoais e empresa.</p>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-md hover:bg-slate-200 transition-colors text-slate-500 hover:text-slate-800 shrink-0 cursor-pointer">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                {isAdmin && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-800 text-xs flex items-center gap-2.5">
                    <Info size={16} className="text-amber-600 shrink-0" />
                    <span>Contas de Administrador possuem dados gerenciados centralmente e não podem ser alterados.</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                    <User size={16} /> Nome Completo
                  </label>
                  <Input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                    disabled={isAdmin}
                    className={isAdmin ? "bg-slate-50 text-slate-500 cursor-not-allowed border-slate-200" : ""}
                    placeholder="Seu nome completo" 
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                      <Briefcase size={16} /> Cargo
                    </label>
                    {isAttendant && (
                      <span className="text-[11px] font-medium text-slate-400">
                        Fixo para Suporte Técnico
                      </span>
                    )}
                  </div>
                  <Input 
                    value={jobTitle} 
                    onChange={(e) => setJobTitle(e.target.value)} 
                    disabled={isAdmin || isAttendant}
                    className={isAdmin || isAttendant ? "bg-slate-50 text-slate-500 cursor-not-allowed border-slate-200" : ""}
                    placeholder="Seu cargo na empresa (ex: Analista de TI)" 
                  />
                </div>

                <div className="space-y-1 relative" ref={dropdownRef}>
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                    <Building2 size={16} /> Unidade da Empresa
                  </label>
                  <div 
                    onClick={() => {
                      if (!isAdmin) setIsDropdownOpen(!isDropdownOpen);
                    }}
                    className={`flex items-center justify-between h-11 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm transition-all ${
                      isAdmin 
                        ? 'bg-slate-50 text-slate-500 cursor-not-allowed border-slate-200' 
                        : 'bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer hover:bg-slate-50'
                    }`}
                  >
                    {companyUnit ? (
                      <span className="font-medium truncate pr-2">{companyUnit}</span>
                    ) : (
                      <span className="text-slate-400">Selecione uma empresa</span>
                    )}
                    {!isAdmin && (
                      <ChevronDown size={16} className={`text-slate-400 shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    )}
                  </div>

                  <AnimatePresence>
                    {!isAdmin && isDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute z-50 mt-1 w-full max-h-56 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-xl py-1"
                      >
                        {companies.map((company) => (
                          <div
                            key={company.id}
                            onClick={() => {
                              setCompanyUnit(company.id);
                              setIsDropdownOpen(false);
                            }}
                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 cursor-pointer transition-colors"
                          >
                            <div className="w-8 h-8 rounded bg-white border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                              <img 
                                src={company.logo} 
                                alt={company.name} 
                                className="w-full h-full object-contain p-1"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <div className="hidden w-full h-full items-center justify-center text-slate-400 text-[10px] font-bold">
                                {company.name.substring(0, 2).toUpperCase()}
                              </div>
                            </div>
                            <span className="text-sm font-medium text-slate-700">{company.name}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="pt-4 flex flex-col-reverse xs:flex-row gap-2 sm:gap-3 justify-end border-t border-slate-100">
                  {isAdmin ? (
                    <Button type="button" onClick={onClose} className="w-full xs:w-auto">
                      Fechar
                    </Button>
                  ) : (
                    <>
                      <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting} className="w-full xs:w-auto">
                        Cancelar
                      </Button>
                      <Button type="submit" isLoading={isSubmitting} className="gap-2 w-full xs:w-auto">
                        <Save size={16} /> Salvar Alterações
                      </Button>
                    </>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmSave}
        title="Confirmar alterações"
        message="Deseja salvar as alterações realizadas no seu perfil?"
        confirmText="Salvar"
        cancelText="Voltar"
        isDestructive={false}
        isLoading={isSubmitting}
      />
    </>
  );
}
