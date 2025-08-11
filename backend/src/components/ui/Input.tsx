import React from 'react';
import { brandConfig } from '../../config/brand';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ 
  label, 
  error, 
  icon, 
  className = '', 
  id,
  disabled,
  ...props 
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400">{icon}</div>
          </div>
        )}
        <input
          id={inputId}
          disabled={disabled}
          className={`
            block w-full px-4 py-3 md:py-4 border border-gray-300 rounded-xl
            focus:ring-2 focus:ring-[${brandConfig.colors.primary}]/50 focus:border-[${brandConfig.colors.primary}]
            placeholder-gray-400 text-gray-900 bg-white
            transition-all duration-200 shadow-sm hover:shadow-md
            ${icon ? 'pl-10 md:pl-12' : ''}
            ${error ? 'border-red-300 focus:ring-red-500/50 focus:border-red-500' : ''}
            ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}
            mobile-input
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}