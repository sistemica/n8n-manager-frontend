import React from 'react';
import { ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import { isDarkTheme } from '../lib/theme';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  sortable?: boolean;
}

export default function Table<T>({ 
  columns, 
  data, 
  loading, 
  error, 
  emptyMessage = 'No data found',
  onRowClick,
  sortable = false
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = React.useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const handleSort = (key: string) => {
    if (!sortable) return;
    
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = (a as any)[sortConfig.key];
      const bValue = (b as any)[sortConfig.key];

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  return (
    <div className={`-mx-6 ${isDarkTheme ? 'bg-dark-800/50' : 'bg-gray-100'}`}>
      <table className="w-full">
        <thead>
          <tr className={`border-b ${isDarkTheme ? 'border-dark-700' : 'border-gray-200'}`}>
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => handleSort(column.key)}
                className={`px-6 py-4 text-xs font-bold text-left ${
                  isDarkTheme ? 'text-dark-200' : 'text-gray-500'
                } ${sortable ? 'cursor-pointer select-none' : ''}`}
              >
                <div className="flex items-center space-x-2">
                  <span>{column.header}</span>
                  {sortable && (
                    <div className="flex flex-col">
                      <ChevronUp className={`h-3 w-3 ${
                        sortConfig?.key === column.key && sortConfig.direction === 'asc'
                          ? isDarkTheme ? 'text-white' : 'text-gray-900'
                          : isDarkTheme ? 'text-dark-400' : 'text-gray-400'
                      }`} />
                      <ChevronDown className={`h-3 w-3 -mt-1 ${
                        sortConfig?.key === column.key && sortConfig.direction === 'desc'
                          ? isDarkTheme ? 'text-white' : 'text-gray-900'
                          : isDarkTheme ? 'text-dark-400' : 'text-gray-400'
                      }`} />
                    </div>
                  )}
                </div>
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
          ) : sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (onRowClick ? 1 : 0)} className="px-6 py-4 text-center">
                <span className={isDarkTheme ? 'text-dark-200' : 'text-gray-500'}>
                  {emptyMessage}
                </span>
              </td>
            </tr>
          ) : (
            sortedData.map((item, index) => (
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