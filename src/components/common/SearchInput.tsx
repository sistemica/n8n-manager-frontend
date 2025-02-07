import React from 'react';
import { Search, X } from 'lucide-react';
import { isDarkTheme } from '../../lib/theme';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export default function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  return (
    <div className="relative flex-1 max-w-md">
      <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${
        isDarkTheme ? 'text-dark-400' : 'text-gray-400'
      }`} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full pl-9 pr-8 py-2 ${
          isDarkTheme 
            ? 'bg-dark-700/50 text-white placeholder-dark-400' 
            : 'bg-white/50 text-gray-900 placeholder-gray-400'
        } focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all rounded-lg`}
      />
      {value && (
        <button
          onClick={() => onChange('')}
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
  );
}