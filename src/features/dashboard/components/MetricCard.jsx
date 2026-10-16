import React from 'react';
import { motion } from 'framer-motion';

export function MetricCard({ title, value, icon: Icon, colorClass }) {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-surface-card border border-border-subtle rounded-lg p-4 sm:p-6 shadow-sm flex items-start justify-between gap-2"
    >
      <div className="min-w-0">
        <p className="text-xs sm:text-sm font-semibold text-text-secondary uppercase tracking-wider truncate">{title}</p>
        <h3 className="text-2xl sm:text-3xl font-bold text-text-primary mt-1.5 sm:mt-2">{value}</h3>
      </div>
      <div className={`p-2.5 sm:p-3 rounded-lg shrink-0 ${colorClass}`}>
        <Icon size={22} className="sm:w-6 sm:h-6" strokeWidth={2} />
      </div>
    </motion.div>
  );
}
