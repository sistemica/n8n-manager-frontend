import React from 'react';
import { RotateCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { isDarkTheme } from '../../lib/theme';

interface RefreshButtonProps {
  onClick: () => void;
  isRefreshing: boolean;
}

export default function RefreshButton({ onClick, isRefreshing }: RefreshButtonProps) {
  const { t } = useTranslation();

  return (
    <button
      onClick={onClick}
      disabled={isRefreshing}
      className={`p-2 rounded-lg transition-all duration-200 ${
        isDarkTheme 
          ? 'text-dark-200 hover:bg-dark-700/50 hover:text-white' 
          : 'text-gray-400 hover:bg-gray-100/50 hover:text-gray-600'
      } ${isRefreshing ? 'cursor-not-allowed opacity-50' : ''}`}
      title={t('common.refresh')}
    >
      <RotateCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
    </button>
  );
}