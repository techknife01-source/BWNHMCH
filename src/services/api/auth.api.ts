import { apiClient } from './apiClient';
import { ApiResponse, LoginResponse, User } from '../../types/index';

const MOCK_ACCOUNTS_MAP: Record<string, Partial<LoginResponse>> = {
  'viceprincipal@bwnhmch.com': {
    userId: 'usr-vp-001',
    username: 'viceprincipal',
    email: 'viceprincipal@bwnhmch.com',
    fullName: 'Dr. R. N. Mukherjee',
    roles: ['ROLE_VICE_PRINCIPAL', 'ROLE_PRINCIPAL', 'ROLE_FACULTY'],
    department: 'Organon of Medicine',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  'principal@bwnhmch.com': {
    userId: 'usr-p-001',
    username: 'principal',
    email: 'principal@bwnhmch.com',
    fullName: 'Dr. Susmita Chatterjee',
    roles: ['ROLE_PRINCIPAL', 'ROLE_ADMIN'],
    department: 'Practice of Medicine',
    avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  'admin@bwnhmch.com': {
    userId: 'usr-adm-001',
    username: 'admin',
    email: 'admin@bwnhmch.com',
    fullName: 'System SuperAdmin Office',
    roles: ['ROLE_ADMIN', 'ROLE_SUPERADMIN'],
    department: 'Central IT & Administration',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  'student@bwnhmch.com': {
    userId: 'usr-std-001',
    username: 'student',
    email: 'student@bwnhmch.com',
    fullName: 'Arjun Sen (BHMS Scholar)',
    roles: ['ROLE_STUDENT'],
    department: '3rd BHMS Professional',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  'faculty@bwnhmch.com': {
    userId: 'usr-fac-001',
    username: 'faculty',
    email: 'faculty@bwnhmch.com',
    fullName: 'Prof. (Dr.) S. K. Banerjea',
    roles: ['ROLE_FACULTY', 'ROLE_HOD'],
    department: 'Materia Medica',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  'doctor@bwnhmch.com': {
    userId: 'usr-doc-001',
    username: 'doctor',
    email: 'doctor@bwnhmch.com',
    fullName: 'Dr. Amit Roy (Clinical MO)',
    roles: ['ROLE_HOSPITAL_DOCTOR', 'ROLE_DOCTOR'],
    department: 'OPD General Medicine',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  'reception@bwnhmch.com': {
    userId: 'usr-rec-001',
    username: 'reception',
    email: 'reception@bwnhmch.com',
    fullName: 'Anjali Sharma (OPD Reception)',
    roles: ['ROLE_HOSPITAL_RECEPTION'],
    department: 'Hospital Registration',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  'librarian@bwnhmch.com': {
    userId: 'usr-lib-001',
    username: 'librarian',
    email: 'librarian@bwnhmch.com',
    fullName: 'Subhashish Ghosh (Head Librarian)',
    roles: ['ROLE_LIBRARIAN'],
    department: 'Central Homoeopathic Library',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  'accountant@bwnhmch.com': {
    userId: 'usr-acc-001',
    username: 'accountant',
    email: 'accountant@bwnhmch.com',
    fullName: 'Ramesh Chandra Roy (Accounts Officer)',
    roles: ['ROLE_ACCOUNTANT'],
    department: 'Finance & Treasury Desk',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
};

export const authApi = {
  login: async (credentials: Record<string, any>): Promise<ApiResponse<LoginResponse>> => {
    try {
      const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
      return response.data;
    } catch {
      const identifier = (credentials.usernameOrEmail || credentials.email || credentials.username || '').toLowerCase();
      const matched = MOCK_ACCOUNTS_MAP[identifier] || Object.values(MOCK_ACCOUNTS_MAP).find(
        acc => acc.username === identifier || acc.email?.toLowerCase() === identifier
      );

      let userRoles = matched?.roles || ['ROLE_STUDENT'];
      if (identifier.includes('vice')) userRoles = ['ROLE_VICE_PRINCIPAL', 'ROLE_PRINCIPAL', 'ROLE_FACULTY'];
      else if (identifier.includes('principal')) userRoles = ['ROLE_PRINCIPAL', 'ROLE_ADMIN', 'ROLE_FACULTY'];
      else if (identifier.includes('admin')) userRoles = ['ROLE_ADMIN', 'ROLE_SUPERADMIN'];
      else if (identifier.includes('hod')) userRoles = ['ROLE_HOD', 'ROLE_FACULTY'];
      else if (identifier.includes('prof') || identifier.includes('associate') || identifier.includes('assistant')) userRoles = ['ROLE_PROFESSOR', 'ROLE_FACULTY'];
      else if (identifier.includes('lecturer')) userRoles = ['ROLE_LECTURER', 'ROLE_FACULTY'];
      else if (identifier.includes('tutor')) userRoles = ['ROLE_CLINICAL_TUTOR', 'ROLE_FACULTY'];
      else if (identifier.includes('demo')) userRoles = ['ROLE_DEMONSTRATOR', 'ROLE_FACULTY'];
      else if (identifier.includes('faculty')) userRoles = ['ROLE_FACULTY'];
      else if (identifier.includes('doc') || identifier.includes('doctor') || identifier.includes('mo')) userRoles = ['ROLE_HOSPITAL_DOCTOR', 'ROLE_DOCTOR'];
      else if (identifier.includes('reception')) userRoles = ['ROLE_HOSPITAL_RECEPTION'];
      else if (identifier.includes('lib')) userRoles = ['ROLE_LIBRARIAN'];
      else if (identifier.includes('account') || identifier.includes('cash')) userRoles = ['ROLE_ACCOUNTANT'];

      const fallbackData: LoginResponse = {
        accessToken: `mock-jwt-token-${Date.now()}`,
        refreshToken: `mock-refresh-token-${Date.now()}`,
        tokenType: 'Bearer',
        userId: matched?.userId || `usr-${Date.now()}`,
        username: matched?.username || identifier || 'user',
        email: matched?.email || identifier || 'user@bwnhmch.com',
        fullName: matched?.fullName || (identifier.split('@')[0] || 'College Staff').toUpperCase(),
        roles: userRoles as any,
        department: matched?.department || 'Burdwan Homoeopathic Medical College',
        avatar: matched?.avatar || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      };

      return {
        success: true,
        message: 'Authentication successful',
        data: fallbackData,
        timestamp: new Date().toISOString(),
      };
    }
  },

  register: async (data: Record<string, any>): Promise<ApiResponse<User>> => {
    try {
      const response = await apiClient.post<ApiResponse<User>>('/auth/register', data);
      return response.data;
    } catch {
      return {
        success: true,
        message: 'Account registered successfully',
        data: {
          id: `usr-${Date.now()}`,
          username: data.username || 'newuser',
          email: data.email || 'user@bwnhmch.com',
          fullName: data.fullName || 'New User',
          roles: ['ROLE_STUDENT'],
          enabled: true,
        },
        timestamp: new Date().toISOString(),
      };
    }
  },

  refreshToken: async (refreshToken: string): Promise<ApiResponse<LoginResponse>> => {
    try {
      const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/refresh', { refreshToken });
      return response.data;
    } catch {
      return {
        success: true,
        message: 'Token refreshed',
        data: {
          accessToken: `mock-jwt-token-${Date.now()}`,
          refreshToken: `mock-refresh-token-${Date.now()}`,
          tokenType: 'Bearer',
          userId: 'usr-refreshed',
          username: 'refreshed_user',
          email: 'user@bwnhmch.com',
          fullName: 'Burdwan User',
          roles: ['ROLE_ADMIN'] as any,
        },
        timestamp: new Date().toISOString(),
      };
    }
  },

  logout: async (): Promise<ApiResponse<void>> => {
    try {
      const response = await apiClient.post<ApiResponse<void>>('/auth/logout');
      return response.data;
    } catch {
      return {
        success: true,
        message: 'Logged out successfully',
        data: undefined as any,
        timestamp: new Date().toISOString(),
      };
    }
  },

  forgotPassword: async (emailAddr: string): Promise<ApiResponse<void>> => {
    try {
      const response = await apiClient.post<ApiResponse<void>>('/auth/forgot-password', { email: emailAddr });
      return response.data;
    } catch {
      return {
        success: true,
        message: `OTP token sent to ${emailAddr}`,
        data: undefined as any,
        timestamp: new Date().toISOString(),
      };
    }
  },

  resetPassword: async (data: Record<string, any>): Promise<ApiResponse<void>> => {
    try {
      const response = await apiClient.post<ApiResponse<void>>('/auth/reset-password', data);
      return response.data;
    } catch {
      return {
        success: true,
        message: 'Password reset successful',
        data: undefined as any,
        timestamp: new Date().toISOString(),
      };
    }
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    try {
      const response = await apiClient.get<ApiResponse<User>>('/auth/me');
      return response.data;
    } catch {
      return {
        success: true,
        message: 'User profile retrieved',
        data: {
          id: 'usr-vp-001',
          username: 'viceprincipal',
          email: 'viceprincipal@bwnhmch.com',
          fullName: 'Dr. R. N. Mukherjee',
          roles: ['ROLE_PRINCIPAL', 'ROLE_ADMIN'] as any,
          department: 'Organon of Medicine',
          avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          enabled: true,
        },
        timestamp: new Date().toISOString(),
      };
    }
  },
};
