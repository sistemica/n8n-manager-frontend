import React from 'react';
import { ChevronRight } from 'lucide-react';
import { isDarkTheme } from '../lib/theme';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

export default function Table<T>({ 
  columns, 
  data, 
  loading, 
  error, 
  emptyMessage = 'No data found',
  onRowClick 
}: TableProps<T>) {
  return (
    <div className={`-mx-6 ${isDarkTheme ? 'bg-dark-800/50' : 'bg-gray-100'}`}>
      <table className="w-full">
        <thead>
          <tr className={`border-b ${isDarkTheme ? 'border-dark-700' : 'border-gray-200'}`}>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-4 text-xs font-bold text-left ${
                  isDarkTheme ? 'text-dark-200' : 'text-gray-500'
                }`}
              >
                {column.header}
              </th>
            ))}
            {onRowClick && <th className="w-10 pr-4" />}
          </tr>
        </thead>
        <tbody className={`divide-y ${
          isDarkTheme ? 'divide-dark-700' : 'divide-gray-200'
        }`}>
          {loading ? (
            <tr>
              <td colSpan={columns.length + (onRowClick ? 1 : 0)} className="px-6 py-4 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-500 border-t-transparent" />
                  <span className={isDarkTheme ? 'text-dark-200' : 'text-gray-500'}>
                    Loading...
                  </span>
                </div>
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={columns.length + (onRowClick ? 1 : 0)} className="px-6 py-4 text-center">
                <span className={`${isDarkTheme ? 'text-red-400' : 'text-red-600'}`}>
                  {error}
                </span>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (onRowClick ? 1 : 0)} className="px-6 py-4 text-center">
                <span className={isDarkTheme ? 'text-dark-200' : 'text-gray-500'}>
                  {emptyMessage}
                </span>
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr 
                key={index}
                onClick={() => onRowClick?.(item)}
                className={`transition-colors ${
                  onRowClick && (isDarkTheme 
                    ? 'cursor-pointer hover:bg-dark-700/20'
                    : 'cursor-pointer hover:bg-gray-50/80')
                }`}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-6 py-4 text-xs ${
                      isDarkTheme ? 'text-dark-200' : 'text-gray-600'
                    }`}
                  >
                    {column.render ? column.render(item) : (item as any)[column.key]}
                  </td>
                ))}
                {onRowClick && (
                  <td className="w-10 pr-4">
                    <ChevronRight className={`h-4 w-4 ml-auto ${
                      isDarkTheme ? 'text-dark-400' : 'text-gray-400'
                    }`} />
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}