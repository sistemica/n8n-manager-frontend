import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Server, Workflow, Webhook, CheckCircle } from 'lucide-react';
import { getInstances } from '../services/n8nService';
import type { N8nInstance } from '../services/n8nService';
import { isDarkTheme } from '../lib/theme';
import LoadingBar from '../components/LoadingBar';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description?: string;
  loading?: boolean;
}

function StatCard({ title, value, icon, description, loading }: StatCardProps) {
  return (
    <div className={`rounded-lg ${
      isDarkTheme ? 'bg-dark-800' : 'bg-white'
    } p-6 space-y-4`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className={`text-sm font-medium ${
            isDarkTheme ? 'text-dark-200' : 'text-gray-600'
          }`}>
            {title}
          </h3>
          {loading ? (
            <div className="mt-2 h-9 w-16 animate-pulse rounded bg-gray-200" />
          ) : (
            <span className={`block mt-2 text-3xl font-semibold ${
              isDarkTheme ? 'text-white' : 'text-gray-900'
            }`}>
              {value}
            </span>
          )}
        </div>
        <div className={`p-3 rounded-lg ${
          isDarkTheme
            ? 'bg-dark-700/50 text-dark-200'
            : 'bg-gray-100/50 text-gray-600'
        }`}>
          {icon}
        </div>
      </div>
      {description && (
        <p className={`text-sm ${
          isDarkTheme ? 'text-dark-300' : 'text-gray-500'
        }`}>
          {description}
        </p>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { t } = useTranslation();
  const [instances, setInstances] = useState<N8nInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const fetchInstances = async () => {
      try {
        const { items } = await getInstances();
        if (!ignore) {
          setInstances(items);
          setError(null);
        }
      } catch (error: any) {
        if (!ignore) {
          console.error('Error fetching instances:', error);
          setError('Failed to load instances. Please try again later.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchInstances();

    return () => {
      ignore = true;
    };
  }, []);

  // Calculate statistics
  const totalInstances = instances.length;
  const availableInstances = instances.filter(i => i.availability_status).length;
  const totalWorkflows = instances.reduce((sum, i) => 
    sum + i.workflows_active + i.workflows_inactive, 0
  );
  const activeWorkflows = instances.reduce((sum, i) => sum + i.workflows_active, 0);
  const totalWebhooks = instances.reduce((sum, i) => 
    sum + i.webhooks_active + i.webhooks_inactive, 0
  );
  const activeWebhooks = instances.reduce((sum, i) => sum + i.webhooks_active, 0);

  if (error) {
    return (
      <div className={`rounded-lg ${isDarkTheme ? 'bg-dark-800' : 'bg-white'} p-6`}>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <>
      {loading && <LoadingBar />}
      <div className="space-y-8">
        <h1 className={`text-2xl font-bold ${
          isDarkTheme ? 'text-white' : 'text-gray-900'
        }`}>
          {t('nav.dashboard')}
        </h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title={t('nav.instances')}
            value={`${availableInstances}/${totalInstances}`}
            icon={<Server className="h-6 w-6" />}
            description={t('dashboard.instancesDesc')}
            loading={loading}
          />
          <StatCard
            title={t('dashboard.availability')}
            value={`${totalInstances ? Math.round((availableInstances / totalInstances) * 100) : 0}%`}
            icon={<CheckCircle className="h-6 w-6" />}
            description={t('dashboard.availabilityDesc')}
            loading={loading}
          />
          <StatCard
            title={t('dashboard.workflows')}
            value={`${activeWorkflows}/${totalWorkflows}`}
            icon={<Workflow className="h-6 w-6" />}
            description={t('dashboard.workflowsDesc')}
            loading={loading}
          />
          <StatCard
            title={t('dashboard.webhooks')}
            value={`${activeWebhooks}/${totalWebhooks}`}
            icon={<Webhook className="h-6 w-6" />}
            description={t('dashboard.webhooksDesc')}
            loading={loading}
          />
        </div>
      </div>
    </>
  );
}