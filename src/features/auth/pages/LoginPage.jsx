import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import useAuthStore from '../hooks/useAuthStore';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { api } from '../../../lib/axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      
      toast.success('Login realizado com sucesso!', { 
        duration: 4000,
        style: { background: '#10B981', color: '#fff', fontWeight: '500' }
      });
      
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      const { accessToken, user } = response.data;

      if (user && user.role === 0) user.role = 'User';
      if (user && user.role === 1) user.role = 'Attendant';
      if (user && user.role === 2) user.role = 'Admin';

      sessionStorage.setItem('abadesk_token', accessToken);
      sessionStorage.setItem('abadesk_user', JSON.stringify(user));

      useAuthStore.setState({ user, token: accessToken, isAuthenticated: true, isLoading: false });
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Credenciais inválidas. Verifique seu usuário e senha.');
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
            <img alt="Ilustração de Gestão" className="w-full h-auto object-contain pointer-events-none select-none opacity-95" style={{ filter: 'brightness(0) invert(1)' }} src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbuFZf9UeCR-kOBftoGZWbSDbZ0CxM5jE5rT82KUAtMhs_E4HndLkpR9IDngrz28Z8vJyIO3EON_ETYLl-MFvAoAQsKzVKRMgB0CSkda-cEQg8Ubqm7TZmApsaEFRlQzntLEYgGxIQwVTvAdJ4dV5Gsh8VtR6wUF6BgAPLKnqbIiMbUnr2qhXfwwQ8NhQwyTK8eJpEadKN8rkeSYSnYyJRNHJ0-3lSacStCJwu4z3zGcUN_bAn_zVNiOQUR-eg5JISJA" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-[2.35rem] font-bold tracking-tight text-white leading-tight">GRUPO ABA INFRA</h1>
          <p className="mt-4 text-base sm:text-lg text-white/90 font-normal leading-relaxed max-w-lg">Excelência e agilidade com atendimento personalizado</p>
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
              <img alt="Logo ABA Desk" className="h-9 w-auto object-contain" style={{ filter: 'invert(1) contrast(1.15) brightness(0.2)' }} src="https://lh3.googleusercontent.com/aida-public/AB6AXuDX-Pdr1RjHID0FTyxO_nwLM149Z8UIl5EEArVt43MdpzerdXpYPGX_3H8_PnKvDnk5qEOznljzrPgn8x_dHPsvzkk_H9_AQxlFk7XQr1P4Yer1lYVxal1LvO3A3I5VRLOPFyFf4SFmiIDSNsRtuIEuBB0dx8sHw4UuAZPc24atDmFD414R3o2ipDtUajUCbt39fqmzhOV73gs7Xowk51KuqqR_IfhC9PngoVn8VB_gDgaENBg14Mh6a7uSQEmfX_4qIw" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Acessar Plataforma
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Entre com suas credenciais de acesso corporativo
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="email">
                E-mail corporativo
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
                  placeholder="voce@empresa.com.br" 
                  required 
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider" htmlFor="password">
                  Senha de acesso
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
                  placeholder="••••••••" 
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

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <input id="remember-me" type="checkbox" className="h-4 w-4 rounded border-slate-300 text-[#c8101e] focus:ring-[#c8101e]/40 cursor-pointer" />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-600 select-none cursor-pointer">
                  Lembrar de mim
                </label>
              </div>
              <a href="#" className="text-xs font-semibold text-[#c8101e] hover:text-[#9c0c16] transition-colors hover:underline">
                Esqueceu a senha?
              </a>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-[#c8101e] hover:bg-[#a70d18] active:bg-[#8b0c15] shadow-sm hover:shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8101e] disabled:opacity-70"
              >
                {isSubmitting ? 'Autenticando...' : 'Entrar no ABA Desk'}
                {!isSubmitting && (
                  <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            <span>Não tem uma conta corporativa? </span>
            <Link to="/register" className="font-semibold text-[#c8101e] hover:text-[#9c0c16] hover:underline">
              Cadastre-se
            </Link>
          </div>
          
        </div>
      </section>

    </div>
  );
}
