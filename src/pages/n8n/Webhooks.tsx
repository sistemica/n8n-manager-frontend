import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, X, ExternalLink, AlertTriangle, RotateCw } from 'lucide-react';
import { getWebhooks } from '../../services/webhookService';
import type { Webhook } from '../../services/webhookService';
import { isDarkTheme } from '../../lib/theme';
import Table from '../../components/Table';
import TableSkeleton from '../../components/TableSkeleton';
import LoadingBar from '../../components/LoadingBar';

export default function Webhooks() {
  const { t } = useTranslation();
  const { instanceId } = useParams();
  const navigate = useNavigate();
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!instanceId) return;
    setIsRefreshing(true);
    try {
      const { items } = await getWebhooks(instanceId);
      setWebhooks(items);
      setError(null);
    } catch (error: any) {
      console.error('Error refreshing webhooks:', error);
      setError('Failed to load webhooks. Please try again later.');
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
    if (!instanceId) {
      navigate('/app/n8n/instances');
      return;
    }

    let ignore = false;

    const fetchWebhooks = async () => {
      try {
        const { items } = await getWebhooks(instanceId);
        if (!ignore) {
          setWebhooks(items);
          setError(null);
        }
      } catch (error: any) {
        if (!ignore) {
          console.error('Error fetching webhooks:', error);
          setError('Failed to load webhooks. Please try again later.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchWebhooks();

    return () => {
      ignore = true;
    };
  }, [instanceId, navigate]);

  // Function to extract webhook path without protocol and hostname
  const getWebhookPath = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.replace('/webhook/', '');
    } catch {
      return url;
    }
  };

  // Function to safely parse methods
  const parseMethods = (methodsStr: string): string[] => {
    try {
      // If it's already an array, return it
      if (Array.isArray(methodsStr)) return methodsStr;
      
      // If it's a JSON string, parse it
      if (typeof methodsStr === 'string' && methodsStr.startsWith('[')) {
        return JSON.parse(methodsStr);
      }
      
      // If it's a single method string, wrap it in an array
      return [methodsStr];
    } catch {
      // If parsing fails, return an empty array
      console.warn('Failed to parse methods:', methodsStr);
      return [];
    }
  };

  const filteredWebhooks = webhooks.filter(webhook => 
    webhook.workflow_name.toLowerCase().includes(search.toLowerCase()) ||
    getWebhookPath(webhook.webhook_url).toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: 'webhook_url',
      header: t('n8n.webhookUrl'),
      render: (webhook: Webhook) => (
        <div className="flex items-center">
          {webhook.auth_type ? (
            <span className={`mr-2 ${
              isDarkTheme ? 'text-dark-300' : 'text-gray-400'
            }`}>
              🔒
            </span>
          ) : (
            <span className={`mr-2 ${
              isDarkTheme ? 'text-yellow-400' : 'text-yellow-600'
            }`}>
              <AlertTriangle className="h-4 w-4" />
            </span>
          )}
          <span className={isDarkTheme ? 'text-white' : 'text-gray-900'}>
            {getWebhookPath(webhook.webhook_url)}
          </span>
        </div>
      ),
    },
    {
      key: 'methods',
      header: t('n8n.methods'),
      render: (webhook: Webhook) => {
        const methods = parseMethods(webhook.methods);
        return (
          <div className="flex flex-wrap gap-1">
            {methods.map((method, index) => {
              let bgColor = '';
              let textColor = '';
              
              // Color mapping for different HTTP methods
              switch (method.toUpperCase()) {
                case 'GET':
                  bgColor = isDarkTheme ? 'bg-blue-500/20' : 'bg-blue-100';
                  textColor = isDarkTheme ? 'text-blue-400' : 'text-blue-700';
                  break;
                case 'POST':
                  bgColor = isDarkTheme ? 'bg-green-500/20' : 'bg-green-100';
                  textColor = isDarkTheme ? 'text-green-400' : 'text-green-700';
                  break;
                case 'PUT':
                  bgColor = isDarkTheme ? 'bg-yellow-500/20' : 'bg-yellow-100';
                  textColor = isDarkTheme ? 'text-yellow-400' : 'text-yellow-700';
                  break;
                case 'DELETE':
                  bgColor = isDarkTheme ? 'bg-red-500/20' : 'bg-red-100';
                  textColor = isDarkTheme ? 'text-red-400' : 'text-red-700';
                  break;
                case 'PATCH':
                  bgColor = isDarkTheme ? 'bg-purple-500/20' : 'bg-purple-100';
                  textColor = isDarkTheme ? 'text-purple-400' : 'text-purple-700';
                  break;
                default:
                  bgColor = isDarkTheme ? 'bg-dark-700' : 'bg-gray-100';
                  textColor = isDarkTheme ? 'text-dark-200' : 'text-gray-600';
              }

              return (
                <span
                  key={`${method}-${index}`}
                  className={`px-2 py-0.5 text-xs font-medium rounded-full ${bgColor} ${textColor}`}
                >
                  {method.toUpperCase()}
                </span>
              );
            })}
          </div>
        );
      },
    },
    {
      key: 'workflow_name',
      header: t('n8n.workflowName'),
      render: (webhook: Webhook) => (
        <div className="flex items-center">
          <span className={isDarkTheme ? 'text-white' : 'text-gray-900'}>
            {webhook.workflow_name}
          </span>
          <a
            href={`${webhook.webhook_url.split('/webhook/')[0]}/workflow/${webhook.workflow_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`ml-2 ${
              isDarkTheme 
                ? 'text-dark-300 hover:text-white' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      ),
    },
  ];

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
              placeholder={t('n8n.searchWebhooksPlaceholder')}
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
          </div>
        </div>

        {loading ? (
          <TableSkeleton columns={columns.length} rows={5} />
        ) : (
          <Table
            columns={columns}
            data={filteredWebhooks}
            loading={loading}
            error={error}
            emptyMessage={t('n8n.noWebhooksFound')}
            sortable={true}
          />
        )}
      </div>
    </>
  );
}