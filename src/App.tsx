import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';
import LoginForm from './components/LoginForm';
import LanguageSwitcher from './components/LanguageSwitcher';
import MainLayout from './layouts/MainLayout';
import Settings from './pages/Settings';
import PersonalSettings from './pages/PersonalSettings';
import Users from './pages/Users';
import ProtectedRoute from './components/ProtectedRoute';
import { isDarkTheme } from './lib/theme';
import { ToastProvider } from './components/providers/ToastProvider';
import navigation from './config/navigation';
import './lib/i18n';

function App() {
  const { t } = useTranslation();

  const PageWrapper = ({ title }: { title: string }) => (
    <div className={`rounded-lg ${isDarkTheme ? 'bg-dark-800' : 'bg-white'} shadow-sm p-6`}>
      <h1 className={`text-2xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
        {t(title)}
      </h1>
    </div>
  );

  const generateRoutes = () => {
    const routes: React.ReactNode[] = [];

    routes.push(
      <Route key="settings" path="settings" element={<Settings />} />,
      <Route key="settings-personal" path="settings/personal" element={<PersonalSettings />} />,
      <Route key="settings-users" path="settings/users" element={<Users />} />
    );

    navigation.forEach(section => {
      routes.push(
        <Route 
          key={section.id} 
          path={section.id} 
          element={<PageWrapper title={`nav.${section.id}`} />} 
        />
      );

      section.subItems.forEach(item => {
        if (item.type === 'link') {
          const path = item.path.split('/app/')[1];
          routes.push(
            <Route 
              key={item.id} 
              path={path} 
              element={<PageWrapper title={item.label} />} 
            />
          );
        }
      });
    });

    return routes;
  };

  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={
          <>
            <div className="absolute top-4 right-4">
              <LanguageSwitcher />
            </div>
            <div className="flex items-center justify-center min-h-screen p-4">
              <LoginForm />
            </div>
          </>
        } />
        <Route path="/app" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          {generateRoutes()}
          <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
        </Route>
      </Routes>
    </ToastProvider>
  );
}

export default App;