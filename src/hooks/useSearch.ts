import { useState, useCallback } from 'react';

export interface UseSearchProps<T> {
  data: T[];
  searchFields: (keyof T)[];
  searchValue: string;
}

export function useSearch<T>({ data, searchFields, searchValue }: UseSearchProps<T>) {
  return data.filter(item => 
    searchFields.some(field => {
      const value = String(item[field]).toLowerCase();
      return value.includes(searchValue.toLowerCase());
    })
  );
}