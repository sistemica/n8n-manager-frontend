import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Loader2, Mail, Lock, CheckCircle, XCircle } from 'lucide-react';
import pb from '../lib/pocketbase';
import { isDarkTheme } from '../lib/theme';
import { useNavigate } from 'react-router-dom';

type LoginState = 'idle' | 'loading' | 'success' | 'error' | 'redirect';

export default function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loginState, setLoginState] = useState<LoginState>('idle');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    if (pb.authStore.isValid) {
      setLoginState('redirect');
      setTimeout(() => {
        navigate('/app');
      }, 1000);
    }
  }, [navigate]);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(emailRegex.test(email) && password.length >= 1);
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginState('loading');

    try {
      await pb.collection('users').authWithPassword(email, password);
      setLoginState('success');
      setTimeout(() => {
        setLoginState('redirect');
      }, 1000);
      setTimeout(() => {
        navigate('/app');
      }, 2000);
    } catch (error) {
      setLoginState('error');
      setTimeout(() => setLoginState('idle'), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full max-w-md mx-auto ${
        isDarkTheme ? 'bg-dark-800' : 'bg-white'
      } rounded-2xl shadow-xl overflow-hidden`}
    >
      <div className="px-8 py-10">
        <div className="text-center mb-8">
          <h2 className={`text-2xl font-bold ${
            isDarkTheme ? 'text-white' : 'text-gray-800'
          }`}>
            {t('login.title')}
          </h2>
          <p className={
            isDarkTheme ? 'text-dark-200' : 'text-gray-600'
          }>
            {t('login.subtitle')}
          </p>
        </div>
        
        <div className="h-[280px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {loginState === 'idle' ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="w-full space-y-6"
              >
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkTheme ? 'text-dark-100' : 'text-gray-700'
                  }`}>
                    {t('login.email')}
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
                      isDarkTheme ? 'text-dark-400' : 'text-gray-400'
                    }`} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`pl-10 w-full px-4 py-2 rounded-lg border ${
                        isDarkTheme 
                          ? 'bg-dark-700 border-dark-600 text-white placeholder-dark-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                      } focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all`}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkTheme ? 'text-dark-100' : 'text-gray-700'
                  }`}>
                    {t('login.password')}
                  </label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
                      isDarkTheme ? 'text-dark-400' : 'text-gray-400'
                    }`} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`pl-10 w-full px-4 py-2 rounded-lg border ${
                        isDarkTheme 
                          ? 'bg-dark-700 border-dark-600 text-white placeholder-dark-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                      } focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all`}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!isValid}
                  className="w-full bg-dark-800 text-white py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:bg-dark-700"
                >
                  {t('login.submit')}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="status"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center justify-center"
              >
                {loginState === 'loading' && (
                  <Loader2 className="h-12 w-12 text-dark-800 animate-spin" />
                )}
                {loginState === 'success' && (
                  <CheckCircle className="h-12 w-12 text-green-500" />
                )}
                {loginState === 'error' && (
                  <XCircle className="h-12 w-12 text-red-500" />
                )}
                {loginState === 'redirect' && (
                  <Loader2 className="h-12 w-12 text-dark-800 animate-spin" />
                )}
                <p className={
                  isDarkTheme ? 'mt-4 text-dark-200' : 'mt-4 text-gray-600'
                }>
                  {loginState === 'loading' && t('login.loading')}
                  {loginState === 'success' && t('login.success')}
                  {loginState === 'error' && t('login.error')}
                  {loginState === 'redirect' && t('login.redirecting')}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}