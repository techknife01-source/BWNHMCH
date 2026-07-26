import { useQuery, useQueryClient } from '@tanstack/react-query';
import { facultyDashboardApi } from '../api/facultyDashboard.api';
import {
  FacultyDashboardSummary,
  FacultyStatistics,
  FacultyClass,
  FacultySchedule,
  FacultyActivity,
  FacultyNotice,
  FacultyResearchSummary,
  FacultyAttendanceSummary,
  FacultyAssignmentSummary,
  FacultyLibrarySummary,
  HospitalNotification,
  PerformanceStatistics,
} from '../types/dashboard.types';

export const FACULTY_DASHBOARD_QUERY_KEYS = {
  all: ['faculty', 'dashboard'] as const,
  summary: ['faculty', 'dashboard', 'summary'] as const,
  statistics: ['faculty', 'dashboard', 'statistics'] as const,
  todaysClasses: ['faculty', 'dashboard', 'todaysClasses'] as const,
  upcomingSchedule: ['faculty', 'dashboard', 'upcomingSchedule'] as const,
  recentActivities: ['faculty', 'dashboard', 'recentActivities'] as const,
  departmentNotices: ['faculty', 'dashboard', 'departmentNotices'] as const,
  hospitalNotifications: ['faculty', 'dashboard', 'hospitalNotifications'] as const,
  researchSummary: ['faculty', 'dashboard', 'researchSummary'] as const,
  attendanceSummary: ['faculty', 'dashboard', 'attendanceSummary'] as const,
  assignmentSummary: ['faculty', 'dashboard', 'assignmentSummary'] as const,
  librarySummary: ['faculty', 'dashboard', 'librarySummary'] as const,
  performanceStatistics: ['faculty', 'dashboard', 'performanceStatistics'] as const,
};

const DEFAULT_STALE_TIME = 1000 * 60 * 5; // 5 minutes
const DEFAULT_GC_TIME = 1000 * 60 * 10; // 10 minutes

/**
 * Hook to fetch complete faculty dashboard summary
 */
export function useFacultyDashboard() {
  const queryClient = useQueryClient();

  const query = useQuery<FacultyDashboardSummary, Error>({
    queryKey: FACULTY_DASHBOARD_QUERY_KEYS.summary,
    queryFn: () => facultyDashboardApi.getDashboardSummary(),
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const invalidateAndRefetch = async () => {
    await queryClient.invalidateQueries({ queryKey: FACULTY_DASHBOARD_QUERY_KEYS.all });
  };

  return {
    ...query,
    summary: query.data,
    invalidateAndRefetch,
  };
}

/**
 * Hook to fetch faculty statistics
 */
export function useDashboardStatistics() {
  const query = useQuery<FacultyStatistics, Error>({
    queryKey: FACULTY_DASHBOARD_QUERY_KEYS.statistics,
    queryFn: () => facultyDashboardApi.getDashboardStatistics(),
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    statistics: query.data,
  };
}

/**
 * Hook to fetch Today's Classes
 */
export function useTodaysClasses() {
  const query = useQuery<FacultyClass[], Error>({
    queryKey: FACULTY_DASHBOARD_QUERY_KEYS.todaysClasses,
    queryFn: () => facultyDashboardApi.getTodaysClasses(),
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    classes: query.data || [],
  };
}

/**
 * Hook to fetch Upcoming Schedule
 */
export function useUpcomingSchedule() {
  const query = useQuery<FacultySchedule[], Error>({
    queryKey: FACULTY_DASHBOARD_QUERY_KEYS.upcomingSchedule,
    queryFn: () => facultyDashboardApi.getUpcomingSchedule(),
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    schedule: query.data || [],
  };
}

/**
 * Hook to fetch Recent Activities
 */
export function useRecentActivities() {
  const query = useQuery<FacultyActivity[], Error>({
    queryKey: FACULTY_DASHBOARD_QUERY_KEYS.recentActivities,
    queryFn: () => facultyDashboardApi.getRecentActivities(),
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    activities: query.data || [],
  };
}

/**
 * Hook to fetch Department Notices
 */
export function useDepartmentNotices() {
  const query = useQuery<FacultyNotice[], Error>({
    queryKey: FACULTY_DASHBOARD_QUERY_KEYS.departmentNotices,
    queryFn: () => facultyDashboardApi.getDepartmentNotices(),
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    notices: query.data || [],
  };
}

/**
 * Hook to fetch Hospital Notifications
 */
export function useHospitalNotifications() {
  const query = useQuery<HospitalNotification, Error>({
    queryKey: FACULTY_DASHBOARD_QUERY_KEYS.hospitalNotifications,
    queryFn: () => facultyDashboardApi.getHospitalNotifications(),
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    hospitalNotification: query.data,
  };
}

/**
 * Hook to fetch Research Summary
 */
export function useResearchSummary() {
  const query = useQuery<FacultyResearchSummary, Error>({
    queryKey: FACULTY_DASHBOARD_QUERY_KEYS.researchSummary,
    queryFn: () => facultyDashboardApi.getResearchSummary(),
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    researchSummary: query.data,
  };
}

/**
 * Hook to fetch Attendance Summary
 */
export function useAttendanceSummary() {
  const query = useQuery<FacultyAttendanceSummary, Error>({
    queryKey: FACULTY_DASHBOARD_QUERY_KEYS.attendanceSummary,
    queryFn: () => facultyDashboardApi.getAttendanceSummary(),
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    attendanceSummary: query.data,
  };
}

/**
 * Hook to fetch Assignment Summary
 */
export function useAssignmentSummary() {
  const query = useQuery<FacultyAssignmentSummary, Error>({
    queryKey: FACULTY_DASHBOARD_QUERY_KEYS.assignmentSummary,
    queryFn: () => facultyDashboardApi.getAssignmentSummary(),
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    assignmentSummary: query.data,
  };
}

/**
 * Hook to fetch Library Summary
 */
export function useLibrarySummary() {
  const query = useQuery<FacultyLibrarySummary, Error>({
    queryKey: FACULTY_DASHBOARD_QUERY_KEYS.librarySummary,
    queryFn: () => facultyDashboardApi.getLibrarySummary(),
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    librarySummary: query.data,
  };
}

/**
 * Hook to fetch Performance Statistics
 */
export function usePerformanceStatistics() {
  const query = useQuery<PerformanceStatistics, Error>({
    queryKey: FACULTY_DASHBOARD_QUERY_KEYS.performanceStatistics,
    queryFn: () => facultyDashboardApi.getPerformanceStatistics(),
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    performanceStatistics: query.data,
  };
}
