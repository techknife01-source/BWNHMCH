import { useState, useEffect, useCallback } from 'react';
import { facultyService } from '../services/faculty.service';
import { FacultyProfile, FacultyStatistics } from '../types';

export const useFaculty = () => {
  const [profile, setProfile] = useState<FacultyProfile | null>(null);
  const [statistics, setStatistics] = useState<FacultyStatistics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [profileRes, statsRes] = await Promise.allSettled([
        facultyService.getProfile(),
        facultyService.getStatistics(),
      ]);

      if (profileRes.status === 'fulfilled' && profileRes.value?.data) {
        setProfile(profileRes.value.data);
      }
      if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
        setStatistics(statsRes.value.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load faculty data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    profile,
    statistics,
    isLoading,
    error,
    refresh: loadData,
  };
};
