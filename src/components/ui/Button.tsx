import React from 'react';
import { isDarkTheme } from '../../lib/theme';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
  width?: 'auto' | 'full';
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  loading,
  width = 'auto',
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg transition-colors';
  
  const variantStyles = {
    primary: isDarkTheme
      ? 'bg-dark-800 text-white hover:bg-dark-700 disabled:bg-dark-800/50'
      : 'bg-dark-800 text-white hover:bg-dark-700/90 disabled:bg-dark-800/50',
    secondary: isDarkTheme
      ? 'bg-dark-700/50 text-dark-200 hover:bg-dark-700 hover:text-white'
      : 'bg-gray-100/50 text-gray-700 hover:bg-gray-200',
    danger: isDarkTheme
      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
      : 'bg-red-100 text-red-700 hover:bg-red-200',
  };

  const sizeStyles = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4',
    lg: 'h-12 px-6 text-lg',
  };

  const widthStyles = {
    auto: 'min-w-[100px]', // Minimum width to prevent size changes
    full: 'w-full',
  };

  return (
    <button
      {...props}
      disabled={loading || disabled}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${widthStyles[width]}
        ${loading || disabled ? 'cursor-not-allowed opacity-50' : ''}
        ${className}
      `}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}