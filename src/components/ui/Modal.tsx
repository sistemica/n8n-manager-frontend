import React from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { isDarkTheme } from '../../lib/theme';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  position?: 'center' | 'right';
  width?: string;
}

export default function Modal({ 
  children, 
  onClose, 
  position = 'center',
  width = 'max-w-md'
}: ModalProps) {
  return createPortal(
    <div className="fixed inset-0 isolate z-[100]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={position === 'right' ? { x: '100%' } : { scale: 0.9, opacity: 0 }}
        animate={position === 'right' ? { x: 0 } : { scale: 1, opacity: 1 }}
        exit={position === 'right' ? { x: '100%' } : { scale: 0.9, opacity: 0 }}
        transition={
          position === 'right'
            ? { type: 'spring', damping: 25, stiffness: 200 }
            : { type: 'spring', damping: 20, stiffness: 300 }
        }
        className={`
          fixed
          ${position === 'right'
            ? 'top-0 bottom-0 right-0 w-96'
            : `top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${width}`
          }
          ${isDarkTheme ? 'bg-dark-800' : 'bg-white'}
          shadow-xl
          ${position === 'center' ? 'rounded-lg' : ''}
          z-[110]
        `}
      >
        {children}
      </motion.div>
    </div>,
    document.body
  );
}