import React from 'react';
import { isDarkTheme } from '../lib/theme';

interface TableSkeletonProps {
  columns: number;
  rows?: number;
}

export default function TableSkeleton({ columns, rows = 5 }: TableSkeletonProps) {
  return (
    <div className={`-mx-6 ${isDarkTheme ? 'bg-dark-800/50' : 'bg-gray-100'}`}>
      <table className="w-full">
        <thead>
          <tr className={`border-b ${isDarkTheme ? 'border-dark-700' : 'border-gray-200'}`}>
            {Array.from({ length: columns }).map((_, i) => (
              <th
                key={i}
                className="px-6 py-4"
              >
                <div className={`h-4 rounded animate-pulse ${
                  isDarkTheme ? 'bg-dark-700' : 'bg-gray-200'
                }`} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`divide-y ${
          isDarkTheme ? 'divide-dark-700' : 'divide-gray-200'
        }`}>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  <div className={`h-4 rounded animate-pulse ${
                    isDarkTheme ? 'bg-dark-700' : 'bg-gray-200'
                  } ${colIndex === 2 ? 'w-16' : 'w-full'}`} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}