import React from 'react';
import { motion } from 'framer-motion';

interface CurrencySelectorProps {
  selected: 'ar' | 'usdt';
  onChange: (currency: 'ar' | 'usdt') => void;
  className?: string;
}

export function CurrencySelector({ selected, onChange, className = '' }: CurrencySelectorProps) {
  return (
    <div className={`flex bg-gray-100 rounded-lg p-1 ${className}`}>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onChange('ar')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          selected === 'ar'
            ? 'bg-white text-[#006B76] shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Ar
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onChange('usdt')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          selected === 'usdt'
            ? 'bg-white text-[#006B76] shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        USDT
      </motion.button>
      <div className="ml-2 text-xs text-gray-500 flex items-center">
        5000 Ar = 1 USDT
      </div>
    </div>
  );
}