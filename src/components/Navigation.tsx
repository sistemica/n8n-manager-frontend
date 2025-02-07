import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Box } from 'lucide-react';
import { isDarkTheme } from '../lib/theme';
import navigation, { NavLink, NavDynamic } from '../config/navigation';
import DynamicSubmenu from './DynamicSubmenu';

interface NavigationProps {
  activeSection: string | null;
  onSectionChange: (section: string | null) => void;
}

export default function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [dynamicItems, setDynamicItems] = useState<Record<string, NavLink[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const handleNavClick = (itemId: string) => {
    if (activeSection === itemId) {
      onSectionChange(null);
    } else {
      onSectionChange(itemId);
    }
  };

  // Load dynamic items when a section is opened
  useEffect(() => {
    if (!activeSection) return;

    const section = navigation.find(item => item.id === activeSection);
    if (!section) return;

    section.subItems.forEach(async (item) => {
      if (item.type === 'dynamic' && !dynamicItems[item.id]) {
        setLoading(prev => ({ ...prev, [item.id]: true }));
        try {
          const items = await item.loadItems();
          setDynamicItems(prev => ({ ...prev, [item.id]: items }));
        } catch (error) {
          console.error(`Error loading dynamic items for ${item.id}:`, error);
        } finally {
          setLoading(prev => ({ ...prev, [item.id]: false }));
        }
      }
    });
  }, [activeSection]);

  return (
    <nav className="fixed left-0 top-0 flex h-screen z-40">
      {/* Primary Navigation */}
      <div className={`w-16 flex-shrink-0 ${isDarkTheme ? 'bg-dark-800' : 'bg-white'} border-r ${
        isDarkTheme ? 'border-dark-700' : 'border-gray-200'
      }`}>
        <div className="flex flex-col items-center h-full">
          {/* App Logo */}
          <div className="py-3">
            <a 
              href="/app" 
              className={`block p-3 ${
                isDarkTheme ? 'text-white' : 'text-gray-900'
              }`}
            >
              <Box className="h-5 w-5" />
            </a>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 flex flex-col items-center pt-1 space-y-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`p-3 rounded-lg transition-all duration-200 group ${
                    activeSection === item.id
                      ? isDarkTheme
                        ? 'bg-dark-700 text-white shadow-md shadow-dark-900/20'
                        : 'bg-gray-100 text-gray-900 shadow-md shadow-gray-200/50'
                      : isDarkTheme
                        ? 'text-dark-100 hover:bg-dark-700 hover:text-white hover:shadow-md hover:shadow-dark-900/20'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:shadow-md hover:shadow-gray-200/50'
                  }`}
                  title={t(item.label)}
                >
                  <Icon className="h-5 w-5" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Secondary Navigation */}
      <AnimatePresence>
        {activeSection && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 200, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className={`h-screen border-r overflow-hidden ${
              isDarkTheme ? 'bg-dark-800 border-dark-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="py-6 px-3">
              {navigation
                .find(item => item.id === activeSection)
                ?.subItems.map((subItem, index) => {
                  if (subItem.type === 'title') {
                    return (
                      <div
                        key={subItem.id}
                        className={`px-3 py-2 text-xs font-semibold ${
                          isDarkTheme ? 'text-dark-300' : 'text-gray-500'
                        } ${index > 0 ? 'mt-6' : ''}`}
                      >
                        {t(subItem.label)}
                      </div>
                    );
                  }

                  if (subItem.type === 'dynamic') {
                    return (
                      <DynamicSubmenu
                        key={subItem.id}
                        items={dynamicItems[subItem.id] || []}
                        isLoading={loading[subItem.id]}
                      />
                    );
                  }

                  const link = subItem as NavLink;
                  const Icon = link.icon;
                  
                  return (
                    <button
                      key={link.id}
                      onClick={() => navigate(link.path)}
                      className={`w-full mb-1 px-3 py-2.5 rounded-lg flex items-center space-x-3 transition-all duration-200 ${
                        location.pathname === link.path
                          ? isDarkTheme
                            ? 'bg-dark-700 text-white shadow-md shadow-dark-900/20'
                            : 'bg-gray-100 text-gray-900 shadow-md shadow-gray-200/50'
                          : isDarkTheme
                            ? 'text-dark-100 hover:bg-dark-700 hover:text-white hover:shadow-md hover:shadow-dark-900/20'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:shadow-md hover:shadow-gray-200/50'
                      }`}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm whitespace-nowrap">{t(link.label)}</span>
                    </button>
                  );
                })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}