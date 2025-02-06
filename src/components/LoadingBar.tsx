import React from 'react';
import { motion } from 'framer-motion';
import { isDarkTheme } from '../lib/theme';

export default function LoadingBar() {
  return (
    <div className="fixed top-0 left-0 right-0 h-0.5 overflow-hidden z-50">
      <motion.div
        className={`h-full ${isDarkTheme ? 'bg-primary-500' : 'bg-dark-800'}`}
        initial={{ width: "0%" }}
        animate={{
          width: ["0%", "30%", "70%", "90%"],
          transition: {
            duration: 1.5,
            ease: "easeInOut",
            repeat: Infinity,
          }
        }}
      />
    </div>
  );
}