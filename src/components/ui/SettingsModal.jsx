import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Save, User, Building2 } from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';
import useAuthStore from '../../features/auth/hooks/useAuthStore';
import toast from 'react-hot-toast';

export function SettingsModal({ isOpen, onClose }) {
  const { user, updateProfile } = useAuthStore();
  const [name, setName] = useState('');
  const [companyUnit, setCompanyUnit] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const companies = [
    { id: 'ABA Infra', name: 'ABA Infra', logo: '/logos/aba-infra.jpg' },
    { id: 'Adonai Química', name: 'Adonai Química', logo: '/logos/adonai-quimica.png' },
    { id: 'Concais', name: 'Concais', logo: '/logos/concais.png' },
    { id: 'Eudmarco', name: 'Eudmarco', logo: '/logos/eudmarco.png' },
    { id: 'FCA Log', name: 'FCA Log', logo: '/logos/fca-log.jpg' },
  ];

  useEffect(() => {
    if (user) {
      setName(user.name || '');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateProfile(name, companyUnit);
      toast.success('Perfil atualizado com sucesso!');
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao atualizar perfil.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md"
          >
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center rounded-t-2xl">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Configurações de Perfil</h3>
                <p className="text-sm text-slate-500">Atualize seus dados pessoais e empresa.</p>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-md hover:bg-slate-200 transition-colors text-slate-500 hover:text-slate-800">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                  <User size={16} /> Nome Completo
                </label>
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  placeholder="Seu nome completo" 
                />
              </div>

              <div className="space-y-1 relative" ref={dropdownRef}>
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                  <Building2 size={16} /> Unidade da Empresa
                </label>
                <div 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-between h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer hover:bg-slate-50 transition-all"
                >
                  {companyUnit ? (
                    <span className="font-medium text-slate-800">{companyUnit}</span>
                  ) : (
                    <span className="text-slate-400">Selecione uma empresa</span>
                  )}
                  <ChevronDown size={16} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                <AnimatePresence>
                  {isDropdownOpen && (
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

              <div className="pt-4 flex gap-3 justify-end border-t border-slate-100">
                <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
                  Cancelar
                </Button>
                <Button type="submit" isLoading={isSubmitting} className="gap-2">
                  <Save size={16} /> Salvar Alterações
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
