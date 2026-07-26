/**
 * Hooks & Utility Functions Unit Tests
 * Validates query keys, error parser logic, percentage formatting, and settings helper functions.
 */

import { FACULTY_DASHBOARD_QUERY_KEYS } from '../hooks/useFacultyDashboardHooks';
import { parseApiError, formatPercentage } from '../utils/dashboard.utils';

describe('Faculty Dashboard Hooks & Utility Tests', () => {
  test('verifies query keys structure', () => {
    expect(FACULTY_DASHBOARD_QUERY_KEYS.all).toEqual(['faculty', 'dashboard']);
    expect(FACULTY_DASHBOARD_QUERY_KEYS.summary).toEqual(['faculty', 'dashboard', 'summary']);
    expect(FACULTY_DASHBOARD_QUERY_KEYS.statistics).toEqual(['faculty', 'dashboard', 'statistics']);
  });

  test('formats percentage correctly', () => {
    expect(formatPercentage(87.42)).toBe('87.4%');
    expect(formatPercentage(90)).toBe('90.0%');
  });

  test('parses unknown generic errors correctly', () => {
    const error = new Error('Database connection failed');
    const parsed = parseApiError(error);
    expect(parsed.statusCode).toBe(500);
    expect(parsed.message).toBe('Database connection failed');
    expect(parsed.isServerError).toBe(true);
  });

  test('parses fallback non-Error objects', () => {
    const parsed = parseApiError('Random string error');
    expect(parsed.statusCode).toBe(500);
    expect(parsed.message).toBe('Unknown dashboard error');
    expect(parsed.isServerError).toBe(true);
  });
});
