import React from 'react';
import { cn } from '../../lib/utils';

const variantConfig = {
  NEW: { dot: "bg-status-novo", wrapper: "bg-status-novo-bg text-status-novo border-status-novo/20" },
  ANALYZING: { dot: "bg-status-analise", wrapper: "bg-status-analise-bg text-status-analise border-status-analise/20" },
  IN_DEVELOPMENT: { dot: "bg-status-dev", wrapper: "bg-status-dev-bg text-status-dev border-status-dev/20" },
  IN_TEST: { dot: "bg-status-teste", wrapper: "bg-status-teste-bg text-status-teste border-status-teste/20" },
  WAITING_HOMOLOGATION: { dot: "bg-status-homologacao", wrapper: "bg-status-homologacao-bg text-status-homologacao border-status-homologacao/20" },
  RESOLVED: { dot: "bg-status-resolvido", wrapper: "bg-status-resolvido-bg text-status-resolvido border-status-resolvido/20" },
  REJECTED: { dot: "bg-status-rejeitado", wrapper: "bg-status-rejeitado-bg text-status-rejeitado border-status-rejeitado/20" },
  Open: { dot: "bg-blue-600", wrapper: "bg-blue-100 text-blue-700 border-blue-200" },
  InAnalysis: { dot: "bg-amber-600", wrapper: "bg-amber-100 text-amber-700 border-amber-200" },
  InProgress: { dot: "bg-purple-600", wrapper: "bg-purple-100 text-purple-700 border-purple-200" },
  WaitingUser: { dot: "bg-orange-600", wrapper: "bg-orange-100 text-orange-700 border-orange-200" },
  Resolved: { dot: "bg-emerald-600", wrapper: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  DEFAULT: { dot: "bg-gray-500", wrapper: "bg-gray-100 text-gray-700 border-gray-200" }
};

export function Badge({ status, label, className }) {
  const config = variantConfig[status] || variantConfig.DEFAULT;
  
  return (
    <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] border text-[11px] font-semibold uppercase tracking-wider", config.wrapper, className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {label}
    </div>
  );
}
