import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Settings, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import pb from '../lib/pocketbase';
import { isDarkTheme } from '../lib/theme';

export default function UserMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const user = pb.authStore.model;

  const handleLogout = async () => {
    pb.authStore.clear();
    navigate('/');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 rounded-lg p-3 transition-all duration-200 ${
          isOpen
            ? isDarkTheme
              ? 'bg-dark-700 text-white shadow-md shadow-dark-900/20'
              : 'bg-gray-100 text-gray-900 shadow-md shadow-gray-200/50'
            : isDarkTheme
              ? 'text-dark-100 hover:bg-dark-700 hover:text-white hover:shadow-md hover:shadow-dark-900/20'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:shadow-md hover:shadow-gray-200/50'
        }`}
      >
        {user?.avatar ? (
          <img
            src={`${import.meta.env.VITE_POCKETBASE_URL}/api/files/${user.collectionId}/${user.id}/${user.avatar}`}
            alt={user.name}
            className="h-5 w-5 rounded-lg object-cover"
          />
        ) : (
          <User className="h-5 w-5" />
        )}
        <span className="text-sm">{user?.name || 'User'}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg ${
              isDarkTheme ? 'bg-dark-800 ring-1 ring-dark-700' : 'bg-white ring-1 ring-gray-200'
            }`}
          >
            <div className="py-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/app/settings/personal');
                }}
                className={`flex w-full items-center px-4 py-2.5 text-sm transition-all duration-200 ${
                  isDarkTheme
                    ? 'text-dark-100 hover:bg-dark-700 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Settings className="mr-2 h-4 w-4" />
                {t('app.settings')}
              </button>
              <button
                onClick={handleLogout}
                className={`flex w-full items-center px-4 py-2.5 text-sm transition-all duration-200 ${
                  isDarkTheme
                    ? 'text-dark-100 hover:bg-dark-700 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t('app.logout')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}