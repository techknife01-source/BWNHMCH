import { useAuth } from './useAuth';
import {
  hasRole,
  hasAnyRole,
  hasAllRoles,
  getUserRoleCodes,
} from '../modules/core/utils/rbac.utils';

export function useRole() {
  const { user, isAuthenticated, isLoading } = useAuth();

  const userRoles = getUserRoleCodes(user);

  return {
    userRoles,
    checkRole: (role: string) => hasRole(user, role),
    checkAnyRole: (roles: string[]) => hasAnyRole(user, roles),
    checkAllRoles: (roles: string[]) => hasAllRoles(user, roles),
    hasRole: (role: string) => hasRole(user, role),
    hasAnyRole: (roles: string[]) => hasAnyRole(user, roles),
    hasAllRoles: (roles: string[]) => hasAllRoles(user, roles),
    isAuthenticated,
    isLoading,
  };
}
