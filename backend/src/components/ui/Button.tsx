import React from 'react';
import { motion } from 'framer-motion';
import { brandConfig } from '../../config/brand';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 shadow-lg hover:shadow-xl btn-3d";
  
  const variants = {
    primary: `bg-gradient-to-r from-[${brandConfig.colors.primary}] to-[${brandConfig.colors.primary}]/80 text-white hover:from-[${brandConfig.colors.primary}]/90 hover:to-[${brandConfig.colors.primary}]/70 focus:ring-[${brandConfig.colors.primary}]/50`,
    secondary: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 hover:from-gray-200 hover:to-gray-300 focus:ring-gray-500/50",
    outline: `border-2 border-[${brandConfig.colors.primary}] text-[${brandConfig.colors.primary}] hover:bg-[${brandConfig.colors.primary}] hover:text-white focus:ring-[${brandConfig.colors.primary}]/50`,
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500/50 shadow-none hover:shadow-md",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500/50"
  };
  
  const sizes = {
    sm: "px-3 py-2 md:px-4 md:py-2.5 text-sm min-h-[40px] md:min-h-[44px]",
    md: "px-4 py-3 md:px-6 md:py-3 text-sm md:text-base min-h-[44px] md:min-h-[48px]",
    lg: "px-6 py-4 md:px-8 md:py-4 text-base md:text-lg min-h-[52px] md:min-h-[56px]"
  };
  
  const isDisabled = disabled || isLoading;
  
  return (
    <motion.button
      whileTap={{ scale: isDisabled ? 1 : 0.98 }}
      whileHover={{ scale: isDisabled ? 1 : 1.02 }}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${isDisabled ? 'opacity-50 cursor-not-allowed shadow-none transform-none' : 'cursor-pointer'}
        mobile-button
        ${className}
      `}
      disabled={isDisabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 md:h-5 md:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </motion.button>
  );
}