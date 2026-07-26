import axios from 'axios';

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string>;
}

export const parseApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data && typeof data === 'object') {
      return {
        message: data.message || 'An unexpected error occurred',
        status: error.response?.status,
        errors: data.errors || undefined,
      };
    }
    return {
      message: error.message || 'Network error occurred',
      status: error.response?.status,
    };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: 'An unknown error occurred' };
};
