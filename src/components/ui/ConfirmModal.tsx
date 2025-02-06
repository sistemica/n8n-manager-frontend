import React from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { isDarkTheme } from '../../lib/theme';
import Button from './Button';

interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
  loading
}: ConfirmModalProps) {
  const { t } = useTranslation();

  return createPortal(
    <div className="fixed inset-0 z-[110]">
      {/* Backdrop with blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 backdrop-blur-sm bg-black/50"
        onClick={onCancel}
      />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 rounded-lg shadow-xl ${
          isDarkTheme 
            ? 'bg-dark-800/95 backdrop-blur-sm' 
            : 'bg-white/95 backdrop-blur-sm'
        }`}
        style={{ margin: 0 }} // Ensure no auto margins affect positioning
      >
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-full ${
            isDarkTheme ? 'bg-red-500/20' : 'bg-red-100'
          }`}>
            <AlertTriangle className={`h-6 w-6 ${
              isDarkTheme ? 'text-red-400' : 'text-red-600'
            }`} />
          </div>
          <div>
            <h3 className={`text-lg font-semibold mb-1 ${
              isDarkTheme ? 'text-white' : 'text-gray-900'
            }`}>
              {title}
            </h3>
            <p className={isDarkTheme ? 'text-dark-200' : 'text-gray-600'}>
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            {t('common.cancel')}
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            loading={loading}
          >
            {loading ? t('common.deleting') : t('common.delete')}
          </Button>
        </div>
      </motion.div>
    </div>,
    document.body // Mount directly to body instead of modal-root
  );
}