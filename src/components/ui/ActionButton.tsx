import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  description: string;
  onClick: (() => void) | string;
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
  
  const handleClick = () => {
    if (typeof onClick === 'function') {
      onClick();
    } else {
      window.location.href = onClick;
    }
  };
  
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`
        relative overflow-hidden rounded-2xl p-4 text-left transition-all duration-300
        ${isPrimary 
          ? 'bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-xl hover:shadow-2xl border border-gray-200 hover:border-[#006B76]/30' 
          : 'bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl border border-gray-100 hover:border-gray-200'
        }
        ${className}
      `}
    >
      <div className={`flex ${isPrimary ? 'flex-col items-center text-center space-y-3' : 'items-center space-x-3'}`}>
        <div className={`
          ${isPrimary ? 'w-16 h-16' : 'w-10 h-10'} rounded-2xl flex items-center justify-center
          ${isPrimary 
            ? 'bg-gradient-to-br from-[#006B76] via-[#006B76]/90 to-[#006B76]/80 text-white shadow-xl' 
            : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 shadow-md'
          }
        `}>
          <Icon className={`${isPrimary ? 'h-8 w-8' : 'h-5 w-5'}`} />
        </div>
        <div className={`${isPrimary ? 'text-center' : 'flex-1'}`}>
          <h3 className={`font-bold text-gray-900 ${isPrimary ? 'text-base' : 'text-sm'}`}>
            {label}
          </h3>
          {description && (
            <p className={`text-gray-500 mt-1 ${isPrimary ? 'text-sm' : 'text-xs'}`}>
              {description}
            </p>
          )}
        </div>
      </div>
      
      {/* Effet de brillance */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-700" />
    </motion.button>
  );
}