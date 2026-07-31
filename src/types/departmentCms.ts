export interface FacultyMemberCMS {
  id: string;
  name: string;
  designation: string;
  qualification: string;
  specialization?: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  imageUrl?: string;
  joiningDate?: string;
  experienceYears?: string;
  registrationNumber?: string;
  biography?: string;
  status?: 'Active' | 'Inactive';
}

export interface GalleryItemCMS {
  id: string;
  url: string;
  caption: string;
  category?: string;
}

export interface DownloadItemCMS {
  id: string;
  title: string;
  url: string;
  fileType: string;
  fileSize: string;
  uploadDate?: string;
  category?: string;
}

export interface DepartmentBannerCMS {
  title: string;
  subtitle: string;
  badge?: string;
  bgImageUrl?: string;
}

export interface DepartmentCMSData {
  id: string;
  code: string;
  name: string; // Department Name
  banner: DepartmentBannerCMS; // Banner
  description: string; // Description
  methodology: string[]; // Methodology
  practical: string[]; // Practical
  teachingAids: string[]; // Teaching Aids
  facultyList: FacultyMemberCMS[]; // Faculty List
  gallery: GalleryItemCMS[]; // Gallery
  research: string[]; // Research
  achievements: string[]; // Achievements
  downloads: DownloadItemCMS[]; // Downloads

  // Extended metadata
  hod?: string;
  yearsCovered?: string;
  software?: string[];
  laboratories?: string[];
  facilities?: string[];
  lastUpdated?: string;
  updatedBy?: string;
}
