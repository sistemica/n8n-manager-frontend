import React from 'react';
import { AlertCircle } from 'lucide-react';
import { isDarkTheme } from '../../lib/theme';

interface TooltipProps {
  content: string;
}

export default function Tooltip({ content }: TooltipProps) {
  return (
    <div className="group relative ml-2">
      <AlertCircle className={`h-4 w-4 ${
        isDarkTheme ? 'text-dark-300' : 'text-gray-400'
      }`} />
      
      <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className={`relative px-3 py-2 text-sm rounded-lg max-w-xs whitespace-normal ${
          isDarkTheme 
            ? 'bg-dark-700 text-dark-100' 
            : 'bg-gray-700 text-gray-100'
        }`}>
          {content}
          <div className={`absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 rotate-45 ${
            isDarkTheme ? 'bg-dark-700' : 'bg-gray-700'
          }`} />
        </div>
      </div>
    </div>
  );
}