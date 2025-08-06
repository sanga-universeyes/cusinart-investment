import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  description: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function ActionButton({ 
  icon: Icon, 
  label, 
  description, 
  onClick, 
  variant = 'primary',
  className = '' 
}: ActionButtonProps) {
  const isPrimary = variant === 'primary';
  
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-xl p-4 text-left transition-all duration-200
        ${isPrimary 
          ? 'bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl border border-gray-200' 
          : 'bg-white shadow-md hover:shadow-lg border border-gray-100'
        }
        ${className}
      `}
    >
      <div className="flex items-center space-x-3">
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center
          ${isPrimary 
            ? 'bg-gradient-to-br from-[#006B76] to-[#006B76]/80 text-white shadow-lg' 
            : 'bg-gray-100 text-gray-600'
          }
        `}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm">
            {label}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {description}
          </p>
        </div>
      </div>
      
      {/* Effet de brillance */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    </motion.button>
  );
}