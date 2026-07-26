import { UserStatus, UserType, Role, Permission } from '../types/core.types';
import { hasPermission } from './rbac.utils';

export { hasPermission };

export const getUserStatusBadgeColor = (status: UserStatus): string => {
  switch (status) {
    case UserStatus.ACTIVE:
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
    case UserStatus.INACTIVE:
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    case UserStatus.PENDING:
      return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
    case UserStatus.SUSPENDED:
      return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
    case UserStatus.ARCHIVED:
      return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300';
    default:
      return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
  }
};

export const getUserTypeDisplayLabel = (type: UserType): string => {
  switch (type) {
    case UserType.FACULTY:
      return 'Faculty Member';
    case UserType.STUDENT:
      return 'Student';
    case UserType.PRINCIPAL:
      return 'Principal / Dean';
    case UserType.HOSPITAL_STAFF:
      return 'Hospital & OPD Staff';
    case UserType.ADMIN:
      return 'Administrator';
    case UserType.LIBRARIAN:
      return 'Librarian';
    case UserType.SUPPORT:
      return 'Support Staff';
    default:
      return type;
  }
};

export const getAggregatedPermissions = (userRoles: Role[]): Permission[] => {
  const permMap = new Map<string, Permission>();
  userRoles.forEach((role) => {
    role.permissions.forEach((perm) => {
      permMap.set(perm.key, perm);
    });
  });
  return Array.from(permMap.values());
};
