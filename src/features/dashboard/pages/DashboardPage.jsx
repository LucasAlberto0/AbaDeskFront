import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, LayoutDashboard } from 'lucide-react';
import { getDashboardSummary } from '../api/dashboardService';
import { MetricCard } from '../components/MetricCard';

export default function DashboardPage() {
  const [summary, setSummary] = useState({
    pendingMyAction: 0,
    openTickets: 0,
    resolvedTickets: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getDashboardSummary();
        setSummary(data);
      } catch (error) {
        console.error("Erro ao buscar resumo do dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Dashboard</h1>
        <p className="text-text-secondary mt-1">Visão geral do sistema e suas pendências.</p>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <MetricCard 
            title="Minhas Pendências" 
            value={summary.pendingMyAction} 
            icon={AlertCircle}
            colorClass="bg-status-rejeitado-bg text-status-rejeitado"
          />
          <MetricCard 
            title="Total em Aberto" 
            value={summary.openTickets} 
            icon={LayoutDashboard}
            colorClass="bg-status-novo-bg text-status-novo"
          />
          <MetricCard 
            title="Concluídos" 
            value={summary.resolvedTickets} 
            icon={CheckCircle2}
            colorClass="bg-status-resolvido-bg text-status-resolvido"
          />
        </motion.div>
      )}
    </div>
  );
}
