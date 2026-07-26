import { useState, useEffect, useCallback } from 'react';
import { facultyService } from '../services/faculty.service';
import { FacultyNotification, FacultySubject } from '../types';

export const useFacultyDashboard = () => {
  const [subjects, setSubjects] = useState<FacultySubject[]>([]);
  const [notifications, setNotifications] = useState<FacultyNotification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [subjRes, notifRes] = await Promise.allSettled([
        facultyService.getAssignedSubjects(),
        facultyService.getNotifications(),
      ]);

      if (subjRes.status === 'fulfilled' && subjRes.value?.data) {
        setSubjects(subjRes.value.data);
      }
      if (notifRes.status === 'fulfilled' && notifRes.value?.data) {
        setNotifications(notifRes.value.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load dashboard metrics');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  return {
    subjects,
    notifications,
    isLoading,
    error,
    refresh: loadDashboardData,
  };
};
