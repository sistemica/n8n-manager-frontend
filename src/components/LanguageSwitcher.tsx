import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { isDarkTheme } from '../lib/theme';

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLangMenuOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
        className={`flex items-center space-x-2 ${
          isDarkTheme ? 'text-dark-100 hover:text-white' : 'text-gray-600 hover:text-gray-900'
        } transition-colors`}
      >
        <Globe className="h-5 w-5" />
        <span className="text-sm">{t(`language.${i18n.language}`)}</span>
      </button>
      
      <AnimatePresence>
        {isLangMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute right-0 mt-2 py-2 w-32 ${
              isDarkTheme 
                ? 'bg-dark-800 ring-dark-700' 
                : 'bg-white ring-gray-200'
            } rounded-lg shadow-lg ring-1`}
          >
            <button
              onClick={() => changeLanguage('en')}
              className={`block w-full px-4 py-2 text-sm text-left ${
                isDarkTheme
                  ? 'text-dark-100 hover:bg-dark-700'
                  : 'text-gray-700 hover:bg-gray-100'
              } transition-colors`}
            >
              {t('language.en')}
            </button>
            <button
              onClick={() => changeLanguage('de')}
              className={`block w-full px-4 py-2 text-sm text-left ${
                isDarkTheme
                  ? 'text-dark-100 hover:bg-dark-700'
                  : 'text-gray-700 hover:bg-gray-100'
              } transition-colors`}
            >
              {t('language.de')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}