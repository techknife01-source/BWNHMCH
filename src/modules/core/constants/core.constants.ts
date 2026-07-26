/**
 * Core User Management Constants
 */

export const CORE_ROUTES = {
  USERS: '/admin/users',
  USER_CREATE: '/admin/users/create',
  USER_DETAIL: '/admin/users/:id',
  USER_EDIT: '/admin/users/:id/edit',
  ROLES: '/admin/roles',
  ROLE_DETAIL: '/admin/roles/:id',
  PERMISSIONS: '/admin/permissions',
  DEPARTMENTS: '/admin/departments',
  DESIGNATIONS: '/admin/designations',
  SESSIONS: '/admin/sessions',
  AUDIT_LOGS: '/admin/audit-logs',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

export const ROLE_NAMES = {
  SUPER_ADMIN: 'ROLE_SUPER_ADMIN',
  ADMIN: 'ROLE_ADMIN',
  PRINCIPAL: 'ROLE_PRINCIPAL',
  VICE_PRINCIPAL: 'ROLE_VICE_PRINCIPAL',
  HOD: 'ROLE_HOD',
  FACULTY: 'ROLE_FACULTY',
  DOCTOR: 'ROLE_DOCTOR',
  STUDENT: 'ROLE_STUDENT',
  ACCOUNTANT: 'ROLE_ACCOUNTANT',
  LIBRARIAN: 'ROLE_LIBRARIAN',
  RECEPTIONIST: 'ROLE_RECEPTIONIST',
  PHARMACIST: 'ROLE_PHARMACIST',
  LAB_TECHNICIAN: 'ROLE_LAB_TECHNICIAN',
  GUEST: 'ROLE_GUEST',
  HOSPITAL_STAFF: 'ROLE_HOSPITAL',
} as const;

export const PERMISSION_KEYS = {
  // User Management
  USER_READ: 'user:read',
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_STATUS_CHANGE: 'user:status-change',

  // Role & Permission Management
  ROLE_READ: 'role:read',
  ROLE_MANAGE: 'role:manage',
  PERMISSION_READ: 'permission:read',
  PERMISSION_ASSIGN: 'permission:assign',

  // Academic Management
  ACADEMIC_READ: 'academic:read',
  ACADEMIC_WRITE: 'academic:write',
  ACADEMIC_APPROVE: 'academic:approve',

  // OPD & Hospital
  HOSPITAL_OPD_VIEW: 'hospital:opd:view',
  HOSPITAL_OPD_MANAGE: 'hospital:opd:manage',
  HOSPITAL_ROSTER_MANAGE: 'hospital:roster:manage',

  // CMS
  CMS_READ: 'cms:read',
  CMS_PUBLISH: 'cms:publish',
  CMS_MANAGE: 'cms:manage',

  // System & Audit
  SYSTEM_SETTINGS: 'system:settings',
  AUDIT_LOGS_VIEW: 'audit:view',
  SESSIONS_TERMINATE: 'sessions:terminate',
} as const;
