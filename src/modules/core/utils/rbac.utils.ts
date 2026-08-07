import { ROLE_NAMES } from '../constants/core.constants';

/**
 * Normalizes a role string into uppercase with 'ROLE_' prefix if missing.
 */
export const normalizeRole = (role: string): string => {
  if (!role) return '';
  const trimmed = role.trim().toUpperCase();
  if (trimmed.startsWith('ROLE_')) return trimmed;
  return `ROLE_${trimmed}`;
};

/**
 * Extracts all active role strings from a user object.
 * Supports string arrays, UserRole arrays, Role object arrays, and userType strings.
 */
export const getUserRoleCodes = (user: any): string[] => {
  if (!user) return [];
  const roleSet = new Set<string>();

  // Check single string role properties (e.g. role, userRole, roleName, userType)
  ['role', 'userRole', 'roleName', 'userType'].forEach((prop) => {
    if (user[prop] && typeof user[prop] === 'string') {
      const raw = user[prop].trim().toUpperCase();
      roleSet.add(raw);
      roleSet.add(normalizeRole(raw));
    }
  });

  // Add roles from user.roles or user.authorities
  const roleList = Array.isArray(user.roles)
    ? user.roles
    : Array.isArray(user.authorities)
    ? user.authorities
    : [];

  if (roleList.length > 0) {
    roleList.forEach((r: any) => {
      if (typeof r === 'string') {
        const trimmed = r.trim().toUpperCase();
        roleSet.add(trimmed);
        roleSet.add(normalizeRole(trimmed));
      } else if (r && typeof r === 'object') {
        if (r.authority && typeof r.authority === 'string') {
          const authTrimmed = r.authority.trim().toUpperCase();
          roleSet.add(authTrimmed);
          roleSet.add(normalizeRole(authTrimmed));
        }
        if (r.name && typeof r.name === 'string') {
          const nameTrimmed = r.name.trim().toUpperCase();
          roleSet.add(nameTrimmed);
          roleSet.add(normalizeRole(nameTrimmed));
        }
        if (r.code && typeof r.code === 'string') {
          const codeTrimmed = r.code.trim().toUpperCase();
          roleSet.add(codeTrimmed);
          roleSet.add(normalizeRole(codeTrimmed));
        }
      }
    });
  }

  // Check designation & identifier for automatic Faculty mapping
  const des = (user.designation || '').toLowerCase();
  const emailOrName = (user.email || user.username || '').toLowerCase();
  
  const isFacultyDesignation = [
    'principal',
    'vice principal',
    'hod',
    'head of department',
    'professor',
    'associate professor',
    'assistant professor',
    'lecturer',
    'clinical tutor',
    'tutor',
    'demonstrator'
  ].some(d => des.includes(d)) ||
  emailOrName.includes('vice') ||
  emailOrName.includes('principal') ||
  emailOrName.includes('faculty') ||
  emailOrName.includes('prof') ||
  emailOrName.includes('hod') ||
  emailOrName.includes('lecturer') ||
  emailOrName.includes('tutor') ||
  emailOrName.includes('demo');

  if (isFacultyDesignation) {
    roleSet.add('ROLE_FACULTY');
    roleSet.add('FACULTY');
    
    if (des.includes('vice principal') || emailOrName.includes('vice')) {
      roleSet.add('ROLE_VICE_PRINCIPAL');
      roleSet.add('ROLE_PRINCIPAL');
    } else if (des.includes('principal') || emailOrName.includes('principal')) {
      roleSet.add('ROLE_PRINCIPAL');
    }
    if (des.includes('hod') || emailOrName.includes('hod')) {
      roleSet.add('ROLE_HOD');
    }

    // Crucial: Faculty members are never students
    roleSet.delete('ROLE_STUDENT');
    roleSet.delete('STUDENT');
  }

  // If role Set is empty and user is valid, default to GUEST
  if (roleSet.size === 0) {
    roleSet.add(ROLE_NAMES.GUEST);
    roleSet.add('GUEST');
  }

  return Array.from(roleSet);
};

/**
 * Extracts all permission keys assigned to a user directly or via roles.
 */
export const getUserPermissionKeys = (user: any): string[] => {
  if (!user) return [];
  const permSet = new Set<string>();

  // Direct permissions on user
  if (Array.isArray(user.permissions)) {
    user.permissions.forEach((p: any) => {
      if (typeof p === 'string') {
        permSet.add(p);
      } else if (p && typeof p === 'object' && p.key) {
        permSet.add(p.key);
      }
    });
  }

  // Permissions inside user.roles
  if (Array.isArray(user.roles)) {
    user.roles.forEach((r: any) => {
      if (r && typeof r === 'object' && Array.isArray(r.permissions)) {
        r.permissions.forEach((p: any) => {
          if (typeof p === 'string') {
            permSet.add(p);
          } else if (p && typeof p === 'object' && p.key) {
            permSet.add(p.key);
          }
        });
      }
    });
  }

  return Array.from(permSet);
};

/**
 * Checks if a user has a specific role.
 */
export const hasRole = (user: any, role: string): boolean => {
  if (!user || !role) return false;
  if (role === 'ALL' || role === '*') return true;
  
  const userRoles = getUserRoleCodes(user);
  const normalizedTarget = normalizeRole(role);
  const rawTarget = role.trim().toUpperCase();

  return userRoles.includes(normalizedTarget) || userRoles.includes(rawTarget);
};

/**
 * Checks if a user has ANY of the specified roles.
 */
export const hasAnyRole = (user: any, roles: string[]): boolean => {
  if (!user || !roles || roles.length === 0) return false;
  if (roles.includes('ALL') || roles.includes('*')) return true;
  return roles.some((r) => hasRole(user, r));
};

/**
 * Checks if a user has ALL of the specified roles.
 */
export const hasAllRoles = (user: any, roles: string[]): boolean => {
  if (!user || !roles) return false;
  if (roles.length === 0) return true;
  return roles.every((r) => hasRole(user, r));
};

/**
 * Checks if a user has a specific permission.
 * Super Admins automatically bypass and pass all permission checks.
 */
export const hasPermission = (user: any, permissionKey: string): boolean => {
  if (!user || !permissionKey) return false;
  
  // Super Admin bypass
  if (hasRole(user, ROLE_NAMES.SUPER_ADMIN) || hasRole(user, 'SUPER_ADMIN')) {
    return true;
  }

  const userPerms = getUserPermissionKeys(user);
  return userPerms.includes(permissionKey);
};

/**
 * Checks if a user has ANY of the specified permissions.
 */
export const hasAnyPermission = (user: any, permissions: string[]): boolean => {
  if (!user || !permissions || permissions.length === 0) return false;
  if (hasRole(user, ROLE_NAMES.SUPER_ADMIN) || hasRole(user, 'SUPER_ADMIN')) {
    return true;
  }
  return permissions.some((p) => hasPermission(user, p));
};

/**
 * Checks if a user has ALL of the specified permissions.
 */
export const hasAllPermissions = (user: any, permissions: string[]): boolean => {
  if (!user || !permissions) return false;
  if (hasRole(user, ROLE_NAMES.SUPER_ADMIN) || hasRole(user, 'SUPER_ADMIN')) {
    return true;
  }
  if (permissions.length === 0) return true;
  return permissions.every((p) => hasPermission(user, p));
};
