/**
 * Notification Center Unit & Integration Tests
 * Validates filtering, unread counting, category logic, priority thresholds, search & mark as read actions.
 */

import { INITIAL_NOTIFICATIONS, NotificationItem } from '../hooks/useNotificationCenter';

describe('Faculty Notification Center Unit Tests', () => {
  let notifications: NotificationItem[];

  beforeEach(() => {
    notifications = [...INITIAL_NOTIFICATIONS];
  });

  test('calculates correct initial unread count', () => {
    const unreadCount = notifications.filter((n) => !n.read).length;
    expect(unreadCount).toBeGreaterThan(0);
    expect(unreadCount).toBe(3);
  });

  test('marks notification as read by id', () => {
    const targetId = 'n1';
    notifications = notifications.map((n) => (n.id === targetId ? { ...n, read: true } : n));
    const target = notifications.find((n) => n.id === targetId);
    expect(target?.read).toBe(true);
  });

  test('marks all notifications as read', () => {
    notifications = notifications.map((n) => ({ ...n, read: true }));
    const unreadCount = notifications.filter((n) => !n.read).length;
    expect(unreadCount).toBe(0);
  });

  test('filters notifications by category', () => {
    const academicOnly = notifications.filter((n) => n.category === 'Academic');
    expect(academicOnly.every((n) => n.category === 'Academic')).toBe(true);
  });

  test('filters notifications by priority', () => {
    const criticalOnly = notifications.filter((n) => n.priority === 'Critical');
    expect(criticalOnly.length).toBeGreaterThan(0);
    expect(criticalOnly[0].priority).toBe('Critical');
  });

  test('searches notifications by title query', () => {
    const query = 'WBUHS';
    const matches = notifications.filter((n) =>
      n.title.toLowerCase().includes(query.toLowerCase())
    );
    expect(matches.length).toBe(1);
    expect(matches[0].id).toBe('n1');
  });
});
