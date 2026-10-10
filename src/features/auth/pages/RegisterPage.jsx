import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../hooks/useAuthStore';
import { Eye, EyeOff, Mail, User, ChevronDown, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(0); // 0 = User, 1 = Attendant
  const [jobTitle, setJobTitle] = useState('');
  const [companyUnit, setCompanyUnit] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);

  const companies = [
    { id: 'ABA Infra', name: 'ABA Infra', logo: '/logos/aba-infra.jpg' },
    { id: 'Adonai Química', name: 'Adonai Química', logo: '/logos/adonai-quimica.png' },
    { id: 'Concais', name: 'Concais', logo: '/logos/concais.png' },
    { id: 'Eudmarco', name: 'Eudmarco', logo: '/logos/eudmarco.png' },
    { id: 'FCA Log', name: 'FCA Log', logo: '/logos/fca-log.jpg' },
  ];
  
  const register = useAuthStore((state) => state.register);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await register(name, email, password, role, jobTitle, companyUnit);
      useAuthStore.getState().logout(); // ensure state is clear
      toast.success('Conta criada com sucesso! Redirecionando para o login...', { duration: 3000 });
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao realizar o cadastro. Verifique os dados e tente novamente.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen font-sans antialiased text-slate-800 bg-[#f9fafb] flex flex-col lg:flex-row w-full overflow-hidden">
      
      <section className="hidden lg:flex lg:w-[54%] xl:w-[56%] bg-[#c8101e] relative flex-col justify-between p-8 sm:p-12 lg:p-16 text-white overflow-hidden shadow-2xl z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#c8101e] via-[#b80e1b] to-[#920914] opacity-95"></div>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "28px 28px" }}></div>

        <div className="relative z-10 my-auto py-8 max-w-xl mx-auto flex flex-col items-center text-center">
          <div className="w-64 sm:w-80 md:w-96 mb-6 drop-shadow-md transition-transform duration-500 hover:scale-[1.02]">
            <img alt="Ilustração de Gestão" className="w-full h-auto object-contain pointer-events-none select-none opacity-95" style={{ filter: 'brightness(0) invert(1)' }} src="/assets/illustration.png" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-[2.35rem] font-bold tracking-tight text-white leading-tight">GRUPO ABA INFRA</h1>
          <p className="mt-4 text-base sm:text-lg text-white/90 font-normal leading-relaxed max-w-lg">Crie sua conta e ganhe acesso à nossa plataforma unificada</p>
        </div>

        <div className="relative z-10 text-xs text-white/60 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-white/15 pt-4">
          <span>© 2026 Lucas Alberto. Todos os direitos reservados.</span>
          <span className="text-white/40 hidden sm:inline">•</span>
          <span className="text-white/70 font-medium">Ambiente Corporativo Seguro</span>
        </div>
      </section>

      <section className="w-full lg:w-[46%] xl:w-[44%] flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-14 bg-[#f8fafc]">
        <div className="w-full max-w-md bg-white rounded-2xl p-7 sm:p-10 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.08)] border border-slate-100">
          
          <div className="flex flex-col items-center text-center mb-7">
            <div className="h-10 mb-4 flex items-center justify-center">
              <img alt="Logo ABA Desk" className="h-9 w-auto object-contain" style={{ filter: 'invert(1) contrast(1.15) brightness(0.2)' }} src="/assets/logo-dark.png" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Criar Conta
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Preencha os dados para obter seu acesso
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Perfil de Acesso Solicitado <span className="text-[#c8101e]">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                <div 
                  onClick={() => setRole(0)}
                  className={`relative flex flex-col p-4 cursor-pointer rounded-xl border-2 transition-all ${
                    role === 0 ? 'border-[#c8101e] bg-red-50/30 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <User size={18} className={role === 0 ? 'text-[#c8101e]' : 'text-slate-400'} />
                      <span className={`font-semibold text-[14px] leading-none mt-0.5 ${role === 0 ? 'text-slate-900' : 'text-slate-700'}`}>Usuário</span>
                    </div>
                    <div className={`w-3.5 h-3.5 shrink-0 rounded-full border flex items-center justify-center mt-0.5 ${
                      role === 0 ? 'border-[#c8101e]' : 'border-slate-300'
                    }`}>
                      {role === 0 && <div className="w-1.5 h-1.5 rounded-full bg-[#c8101e]"></div>}
                    </div>
                  </div>
                  <p className="text-[12px] text-slate-500 leading-snug">Abertura e acompanhamento de chamados e serviços prediais.</p>
                </div>

                <div 
                  onClick={() => setRole(1)}
                  className={`relative flex flex-col p-4 cursor-pointer rounded-xl border-2 transition-all ${
                    role === 1 ? 'border-[#c8101e] bg-red-50/30 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <svg className={`w-4.5 h-4.5 ${role === 1 ? 'text-[#c8101e]' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      <span className={`font-semibold text-[14px] leading-none mt-0.5 ${role === 1 ? 'text-slate-900' : 'text-slate-700'}`}>Suporte Técnico</span>
                    </div>
                    <div className={`w-3.5 h-3.5 shrink-0 rounded-full border flex items-center justify-center mt-0.5 ${
                      role === 1 ? 'border-[#c8101e]' : 'border-slate-300'
                    }`}>
                      {role === 1 && <div className="w-1.5 h-1.5 rounded-full bg-[#c8101e]"></div>}
                    </div>
                  </div>
                  <p className="text-[12px] text-slate-500 leading-snug">Triagem, fila de suporte técnico e resolução de incidentes.</p>
                </div>
              </div>
            </div>

            {role === 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="jobTitle">
                    Cargo / Função <span className="text-[#c8101e]">*</span>
                  </label>
                  <input 
                    type="text" 
                    id="jobTitle" 
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="block w-full px-3 py-2 h-10 sm:text-sm border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#c8101e]/30 focus:border-[#c8101e] outline-none transition-colors" 
                    placeholder="Ex: Analista Financeiro" 
                    required={role === 0}
                  />
                </div>
                <div className="relative">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="companyUnit">
                    Empresa / Unidade <span className="text-[#c8101e]">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
                    className="flex w-full items-center justify-between px-3 py-2 h-10 sm:text-sm border border-slate-300 rounded-lg text-slate-900 bg-white focus:ring-2 focus:ring-[#c8101e]/30 focus:border-[#c8101e] outline-none transition-colors"
                  >
                    {companyUnit ? (
                      <div className="flex items-center gap-2">
                        <img src={companies.find(c => c.id === companyUnit)?.logo} alt={companyUnit} className="w-5 h-5 object-contain" />
                        <span>{companyUnit}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400">Selecione a empresa</span>
                    )}
                    <ChevronDown size={16} className={`text-slate-400 transition-transform ${isCompanyDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isCompanyDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 max-h-60 overflow-auto">
                      {companies.map((company) => (
                        <button
                          key={company.id}
                          type="button"
                          onClick={() => {
                            setCompanyUnit(company.id);
                            setIsCompanyDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left hover:bg-slate-50 transition-colors ${companyUnit === company.id ? 'bg-red-50 text-[#c8101e]' : 'text-slate-700'}`}
                        >
                          <img src={company.logo} alt={company.name} className="w-5 h-5 object-contain" />
                          <span className="flex-1 font-medium text-[13px]">{company.name}</span>
                          {companyUnit === company.id && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="name">
                Nome Completo <span className="text-[#c8101e]">*</span>
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User size={16} />
                </div>
                <input 
                  type="text" 
                  id="name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 sm:text-sm border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#c8101e]/30 focus:border-[#c8101e] outline-none transition-colors" 
                  placeholder="Seu nome completo" 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="email">
                E-mail corporativo <span className="text-[#c8101e]">*</span>
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={16} />
                </div>
                <input 
                  type="email" 
                  id="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 sm:text-sm border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#c8101e]/30 focus:border-[#c8101e] outline-none transition-colors" 
                  placeholder="nome@grupoaba.com.br" 
                  autoComplete="off"
                  data-lpignore="true"
                  required 
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider" htmlFor="password">
                  Senha de acesso <span className="text-[#c8101e]">*</span>
                </label>
              </div>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  id="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 sm:text-sm border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#c8101e]/30 focus:border-[#c8101e] outline-none transition-colors" 
                  placeholder="••••••••••••" 
                  autoComplete="new-password"
                  data-lpignore="true"
                  required 
                />
                <button 
                  type="button" 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-[#c8101e] hover:bg-[#a70d18] active:bg-[#8b0c15] shadow-sm hover:shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8101e] disabled:opacity-70"
              >
                {isSubmitting ? 'Cadastrando...' : 'Criar Conta ABA Desk'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            <span>Já possui conta? </span>
            <Link to="/login" className="font-semibold text-[#c8101e] hover:text-[#9c0c16] hover:underline">
              Fazer Login
            </Link>
          </div>
          
        </div>
      </section>

    </div>
  );
}
