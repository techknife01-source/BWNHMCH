/**
 * Faculty Dashboard API Service & Schema Validation Tests
 * Validates endpoint query execution, Zod schema parsing, and fallback data structures.
 */

import {
  facultyDashboardApi,
  DEFAULT_FACULTY_STATISTICS,
  DEFAULT_TODAYS_CLASSES,
  DEFAULT_UPCOMING_SCHEDULE,
  DEFAULT_RECENT_ACTIVITIES,
  DEFAULT_DEPARTMENT_NOTICES,
} from '../api/facultyDashboard.api';
import {
  facultyStatisticsSchema,
  facultyClassSchema,
  facultyScheduleSchema,
  facultyActivitySchema,
  facultyNoticeSchema,
} from '../schemas/dashboard.schema';

describe('Faculty Dashboard API & Schema Integration Tests', () => {
  test('validates default statistics schema', () => {
    const result = facultyStatisticsSchema.safeParse(DEFAULT_FACULTY_STATISTICS);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.activeClassesCount).toBe(12);
      expect(result.data.overallAttendancePercentage).toBe(87.4);
    }
  });

  test('validates today classes schema structure', () => {
    const firstClass = DEFAULT_TODAYS_CLASSES[0];
    const result = facultyClassSchema.safeParse(firstClass);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.subject).toBe('Organon of Medicine & Philosophy');
      expect(result.data.status).toBe('Ongoing');
    }
  });

  test('validates upcoming schedule schema', () => {
    const firstSchedule = DEFAULT_UPCOMING_SCHEDULE[0];
    const result = facultyScheduleSchema.safeParse(firstSchedule);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.type).toBe('Administrative');
      expect(result.data.status).toBe('completed');
    }
  });

  test('validates recent activity schema', () => {
    const activity = DEFAULT_RECENT_ACTIVITIES[0];
    const result = facultyActivitySchema.safeParse(activity);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.type).toBe('attendance');
    }
  });

  test('validates department notice schema', () => {
    const notice = DEFAULT_DEPARTMENT_NOTICES[0];
    const result = facultyNoticeSchema.safeParse(notice);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.pinned).toBe(true);
      expect(result.data.category).toBe('Academic');
    }
  });

  test('fetches full dashboard summary with fallback', async () => {
    const summary = await facultyDashboardApi.getDashboardSummary();
    expect(summary).toBeDefined();
    expect(summary.statistics.activeClassesCount).toBeGreaterThan(0);
    expect(summary.classes.length).toBeGreaterThan(0);
    expect(summary.schedule.length).toBeGreaterThan(0);
    expect(summary.notices.length).toBeGreaterThan(0);
  });

  test('fetches individual API endpoints successfully', async () => {
    const stats = await facultyDashboardApi.getDashboardStatistics();
    expect(stats.activeClassesCount).toBe(12);

    const classes = await facultyDashboardApi.getTodaysClasses();
    expect(classes.length).toBeGreaterThan(0);

    const schedule = await facultyDashboardApi.getUpcomingSchedule();
    expect(schedule.length).toBeGreaterThan(0);

    const activities = await facultyDashboardApi.getRecentActivities();
    expect(activities.length).toBeGreaterThan(0);

    const notices = await facultyDashboardApi.getDepartmentNotices();
    expect(notices.length).toBeGreaterThan(0);
  });
});
