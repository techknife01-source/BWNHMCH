import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthState } from '../types/index';
import { tokenManager } from '../utils/tokenManager';
import { authApi } from '../services/api/auth.api';

interface AuthContextType extends AuthState {
  login: (data: any) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: tokenManager.getUser(),
    token: tokenManager.getAccessToken(),
    refreshToken: tokenManager.getRefreshToken(),
    isAuthenticated: !!tokenManager.getAccessToken(),
    isLoading: true,
  });

  useEffect(() => {
    const initAuth = async () => {
      const token = tokenManager.getAccessToken();
      if (token) {
        try {
          const res = await authApi.getCurrentUser();
          if (res.data) {
            const userData = res.data;
            const userObj: any = {
              ...userData,
              roles: Array.isArray(userData.roles)
                ? Array.from(userData.roles)
                : typeof (userData as any).role === 'string'
                ? [(userData as any).role]
                : ['ROLE_STUDENT'],
              role: (userData as any).role || (Array.isArray(userData.roles) ? Array.from(userData.roles)[0] : undefined),
              authorities: (userData as any).authorities || userData.roles,
            };
            tokenManager.setUser(userObj);
            setState({
              user: userObj,
              token,
              refreshToken: tokenManager.getRefreshToken(),
              isAuthenticated: true,
              isLoading: false,
            });
            return;
          }
        } catch {
          tokenManager.clearAll();
        }
      }
      setState({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    };

    initAuth();
  }, []);

  const login = async (credentials: any) => {
    const usernameOrEmail = credentials.usernameOrEmail || credentials.email || credentials.username || '';
    const password = credentials.password || '';

    const payload = {
      usernameOrEmail,
      password,
    };

    const res = await authApi.login(payload);
    const loginData = res?.data;

    if (!loginData || !loginData.accessToken) {
      throw new Error(res?.message || 'Login failed: Access token missing in response');
    }

    const { accessToken, refreshToken, userId, username, email, fullName, roles, department, avatar } = loginData;

    const userObj: any = {
      id: userId || (loginData as any).id || 'usr-current',
      username: username || usernameOrEmail,
      email: email || usernameOrEmail,
      fullName: fullName || username || 'User',
      roles: Array.isArray(roles)
        ? roles
        : typeof (loginData as any).role === 'string'
        ? [(loginData as any).role]
        : ['ROLE_STUDENT'],
      role: (loginData as any).role || (Array.isArray(roles) ? roles[0] : undefined),
      authorities: (loginData as any).authorities || roles,
      userType: (loginData as any).userType || (loginData as any).role,
      department: department || '',
      designation: (loginData as any).designation,
      avatar,
      avatarUrl: avatar,
      enabled: true,
    };

    if (accessToken) tokenManager.setAccessToken(accessToken);
    if (refreshToken) tokenManager.setRefreshToken(refreshToken);
    tokenManager.setUser(userObj);

    setState({
      user: userObj,
      token: accessToken,
      refreshToken: refreshToken || null,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    authApi.logout().catch(() => {});
    tokenManager.clearAll();
    setState({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const setUser = (user: User | null) => {
    if (user) tokenManager.setUser(user);
    setState((prev) => ({ ...prev, user }));
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
