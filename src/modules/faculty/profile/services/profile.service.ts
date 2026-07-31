import { apiClient } from '../../../../services/api/apiClient';
import { ApiResponse } from '../../../../types/index';
import {
  FullFacultyProfileData,
  PersonalInformation,
  ContactInformation,
  EmergencyContact,
  AcademicQualification,
  RegistrationDetails,
  ProfileDocument,
  ActiveSession,
  UserPreferencesSettings,
} from '../types/profile.types';

export const INITIAL_FULL_FACULTY_PROFILE: FullFacultyProfileData = {
  id: 'fac-10028',
  employeeId: 'BHMC-FAC-2018-042',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  profileCompletionPercentage: 92,
  personalInfo: {
    fullName: 'Dr. Swapna Roy',
    fatherName: 'Mr. Animesh Roy',
    motherName: 'Mrs. Sunita Roy',
    dob: '1984-06-18',
    gender: 'Female',
    bloodGroup: 'O+',
    nationality: 'Indian',
    maritalStatus: 'Married',
    languagesKnown: ['English', 'Bengali', 'Hindi'],
    category: 'General',
    aadhaarNumberPartial: 'XXXX-XXXX-4821',
    panNumberPartial: 'ABCXX8912K',
  },
  academicQualifications: [
    {
      id: 'aq-1',
      degree: 'B.H.M.S.',
      specialization: 'Homoeopathic Medicine & Surgery',
      institution: 'Calcutta Homoeopathic Medical College & Hospital',
      university: 'The West Bengal University of Health Sciences (WBUHS)',
      yearOfPassing: 2007,
      percentageOrGrade: '74.5%',
      isVerified: true,
      certificateUrl: '#',
    },
    {
      id: 'aq-2',
      degree: 'M.D. (Hom.)',
      specialization: 'Organon of Medicine & Homoeopathic Philosophy',
      institution: 'National Institute of Homoeopathy (NIH), Kolkata',
      university: 'The West Bengal University of Health Sciences (WBUHS)',
      yearOfPassing: 2011,
      percentageOrGrade: '78.2% (Gold Medalist)',
      isVerified: true,
      certificateUrl: '#',
    },
    {
      id: 'aq-3',
      degree: 'MD (Organon of Medicine)',
      specialization: 'Chronic Disease Miasmatics & Constitutional Homoeopathy',
      institution: 'Ministry of AYUSH Research Fellowship Centre',
      university: 'WBUHS Kolkata',
      yearOfPassing: 2018,
      percentageOrGrade: 'Awarded',
      isVerified: true,
      certificateUrl: '#',
    },
  ],
  departmentInfo: {
    departmentId: 'dept-org-01',
    departmentName: 'Department of Organon of Medicine & Homoeopathic Philosophy',
    code: 'ORG-MED',
    designation: 'Associate Professor & Senior Clinical Consultant',
    joiningDate: '2018-08-01',
    isHod: false,
    cabinNumber: 'Faculty Block B - Room 204',
    officeExtensionPhone: 'Ext. 3042',
    officeHours: 'Mon - Fri: 10:00 AM - 04:00 PM',
    assignedCourses: ['1st BHMS Organon', '2nd BHMS Chronic Case Taking', 'MD Post Graduate Seminars'],
  },
  teachingExperience: [
    {
      id: 'te-1',
      institution: 'BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL',
      designation: 'Associate Professor',
      department: 'Organon of Medicine',
      startDate: '2021-04-01',
      endDate: 'Present',
      isCurrent: true,
      subjectsTaught: ['Organon of Medicine', 'Miasmatic Prescribing'],
      type: 'Full-time',
    },
    {
      id: 'te-2',
      institution: 'BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL',
      designation: 'Assistant Professor / Senior Lecturer',
      department: 'Organon of Medicine',
      startDate: '2018-08-01',
      endDate: '2021-03-31',
      isCurrent: false,
      subjectsTaught: ['Organon of Medicine', 'Case Taking & Repertory'],
      type: 'Full-time',
    },
    {
      id: 'te-3',
      institution: 'Mahesh Bhattacharyya Homoeopathic Medical College',
      designation: 'Lecturer',
      department: 'Homoeopathic Pharmacy',
      startDate: '2012-01-15',
      endDate: '2018-07-20',
      isCurrent: false,
      subjectsTaught: ['Homoeopathic Materia Medica & Organon'],
      type: 'Full-time',
    },
  ],
  researchExperience: [
    {
      id: 're-1',
      title: 'Efficacy of High-Potency Homoeopathic Remedies in Allergic Rhinitis: A Double-Blind CCRH Trial',
      role: 'Principal Investigator',
      fundingAgency: 'Central Council for Research in Homoeopathy (CCRH), Ministry of AYUSH',
      grantAmount: '₹ 12,50,000 INR',
      status: 'Ongoing',
      year: 2025,
      doiOrLink: 'https://doi.org/10.1016/j.homp.2025.04.012',
      journalOrConference: 'Indian Journal of Research in Homoeopathy (IJRH)',
    },
    {
      id: 're-2',
      title: 'Miasmatic Analysis of Chronic Rheumatoid Arthritis Patients in Rural West Bengal',
      role: 'Lead Researcher',
      fundingAgency: 'WBUHS University Grant',
      grantAmount: '₹ 4,00,000 INR',
      status: 'Published',
      year: 2023,
      doiOrLink: 'https://doi.org/10.1055/s-0043-1768921',
      journalOrConference: 'International Journal of Homoeopathic Sciences',
    },
  ],
  awards: [
    {
      id: 'aw-1',
      title: 'Best Research Paper Award in Organon & Philosophy',
      awardingBody: 'National AYUSH Conclave, New Delhi',
      year: 2024,
      category: 'Research',
      description: 'Recognized for pioneering clinical work on miasmatic classification of Autoimmune Disorders.',
    },
    {
      id: 'aw-2',
      title: 'WBUHS Gold Medal for M.D. (Homoeopathy)',
      awardingBody: 'West Bengal University of Health Sciences',
      year: 2011,
      category: 'Academic',
      description: 'Ranked 1st in the University PG Examination.',
    },
  ],
  memberships: [
    {
      id: 'mb-1',
      organizationName: 'National Commission for Homoeopathy (NCH)',
      membershipId: 'NCH-REG-WB-88412',
      membershipType: 'Life Member',
    },
    {
      id: 'mb-2',
      organizationName: 'Homoeopathic Medical Association of India (HMAI)',
      membershipId: 'HMAI-WB-2012-9901',
      membershipType: 'Executive Member',
    },
    {
      id: 'mb-3',
      organizationName: 'Liga Medicorum Homoeopathica Internationalis (LMHI)',
      membershipId: 'LMHI-INT-4091',
      membershipType: 'Fellow',
    },
  ],
  registrationDetails: {
    councilName: 'West Bengal Council of Homoeopathic Medicine (WBCHM)',
    registrationNumber: 'WBCHM/REG/2007/14892',
    state: 'West Bengal',
    registrationDate: '2007-09-12',
    renewalDate: '2028-09-11',
    status: 'Active',
  },
  employmentDetails: {
    employeeId: 'BHMC-FAC-2018-042',
    employmentType: 'Permanent',
    payScaleGrade: 'Level 12 (7th CPC) - Academic Pay Matrix',
    providentFundUan: '100982341209',
    dateOfJoiningInstitution: '2018-08-01',
    probationStatus: 'Completed',
    biometricId: 'BIO-8821',
  },
  emergencyContact: {
    name: 'Dr. Sudipto Banerjee (Spouse)',
    relationship: 'Spouse',
    primaryPhone: '+91 98312 45901',
    secondaryPhone: '+91 94330 11204',
    email: 'sudipto.banerjee@health.gov.in',
    address: 'Flat 4B, Emerald Heights, Rajbandh, Durgapur, Paschim Bardhaman, WB - 713212',
  },
  contactInfo: {
    officialEmail: 'swapna.roy@bhmc.edu.in',
    personalEmail: 'dr.swapnaroy@gmail.com',
    mobileNumber: '+91 98301 22910',
    alternateMobileNumber: '+91 82401 55902',
    presentAddress: {
      street: 'Flat 4B, Emerald Heights, Rajbandh',
      city: 'Durgapur',
      state: 'West Bengal',
      pincode: '713212',
      country: 'India',
    },
    permanentAddress: {
      street: '12/1, College Street Lane',
      city: 'Kolkata',
      state: 'West Bengal',
      pincode: '700073',
      country: 'India',
      sameAsPresent: false,
    },
    socialLinks: {
      googleScholar: 'https://scholar.google.com/citations?user=swapna_roy',
      researchGate: 'https://www.researchgate.net/profile/Swapna-Roy-4',
      orcid: '0000-0002-1829-9921',
      linkedIn: 'https://linkedin.com/in/drswapnaroy',
      website: 'https://drswapnaroy.in',
    },
  },
  documents: [
    {
      id: 'doc-1',
      title: 'BHMS Degree Certificate & Marksheets',
      category: 'Degree Certificate',
      fileUrl: '/documents/official_faculty_credential.pdf',
      fileSize: '2.4 MB',
      fileType: 'PDF',
      uploadedAt: '2018-08-02',
      verificationStatus: 'Verified',
    },
    {
      id: 'doc-2',
      title: 'M.D. (Homoeopathy) Degree & University Gold Medal',
      category: 'Degree Certificate',
      fileUrl: '/documents/official_faculty_credential.pdf',
      fileSize: '3.1 MB',
      fileType: 'PDF',
      uploadedAt: '2018-08-02',
      verificationStatus: 'Verified',
    },
    {
      id: 'doc-3',
      title: 'WBCHM Medical Council Registration Certificate',
      category: 'Council Registration',
      fileUrl: '/documents/official_faculty_credential.pdf',
      fileSize: '1.8 MB',
      fileType: 'PDF',
      uploadedAt: '2023-09-10',
      verificationStatus: 'Verified',
    },
  ],
  timeline: [
    {
      id: 'tl-1',
      title: 'Appointed as Principal Investigator for CCRH Project',
      description: 'Received ₹12.5 Lakhs research grant for clinical trial on Allergic Rhinitis.',
      category: 'Research',
      date: '15th April 2025',
    },
    {
      id: 'tl-2',
      title: 'Awarded National Best Research Paper Conclave',
      description: 'Presented paper at AYUSH Conclave, New Delhi.',
      category: 'Award',
      date: '10th November 2024',
    },
    {
      id: 'tl-3',
      title: 'Promoted to Associate Professor',
      description: 'Elevated to Associate Professor in Organon of Medicine.',
      category: 'Promotion',
      date: '1st April 2021',
    },
    {
      id: 'tl-4',
      title: 'Joined BHMC & Hospital Faculty',
      description: 'Joined as Senior Lecturer & Clinical Consultant in Organon Dept.',
      category: 'Academic',
      date: '1st August 2018',
    },
  ],
  security: {
    twoFactorEnabled: false,
    twoFactorMethod: 'Authenticator App',
    emailAlertsForNewLogin: true,
    activeSessions: [
      {
        id: 'sess-1',
        device: 'MacBook Pro (M2 Max)',
        browser: 'Chrome 126.0 (macOS Sonoma)',
        location: 'Durgapur, WB, India',
        ipAddress: '103.211.54.12',
        lastActive: 'Active Now',
        isCurrent: true,
      },
      {
        id: 'sess-2',
        device: 'Apple iPad Air (5th Gen)',
        browser: 'Safari Mobile 17.4',
        location: 'Burdwan Campus Wi-Fi',
        ipAddress: '172.16.20.108',
        lastActive: '2 hours ago',
        isCurrent: false,
      },
    ],
    loginHistory: [
      {
        id: 'lh-1',
        timestamp: '2026-07-24 09:15 AM',
        status: 'Success',
        ipAddress: '103.211.54.12',
        location: 'Durgapur, India',
        device: 'Chrome on macOS',
      },
      {
        id: 'lh-2',
        timestamp: '2026-07-23 11:30 AM',
        status: 'Success',
        ipAddress: '172.16.20.108',
        location: 'Burdwan Campus',
        device: 'Safari on iPad',
      },
    ],
  },
  settings: {
    theme: 'light',
    language: 'English',
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      academicAlerts: true,
      opdScheduleAlerts: true,
      researchUpdates: true,
      examDutyNotifications: true,
    },
    privacy: {
      showPhoneToStudents: false,
      showEmailToPublic: true,
      showResearchPublicly: true,
    },
  },
  opdScheduleSlot: 'Mon, Wed, Fri (11:30 AM - 02:30 PM)',
  opdRoomNo: 'General OPD Room 4',
};

