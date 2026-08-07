import { UserRole } from '../types/index';
import {
  hasRole as coreHasRole,
  hasAnyRole as coreHasAnyRole,
  getUserRoleCodes as coreGetUserRoleCodes,
} from '../modules/core/utils/rbac.utils';

export const CORE_ROLES = {
  SUPER_ADMIN: 'ROLE_SUPER_ADMIN',
  PRINCIPAL: 'ROLE_PRINCIPAL',
  VICE_PRINCIPAL: 'ROLE_VICE_PRINCIPAL',
  ADMIN: 'ROLE_ADMIN',
  FACULTY: 'ROLE_FACULTY',
  HOD: 'ROLE_HOD',
  STUDENT: 'ROLE_STUDENT',
} as const;

export const FACULTY_DESIGNATIONS = [
  'Principal',
  'Vice Principal',
  'HOD',
  'Head of Department',
  'Professor',
  'Associate Professor',
  'Assistant Professor',
  'Lecturer',
  'Clinical Tutor',
  'Demonstrator',
];

export const FACULTY_ROLE_CODES = [
  'ROLE_FACULTY',
  'ROLE_PRINCIPAL',
  'ROLE_VICE_PRINCIPAL',
  'ROLE_HOD',
  'ROLE_PROFESSOR',
  'ROLE_ASSOCIATE_PROFESSOR',
  'ROLE_ASSISTANT_PROFESSOR',
  'ROLE_LECTURER',
  'ROLE_CLINICAL_TUTOR',
  'ROLE_DEMONSTRATOR',
  'ROLE_ADMIN',
  'ROLE_SUPER_ADMIN',
  'ROLE_SUPERADMIN',
  'FACULTY',
];

export const isSuperAdmin = (user: any): boolean => {
  if (!user) return false;
  const roles = coreGetUserRoleCodes(user);
  const identifier = (user.email || user.username || '').toLowerCase();
  const des = (user.designation || '').toLowerCase();
  const userType = (user.userType || user.role || user.userRole || '').toLowerCase();
  return (
    roles.includes('ROLE_SUPER_ADMIN') ||
    roles.includes('ROLE_SUPERADMIN') ||
    roles.includes('SUPER_ADMIN') ||
    roles.includes('SUPERADMIN') ||
    userType.includes('superadmin') ||
    des.includes('super admin') ||
    identifier.includes('superadmin')
  );
};

export const isVicePrincipal = (user: any): boolean => {
  if (!user) return false;
  const roles = coreGetUserRoleCodes(user);
  const identifier = (user.email || user.username || '').toLowerCase();
  const des = (user.designation || '').toLowerCase();
  const userType = (user.userType || user.role || user.userRole || '').toLowerCase();
  return (
    roles.includes('ROLE_VICE_PRINCIPAL') ||
    roles.includes('VICE_PRINCIPAL') ||
    roles.includes('ROLE_VICEPRINCIPAL') ||
    userType.includes('vice') ||
    des.includes('vice principal') ||
    des.includes('vice-principal') ||
    identifier.includes('vice')
  );
};

export const isPrincipal = (user: any): boolean => {
  if (!user) return false;
  if (isSuperAdmin(user)) return true;
  if (isVicePrincipal(user)) return false; // Vice Principal is distinct
  const roles = coreGetUserRoleCodes(user);
  const identifier = (user.email || user.username || '').toLowerCase();
  const des = (user.designation || '').toLowerCase();
  const userType = (user.userType || user.role || user.userRole || '').toLowerCase();
  return (
    roles.includes('ROLE_PRINCIPAL') ||
    roles.includes('PRINCIPAL') ||
    userType.includes('principal') ||
    des.includes('principal') ||
    identifier.includes('principal')
  );
};

export const isAdmin = (user: any): boolean => {
  if (!user) return false;
  if (isSuperAdmin(user)) return true;
  const roles = coreGetUserRoleCodes(user);
  const identifier = (user.email || user.username || '').toLowerCase();
  const des = (user.designation || '').toLowerCase();
  const userType = (user.userType || user.role || user.userRole || '').toLowerCase();
  return (
    roles.includes('ROLE_ADMIN') ||
    roles.includes('ADMIN') ||
    userType.includes('admin') ||
    des.includes('admin') ||
    identifier.includes('admin')
  );
};

