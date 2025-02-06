import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isDarkTheme } from '../lib/theme';
import pb from '../lib/pocketbase';
import useToast from '../hooks/useToast';

export default function PersonalSettings() {
  const { t, i18n } = useTranslation();
  const { showToast } = useToast();
  const user = pb.authStore.model;
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data: Record<string, any> = {};
    
    if (name !== user?.name) data.name = name;
    if (email !== user?.email) data.email = email;
    if (password) {
      data.password = password;
      data.passwordConfirm = password;
    }

    try {
      if (Object.keys(data).length > 0) {
        await pb.collection('users').update(user?.id, data);
        showToast(t('common.updateSuccess'), 'success');
        setPassword(''); // Clear password field after successful update
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      showToast(t('common.updateError'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem('i18nextLng', language);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Language Settings */}
      <div className="mb-8">
        <h3 className={`text-sm font-medium mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
          {t('settings.language')}
        </h3>
        <div className="flex space-x-4">
          <button
            onClick={() => handleLanguageChange('en')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              i18n.language === 'en'
                ? 'bg-dark-800 text-white'
                : isDarkTheme
                  ? 'bg-dark-700/50 text-dark-200 hover:text-white hover:bg-dark-700'
                  : 'bg-gray-100/50 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('language.en')}
          </button>
          <button
            onClick={() => handleLanguageChange('de')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              i18n.language === 'de'
                ? 'bg-dark-800 text-white'
                : isDarkTheme
                  ? 'bg-dark-700/50 text-dark-200 hover:text-white hover:bg-dark-700'
                  : 'bg-gray-100/50 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('language.de')}
          </button>
        </div>
      </div>

      {/* Profile Settings */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkTheme ? 'text-dark-100' : 'text-gray-700'
          }`}>
            {t('users.name')}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border ${
              isDarkTheme 
                ? 'bg-dark-700 border-dark-600 text-white placeholder-dark-400' 
                : 'bg-gray-50 border-gray-400 text-gray-900 placeholder-gray-400'
            } focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkTheme ? 'text-dark-100' : 'text-gray-700'
          }`}>
            {t('users.email')}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border ${
              isDarkTheme 
                ? 'bg-dark-700 border-dark-600 text-white placeholder-dark-400' 
                : 'bg-gray-50 border-gray-400 text-gray-900 placeholder-gray-400'
            } focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkTheme ? 'text-dark-100' : 'text-gray-700'
          }`}>
            {t('login.password')}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('users.passwordPlaceholder')}
            className={`w-full px-4 py-2 rounded-lg border ${
              isDarkTheme 
                ? 'bg-dark-700 border-dark-600 text-white placeholder-dark-400' 
                : 'bg-gray-50 border-gray-400 text-gray-900 placeholder-gray-400'
            } focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all`}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-dark-800 text-white rounded-lg transition-colors hover:bg-dark-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('common.saving') : t('common.save')}
          </button>
        </div>
      </form>
    </div>
  );
}