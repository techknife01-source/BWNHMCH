import { useState, useEffect, useCallback } from 'react';
import { ApiResponse } from '../../../types/index';

export interface UseCmsDataResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCmsData<T>(
  fetcher: () => Promise<ApiResponse<T>>,
  initialData: T | null = null
): UseCmsDataResult<T> {
  const [data, setData] = useState<T | null>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetcher();
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.message || 'Failed to fetch CMS content');
      }
    } catch (err: any) {
      setError(err?.message || 'Network error fetching CMS content');
    } finally {
      setIsLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, isLoading, error, refetch: loadData };
}
