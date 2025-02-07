import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { isDarkTheme } from '../lib/theme';
import type { NavLink } from '../config/navigation';

interface DynamicSubmenuProps {
  items: NavLink[];
  isLoading: boolean;
}

export default function DynamicSubmenu({ items, isLoading }: DynamicSubmenuProps) {
  const location = useLocation();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="px-3 py-2">
        <div className={`h-3 w-20 rounded animate-pulse ${
          isDarkTheme ? 'bg-dark-700' : 'bg-gray-200'
        }`} />
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      {items.map(link => (
        <button
          key={link.id}
          onClick={() => navigate(link.path)}
          className={`w-full px-3 py-1.5 rounded-lg flex items-center space-x-2 transition-all duration-200 text-xs ${
            location.pathname === link.path
              ? isDarkTheme
                ? 'bg-dark-700 text-white shadow-md shadow-dark-900/20'
                : 'bg-gray-100 text-gray-900 shadow-md shadow-gray-200/50'
              : isDarkTheme
                ? 'text-dark-100 hover:bg-dark-700 hover:text-white hover:shadow-md hover:shadow-dark-900/20'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:shadow-md hover:shadow-gray-200/50'
          }`}
        >
          <link.icon className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="whitespace-nowrap">{link.label}</span>
        </button>
      ))}
    </div>
  );
}