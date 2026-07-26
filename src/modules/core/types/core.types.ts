/**
 * Shared Core User Management Domain Models
 * Reused across all admin, faculty, student, and staff modules.
 */

// ==========================================
// ENUMS
// ==========================================

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
  ARCHIVED = 'ARCHIVED',
}

export enum UserType {
  STUDENT = 'STUDENT',
  FACULTY = 'FACULTY',
  PRINCIPAL = 'PRINCIPAL',
  HOSPITAL_STAFF = 'HOSPITAL_STAFF',
  ADMIN = 'ADMIN',
  LIBRARIAN = 'LIBRARIAN',
  SUPPORT = 'SUPPORT',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
}

export enum RoleType {
  SYSTEM = 'SYSTEM',
  CUSTOM = 'CUSTOM',
  ACADEMIC = 'ACADEMIC',
  CLINICAL = 'CLINICAL',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
}

export enum PermissionGroup {
  USER_MANAGEMENT = 'USER_MANAGEMENT',
  ROLE_MANAGEMENT = 'ROLE_MANAGEMENT',
  ACADEMIC = 'ACADEMIC',
  HOSPITAL_OPD = 'HOSPITAL_OPD',
  CMS = 'CMS',
  EXAMINATION = 'EXAMINATION',
  FINANCE = 'FINANCE',
  SYSTEM_SETTINGS = 'SYSTEM_SETTINGS',
  REPORTS = 'REPORTS',
}

export enum SessionStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  TERMINATED = 'TERMINATED',
  REVOKED = 'REVOKED',
}

export enum NotificationChannel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  IN_APP = 'IN_APP',
  PUSH = 'PUSH',
}

// ==========================================
// INTERFACES
// ==========================================

export interface Permission {
  id: string;
  key: string;
  name: string;
  description: string;
  group: PermissionGroup;
  isSystem: boolean;
}

export interface Role {
  id: string;
  name: string;
  code: string;
  description: string;
  type: RoleType;
  permissions: Permission[];
  isSystemRole: boolean;
  userCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  description?: string;
  headOfDepartment?: string;
  contactEmail?: string;
  phoneExtension?: string;
  facultyCount?: number;
  isClinical?: boolean;
}

export interface Designation {
  id: string;
  title: string;
  code: string;
  departmentId?: string;
  level: number;
  description?: string;
  isAcademic: boolean;
}

export interface NotificationPreference {
  channel: NotificationChannel;
  enabled: boolean;
  academicAlerts: boolean;
  opdScheduleAlerts: boolean;
  examDutyAlerts: boolean;
  systemAnnouncements: boolean;
}

export interface UserPreference {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notificationPreferences: NotificationPreference[];
  compactView?: boolean;
}

export interface UserProfile {
  id: string;
  userId: string;
  fatherName?: string;
  motherName?: string;
  dob?: string;
  gender?: Gender;
  bloodGroup?: string;
  nationality?: string;
  aadhaarNumberPartial?: string;
  panNumberPartial?: string;
  bio?: string;
  addressStreet?: string;
  addressCity?: string;
  addressState?: string;
  addressPincode?: string;
  addressCountry?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  qualificationSummary?: string;
}

export interface SessionInfo {
  id: string;
  userId: string;
  device: string;
  browser: string;
  ipAddress: string;
  location?: string;
  status: SessionStatus;
  isCurrentSession: boolean;
  loginAt: string;
  lastActiveAt: string;
  expiresAt: string;
}

export interface LoginHistory {
  id: string;
  userId: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED' | 'BLOCKED';
  ipAddress: string;
  location?: string;
  deviceInfo: string;
  failureReason?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  userType: UserType;
  status: UserStatus;
  avatarUrl?: string;
  phoneNumber?: string;
  employeeOrStudentId?: string;
  department?: Department;
  designation?: Designation;
  roles: Role[];
  profile?: UserProfile;
  preferences?: UserPreference;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}
