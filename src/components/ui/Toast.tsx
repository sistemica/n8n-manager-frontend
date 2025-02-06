import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';
import { isDarkTheme } from '../../lib/theme';

export type ToastType = 'success' | 'error' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
};

const colors = {
  success: {
    light: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      icon: 'text-green-500',
    },
    dark: {
      bg: 'bg-green-500/20',
      text: 'text-green-400',
      icon: 'text-green-400',
    },
  },
  error: {
    light: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      icon: 'text-red-500',
    },
    dark: {
      bg: 'bg-red-500/20',
      text: 'text-red-400',
      icon: 'text-red-400',
    },
  },
  warning: {
    light: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      icon: 'text-yellow-500',
    },
    dark: {
      bg: 'bg-yellow-500/20',
      text: 'text-yellow-400',
      icon: 'text-yellow-400',
    },
  },
};

export default function Toast({ message, type, onClose }: ToastProps) {
  const Icon = icons[type];
  const theme = isDarkTheme ? colors[type].dark : colors[type].light;

  return createPortal(
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] ${theme.bg} rounded-lg shadow-lg backdrop-blur-sm`}
      style={{ margin: 0 }} // Ensure no auto margins affect positioning
    >
      <div className="px-4 py-3 flex items-center space-x-3">
        <Icon className={`h-5 w-5 flex-shrink-0 ${theme.icon}`} />
        <p className={`text-sm ${theme.text}`}>{message}</p>
        <button
          onClick={onClose}
          className={`p-1 rounded-lg transition-colors ${theme.text} opacity-75 hover:opacity-100 flex-shrink-0`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>,
    document.body // Mount directly to body instead of any container
  );
}