export const canManageGallery = (user: any): boolean => {
  if (!user) return false;
  return isSuperAdmin(user) || isAdmin(user) || isPrincipal(user) || isVicePrincipal(user);
};

export const isHOD = (user: any): boolean => {
  if (!user) return false;
  const roles = coreGetUserRoleCodes(user);
  const identifier = (user.email || user.username || '').toLowerCase();
  const des = (user.designation || '').toLowerCase();
  return (
    roles.includes('ROLE_HOD') ||
    des.includes('hod') ||
    des.includes('head of department') ||
    identifier.includes('hod')
  );
};

export const isFacultyUser = (user: any): boolean => {
  if (!user) return false;

  // Check designation string
  if (user.designation && typeof user.designation === 'string') {
    const des = user.designation.toLowerCase();
    if (FACULTY_DESIGNATIONS.some((d) => des.includes(d.toLowerCase()))) {
      return true;
    }
  }

  // Check roles array
  const roles = coreGetUserRoleCodes(user);
  if (roles.some((r) => FACULTY_ROLE_CODES.includes(r))) {
    return true;
  }

  // Fallback check on email or username
  const identifier = (user.email || user.username || '').toLowerCase();
  if (
    identifier.includes('vice') ||
    identifier.includes('principal') ||
    identifier.includes('faculty') ||
    identifier.includes('prof') ||
    identifier.includes('hod') ||
    identifier.includes('lecturer') ||
    identifier.includes('tutor') ||
    identifier.includes('demo')
  ) {
    return true;
  }

  return false;
};

export const isStudentUser = (user: any): boolean => {
  if (!user) return false;
  if (isFacultyUser(user) || isSuperAdmin(user) || isAdmin(user)) return false;

  const roles = coreGetUserRoleCodes(user);
  return roles.includes('ROLE_STUDENT') || roles.includes('STUDENT');
};

export const getUserDisplayDesignation = (user: any): string => {
  if (!user) return 'Guest User';

  if (user.designation && typeof user.designation === 'string' && user.designation.trim()) {
    return user.designation;
  }

  const roles = coreGetUserRoleCodes(user);
  const identifier = (user.email || user.username || '').toLowerCase();

  if (isSuperAdmin(user)) return 'Super Administrator';
  if (isVicePrincipal(user)) return 'Vice Principal';
  if (isPrincipal(user)) return 'Principal';
  if (isHOD(user)) return 'Head of Department (HOD)';
  if (isAdmin(user)) return 'Administrator';
  if (roles.includes('ROLE_PROFESSOR') || identifier.includes('prof')) return 'Professor';
  if (roles.includes('ROLE_ASSOCIATE_PROFESSOR')) return 'Associate Professor';
  if (roles.includes('ROLE_ASSISTANT_PROFESSOR')) return 'Assistant Professor';
  if (roles.includes('ROLE_LECTURER') || identifier.includes('lecturer')) return 'Lecturer';
  if (roles.includes('ROLE_CLINICAL_TUTOR') || identifier.includes('tutor')) return 'Clinical Tutor';
  if (roles.includes('ROLE_DEMONSTRATOR') || identifier.includes('demo')) return 'Demonstrator';
  if (isFacultyUser(user)) return 'Faculty Member';
  if (roles.includes('ROLE_LIBRARIAN') || identifier.includes('lib')) return 'Head Librarian';
  if (roles.includes('ROLE_HOSPITAL_DOCTOR') || roles.includes('ROLE_DOCTOR') || identifier.includes('doc')) return 'Medical Officer';
  if (roles.includes('ROLE_RECEPTIONIST') || identifier.includes('reception')) return 'Hospital Receptionist';
  if (roles.includes('ROLE_ACCOUNTANT') || identifier.includes('account')) return 'Accounts Officer';
  if (isStudentUser(user)) return 'BHMS Student Scholar';

  return 'Authorized User';
};

