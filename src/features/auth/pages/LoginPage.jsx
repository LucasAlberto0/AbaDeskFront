import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
    <div className="h-[100dvh] min-h-[100dvh] font-sans antialiased text-slate-800 bg-[#f9fafb] flex flex-col lg:flex-row w-full overflow-y-auto lg:overflow-hidden">

      <section className="hidden lg:flex lg:w-[54%] xl:w-[56%] bg-[#c8101e] relative flex-col justify-between p-8 sm:p-12 lg:p-16 text-white overflow-hidden shadow-2xl z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#c8101e] via-[#b80e1b] to-[#920914] opacity-95"></div>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "28px 28px" }}></div>

        <div className="relative z-10 my-auto py-8 max-w-xl mx-auto flex flex-col items-center text-center">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-64 sm:w-80 md:w-96 mb-6 drop-shadow-md"
          >
            <img alt="Ilustração de Gestão" className="w-full h-auto object-contain pointer-events-none select-none opacity-95" style={{ filter: 'brightness(0) invert(1)' }} src="/img/illustrations/illustration.png" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl sm:text-3xl lg:text-[2.35rem] font-bold tracking-tight text-white leading-tight"
          >
            GRUPO ABA INFRA
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-white/90 font-normal leading-relaxed max-w-lg"
          >
            Excelência e agilidade com atendimento personalizado
          </motion.p>
        </div>

        <div className="relative z-10 border-t border-white/15 pt-4 text-center text-[11px] xl:text-xs leading-relaxed text-white/75">
          Este sistema foi desenvolvido por <span className="font-medium text-white">Lucas Alberto</span> no intuito de realizar um teste técnico para a empresa ABA Infra.
        </div>
      </section>

      <section className="w-full lg:w-[46%] xl:w-[44%] min-h-full flex-1 flex flex-col items-center justify-center p-3 sm:p-8 lg:p-14 bg-[#f8fafc]">
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md bg-white rounded-2xl p-4 sm:p-8 md:p-10 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.08)] border border-slate-100 my-auto"
        >

          <div className="flex flex-col items-center text-center mb-4 sm:mb-7">
            <div className="h-9 sm:h-10 mb-2.5 sm:mb-4 flex items-center justify-center">
              <img alt="Logo ABA Desk" className="h-8 sm:h-9 w-auto object-contain" style={{ filter: 'invert(1) contrast(1.15) brightness(0.2)' }} src="/img/brand/logo-dark.png" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Acessar Plataforma
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">
              Entre com suas credenciais de acesso corporativo
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
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
                  className="block w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#c8101e]/30 focus:border-[#c8101e] outline-none transition-colors"
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
                  type={showPassword ? 'text' : (typeof CSS !== 'undefined' && CSS.supports && CSS.supports('-webkit-text-security', 'disc') ? 'text' : 'password')}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={!showPassword && typeof CSS !== 'undefined' && CSS.supports && CSS.supports('-webkit-text-security', 'disc') ? { WebkitTextSecurity: 'disc' } : undefined}
                  autoComplete="current-password"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  className="block w-full pl-10 pr-10 py-2.5 text-sm border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#c8101e]/30 focus:border-[#c8101e] outline-none transition-colors"
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

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
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
              <motion.button
                whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                transition={{ duration: 0.15 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-[#c8101e] hover:bg-[#a70d18] active:bg-[#8b0c15] shadow-sm hover:shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8101e] disabled:opacity-70 cursor-pointer"
              >
                {isSubmitting ? 'Autenticando...' : 'Entrar no ABA Desk'}
                {!isSubmitting && (
                  <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                )}
              </motion.button>
            </div>
          </form>

          <div className="mt-4 sm:mt-6 text-center text-xs text-slate-500">
            <span>Não tem uma conta corporativa? </span>
            <Link to="/register" className="font-semibold text-[#c8101e] hover:text-[#9c0c16] hover:underline">
              Cadastre-se
            </Link>
          </div>

        </motion.div>

        <footer className="lg:hidden mt-3 sm:mt-4 text-center text-[11px] sm:text-xs text-slate-400 max-w-xs sm:max-w-md">
          Este sistema foi desenvolvido por <span className="font-medium text-slate-600">Lucas Alberto</span> no intuito de realizar um teste técnico para a empresa ABA Infra.
        </footer>
      </section>

    </div>
  );
}
