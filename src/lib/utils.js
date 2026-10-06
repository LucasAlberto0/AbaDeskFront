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
