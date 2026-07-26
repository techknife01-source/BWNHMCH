import { User } from './core.types';

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
  userType?: string;
  rememberMe?: boolean;
}

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
  expiresIn?: number;
}

export interface LoginResponseData {
  user: User;
  tokens: AuthTokenResponse;
  requiresOtp?: boolean;
  otpSessionId?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token?: string;
  otpSessionId?: string;
  otp?: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface VerifyOtpRequest {
  otp: string;
  otpSessionId?: string;
  emailOrPhone?: string;
}

export interface ResendOtpRequest {
  otpSessionId?: string;
  emailOrPhone?: string;
  channel?: 'EMAIL' | 'SMS';
}

export interface OtpVerificationResponse {
  verified: boolean;
  message?: string;
  tokens?: AuthTokenResponse;
  user?: User;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface NormalizedAuthError {
  code: string;
  message: string;
  status?: number;
  details?: ApiErrorDetail[];
  rawError?: any;
}
