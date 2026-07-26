/**
 * Shared CMS Data Layer Enums and Interfaces
 * Reused by all public & portal website pages.
 */

// ==========================================
// ENUMS
// ==========================================

export enum NoticeCategory {
  ACADEMIC = 'ACADEMIC',
  EXAM = 'EXAM',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  HOSPITAL = 'HOSPITAL',
  GENERAL = 'GENERAL',
  TENDER = 'TENDER',
  RECRUITMENT = 'RECRUITMENT',
}

export enum NewsCategory {
  COLLEGE_NEWS = 'COLLEGE_NEWS',
  RESEARCH = 'RESEARCH',
  ACADEMIC = 'ACADEMIC',
  HOSPITAL_EVENTS = 'HOSPITAL_EVENTS',
  AWARDS = 'AWARDS',
  PRESS_RELEASE = 'PRESS_RELEASE',
}

export enum EventCategory {
  SEMINAR = 'SEMINAR',
  WORKSHOP = 'WORKSHOP',
  CONFERENCE = 'CONFERENCE',
  CULTURAL = 'CULTURAL',
  SPORTS = 'SPORTS',
  CLINICAL = 'CLINICAL',
  COMMUNITY_OUTREACH = 'COMMUNITY_OUTREACH',
}

export enum GalleryCategory {
  CAMPUS = 'CAMPUS',
  CLINICAL = 'CLINICAL',
  EVENTS = 'EVENTS',
  HERB_GARDEN = 'HERB_GARDEN',
  SEMINARS = 'SEMINARS',
  HOSPITAL = 'HOSPITAL',
  LABORATORY = 'LABORATORY',
}

export enum DepartmentType {
  ACADEMIC = 'ACADEMIC',
  CLINICAL = 'CLINICAL',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  HOSPITAL = 'HOSPITAL',
  SUPPORT = 'SUPPORT',
}

export enum CourseType {
  UNDERGRADUATE = 'UNDERGRADUATE',
  POSTGRADUATE = 'POSTGRADUATE',
  DIPLOMA = 'DIPLOMA',
  CERTIFICATE = 'CERTIFICATE',
  DOCTORAL = 'DOCTORAL',
}

export enum ContentStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  SCHEDULED = 'SCHEDULED',
}

// ==========================================
// INTERFACES
// ==========================================

export interface SEO {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

export interface SocialMedia {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
  googleScholar?: string;
}

export interface ContactInformation {
  institutionName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  primaryPhone: string;
  secondaryPhone?: string;
  emergencyHelpline?: string;
  email: string;
  admissionEmail?: string;
  hospitalEmail?: string;
  workingHours: string;
  opdHours?: string;
  mapEmbedUrl?: string;
  latitude?: number;
  longitude?: number;
  socialMedia?: SocialMedia;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  linkUrl?: string;
  linkText?: string;
  displayOrder: number;
  isActive: boolean;
  status: ContentStatus;
}

export interface QuickLink {
  id: string;
  title: string;
  url: string;
  iconName?: string;
  isExternal?: boolean;
  displayOrder: number;
  category?: string;
}

export interface About {
  id: string;
  title: string;
  subtitle?: string;
  establishmentYear: number;
  vision: string;
  mission: string[];
  objectives: string[];
  history: string;
  affiliationDetails: string;
  recognitionDetails: string;
  campusAreaSize?: string;
  imageUrl?: string;
  seo?: SEO;
}

export interface PrincipalDesk {
  id: string;
  principalName: string;
  designation: string;
  qualifications: string;
  message: string;
  imageUrl: string;
  email?: string;
  phone?: string;
  publishedDate?: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  type: DepartmentType;
  headOfDepartment: string;
  hodQualification?: string;
  hodEmail?: string;
  description: string;
  objectives?: string[];
  facilities?: string[];
  facultyCount: number;
  studentCapacity: number;
  iconName?: string;
  bannerUrl?: string;
  displayOrder?: number;
  status: ContentStatus;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  type: CourseType;
  duration: string;
  intakeCapacity: number;
  eligibilityCriteria: string;
  syllabusOverview: string;
  feeStructureSummary?: string;
  affiliationBody?: string;
  brochureUrl?: string;
  status: ContentStatus;
}

export interface Notice {
  id: string;
  title: string;
  category: NoticeCategory;
  content: string;
  summary?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  publishedDate: string;
  expiryDate?: string;
  isImportant: boolean;
  isNew?: boolean;
  author: string;
  status: ContentStatus;
}

export interface News {
  id: string;
  title: string;
  slug: string;
  category: NewsCategory;
  summary: string;
  content: string;
  imageUrl?: string;
  publishedDate: string;
  author: string;
  tags?: string[];
  isFeatured?: boolean;
  status: ContentStatus;
  seo?: SEO;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  category: EventCategory;
  description: string;
  eventDate: string;
  endDate?: string;
  timeSlot?: string;
  location: string;
  organizer: string;
  contactPerson?: string;
  registrationUrl?: string;
  imageUrl?: string;
  isUpcoming: boolean;
  status: ContentStatus;
}

export interface GalleryImage {
  id: string;
  title: string;
  caption?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category: GalleryCategory;
  uploadedAt: string;
  displayOrder?: number;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  description?: string;
  coverImageUrl: string;
  category: GalleryCategory;
  eventDate?: string;
  images: GalleryImage[];
  imageCount: number;
  status: ContentStatus;
}

export interface Download {
  id: string;
  title: string;
  category: string;
  description?: string;
  fileType: string;
  fileSize: string;
  fileUrl: string;
  updatedAt: string;
  downloadCount?: number;
  isPublic: boolean;
}

export interface CommitteeMember {
  id: string;
  name: string;
  designation: string;
  roleInCommittee: string;
  department?: string;
  email?: string;
  phone?: string;
}

export interface Committee {
  id: string;
  name: string;
  description: string;
  chairperson: string;
  members: CommitteeMember[];
  pdfUrl?: string;
  contactEmail?: string;
  status: ContentStatus;
}

export interface ResearchHighlight {
  id: string;
  title: string;
  authors: string[];
  department: string;
  journalOrConference: string;
  year: number;
  doiOrLink?: string;
  abstract?: string;
  grantAgency?: string;
  grantAmount?: string;
  isFeatured?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  category: string;
  recipientName: string;
  recipientRole: 'STUDENT' | 'FACULTY' | 'INSTITUTION' | 'HOSPITAL';
  awardingBody: string;
  year: number;
  description?: string;
  imageUrl?: string;
  number?: string;
  label?: string;
  icon?: string;
}

export interface HospitalDepartmentBedCount {
  departmentName: string;
  bedCount: number;
}

export interface HospitalOverview {
  id: string;
  name: string;
  totalBedCapacity: number;
  dailyAverageOpdCount: number;
  emergencyAvailable24x7: boolean;
  facilities: string[];
  departmentBeds: HospitalDepartmentBedCount[];
  opdTiming: string;
  ipdTiming: string;
  description: string;
  helplineNumber: string;
  imageUrl?: string;
}
