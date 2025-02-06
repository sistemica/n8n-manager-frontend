import React from 'react';
import { isDarkTheme } from '../../lib/theme';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  icon,
  className = '',
  ...props
}: InputProps) {
  return (
    <div>
      {label && (
        <label className={`block text-sm font-medium mb-2 ${
          isDarkTheme ? 'text-dark-100' : 'text-gray-700'
        }`}>
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${
            isDarkTheme ? 'text-dark-400' : 'text-gray-400'
          }`}>
            {icon}
          </div>
        )}
        <input
          {...props}
          className={`w-full px-4 py-2 rounded-lg border border-gray-400 ${
            icon ? 'pl-10' : ''
          } ${
            isDarkTheme 
              ? 'bg-dark-700 text-white placeholder-dark-400' 
              : 'bg-gray-50 text-gray-900 placeholder-gray-400'
          } focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all ${className}`}
        />
      </div>
      {error && (
        <p className={`mt-1 text-sm ${isDarkTheme ? 'text-red-400' : 'text-red-600'}`}>
          {error}
        </p>
      )}
    </div>
  );
}