import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import UserMenu from '../components/UserMenu';
import Navigation from '../components/Navigation';
import Breadcrumb from '../components/Breadcrumb';
import { isDarkTheme } from '../lib/theme';
import navigation from '../config/navigation';

export default function MainLayout() {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  React.useEffect(() => {
    const section = location.pathname.split('/')[2];
    if (section) {
      setActiveSection(section);
    }
  }, []);

  return (
    <div className={`min-h-screen ${isDarkTheme ? 'bg-dark-900' : 'bg-gray-50'}`}>
      <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />

      <div 
        className="transition-all duration-300 fixed right-0 top-0 bottom-0 overflow-hidden"
        style={{ left: activeSection ? '264px' : '64px' }}
      >
        <header className={`h-16 px-6 fixed top-0 z-20 transition-all duration-300 ${
          isDarkTheme ? 'bg-dark-900/80' : 'bg-gray-50/80'
        } backdrop-blur-sm right-0`}
        style={{ left: activeSection ? '264px' : '64px' }}>
          <div className="h-full w-full flex justify-between items-center">
            <div className="pt-1">
              <Breadcrumb activeSection={activeSection} navItems={navigation} />
            </div>
            <UserMenu />
          </div>
        </header>

        <main className="h-full pt-16 overflow-auto">
          <div className="px-6 py-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}