// ==========================================================
// ENTERPRISE RBAC PERMISSION GUARDS (ISSUE 3 REQUIREMENT MATRIX)
// ==========================================================

// ONLY Super Admin and Admin can add/create users
export const canAddUser = (user: any): boolean => {
  return isSuperAdmin(user) || isAdmin(user) || isPrincipal(user);
};

// ONLY Super Admin and Admin can edit users
export const canEditUser = (user: any): boolean => {
  return isSuperAdmin(user) || isAdmin(user) || isPrincipal(user);
};

// ONLY Super Admin and Admin can delete users
export const canDeleteUser = (user: any): boolean => {
  return isSuperAdmin(user) || isAdmin(user) || isPrincipal(user);
};

// Guard specifically for deleting staff members (ROLE_ADMIN or Super Admin)
export const canDeleteStaff = (user: any): boolean => {
  if (!user) return false;
  return isSuperAdmin(user) || isAdmin(user) || isPrincipal(user) || coreHasAnyRole(user, ['ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ADMIN', 'SUPER_ADMIN', 'ROLE_PRINCIPAL']);
};

// ONLY Super Admin can assign roles
export const canAssignRoles = (user: any): boolean => {
  return isSuperAdmin(user);
};

// ONLY Super Admin can access Database Control
export const canManageDatabase = (user: any): boolean => {
  return isSuperAdmin(user);
};

// ONLY Super Admin can manage System Settings
export const canManageSystemSettings = (user: any): boolean => {
  return isSuperAdmin(user);
};

// ONLY Super Admin can manage departments
export const canManageDepartments = (user: any): boolean => {
  return isSuperAdmin(user);
};

// ONLY Super Admin can view system audit logs
export const canViewAuditLogs = (user: any): boolean => {
  return isSuperAdmin(user);
};

// Leave Approval: Super Admin, Principal, Vice Principal, Admin, HOD
export const canApproveLeave = (user: any): boolean => {
  if (!user) return false;
  if (isStudentUser(user)) return false; // Students must NEVER see approve leave button
  return isSuperAdmin(user) || isPrincipal(user) || isVicePrincipal(user) || isAdmin(user) || isHOD(user);
};

// Fee Management: Super Admin, Principal, Admin, Accountant
export const canManageFees = (user: any): boolean => {
  if (!user) return false;
  if (isFacultyUser(user) && !isPrincipal(user) && !isAdmin(user) && !isSuperAdmin(user)) return false; // Faculty can't manage fees
  if (isStudentUser(user)) return false; // Students can't manage fees
  const roles = coreGetUserRoleCodes(user);
  return isSuperAdmin(user) || isPrincipal(user) || isAdmin(user) || roles.includes('ROLE_ACCOUNTANT');
};

// Publish Notices: Super Admin, Principal, Vice Principal, Admin
export const canPublishNotices = (user: any): boolean => {
  if (!user) return false;
  return isSuperAdmin(user) || isPrincipal(user) || isVicePrincipal(user) || isAdmin(user);
};

// Digital Library Upload: Super Admin, Principal, Vice Principal, Admin, Faculty, HOD
export const canUploadDigitalLibrary = (user: any): boolean => {
  if (!user) return false;
  if (isStudentUser(user)) return false; // Students cannot upload
  return true; // All staff / faculty / admins can upload
};

// Digital Library Access: All roles
export const canAccessDigitalLibrary = (user: any): boolean => {
  return !!user;
};

// Document Approval: Super Admin, Principal, Vice Principal
export const canApproveDocuments = (user: any): boolean => {
  return isSuperAdmin(user) || isPrincipal(user) || isVicePrincipal(user);
};

export const hasRole = (userOrRoles: any = [], requiredRoles: string[] = []): boolean => {
  if (requiredRoles.length === 0 || requiredRoles.includes('ALL')) return true;

  if (Array.isArray(userOrRoles)) {
    return coreHasAnyRole({ roles: userOrRoles }, requiredRoles);
  }
  return coreHasAnyRole(userOrRoles, requiredRoles);
};

export { coreHasRole, coreHasAnyRole, coreGetUserRoleCodes };


