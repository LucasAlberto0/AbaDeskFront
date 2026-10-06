import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import useAuthStore from '../hooks/useAuthStore';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@abadesk.local');
  const [password, setPassword] = useState('senha123');
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      // Error is handled by store
    }
  };

  return (
    <div className="min-h-screen bg-surface-dim flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-status-homologacao/5 blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-surface-card border border-border-subtle rounded-lg shadow-xl z-10 overflow-hidden"
      >
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <ShieldCheck size={28} strokeWidth={2.5} />
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">ABA Desk</h1>
            <p className="text-text-secondary mt-1 text-sm">Enterprise Service Management</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="p-3 rounded bg-status-rejeitado-bg border border-status-rejeitado/20 text-status-rejeitado text-sm font-medium"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Email Corporativo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <Mail size={16} />
                </div>
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError(); }}
                  className="pl-9"
                  placeholder="admin@abadesk.local"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <Lock size={16} />
                </div>
                <Input 
                  type="password" 
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError(); }}
                  className="pl-9"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full mt-6" 
              size="lg"
              isLoading={isLoading}
            >
              Acessar Plataforma
            </Button>
          </form>
        </div>
        
        <div className="bg-surface-dim/50 border-t border-border-subtle p-4 text-center">
          <p className="text-xs text-text-muted">© 2026 ABA Infra. Acesso restrito.</p>
        </div>
      </motion.div>
    </div>
  );
}
