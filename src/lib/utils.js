import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export const getStatusLabel = (status) => {
  const labels = {
    Open: "Aberto",
    InAnalysis: "Em Análise",
    InProgress: "Em Atendimento",
    WaitingUser: "Aguardando Usuário",
    Resolved: "Resolvido"
  };
  return labels[status] || status;
};

export const getCategoryLabel = (category) => {
  const labels = {
    Bug: "Bug / Falha",
    Improvement: "Melhoria",
    NewFeature: "Nova Funcionalidade",
    Question: "Dúvida",
    Access: "Acesso"
  };
  return labels[category] || category;
};

export const translateStatus = (status) => {
  const map = {
    'Open': { label: 'Novo', icon: 'add_circle', color: 'bg-blue-100 text-blue-700' },
    'InAnalysis': { label: 'Em análise', icon: 'search', color: 'bg-amber-100 text-amber-700' },
    'InProgress': { label: 'Em atendimento', icon: 'terminal', color: 'bg-purple-100 text-purple-700' },
    'WaitingUser': { label: 'Aguardando Usuário', icon: 'pending', color: 'bg-orange-100 text-orange-700' },
    'Resolved': { label: 'Resolvido', icon: 'check_circle', color: 'bg-emerald-100 text-emerald-700' },
  };
  return map[status] || { label: status, icon: 'info', color: 'bg-slate-100 text-slate-700' };
};

export const translateCategory = (cat) => {
  const map = {
    'Bug': { label: 'Bug / Falha', icon: 'bug_report' },
    'Improvement': { label: 'Melhoria', icon: 'trending_up' },
    'NewFeature': { label: 'Nova Funcionalidade', icon: 'new_releases' },
    'Question': { label: 'Dúvida', icon: 'help_outline' },
    'Access': { label: 'Acesso', icon: 'key' },
  };
  return map[cat] || { label: cat, icon: 'category' };
};
