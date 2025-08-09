import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

export function Card({ children, className = '', hover = false, padding = 'md' }: CardProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.02 } : {}}
      transition={{ duration: 0.2 }}
      className={`
        bg-white rounded-2xl shadow-xl border border-gray-100/50 backdrop-blur-sm
        ${paddingClasses[padding]}
        ${hover ? 'hover:shadow-2xl hover:border-[#006B76]/20 transition-all duration-300' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}