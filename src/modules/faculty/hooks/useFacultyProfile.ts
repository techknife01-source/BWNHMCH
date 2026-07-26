import { useState, useEffect, useCallback } from 'react';
import { facultyService } from '../services/faculty.service';
import { FacultyProfile } from '../types';

export const useFacultyProfile = () => {
  const [profile, setProfile] = useState<FacultyProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await facultyService.getProfile();
      if (res?.data) {
        setProfile(res.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load profile details');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = async (data: Partial<FacultyProfile>) => {
    setIsUpdating(true);
    setError(null);
    try {
      const res = await facultyService.updateProfile(data);
      if (res?.data) {
        setProfile(res.data);
      }
      return res;
    } catch (err: any) {
      setError(err?.message || 'Failed to update profile');
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    isLoading,
    isUpdating,
    error,
    refresh: loadProfile,
    updateProfile,
  };
};
