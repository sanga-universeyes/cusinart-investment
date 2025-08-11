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
        relative overflow-hidden rounded-2xl p-3 md:p-4 text-left transition-all duration-300 group
        ${isPrimary 
          ? 'bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-xl hover:shadow-2xl border border-gray-200 hover:border-[#006B76]/30 min-h-[80px] md:min-h-[100px]' 
          : 'bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl border border-gray-100 hover:border-gray-200 min-h-[80px] md:min-h-[100px]'
        }
        ${className}
      `}
    >
      <div className="flex flex-col items-center text-center space-y-2 h-full justify-center">
        <div className={`
          ${isPrimary ? 'w-10 h-10 md:w-12 md:h-12' : 'w-8 h-8 md:w-10 md:h-10'} 
          rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110
          ${isPrimary 
            ? 'bg-gradient-to-br from-[#006B76] via-[#006B76]/90 to-[#006B76]/80 text-white shadow-xl' 
            : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 shadow-md'
          }
        `}>
          <Icon className={`${isPrimary ? 'h-5 w-5 md:h-6 md:w-6' : 'h-4 w-4 md:h-5 md:w-5'}`} />
        </div>
        <div className="text-center">
          <h3 className={`font-bold text-gray-900 ${isPrimary ? 'text-xs md:text-sm' : 'text-xs'} leading-tight`}>
            {label}
          </h3>
          {description && isPrimary && (
            <p className="text-gray-500 mt-1 text-xs leading-tight">
              {description}
            </p>
          )}
        </div>
      </div>
      
      {/* Effet de brillance */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      
      {/* Badge pour notifications ou statuts */}
      {isPrimary && label === 'Tableau' && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">✓</span>
        </div>
      )}
    </motion.button>
  );
}