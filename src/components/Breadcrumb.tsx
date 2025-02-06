import React from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { isDarkTheme } from '../lib/theme';

interface BreadcrumbProps {
  activeSection: string | null;
  navItems: {
    id: string;
    label: string;
    subItems?: {
      id: string;
      label: string;
      path: string;
    }[];
  }[];
}

export default function Breadcrumb({ activeSection, navItems }: BreadcrumbProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  // Special case for dashboard
  if (pathSegments[1] === 'dashboard') {
    return (
      <span className={`${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
        {t('nav.dashboard')}
      </span>
    );
  }

  const currentMainSection = pathSegments[1];
  const currentSubSection = pathSegments[2];
  const mainItem = navItems.find(item => item.id === currentMainSection);
  
  if (!mainItem) return null;

  const subItem = mainItem.subItems?.find(
    sub => sub.id === currentSubSection
  );

  // Special case for personal settings
  if (currentMainSection === 'settings' && currentSubSection === 'personal') {
    return (
      <div className="flex items-center space-x-2">
        <span className={isDarkTheme ? 'text-dark-200' : 'text-gray-500'}>
          {t('nav.settings')}
        </span>
        <ChevronRight className={`h-4 w-4 ${
          isDarkTheme ? 'text-dark-200' : 'text-gray-400'
        }`} />
        <span className={isDarkTheme ? 'text-white' : 'text-gray-900'}>
          {t('settings.personalSettings')}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <span className={isDarkTheme ? 'text-dark-200' : 'text-gray-500'}>
        {t(mainItem.label)}
      </span>
      
      {subItem && (
        <>
          <ChevronRight className={`h-4 w-4 ${
            isDarkTheme ? 'text-dark-200' : 'text-gray-400'
          }`} />
          <span className={isDarkTheme ? 'text-white' : 'text-gray-900'}>
            {t(subItem.label)}
          </span>
        </>
      )}
    </div>
  );
}