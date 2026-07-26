import { useState, useEffect } from 'react';

export interface DashboardWidgetConfig {
  id: string;
  title: string;
  category: 'core' | 'academic' | 'clinical' | 'analytics' | 'activity';
  visible: boolean;
  order: number;
}

export interface NotificationPreferences {
  emailAlerts: boolean;
  pushAlerts: boolean;
  minimumPriority: 'Low' | 'Medium' | 'High' | 'Critical';
  soundEnabled: boolean;
}

export interface FacultyDashboardSettings {
  theme: 'light' | 'dark' | 'system';
  compactMode: boolean;
  animationsEnabled: boolean;
  defaultLandingWidget: string;
  notificationPreferences: NotificationPreferences;
  widgets: DashboardWidgetConfig[];
}

export const DEFAULT_WIDGETS: DashboardWidgetConfig[] = [
  { id: 'statistics', title: 'Faculty Metrics Overview', category: 'core', visible: true, order: 1 },
  { id: 'upcomingClasses', title: "Today's Academic Classes", category: 'academic', visible: true, order: 2 },
  { id: 'todaysSchedule', title: "Today's Time-Slot Schedule", category: 'academic', visible: true, order: 3 },
  { id: 'quickActions', title: 'Quick Action Panel', category: 'core', visible: true, order: 4 },
  { id: 'performanceChart', title: 'Academic Analytics & Trends', category: 'analytics', visible: true, order: 5 },
  { id: 'attendanceSummary', title: 'Attendance Summary', category: 'academic', visible: true, order: 6 },
  { id: 'assignmentSummary', title: 'Assignment & Logbook Reviews', category: 'academic', visible: true, order: 7 },
  { id: 'researchSummary', title: 'Research & Publications', category: 'academic', visible: true, order: 8 },
  { id: 'librarySummary', title: 'E-Library & Notes', category: 'academic', visible: true, order: 9 },
  { id: 'hospitalPostingSummary', title: 'Clinical OPD & Postings', category: 'clinical', visible: true, order: 10 },
  { id: 'calendarWidget', title: 'Academic Calendar', category: 'core', visible: true, order: 11 },
  { id: 'noticeBoard', title: 'Department Notice Board', category: 'activity', visible: true, order: 12 },
  { id: 'notificationWidget', title: 'Alerts & Circulars', category: 'activity', visible: true, order: 13 },
  { id: 'recentActivities', title: 'Recent Activity Timeline', category: 'activity', visible: true, order: 14 },
  { id: 'dashboardWidgets', title: 'Student Queries & External Tools', category: 'academic', visible: true, order: 15 },
];

export const DEFAULT_SETTINGS: FacultyDashboardSettings = {
  theme: 'system',
  compactMode: false,
  animationsEnabled: true,
  defaultLandingWidget: 'statistics',
  notificationPreferences: {
    emailAlerts: true,
    pushAlerts: true,
    minimumPriority: 'Low',
    soundEnabled: true,
  },
  widgets: DEFAULT_WIDGETS,
};

const STORAGE_KEY = 'FACULTY_DASHBOARD_SETTINGS_V2';

export function useDashboardSettings() {
  const [settings, setSettings] = useState<FacultyDashboardSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure new default widgets are merged if any are missing
        const mergedWidgets = DEFAULT_WIDGETS.map((def) => {
          const found = parsed.widgets?.find((w: DashboardWidgetConfig) => w.id === def.id);
          return found ? { ...def, ...found } : def;
        });
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          widgets: mergedWidgets.sort((a, b) => a.order - b.order),
        };
      }
    } catch (e) {
      console.error('Failed to parse saved dashboard settings:', e);
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save dashboard settings:', e);
    }
  }, [settings]);

  const toggleWidgetVisibility = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) => (w.id === id ? { ...w, visible: !w.visible } : w)),
    }));
  };

  const moveWidget = (id: string, direction: 'up' | 'down') => {
    setSettings((prev) => {
      const index = prev.widgets.findIndex((w) => w.id === id);
      if (index === -1) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.widgets.length) return prev;

      const newWidgets = [...prev.widgets];
      const temp = newWidgets[index];
      newWidgets[index] = newWidgets[targetIndex];
      newWidgets[targetIndex] = temp;

      // Re-index order
      const reindexed = newWidgets.map((w, idx) => ({ ...w, order: idx + 1 }));
      return { ...prev, widgets: reindexed };
    });
  };

  const updateSettings = (partial: Partial<FacultyDashboardSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const updateNotificationPreferences = (partial: Partial<NotificationPreferences>) => {
    setSettings((prev) => ({
      ...prev,
      notificationPreferences: { ...prev.notificationPreferences, ...partial },
    }));
  };

  const restoreDefaultLayout = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return {
    settings,
    widgets: settings.widgets.filter((w) => w.visible).sort((a, b) => a.order - b.order),
    allWidgets: settings.widgets.sort((a, b) => a.order - b.order),
    toggleWidgetVisibility,
    moveWidget,
    updateSettings,
    updateNotificationPreferences,
    restoreDefaultLayout,
  };
}
