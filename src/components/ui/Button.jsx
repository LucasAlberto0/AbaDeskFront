import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', children, isLoading, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-[4px] font-semibold transition-colors focus:outline-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-container active:bg-[#700306]",
    secondary: "bg-white border border-border-subtle text-text-secondary hover:bg-gray-50 hover:border-border-hover",
    ghost: "bg-transparent text-text-secondary hover:bg-gray-100",
    destructive: "bg-status-rejeitado text-white hover:bg-red-700"
  };

  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-[14px]",
    lg: "h-12 px-6 text-base"
  };

  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.97 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
      ) : null}
      {children}
    </motion.button>
  );
});
Button.displayName = "Button";
