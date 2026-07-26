import { useState, useEffect, useCallback } from 'react';
import { studentApi } from '../services/api/student.api';
import { StudentProfile, TimetableEntry, StudyMaterial, ActivityLog } from '../types/index';

export const useStudent = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [profRes, ttRes, smRes, actRes] = await Promise.all([
        studentApi.getProfile(),
        studentApi.getTimetable(),
        studentApi.getStudyMaterials(),
        studentApi.getRecentActivities(),
      ]);

      if (profRes.data) setProfile(profRes.data);
      if (ttRes.data) setTimetable(ttRes.data);
      if (smRes.data) setStudyMaterials(smRes.data);
      if (actRes.data) setActivities(actRes.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch student profile data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  const updateProfile = async (updatedFields: Partial<StudentProfile>) => {
    try {
      const res = await studentApi.updateProfile(updatedFields);
      if (res.data) {
        setProfile(res.data);
      }
      return res;
    } catch (err: any) {
      throw err;
    }
  };

  return {
    profile,
    timetable,
    studyMaterials,
    activities,
    isLoading,
    error,
    refetch: fetchStudentData,
    updateProfile,
  };
};
