import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, X, Plus, RotateCw, ExternalLink } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { getInstances } from '../../services/n8nService';
import type { N8nInstance } from '../../services/n8nService';
import { isDarkTheme } from '../../lib/theme';
import { formatDate } from '../../lib/date';
import Table from '../../components/Table';
import TableSkeleton from '../../components/TableSkeleton';
import EditInstanceForm from '../../components/EditInstanceForm';
import LoadingBar from '../../components/LoadingBar';
import Tooltip from '../../components/ui/Tooltip';

export default function Instances() {
  const { t } = useTranslation();
  const [instances, setInstances] = useState<N8nInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedInstance, setSelectedInstance] = useState<N8nInstance | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const { items } = await getInstances();
      setInstances(items);
      setError(null);
    } catch (error: any) {
      console.error('Error refreshing instances:', error);
      setError('Failed to load instances. Please try again later.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Set the refresh handler in the outlet context
  React.useEffect(() => {
    (window as any).__OUTLET_CONTEXT__ = {
      refresh: handleRefresh,
      isRefreshing,
    };
    return () => {
      (window as any).__OUTLET_CONTEXT__ = undefined;
    };
  }, [isRefreshing]);

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

  // Function to extract host without protocol
  const getHostWithoutProtocol = (fullHost: string) => {
    return fullHost.replace(/^https?:\/\//, '');
  };

  const filteredInstances = instances.filter(instance => 
    getHostWithoutProtocol(instance.host).toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: 'host',
      header: t('n8n.host'),
      render: (instance: N8nInstance) => (
        <span className={isDarkTheme ? 'text-white' : 'text-gray-900'}>
          {getHostWithoutProtocol(instance.host)}
        </span>
      ),
    },
    {
      key: 'protocol',
      header: t('n8n.protocol'),
      render: (instance: N8nInstance) => (
        <span className={isDarkTheme ? 'text-white' : 'text-gray-900'}>
          {instance.host.startsWith('https://') ? 'https' : 'http'}
        </span>
      ),
    },
    {
      key: 'ignore_ssl_errors',
      header: t('n8n.ignoreSSL'),
      render: (instance: N8nInstance) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          instance.ignore_ssl_errors
            ? isDarkTheme
              ? 'bg-yellow-500/20 text-yellow-400'
              : 'bg-yellow-100 text-yellow-800'
            : isDarkTheme
              ? 'bg-green-500/20 text-green-400'
              : 'bg-green-100 text-green-800'
        }`}>
          {instance.ignore_ssl_errors ? t('common.yes') : t('common.no')}
        </span>
      ),
    },
    {
      key: 'check_interval_mins',
      header: t('n8n.interval'),
      render: (instance: N8nInstance) => t('n8n.minutes', { count: instance.check_interval_mins }),
    },
    {
      key: 'last_check',
      header: t('n8n.lastCheck'),
      render: (instance: N8nInstance) => formatDate(instance.last_check),
    },
    {
      key: 'availability_status',
      header: t('n8n.available'),
      render: (instance: N8nInstance) => (
        <div className="relative inline-flex items-center">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            instance.availability_status
              ? isDarkTheme
                ? 'bg-green-500/20 text-green-400'
                : 'bg-green-100 text-green-800'
              : isDarkTheme
                ? 'bg-red-500/20 text-red-400'
                : 'bg-red-100 text-red-800'
          }`}>
            {instance.availability_status ? t('common.yes') : t('common.no')}
          </span>
          {!instance.availability_status && instance.availability_note && (
            <Tooltip content={t(`n8n.errors.${instance.availability_note}`) || t('n8n.errors.default')} />
          )}
        </div>
      ),
    },
    {
      key: 'workflows',
      header: t('n8n.workflows'),
      render: (instance: N8nInstance) => (
        <span>
          <span className={isDarkTheme ? 'text-green-400' : 'text-green-600'}>
            {instance.workflows_active}
          </span>
          {' / '}
          <span className={isDarkTheme ? 'text-red-400' : 'text-red-600'}>
            {instance.workflows_inactive}
          </span>
        </span>
      ),
    },
    {
      key: 'webhooks',
      header: t('n8n.webhooks'),
      render: (instance: N8nInstance) => (
        <span>
          <span className={isDarkTheme ? 'text-green-400' : 'text-green-600'}>
            {instance.webhooks_active}
          </span>
          {' / '}
          <span className={isDarkTheme ? 'text-red-400' : 'text-red-600'}>
            {instance.webhooks_inactive}
          </span>
        </span>
      ),
    },
  ];

  const handleInstanceSave = async () => {
    setLoading(true);
    try {
      const { items } = await getInstances();
      setInstances(items);
      setSelectedInstance(null);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error refreshing instances:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingBar />}
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="relative flex-1 max-w-md">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${
              isDarkTheme ? 'text-dark-400' : 'text-gray-400'
            }`} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('n8n.searchPlaceholder')}
              className={`w-full pl-9 pr-8 py-2 ${
                isDarkTheme 
                  ? 'bg-dark-700/50 text-white placeholder-dark-400' 
                  : 'bg-white/50 text-gray-900 placeholder-gray-400'
              } focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all rounded-lg`}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md ${
                  isDarkTheme
                    ? 'hover:bg-dark-600 text-dark-300'
                    : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDarkTheme 
                  ? 'text-dark-200 hover:bg-dark-700/50 hover:text-white' 
                  : 'text-gray-400 hover:bg-gray-100/50 hover:text-gray-600'
              } ${isRefreshing ? 'cursor-not-allowed opacity-50' : ''}`}
              title={t('common.refresh')}
            >
              <RotateCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isDarkTheme
                  ? 'bg-white/50 text-gray-900 hover:bg-white'
                  : 'bg-dark-700 text-white hover:bg-dark-700/50'
              }`}
            >
              <Plus className="h-4 w-4" />
              <span>{t('n8n.addInstance')}</span>
            </button>
          </div>
        </div>

        {loading ? (
          <TableSkeleton columns={columns.length} rows={5} />
        ) : (
          <Table
            columns={columns}
            data={filteredInstances}
            loading={loading}
            error={error}
            emptyMessage={t('n8n.noResults')}
            onRowClick={setSelectedInstance}
            sortable={true}
          />
        )}
      </div>

      <AnimatePresence>
        {(selectedInstance || showAddForm) && (
          <EditInstanceForm
            instance={selectedInstance}
            onClose={() => {
              setSelectedInstance(null);
              setShowAddForm(false);
            }}
            onSave={handleInstanceSave}
          />
        )}
      </AnimatePresence>
    </>
  );
}