import axios, { InternalAxiosRequestConfig, AxiosError } from 'axios';
import { ENV_CONFIG } from '../../config/env.config';
import { tokenManager } from '../../utils/tokenManager';

export const apiClient = axios.create({
  baseURL: ENV_CONFIG.API_BASE_URL,
  timeout: 120000,
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getAccessToken();
    if (token) {
      if (!config.headers) {
        config.headers = {} as any;
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      if (config.headers) {
        if (typeof (config.headers as any).delete === 'function') {
          (config.headers as any).delete('Content-Type');
          (config.headers as any).delete('content-type');
        }
        if (typeof (config.headers as any).unset === 'function') {
          (config.headers as any).unset('Content-Type');
          (config.headers as any).unset('content-type');
        }
        delete (config.headers as any)['Content-Type'];
        delete (config.headers as any)['content-type'];
        delete (config.headers as any)['Content-type'];
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor with Token Refresh Logic
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean; _fallbackRetry?: boolean };

    // Network Error fallback: if an external backend URL fails due to network/CORS error, retry with relative local endpoint
    if (!error.response && originalRequest && !originalRequest._fallbackRetry) {
      originalRequest._fallbackRetry = true;
      if (typeof originalRequest.baseURL === 'string' && originalRequest.baseURL.startsWith('http')) {
        console.warn('[apiClient] External API Network Error detected. Retrying request via local backend /api/v1...');
        originalRequest.baseURL = '/api/v1';
        return apiClient(originalRequest);
      }
    }

    // Do not attempt token refresh for authentication requests like login or refresh itself
    if (
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/refresh')
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenManager.getRefreshToken();
      if (!refreshToken) {
        tokenManager.clearAll();
        if (window.location.pathname.startsWith('/portal')) {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${ENV_CONFIG.API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const resData = res.data?.data || res.data;
        const accessToken =
          resData?.accessToken ||
          resData?.tokens?.accessToken ||
          resData?.token;
        const newRefreshToken =
          resData?.refreshToken ||
          resData?.tokens?.refreshToken;

        if (accessToken) {
          tokenManager.setAccessToken(accessToken);
        }
        if (newRefreshToken) {
          tokenManager.setRefreshToken(newRefreshToken);
        }

        processQueue(null, accessToken);
        if (originalRequest.headers && accessToken) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        tokenManager.clearAll();
        if (window.location.pathname.startsWith('/portal')) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
