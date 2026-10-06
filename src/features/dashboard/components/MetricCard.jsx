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
      className="bg-surface-card border border-border-subtle rounded-lg p-6 shadow-sm flex items-start justify-between"
    >
      <div>
        <p className="text-sm font-semibold text-text-secondary uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-bold text-text-primary mt-2">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${colorClass}`}>
        <Icon size={24} strokeWidth={2} />
      </div>
    </motion.div>
  );
}
