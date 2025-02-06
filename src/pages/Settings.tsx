import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { User, Sliders, Shield, Users as UsersIcon } from 'lucide-react';
import { isDarkTheme } from '../lib/theme';

interface SettingCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

function SettingCard({ icon, title, description, onClick }: SettingCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-6 rounded-lg transition-all ${
        isDarkTheme
          ? 'bg-dark-800/50 hover:bg-dark-800'
          : 'bg-white/50 hover:bg-white'
      } group`}
    >
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-lg ${
          isDarkTheme
            ? 'bg-dark-700/50 text-dark-200 group-hover:bg-dark-700 group-hover:text-white'
            : 'bg-gray-100/50 text-gray-600 group-hover:bg-gray-100 group-hover:text-gray-900'
        }`}>
          {icon}
        </div>
        <div>
          <h3 className={`text-lg font-semibold mb-1 ${
            isDarkTheme ? 'text-white' : 'text-gray-900'
          }`}>
            {title}
          </h3>
          <p className={isDarkTheme ? 'text-dark-200' : 'text-gray-600'}>
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}

export default function Settings() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const settingsGroups = [
    {
      title: t('settings.account'),
      items: [
        {
          icon: <User className="h-6 w-6" />,
          title: t('settings.personalSettings'),
          description: t('settings.personalSettingsDesc'),
          path: '/app/settings/personal'
        },
        {
          icon: <Sliders className="h-6 w-6" />,
          title: t('settings.preferences'),
          description: t('settings.preferencesDesc'),
          path: '/app/settings/preferences'
        }
      ]
    },
    {
      title: t('settings.administration'),
      items: [
        {
          icon: <UsersIcon className="h-6 w-6" />,
          title: t('settings.users'),
          description: t('settings.usersDesc'),
          path: '/app/settings/users'
        },
        {
          icon: <Shield className="h-6 w-6" />,
          title: t('settings.security'),
          description: t('settings.securityDesc'),
          path: '/app/settings/security'
        }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {settingsGroups.map((group, index) => (
        <div key={index} className="space-y-4">
          <h2 className={`text-lg font-semibold ${
            isDarkTheme ? 'text-white' : 'text-gray-900'
          }`}>
            {group.title}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {group.items.map((item, itemIndex) => (
              <SettingCard
                key={itemIndex}
                icon={item.icon}
                title={item.title}
                description={item.description}
                onClick={() => navigate(item.path)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}