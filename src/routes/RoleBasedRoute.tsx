import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { hasRole, isSuperAdmin } from '../utils/permissionHelper';

export interface RoleBasedRouteProps {
  allowedRoles: string[];
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#002147]" />
      </div>
    );
  }

  // Super Admin bypasses all Super Admin route requirements
  if (isSuperAdmin(user) && (allowedRoles.includes('ROLE_SUPER_ADMIN') || allowedRoles.includes('SUPER_ADMIN'))) {
    return <Outlet />;
  }

  if (!hasRole(user, allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
