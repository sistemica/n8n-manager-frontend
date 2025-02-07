import { useState, useEffect } from 'react';

interface UseRefreshableDataProps<T> {
  fetchData: () => Promise<T[]>;
  onError?: (error: Error) => void;
}

export function useRefreshableData<T>({ fetchData, onError }: UseRefreshableDataProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = async () => {
    setIsRefreshing(true);
    try {
      const items = await fetchData();
      setData(items);
      setError(null);
    } catch (error: any) {
      console.error('Error refreshing data:', error);
      const errorMessage = error.message || 'Failed to load data. Please try again later.';
      setError(errorMessage);
      onError?.(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        const items = await fetchData();
        if (!ignore) {
          setData(items);
          setError(null);
        }
      } catch (error: any) {
        if (!ignore) {
          console.error('Error fetching data:', error);
          const errorMessage = error.message || 'Failed to load data. Please try again later.';
          setError(errorMessage);
          onError?.(error);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      ignore = true;
    };
  }, [fetchData, onError]);

  return {
    data,
    loading,
    error,
    isRefreshing,
    refresh
  };
}