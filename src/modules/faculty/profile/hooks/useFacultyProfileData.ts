import { useState, useEffect, useCallback } from 'react';
import { profileService, INITIAL_FULL_FACULTY_PROFILE } from '../services/profile.service';
import { calculateProfileCompleteness } from '../utils/profileCompleteness';
import {
  FullFacultyProfileData,
  ProfileTab,
  PersonalInformation,
  ContactInformation,
  EmergencyContact,
  UserPreferencesSettings,
  ProfileDocument,
} from '../types/profile.types';

export const useFacultyProfileData = () => {
  const [profileData, setProfileData] = useState<FullFacultyProfileData>(INITIAL_FULL_FACULTY_PROFILE);
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await profileService.getProfile();
      if (res?.data) {
        setProfileData(res.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load faculty profile data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
  };

  const updatePersonalInfo = async (data: Partial<PersonalInformation>) => {
    setIsSaving(true);
    try {
      const res = await profileService.updatePersonalInfo(data);
      if (res?.data) {
        setProfileData((prev) => ({
          ...prev,
          personalInfo: { ...prev.personalInfo, ...res.data },
        }));
        showNotification('Personal details saved successfully.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to update personal details');
    } finally {
      setIsSaving(false);
    }
  };

  const updateContactInfo = async (data: Partial<ContactInformation>) => {
    setIsSaving(true);
    try {
      const res = await profileService.updateContactInfo(data);
      if (res?.data) {
        setProfileData((prev) => ({
          ...prev,
          contactInfo: { ...prev.contactInfo, ...res.data },
        }));
        showNotification('Contact information saved successfully.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to update contact info');
    } finally {
      setIsSaving(false);
    }
  };

  const updateEmergencyContact = async (data: Partial<EmergencyContact>) => {
    setIsSaving(true);
    try {
      const res = await profileService.updateEmergencyContact(data);
      if (res?.data) {
        setProfileData((prev) => ({
          ...prev,
          emergencyContact: { ...prev.emergencyContact, ...res.data },
        }));
        showNotification('Emergency contact updated successfully.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to update emergency contact');
    } finally {
      setIsSaving(false);
    }
  };

  const uploadPhoto = async (file: File) => {
    setIsSaving(true);
    try {
      const res = await profileService.uploadProfilePhoto(file);
      if (res?.data?.avatarUrl) {
        setProfileData((prev) => ({
          ...prev,
          avatarUrl: res.data.avatarUrl,
        }));
        showNotification('Profile avatar updated successfully.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to upload photo');
    } finally {
      setIsSaving(false);
    }
  };

  const removePhoto = async () => {
    setIsSaving(true);
    try {
      await profileService.deleteProfilePhoto();
      setProfileData((prev) => ({
        ...prev,
        avatarUrl: '',
      }));
      showNotification('Profile avatar removed.');
    } catch (err: any) {
      setError(err?.message || 'Failed to remove avatar');
    } finally {
      setIsSaving(false);
    }
  };

  const uploadDoc = async (file: File, category: string, title: string) => {
    setIsSaving(true);
    try {
      const res = await profileService.uploadDocument(file, category, title);
      if (res?.data) {
        setProfileData((prev) => ({
          ...prev,
          documents: [res.data, ...prev.documents],
        }));
        showNotification('Document uploaded successfully.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to upload document');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSettings = async (settings: Partial<UserPreferencesSettings>) => {
    setIsSaving(true);
    try {
      const res = await profileService.updateSettings(settings);
      if (res?.data) {
        setProfileData((prev) => ({
          ...prev,
          settings: { ...prev.settings, ...res.data },
        }));
        showNotification('Settings saved successfully.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  const terminateSession = async (sessionId: string) => {
    try {
      await profileService.terminateSession(sessionId);
      setProfileData((prev) => ({
        ...prev,
        security: {
          ...prev.security,
          activeSessions: prev.security.activeSessions.filter((s) => s.id !== sessionId),
        },
      }));
      showNotification('Session terminated.');
    } catch (err: any) {
      setError(err?.message || 'Failed to terminate session');
    }
  };

  const completeness = calculateProfileCompleteness(profileData);

  return {
    profileData,
    activeTab,
    setActiveTab,
    isLoading,
    isSaving,
    error,
    successMessage,
    completeness,
    refetch: fetchProfile,
    updatePersonalInfo,
    updateContactInfo,
    updateEmergencyContact,
    uploadPhoto,
    removePhoto,
    uploadDoc,
    updateSettings,
    terminateSession,
    dismissError: () => setError(null),
  };
};
