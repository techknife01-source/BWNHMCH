import { AxiosError } from 'axios';

export interface ParsedApiError {
  statusCode: number;
  message: string;
  isNetworkError: boolean;
  isAuthError: boolean;
  isNotFound: boolean;
  isServerError: boolean;
}

export function parseApiError(error: unknown): ParsedApiError {
  if (error instanceof AxiosError) {
    const statusCode = error.response?.status || 0;
    const isNetworkError = error.code === 'ERR_NETWORK' || error.message.includes('timeout') || statusCode === 0;
    
    let message = 'An unexpected error occurred while fetching dashboard data.';
    
    if (statusCode === 401) {
      message = 'Your session has expired. Please log in again.';
    } else if (statusCode === 403) {
      message = 'You do not have permission to view faculty dashboard metrics.';
    } else if (statusCode === 404) {
      message = 'Requested dashboard resource was not found.';
    } else if (statusCode >= 500) {
      message = 'Server encountered an error while retrieving faculty data.';
    } else if (isNetworkError) {
      message = 'Network connection issue or request timeout. Please check your internet connection.';
    } else if (error.response?.data?.message) {
      message = error.response.data.message;
    }

    return {
      statusCode,
      message,
      isNetworkError,
      isAuthError: statusCode === 401 || statusCode === 403,
      isNotFound: statusCode === 404,
      isServerError: statusCode >= 500,
    };
  }

  return {
    statusCode: 500,
    message: error instanceof Error ? error.message : 'Unknown dashboard error',
    isNetworkError: false,
    isAuthError: false,
    isNotFound: false,
    isServerError: true,
  };
}

export function logDashboardError(context: string, error: unknown) {
  const parsed = parseApiError(error);
  console.error(`[Faculty Dashboard Error - ${context}]:`, {
    statusCode: parsed.statusCode,
    message: parsed.message,
    originalError: error,
  });
}

/**
 * Format numbers cleanly (e.g., 1000 -> 1k, or formatted percentages)
 */
export function formatPercentage(val: number): string {
  return `${val.toFixed(1)}%`;
}
