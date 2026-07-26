import { UserRole } from '../types/index';
import {
  hasRole as coreHasRole,
  hasAnyRole as coreHasAnyRole,
  getUserRoleCodes as coreGetUserRoleCodes,
} from '../modules/core/utils/rbac.utils';

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

export const isFacultyUser = (user: any): boolean => {
  if (!user) return false;

  // 1. Check designation string
  if (user.designation && typeof user.designation === 'string') {
    const des = user.designation.toLowerCase();
    if (FACULTY_DESIGNATIONS.some((d) => des.includes(d.toLowerCase()))) {
      return true;
    }
  }

  // 2. Check roles array
  const roles = coreGetUserRoleCodes(user);
  if (roles.some((r) => FACULTY_ROLE_CODES.includes(r))) {
    return true;
  }

  // 3. Fallback check on email or username
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
  if (isFacultyUser(user)) return false;

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

  if (roles.includes('ROLE_SUPER_ADMIN') || roles.includes('ROLE_SUPERADMIN')) return 'Super Administrator';
  if (roles.includes('ROLE_ADMIN')) return 'Administrator';
  if (roles.includes('ROLE_VICE_PRINCIPAL') || identifier.includes('vice')) return 'Vice Principal';
  if (roles.includes('ROLE_PRINCIPAL') || (identifier.includes('principal') && !identifier.includes('vice'))) return 'Principal';
  if (roles.includes('ROLE_HOD') || identifier.includes('hod')) return 'Head of Department (HOD)';
  if (roles.includes('ROLE_PROFESSOR') || identifier.includes('prof')) return 'Professor';
  if (roles.includes('ROLE_ASSOCIATE_PROFESSOR')) return 'Associate Professor';
  if (roles.includes('ROLE_ASSISTANT_PROFESSOR')) return 'Assistant Professor';
  if (roles.includes('ROLE_LECTURER') || identifier.includes('lecturer')) return 'Lecturer';
  if (roles.includes('ROLE_CLINICAL_TUTOR') || identifier.includes('tutor')) return 'Clinical Tutor';
  if (roles.includes('ROLE_DEMONSTRATOR') || identifier.includes('demo')) return 'Demonstrator';
  if (roles.includes('ROLE_FACULTY') || isFacultyUser(user)) return 'Faculty Member';
  if (roles.includes('ROLE_LIBRARIAN') || identifier.includes('lib')) return 'Head Librarian';
  if (roles.includes('ROLE_HOSPITAL_DOCTOR') || roles.includes('ROLE_DOCTOR') || identifier.includes('doc')) return 'Medical Officer';
  if (roles.includes('ROLE_RECEPTIONIST') || identifier.includes('reception')) return 'Hospital Receptionist';
  if (roles.includes('ROLE_ACCOUNTANT') || identifier.includes('account')) return 'Accounts Officer';
  if (roles.includes('ROLE_STUDENT') || identifier.includes('student')) return 'BHMS Student Scholar';

  return 'Authorized User';
};

export const hasRole = (userOrRoles: any = [], requiredRoles: string[] = []): boolean => {
  if (requiredRoles.length === 0 || requiredRoles.includes('ALL')) return true;

  if (Array.isArray(userOrRoles)) {
    return coreHasAnyRole({ roles: userOrRoles }, requiredRoles);
  }
  return coreHasAnyRole(userOrRoles, requiredRoles);
};

export { coreHasRole, coreHasAnyRole, coreGetUserRoleCodes };

