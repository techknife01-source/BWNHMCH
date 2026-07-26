import { FullFacultyProfileData } from '../types/profile.types';

export interface SectionCompletionStatus {
  key: string;
  label: string;
  isComplete: boolean;
  weight: number;
  missingFields: string[];
}

export function calculateProfileCompleteness(profile: FullFacultyProfileData): {
  overallPercentage: number;
  sections: SectionCompletionStatus[];
  missingSections: SectionCompletionStatus[];
} {
  const sections: SectionCompletionStatus[] = [];

  // 1. Personal Information (15%)
  const personalMissing: string[] = [];
  if (!profile.personalInfo.fullName) personalMissing.push('Full Name');
  if (!profile.personalInfo.fatherName) personalMissing.push('Father Name');
  if (!profile.personalInfo.motherName) personalMissing.push('Mother Name');
  if (!profile.personalInfo.dob) personalMissing.push('Date of Birth');
  if (!profile.personalInfo.bloodGroup) personalMissing.push('Blood Group');

  sections.push({
    key: 'personal',
    label: 'Personal Details',
    weight: 15,
    isComplete: personalMissing.length === 0,
    missingFields: personalMissing,
  });

  // 2. Academic Qualifications (15%)
  const academicMissing: string[] = [];
  if (!profile.academicQualifications || profile.academicQualifications.length === 0) {
    academicMissing.push('Degrees / Diplomas');
  }

  sections.push({
    key: 'academic',
    label: 'Academic Credentials',
    weight: 15,
    isComplete: academicMissing.length === 0,
    missingFields: academicMissing,
  });

  // 3. Department & Designation (10%)
  const deptMissing: string[] = [];
  if (!profile.departmentInfo.departmentName) deptMissing.push('Department Name');
  if (!profile.departmentInfo.designation) deptMissing.push('Designation');

  sections.push({
    key: 'department',
    label: 'Department Info',
    weight: 10,
    isComplete: deptMissing.length === 0,
    missingFields: deptMissing,
  });

  // 4. Registration Details (15%)
  const regMissing: string[] = [];
  if (!profile.registrationDetails.registrationNumber) regMissing.push('Council Registration No.');
  if (!profile.registrationDetails.councilName) regMissing.push('Medical Council Name');

  sections.push({
    key: 'registration',
    label: 'Medical Council Registration',
    weight: 15,
    isComplete: regMissing.length === 0,
    missingFields: regMissing,
  });

  // 5. Contact Information (15%)
  const contactMissing: string[] = [];
  if (!profile.contactInfo.officialEmail) contactMissing.push('Official Email');
  if (!profile.contactInfo.mobileNumber) contactMissing.push('Mobile Number');
  if (!profile.contactInfo.presentAddress.city) contactMissing.push('Present Address City');

  sections.push({
    key: 'contact',
    label: 'Contact Details',
    weight: 15,
    isComplete: contactMissing.length === 0,
    missingFields: contactMissing,
  });

  // 6. Emergency Contact (10%)
  const emergencyMissing: string[] = [];
  if (!profile.emergencyContact.name) emergencyMissing.push('Emergency Contact Name');
  if (!profile.emergencyContact.primaryPhone) emergencyMissing.push('Emergency Phone');

  sections.push({
    key: 'employment',
    label: 'Emergency Contact',
    weight: 10,
    isComplete: emergencyMissing.length === 0,
    missingFields: emergencyMissing,
  });

  // 7. Profile Photo (10%)
  const photoMissing: string[] = [];
  if (!profile.avatarUrl) photoMissing.push('Profile Photo');

  sections.push({
    key: 'photo',
    label: 'Profile Avatar',
    weight: 10,
    isComplete: photoMissing.length === 0,
    missingFields: photoMissing,
  });

  // 8. Documents & Certificates (10%)
  const docMissing: string[] = [];
  if (!profile.documents || profile.documents.length === 0) {
    docMissing.push('Uploaded Certificates');
  }

  sections.push({
    key: 'documents',
    label: 'Document Repository',
    weight: 10,
    isComplete: docMissing.length === 0,
    missingFields: docMissing,
  });

  // Calculate weighted percentage
  const totalEarnedWeight = sections.reduce((sum, s) => sum + (s.isComplete ? s.weight : 0), 0);
  const overallPercentage = Math.min(100, Math.round(totalEarnedWeight));

  const missingSections = sections.filter((s) => !s.isComplete);

  return {
    overallPercentage,
    sections,
    missingSections,
  };
}
