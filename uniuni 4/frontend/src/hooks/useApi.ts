import { useState, useEffect, useCallback } from 'react';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function useApi<T>(
  apiFunction: () => Promise<T>,
  options: UseApiOptions = {}
) {
  const { immediate = true, onSuccess, onError } = options;
  
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiFunction();
      setState({ data: result, loading: false, error: null });
      onSuccess?.(result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      onError?.(errorMessage);
      throw error;
    }
  }, [apiFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    execute,
    reset,
    refetch: execute,
  };
}

export function useAsyncApi<T, P extends any[]>(
  apiFunction: (...args: P) => Promise<T>
) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (...args: P) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiFunction(...args);
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Specific hooks for common API patterns

export function useSeatingManagerDashboard() {
  const { seatingApi } = require('../services/seatingApi');
  return useApi(() => seatingApi.getSeatingManagerDashboard());
}

export function useStudentDashboard() {
  const { studentApi } = require('../services/studentApi');
  return useApi(() => studentApi.getStudentDashboard());
}

export function useExams() {
  const { api } = require('../services/api');
  return useApi(() => api.getExams());
}

export function useHalls() {
  const { seatingApi } = require('../services/seatingApi');
  return useApi(() => seatingApi.getHalls());
}

export function useStudentsForAllocation(params: any = {}) {
  const { seatingApi } = require('../services/seatingApi');
  return useApi(() => seatingApi.getStudentsForAllocation(params), { immediate: false });
}

// Mutation hooks for create/update/delete operations

export function useCreateExam() {
  const { seatingApi } = require('../services/seatingApi');
  return useAsyncApi((examData: any) => seatingApi.createExam(examData));
}

export function useUpdateExam() {
  const { seatingApi } = require('../services/seatingApi');
  return useAsyncApi((examId: string, examData: any) => seatingApi.updateExam(examId, examData));
}

export function useDeleteExam() {
  const { seatingApi } = require('../services/seatingApi');
  return useAsyncApi((examId: string) => seatingApi.deleteExam(examId));
}

export function useCreateHall() {
  const { seatingApi } = require('../services/seatingApi');
  return useAsyncApi((hallData: any) => seatingApi.createHall(hallData));
}

export function useUpdateHall() {
  const { seatingApi } = require('../services/seatingApi');
  return useAsyncApi((hallId: string, hallData: any) => seatingApi.updateHall(hallId, hallData));
}

export function useGenerateSeatingAllocation() {
  const { seatingApi } = require('../services/seatingApi');
  return useAsyncApi((examId: string, config: any) => seatingApi.generateSeatingAllocation(examId, config));
}

export function usePublishAllocation() {
  const { seatingApi } = require('../services/seatingApi');
  return useAsyncApi((examId: string) => seatingApi.publishAllocation(examId));
}

export function useStudentSeatingAllocation() {
  const { studentApi } = require('../services/studentApi');
  return useAsyncApi((examId: string) => studentApi.getStudentSeatingAllocation(examId));
}

export function useToggleEventAttendance() {
  const { studentApi } = require('../services/studentApi');
  return useAsyncApi((eventId: string) => studentApi.toggleEventAttendance(eventId));
}

// Authentication hooks

export function useLogin() {
  const { api } = require('../services/api');
  return useAsyncApi((credentials: any) => api.login(credentials));
}

export function useRegister() {
  const { api } = require('../services/api');
  return useAsyncApi((userData: any) => api.register(userData));
}

export function useLogout() {
  const { api } = require('../services/api');
  return useAsyncApi(() => api.logout());
}

// Custom hook for handling pagination
export function usePagination<T>(
  apiFunction: (page: number, limit: number) => Promise<{ data: T[]; totalCount: number; totalPages: number }>,
  initialLimit: number = 10
) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [allData, setAllData] = useState<T[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const { data, loading, error, execute } = useApi(
    () => apiFunction(page, limit),
    {
      immediate: false,
      onSuccess: (result) => {
        if (page === 1) {
          setAllData(result.data);
        } else {
          setAllData(prev => [...prev, ...result.data]);
        }
        setTotalCount(result.totalCount);
        setTotalPages(result.totalPages);
      }
    }
  );

  const loadMore = useCallback(() => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  }, [page, totalPages]);

  const refresh = useCallback(() => {
    setPage(1);
    setAllData([]);
    execute();
  }, [execute]);

  const changeLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
    setAllData([]);
  }, []);

  useEffect(() => {
    execute();
  }, [page, limit, execute]);

  return {
    data: allData,
    loading,
    error,
    page,
    limit,
    totalCount,
    totalPages,
    hasMore: page < totalPages,
    loadMore,
    refresh,
    changeLimit,
  };
}

// Custom hook for real-time data
export function useRealTimeData<T>(
  apiFunction: () => Promise<T>,
  interval: number = 30000 // 30 seconds
) {
  const { data, loading, error, execute } = useApi(apiFunction);

  useEffect(() => {
    const intervalId = setInterval(execute, interval);
    return () => clearInterval(intervalId);
  }, [execute, interval]);

  return { data, loading, error, refresh: execute };
}

export default useApi;