import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Key, Clock, X, ExternalLink } from 'lucide-react';
import { createInstance, updateInstance, deleteInstance } from '../services/n8nService';
import type { N8nInstance } from '../services/n8nService';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';
import ConfirmModal from './ui/ConfirmModal';
import useToast from '../hooks/useToast';
import { isDarkTheme } from '../lib/theme';

interface EditInstanceFormProps {
  instance: N8nInstance | null;
  onClose: () => void;
  onSave: () => void;
}

const PROTOCOLS = ['http', 'https'];

export default function EditInstanceForm({ instance, onClose, onSave }: EditInstanceFormProps) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  
  const getInitialValues = () => {
    if (!instance) return { protocol: 'https', host: '' };
    const url = instance.host;
    const protocol = url.startsWith('https://') ? 'https' : 'http';
    const host = url.replace(/^https?:\/\//, '');
    return { protocol, host };
  };

  const initialValues = getInitialValues();
  const [protocol, setProtocol] = useState(initialValues.protocol);
  const [host, setHost] = useState(initialValues.host);
  const [apiKey, setApiKey] = useState(instance?.api_key || '');
  const [checkInterval, setCheckInterval] = useState(instance?.check_interval_mins || 5);
  const [ignoreSSL, setIgnoreSSL] = useState(instance?.ignore_ssl_errors || false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  React.useEffect(() => {
    if (instance) {
      const { protocol: initialProtocol, host: initialHost } = getInitialValues();
      setIsDirty(
        protocol !== initialProtocol ||
        host !== initialHost ||
        apiKey !== instance.api_key ||
        checkInterval !== instance.check_interval_mins ||
        ignoreSSL !== instance.ignore_ssl_errors
      );
    }
  }, [protocol, host, apiKey, checkInterval, ignoreSSL, instance]);

  const isValidNewInstance = 
    host.trim() !== '' && 
    apiKey.trim() !== '' &&
    checkInterval > 0;

  const isSaveEnabled = instance ? isDirty : isValidNewInstance;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSaveEnabled) return;

    setLoading(true);
    setError(null);

    const fullHost = `${protocol}://${host}`;

    try {
      if (instance) {
        const updates: Record<string, any> = {};
        if (fullHost !== instance.host) updates.host = fullHost;
        if (apiKey !== instance.api_key) updates.api_key = apiKey;
        if (checkInterval !== instance.check_interval_mins) updates.check_interval_mins = checkInterval;
        if (ignoreSSL !== instance.ignore_ssl_errors) updates.ignore_ssl_errors = ignoreSSL;
        
        await updateInstance(instance.id, updates);
        onClose();
        setTimeout(() => {
          showToast(t('common.updateSuccess'), 'success');
          onSave();
        }, 300);
      } else {
        await createInstance({
          host: fullHost,
          api_key: apiKey,
          check_interval_mins: checkInterval,
          ignore_ssl_errors: ignoreSSL,
        });
        onClose();
        setTimeout(() => {
          showToast(t('common.createSuccess'), 'success');
          onSave();
        }, 300);
      }
    } catch (err: any) {
      console.error('Error saving instance:', err);
      setError(err.message || t('n8n.updateError'));
      showToast(err.message || t('n8n.updateError'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!instance) return;
    
    setIsDeleting(true);
    try {
      await deleteInstance(instance.id);
      setShowDeleteConfirm(false);
      onClose();
      setTimeout(() => {
        showToast(t('common.deleteSuccess'), 'success');
        onSave();
      }, 300);
    } catch (err: any) {
      console.error('Error deleting instance:', err);
      setError(err.message || t('common.deleteError'));
      showToast(err.message || t('common.deleteError'), 'error');
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Modal onClose={onClose} position="right" width="w-[480px]">
        <div className="h-full flex flex-col">
          <div className={`flex items-center justify-between p-6 border-b ${
            isDarkTheme ? 'border-dark-700' : 'border-gray-200'
          }`}>
            <div>
              <h2 className={`text-lg font-semibold ${
                isDarkTheme ? 'text-white' : 'text-gray-900'
              }`}>
                {instance ? t('n8n.editInstance') : t('n8n.addInstance')}
              </h2>
              {instance && (
                <a
                  href={instance.host}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-2 inline-flex items-center text-sm ${
                    isDarkTheme 
                      ? 'text-dark-200 hover:text-white' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t('n8n.openInstance')}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              )}
            </div>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-all duration-200 ${
                isDarkTheme 
                  ? 'text-dark-200 hover:bg-dark-700 hover:text-white active:bg-dark-600' 
                  : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600 active:bg-gray-200'
              }`}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-6 pt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex space-x-4">
                <div className="w-1/3">
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkTheme ? 'text-dark-100' : 'text-gray-700'
                  }`}>
                    {t('n8n.protocol')}
                  </label>
                  <select
                    value={protocol}
                    onChange={(e) => setProtocol(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDarkTheme 
                        ? 'bg-dark-700 border-dark-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all`}
                  >
                    {PROTOCOLS.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <Input
                    label={t('n8n.host')}
                    value={host}
                    onChange={(e) => {
                      const value = e.target.value.replace(/^https?:\/\//, '');
                      setHost(value);
                    }}
                    placeholder="example.com"
                    icon={<Globe className="h-5 w-5" />}
                    required
                  />
                </div>
              </div>

              <Input
                label={t('n8n.apiKey')}
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                icon={<Key className="h-5 w-5" />}
                required
              />

              <Input
                label={t('n8n.checkInterval')}
                type="number"
                min="1"
                value={checkInterval}
                onChange={(e) => setCheckInterval(parseInt(e.target.value, 10))}
                icon={<Clock className="h-5 w-5" />}
                required
              />

              <div className="mt-8">
                <label className={`flex items-center space-x-3 cursor-pointer ${
                  isDarkTheme ? 'text-dark-100' : 'text-gray-700'
                }`}>
                  <button
                    type="button"
                    onClick={() => setIgnoreSSL(!ignoreSSL)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      ignoreSSL
                        ? isDarkTheme
                          ? 'bg-yellow-500'
                          : 'bg-yellow-600'
                        : isDarkTheme
                          ? 'bg-dark-600'
                          : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        ignoreSSL ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-sm font-medium">
                    {t('n8n.ignoreSSL')}
                  </span>
                </label>
              </div>

              {error && (
                <p className="text-sm text-red-500">
                  {error}
                </p>
              )}
            </form>
          </div>

          <div className={`p-6 border-t ${
            isDarkTheme ? 'border-dark-700' : 'border-gray-200'
          }`}>
            <div className="flex justify-end space-x-4">
              <Button variant="secondary" onClick={onClose}>
                {t('common.cancel')}
              </Button>
              {instance && (
                <Button
                  variant="danger"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={loading}
                >
                  {t('common.delete')}
                </Button>
              )}
              <Button
                onClick={handleSubmit}
                disabled={loading || !isSaveEnabled}
                loading={loading}
              >
                {t('common.save')}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {showDeleteConfirm && (
        <ConfirmModal
          title={t('common.confirmDelete')}
          message={t('n8n.confirmDeleteMessage')}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          loading={isDeleting}
        />
      )}
    </>
  );
}