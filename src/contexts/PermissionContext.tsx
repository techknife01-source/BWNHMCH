import React, { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { hasRole } from '../utils/permissionHelper';

interface PermissionContextType {
  canAccess: (requiredRoles: string[]) => boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const canAccess = (requiredRoles: string[]): boolean => {
    return hasRole(user?.roles || [], requiredRoles);
  };

  return (
    <PermissionContext.Provider value={{ canAccess }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermission = () => {
  const context = useContext(PermissionContext);
  if (!context) throw new Error('usePermission must be used within PermissionProvider');
  return context;
};