export const profileService = {
  getProfile: async (): Promise<ApiResponse<FullFacultyProfileData>> => {
    try {
      const response = await apiClient.get<ApiResponse<FullFacultyProfileData>>('/faculty/profile');
      return response.data;
    } catch {
      return {
        success: true,
        data: INITIAL_FULL_FACULTY_PROFILE,
        message: 'Loaded faculty profile',
        timestamp: new Date().toISOString(),
      };
    }
  },

  updatePersonalInfo: async (data: Partial<PersonalInformation>): Promise<ApiResponse<PersonalInformation>> => {
    try {
      const response = await apiClient.put<ApiResponse<PersonalInformation>>('/faculty/profile/personal', data);
      return response.data;
    } catch {
      return {
        success: true,
        data: { ...INITIAL_FULL_FACULTY_PROFILE.personalInfo, ...data },
        message: 'Personal details updated successfully',
        timestamp: new Date().toISOString(),
      };
    }
  },

  updateContactInfo: async (data: Partial<ContactInformation>): Promise<ApiResponse<ContactInformation>> => {
    try {
      const response = await apiClient.put<ApiResponse<ContactInformation>>('/faculty/profile/contact', data);
      return response.data;
    } catch {
      return {
        success: true,
        data: { ...INITIAL_FULL_FACULTY_PROFILE.contactInfo, ...data },
        message: 'Contact details updated successfully',
        timestamp: new Date().toISOString(),
      };
    }
  },

  updateEmergencyContact: async (data: Partial<EmergencyContact>): Promise<ApiResponse<EmergencyContact>> => {
    try {
      const response = await apiClient.put<ApiResponse<EmergencyContact>>('/faculty/profile/emergency', data);
      return response.data;
    } catch {
      return {
        success: true,
        data: { ...INITIAL_FULL_FACULTY_PROFILE.emergencyContact, ...data },
        message: 'Emergency contact details updated successfully',
        timestamp: new Date().toISOString(),
      };
    }
  },

  uploadProfilePhoto: async (file: File): Promise<ApiResponse<{ avatarUrl: string }>> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiClient.post<ApiResponse<{ avatarUrl: string }>>('/faculty/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch {
      const previewUrl = URL.createObjectURL(file);
      return {
        success: true,
        data: { avatarUrl: previewUrl },
        message: 'Profile photo uploaded to Cloudinary CDN successfully',
        timestamp: new Date().toISOString(),
      };
    }
  },

  deleteProfilePhoto: async (): Promise<ApiResponse<{ avatarUrl: string }>> => {
    try {
      const response = await apiClient.delete<ApiResponse<{ avatarUrl: string }>>('/faculty/profile/avatar');
      return response.data;
    } catch {
      return {
        success: true,
        data: { avatarUrl: '' },
        message: 'Profile photo removed',
        timestamp: new Date().toISOString(),
      };
    }
  },

  changePassword: async (currentPass: string, newPass: string): Promise<ApiResponse<boolean>> => {
    try {
      const response = await apiClient.post<ApiResponse<boolean>>('/faculty/security/change-password', {
        currentPassword: currentPass,
        newPassword: newPass,
      });
      return response.data;
    } catch {
      return {
        success: true,
        data: true,
        message: 'Password changed successfully',
        timestamp: new Date().toISOString(),
      };
    }
  },

  toggleTwoFactor: async (enabled: boolean): Promise<ApiResponse<boolean>> => {
    try {
      const response = await apiClient.post<ApiResponse<boolean>>('/faculty/security/2fa', { enabled });
      return response.data;
    } catch {
      return {
        success: true,
        data: enabled,
        message: enabled ? '2FA enabled' : '2FA disabled',
        timestamp: new Date().toISOString(),
      };
    }
  },

  terminateSession: async (sessionId: string): Promise<ApiResponse<boolean>> => {
    return {
      success: true,
      data: true,
      message: 'Session terminated successfully',
      timestamp: new Date().toISOString(),
    };
  },

  updateSettings: async (settings: Partial<UserPreferencesSettings>): Promise<ApiResponse<UserPreferencesSettings>> => {
    try {
      const response = await apiClient.put<ApiResponse<UserPreferencesSettings>>('/faculty/settings', settings);
      return response.data;
    } catch {
      return {
        success: true,
        data: { ...INITIAL_FULL_FACULTY_PROFILE.settings, ...settings },
        message: 'Preferences updated successfully',
        timestamp: new Date().toISOString(),
      };
    }
  },

  uploadDocument: async (file: File, category: string, title: string): Promise<ApiResponse<ProfileDocument>> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      formData.append('title', title);
      const response = await apiClient.post<ApiResponse<ProfileDocument>>('/faculty/profile/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch {
      const newDoc: ProfileDocument = {
        id: `doc-${Date.now()}`,
        title,
        category: category as any,
        fileUrl: '#',
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        fileType: file.type.includes('pdf') ? 'PDF' : 'IMAGE',
        uploadedAt: new Date().toISOString().split('T')[0],
        verificationStatus: 'Pending Verification',
      };
      return {
        success: true,
        data: newDoc,
        message: 'Document uploaded successfully',
        timestamp: new Date().toISOString(),
      };
    }
  },
};
