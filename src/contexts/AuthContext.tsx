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
            tokenManager.setUser(res.data);
            setState({
              user: res.data,
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

    const userObj: User = {
      id: userId || 'usr-current',
      username: username || usernameOrEmail,
      email: email || usernameOrEmail,
      fullName: fullName || username || 'User',
      roles: (roles || ['ROLE_STUDENT']) as any,
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
