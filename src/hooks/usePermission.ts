import { useAuth } from './useAuth';
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getUserPermissionKeys,
} from '../modules/core/utils/rbac.utils';

export function usePermission() {
  const { user, isAuthenticated, isLoading } = useAuth();

  const userPermissions = getUserPermissionKeys(user);

  return {
    userPermissions,
    checkPermission: (perm: string) => hasPermission(user, perm),
    checkAnyPermission: (perms: string[]) => hasAnyPermission(user, perms),
    checkAllPermissions: (perms: string[]) => hasAllPermissions(user, perms),
    hasPermission: (perm: string) => hasPermission(user, perm),
    hasAnyPermission: (perms: string[]) => hasAnyPermission(user, perms),
    hasAllPermissions: (perms: string[]) => hasAllPermissions(user, perms),
    isAuthenticated,
    isLoading,
  };
}
