import React, { useState } from 'react';
import { useFacultyProfileData } from './hooks/useFacultyProfileData';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfilePhotoModal } from './components/ProfilePhotoModal';
import { ProfileCompletenessWidget } from './components/ProfileCompletenessWidget';
import { ProfileNavigationTabs } from './components/ProfileNavigationTabs';

// Sections
import { OverviewSection } from './components/sections/OverviewSection';
import { PersonalInfoSection } from './components/sections/PersonalInfoSection';
import { AcademicInfoSection } from './components/sections/AcademicInfoSection';
import { DepartmentInfoSection } from './components/sections/DepartmentInfoSection';
import { ProfessionalInfoSection } from './components/sections/ProfessionalInfoSection';
import { ExperienceSection } from './components/sections/ExperienceSection';
import { AwardsAndRecognitionsSection } from './components/sections/AwardsAndRecognitionsSection';
import { RegistrationAndMembershipsSection } from './components/sections/RegistrationAndMembershipsSection';
import { EmploymentAndEmergencySection } from './components/sections/EmploymentAndEmergencySection';
import { ContactAndSocialSection } from './components/sections/ContactAndSocialSection';
import { DocumentsSection } from './components/sections/DocumentsSection';
import { ProfileTimelineSection } from './components/sections/ProfileTimelineSection';
import { SecuritySection } from './components/sections/SecuritySection';
import { SettingsSection } from './components/sections/SettingsSection';

import { CheckCircle2, AlertTriangle, RefreshCw, X } from 'lucide-react';

export const FacultyProfileContainer: React.FC = () => {
  const {
    profileData,
    activeTab,
    setActiveTab,
    isLoading,
    isSaving,
    error,
    successMessage,
    completeness,
    refetch,
    updatePersonalInfo,
    updateContactInfo,
    updateEmergencyContact,
    uploadPhoto,
    removePhoto,
    uploadDoc,
    updateSettings,
    terminateSession,
    dismissError,
  } = useFacultyProfileData();

  const [photoModalOpen, setPhotoModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="p-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="text-xs font-black text-slate-700 dark:text-slate-300">
          Loading Faculty Profile details...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {successMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 bg-emerald-600 text-white rounded-2xl shadow-xl flex items-center gap-3 text-xs font-black animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Global Error Banner */}
      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-2xl flex items-center justify-between text-rose-700 dark:text-rose-300 text-xs font-bold">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={dismissError} className="p-1 hover:bg-rose-100 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Profile Banner Header */}
      <ProfileHeader
        profile={profileData}
        onOpenPhotoModal={() => setPhotoModalOpen(true)}
      />

      {/* Profile Completeness Progress Widget */}
      <ProfileCompletenessWidget
        overallPercentage={completeness.overallPercentage}
        missingSections={completeness.missingSections}
        onNavigateToTab={(tab) => setActiveTab(tab)}
      />

      {/* Tab Navigation Pill Bar */}
      <ProfileNavigationTabs
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
      />

      {/* Tab Content Display */}
      <div className="mt-4">
        {activeTab === 'overview' && (
          <OverviewSection profile={profileData} onNavigateTab={(t) => setActiveTab(t)} />
        )}

        {activeTab === 'personal' && (
          <PersonalInfoSection
            personalInfo={profileData.personalInfo}
            onSave={updatePersonalInfo}
            isSaving={isSaving}
          />
        )}

        {activeTab === 'academic' && (
          <AcademicInfoSection qualifications={profileData.academicQualifications} />
        )}

        {activeTab === 'department' && (
          <DepartmentInfoSection departmentInfo={profileData.departmentInfo} />
        )}

        {activeTab === 'professional' && (
          <ProfessionalInfoSection
            opdScheduleSlot={profileData.opdScheduleSlot}
            opdRoomNo={profileData.opdRoomNo}
          />
        )}

        {activeTab === 'experience' && (
          <ExperienceSection
            teachingExperience={profileData.teachingExperience}
            researchExperience={profileData.researchExperience}
          />
        )}

        {activeTab === 'awards' && (
          <AwardsAndRecognitionsSection awards={profileData.awards} />
        )}

        {activeTab === 'registration' && (
          <RegistrationAndMembershipsSection
            registrationDetails={profileData.registrationDetails}
            memberships={profileData.memberships}
          />
        )}

        {activeTab === 'employment' && (
          <EmploymentAndEmergencySection
            employmentDetails={profileData.employmentDetails}
            emergencyContact={profileData.emergencyContact}
            onSaveEmergency={updateEmergencyContact}
            isSaving={isSaving}
          />
        )}

        {activeTab === 'contact' && (
          <ContactAndSocialSection
            contactInfo={profileData.contactInfo}
            onSave={updateContactInfo}
            isSaving={isSaving}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentsSection
            documents={profileData.documents}
            onUploadDoc={uploadDoc}
            isSaving={isSaving}
          />
        )}

        {activeTab === 'timeline' && (
          <ProfileTimelineSection timeline={profileData.timeline} />
        )}

        {activeTab === 'security' && (
          <SecuritySection
            security={profileData.security}
            onTerminateSession={terminateSession}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsSection
            settings={profileData.settings}
            onSaveSettings={updateSettings}
            isSaving={isSaving}
          />
        )}
      </div>

      {/* Photo Manage Modal */}
      <ProfilePhotoModal
        isOpen={photoModalOpen}
        onClose={() => setPhotoModalOpen(false)}
        currentAvatarUrl={profileData.avatarUrl}
        onUpload={uploadPhoto}
        onRemove={removePhoto}
        isSaving={isSaving}
      />
    </div>
  );
};
