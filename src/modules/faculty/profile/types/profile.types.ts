export interface PersonalInformation {
  fullName: string;
  fatherName: string;
  motherName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  nationality: string;
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  languagesKnown: string[];
  category?: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
  aadhaarNumberPartial?: string;
  panNumberPartial?: string;
}

export interface AcademicQualification {
  id: string;
  degree: string;
  specialization: string;
  institution: string;
  university: string;
  yearOfPassing: number;
  percentageOrGrade: string;
  certificateUrl?: string;
  isVerified: boolean;
}

export interface DepartmentInformation {
  departmentId: string;
  departmentName: string;
  code: string;
  designation: string;
  joiningDate: string;
  isHod: boolean;
  cabinNumber: string;
  officeExtensionPhone: string;
  officeHours: string;
  assignedCourses: string[];
}

export interface TeachingExperience {
  id: string;
  institution: string;
  designation: string;
  department: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  subjectsTaught: string[];
  type: 'Full-time' | 'Part-time' | 'Visiting' | 'Adjunct';
}

export interface ResearchExperience {
  id: string;
  title: string;
  role: 'Principal Investigator' | 'Co-Investigator' | 'Lead Researcher' | 'Author';
  fundingAgency?: string;
  grantAmount?: string;
  status: 'Ongoing' | 'Completed' | 'Published' | 'Under Review';
  year: number;
  doiOrLink?: string;
  journalOrConference?: string;
}

export interface AwardRecognition {
  id: string;
  title: string;
  awardingBody: string;
  year: number;
  category: 'Academic' | 'Clinical' | 'Research' | 'Government' | 'Institutional';
  description?: string;
}

export interface ProfessionalMembership {
  id: string;
  organizationName: string;
  membershipId: string;
  membershipType: 'Life Member' | 'Annual Member' | 'Fellow' | 'Executive Member';
  validUntil?: string;
}

export interface RegistrationDetails {
  councilName: string;
  registrationNumber: string;
  state: string;
  registrationDate: string;
  renewalDate: string;
  status: 'Active' | 'Renewal Pending' | 'Suspended';
}

export interface EmploymentDetails {
  employeeId: string;
  employmentType: 'Permanent' | 'Contractual' | 'Guest' | 'Visiting';
  payScaleGrade: string;
  providentFundUan?: string;
  dateOfJoiningInstitution: string;
  probationStatus: 'Completed' | 'Ongoing';
  biometricId?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  primaryPhone: string;
  secondaryPhone?: string;
  email?: string;
  address: string;
}

export interface ContactInformation {
  officialEmail: string;
  personalEmail: string;
  mobileNumber: string;
  alternateMobileNumber?: string;
  presentAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  permanentAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    sameAsPresent: boolean;
  };
  socialLinks?: {
    googleScholar?: string;
    researchGate?: string;
    orcid?: string;
    linkedIn?: string;
    website?: string;
  };
}

export interface ProfileDocument {
  id: string;
  title: string;
  category: 'Degree Certificate' | 'Council Registration' | 'Identity Proof' | 'Experience Letter' | 'Publication' | 'Other';
  fileUrl: string;
  fileSize: string;
  fileType: string;
  uploadedAt: string;
  verificationStatus: 'Verified' | 'Pending Verification' | 'Action Required';
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  category: 'Academic' | 'Promotion' | 'Research' | 'Clinical' | 'Administrative' | 'Award';
  date: string;
  iconName?: string;
}

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface LoginHistoryItem {
  id: string;
  timestamp: string;
  status: 'Success' | 'Failed Attempt' | 'Password Changed';
  ipAddress: string;
  location: string;
  device: string;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  twoFactorMethod?: 'Authenticator App' | 'SMS' | 'Email';
  emailAlertsForNewLogin: boolean;
  activeSessions: ActiveSession[];
  loginHistory: LoginHistoryItem[];
}

export interface UserPreferencesSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'English' | 'Hindi' | 'Bengali';
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    academicAlerts: boolean;
    opdScheduleAlerts: boolean;
    researchUpdates: boolean;
    examDutyNotifications: boolean;
  };
  privacy: {
    showPhoneToStudents: boolean;
    showEmailToPublic: boolean;
    showResearchPublicly: boolean;
  };
}

export interface FullFacultyProfileData {
  id: string;
  employeeId: string;
  avatarUrl: string;
  profileCompletionPercentage: number;
  personalInfo: PersonalInformation;
  academicQualifications: AcademicQualification[];
  departmentInfo: DepartmentInformation;
  teachingExperience: TeachingExperience[];
  researchExperience: ResearchExperience[];
  awards: AwardRecognition[];
  memberships: ProfessionalMembership[];
  registrationDetails: RegistrationDetails;
  employmentDetails: EmploymentDetails;
  emergencyContact: EmergencyContact;
  contactInfo: ContactInformation;
  documents: ProfileDocument[];
  timeline: TimelineEvent[];
  security: SecuritySettings;
  settings: UserPreferencesSettings;
  opdScheduleSlot: string;
  opdRoomNo: string;
}

export type ProfileTab =
  | 'overview'
  | 'personal'
  | 'academic'
  | 'department'
  | 'professional'
  | 'experience'
  | 'awards'
  | 'registration'
  | 'employment'
  | 'contact'
  | 'documents'
  | 'timeline'
  | 'security'
  | 'settings';
