import { AxiosError } from 'axios';
import { apiClient } from '../../../services/api/apiClient';
import { ApiResponse } from '../../../types/index';
import { tokenManager } from '../../../utils/tokenManager';
import {
  LoginRequest,
  LoginResponseData,
  AuthTokenResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  VerifyOtpRequest,
  ResendOtpRequest,
  OtpVerificationResponse,
  NormalizedAuthError,
  User,
} from '../types';

/**
 * Normalizes API and network errors into a consistent NormalizedAuthError object.
 */
export const normalizeAuthError = (error: any): NormalizedAuthError => {
  if (error && typeof error === 'object' && 'code' in error && 'message' in error && !('isAxiosError' in error)) {
    return error as NormalizedAuthError;
  }

  const axiosErr = error as AxiosError<any>;
  if (axiosErr?.response?.data) {
    const apiRes = axiosErr.response.data;
    return {
      code: apiRes.code || `HTTP_${axiosErr.response.status}`,
      message: apiRes.message || 'An error occurred during authentication',
      status: axiosErr.response.status,
      details: apiRes.errors || apiRes.details,
      rawError: error,
    };
  }

  if (axiosErr?.request) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Unable to communicate with the server. Please check your internet connection.',
      status: 0,
      rawError: error,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: error?.message || 'An unexpected authentication error occurred.',
    rawError: error,
  };
};

export const authService = {
  /**
   * Authenticate user with credentials
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponseData>> {
    try {
      const usernameOrEmail =
        credentials.usernameOrEmail ||
        (credentials as any).email ||
        (credentials as any).username ||
        '';
      const password = credentials.password || '';

      const payload = {
        usernameOrEmail,
        password,
      };

      const response = await apiClient.post<any>('/auth/login', payload);
      const rawData = response.data;
      const resData = rawData?.data || rawData;

      const accessToken =
        resData?.accessToken ||
        resData?.tokens?.accessToken ||
        resData?.token ||
        rawData?.accessToken ||
        rawData?.token ||
        '';

      const refreshToken =
        resData?.refreshToken ||
        resData?.tokens?.refreshToken ||
        rawData?.refreshToken ||
        '';

      if (accessToken) {
        tokenManager.setAccessToken(accessToken);
      }
      if (refreshToken) {
        tokenManager.setRefreshToken(refreshToken);
      }
      if (resData?.user || rawData?.user) {
        tokenManager.setUser(resData?.user || rawData?.user);
      }

      return rawData;
    } catch (err) {
      throw normalizeAuthError(err);
    }
  },

  /**
   * Log out the current user session
   */
  async logout(): Promise<ApiResponse<void>> {
    try {
      let responseData: ApiResponse<void> = {
        success: true,
        message: 'Logged out successfully',
        data: undefined,
        timestamp: new Date().toISOString(),
      };
      try {
        const response = await apiClient.post<ApiResponse<void>>('/auth/logout');
        responseData = response.data;
      } catch (ignored) {
        // Even if server session termination fails, clear local tokens
      } finally {
        tokenManager.clearAll();
      }
      return responseData;
    } catch (err) {
      tokenManager.clearAll();
      throw normalizeAuthError(err);
    }
  },

  /**
   * Refresh authentication access token
   */
  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthTokenResponse>> {
    try {
      const response = await apiClient.post<ApiResponse<AuthTokenResponse>>('/auth/refresh', { refreshToken });
      if (response.data?.data?.accessToken) {
        tokenManager.setAccessToken(response.data.data.accessToken);
        if (response.data.data.refreshToken) {
          tokenManager.setRefreshToken(response.data.data.refreshToken);
        }
      }
      return response.data;
    } catch (err) {
      throw normalizeAuthError(err);
    }
  },

  /**
   * Fetch details of currently authenticated user
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.get<ApiResponse<User>>('/auth/me');
      if (response.data?.data) {
        tokenManager.setUser(response.data.data);
      }
      return response.data;
    } catch (err) {
      throw normalizeAuthError(err);
    }
  },

  /**
   * Request password reset link/OTP via email
   */
  async forgotPassword(payload: ForgotPasswordRequest): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post<ApiResponse<void>>('/auth/forgot-password', payload);
      return response.data;
    } catch (err) {
      throw normalizeAuthError(err);
    }
  },

  /**
   * Reset password using reset token / OTP
   */
  async resetPassword(payload: ResetPasswordRequest): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post<ApiResponse<void>>('/auth/reset-password', payload);
      return response.data;
    } catch (err) {
      throw normalizeAuthError(err);
    }
  },

  /**
   * Change password for logged in user
   */
  async changePassword(payload: ChangePasswordRequest): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post<ApiResponse<void>>('/auth/change-password', payload);
      return response.data;
    } catch (err) {
      throw normalizeAuthError(err);
    }
  },

  /**
   * Verify One-Time Password
   */
  async verifyOtp(payload: VerifyOtpRequest): Promise<ApiResponse<OtpVerificationResponse>> {
    try {
      const response = await apiClient.post<ApiResponse<OtpVerificationResponse>>('/auth/verify-otp', payload);
      if (response.data?.data?.tokens?.accessToken) {
        tokenManager.setAccessToken(response.data.data.tokens.accessToken);
      }
      if (response.data?.data?.tokens?.refreshToken) {
        tokenManager.setRefreshToken(response.data.data.tokens.refreshToken);
      }
      if (response.data?.data?.user) {
        tokenManager.setUser(response.data.data.user);
      }
      return response.data;
    } catch (err) {
      throw normalizeAuthError(err);
    }
  },

  /**
   * Resend One-Time Password
   */
  async resendOtp(payload: ResendOtpRequest): Promise<ApiResponse<{ sent: boolean; message?: string }>> {
    try {
      const response = await apiClient.post<ApiResponse<{ sent: boolean; message?: string }>>('/auth/resend-otp', payload);
      return response.data;
    } catch (err) {
      throw normalizeAuthError(err);
    }
  },
};
