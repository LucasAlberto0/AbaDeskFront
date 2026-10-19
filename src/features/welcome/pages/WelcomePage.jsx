import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, LogIn, UserPlus } from 'lucide-react';
import useAuthStore from '../../auth/hooks/useAuthStore';

export default function WelcomePage() {
  const { isAuthenticated, user } = useAuthStore();
  const [greeting, setGreeting] = useState('Bem-vindo');
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTimeAndGreeting = () => {
      const now = new Date();
      const hour = now.getHours();
      
      if (hour >= 5 && hour < 12) {
        setGreeting('Bom dia');
      } else if (hour >= 12 && hour < 18) {
        setGreeting('Boa tarde');
      } else {
        setGreeting('Boa noite');
      }

      setTimeString(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    };

    updateTimeAndGreeting();
    const timer = setInterval(updateTimeAndGreeting, 1000);
    return () => clearInterval(timer);
  }, []);

  const companies = [
    { name: 'ABA Infra', logo: '/img/companies/aba-infra.jpg' },
    { name: 'Concais', logo: '/img/companies/concais.png' },
    { name: 'Eudmarco', logo: '/img/companies/eudmarco.png' },
    { name: 'Adonai Química', logo: '/img/companies/adonai-quimica.png' },
    { name: 'FCA Log', logo: '/img/companies/fca-log.jpg' }
  ];

  return (
    <div className="fixed inset-0 h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-white text-slate-800 flex flex-col justify-between px-4 py-3 sm:px-8 sm:py-6 select-none">
      
      <div 
        className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-red-50/70 pointer-events-none blur-2xl" 
      />
      <div 
        className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-slate-100/80 pointer-events-none blur-2xl" 
      />

      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between shrink-0">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3"
        >
          <img 
            src="/img/brand/logo-dark.png" 
            alt="ABA Desk" 
            className="h-7 sm:h-9 w-auto object-contain"
            style={{ filter: 'invert(1) contrast(1.15) brightness(0.2)' }}
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-right"
        >
          <p className="text-xs sm:text-sm font-semibold text-slate-900 tracking-tight">
            {timeString}
          </p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
            Santos • SP
          </p>
        </motion.div>
      </header>

      <main className="relative z-10 w-full max-w-3xl mx-auto my-auto flex flex-col items-center text-center px-2 py-1">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
          className="w-full flex flex-col items-center"
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#c8101e] flex items-center justify-center shadow-lg shadow-red-900/15 mb-3 sm:mb-4">
            <img 
              src="/img/brand/logo-icon.png" 
              alt="ABA" 
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain brightness-0 invert" 
            />
          </div>

          <h1 
            className="text-2xl xs:text-3xl sm:text-4xl md:text-[2.65rem] font-extrabold text-slate-900 tracking-tight leading-[1.15] font-logo"
            style={{ fontFamily: "'Outfit', 'Montserrat', system-ui, sans-serif" }}
          >
            {greeting}! <span className="text-[#c8101e]">Seja bem-vindo ao AbaDesk.</span>
          </h1>

          <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm md:text-base text-slate-600 max-w-md sm:max-w-xl leading-relaxed">
            Portal de atendimento e suporte do <strong>Grupo ABA Infra</strong>. Abra novos chamados, acompanhe solicitações ou conte com nossa equipe técnica.
          </p>

          <div className="mt-5 sm:mt-7 w-full max-w-sm sm:max-w-md flex flex-col xs:flex-row gap-2.5 sm:gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-[#c8101e] to-[#9d0012] hover:from-[#d91221] hover:to-[#b00d19] text-white font-bold text-xs sm:text-sm shadow-md shadow-red-900/20 hover:shadow-lg hover:shadow-red-900/30 flex items-center justify-center gap-2 transition-all active:scale-95 group"
              >
                <span>Acessar Dashboard</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-[#c8101e] to-[#9d0012] hover:from-[#d91221] hover:to-[#b00d19] text-white font-bold text-xs sm:text-sm shadow-md shadow-red-900/20 hover:shadow-lg hover:shadow-red-900/30 flex items-center justify-center gap-2 transition-all active:scale-95 group"
                >
                  <LogIn size={16} />
                  <span>Entrar com E-mail</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/register"
                  className="flex-1 py-3 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 font-semibold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
                >
                  <UserPlus size={16} className="text-slate-500" />
                  <span>Primeiro acesso</span>
                </Link>
              </>
            )}
          </div>

          <div className="mt-6 sm:mt-8 w-full pt-4 sm:pt-6 border-t border-slate-100 flex flex-col items-center">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5 sm:mb-3">
              Unidades Integradas
            </span>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
              {companies.map((comp, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-1.5 opacity-75 hover:opacity-100 transition-opacity"
                  title={comp.name}
                >
                  <img 
                    src={comp.logo} 
                    alt={comp.name} 
                    className="h-5 sm:h-6 w-auto max-w-[70px] sm:max-w-[85px] object-contain rounded-xs" 
                  />
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-600">
                    {comp.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </main>

      <footer className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-2 shrink-0">
        <span>© 2026 Grupo ABA Infra</span>
        <span>Suporte e Atendimento TI</span>
      </footer>

    </div>
  );
}
