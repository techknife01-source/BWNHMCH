import React, { useState } from 'react';
import { DashboardBreadcrumb } from './DashboardBreadcrumb';
import { DashboardStatistics } from './DashboardStatistics';
import { UpcomingClasses } from './UpcomingClasses';
import { TodaysSchedule } from './TodaysSchedule';
import { QuickActions } from './QuickActions';
import { PerformanceChart } from './PerformanceChart';
import { AttendanceSummary } from './AttendanceSummary';
import { AssignmentSummary } from './AssignmentSummary';
import { ResearchSummary } from './ResearchSummary';
import { LibrarySummary } from './LibrarySummary';
import { HospitalPostingSummary } from './HospitalPostingSummary';
import { NoticeBoard } from './NoticeBoard';
import { RecentActivities } from './RecentActivities';
import { CalendarWidget } from './CalendarWidget';
import { NotificationWidget } from './NotificationWidget';
import { DashboardWidgets } from './DashboardWidgets';

// Enterprise Modals & PWA
import { QuickSearchModal } from './components/QuickSearchModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { DashboardCalendarModal } from './components/DashboardCalendarModal';
import { DashboardCustomizerModal } from './components/DashboardCustomizerModal';
import { DashboardSettingsModal } from './components/DashboardSettingsModal';
import { PwaOfflineBanner } from './components/PwaOfflineBanner';

import { useAuth } from '../../../hooks/useAuth';
import { useFacultyDashboard } from './hooks/useFacultyDashboardHooks';
import { useDashboardSettings } from './hooks/useDashboardSettings';
import { Sparkles, SlidersHorizontal, Search } from 'lucide-react';

export const DashboardContent: React.FC = () => {
  const { user } = useAuth();
  const { invalidateAndRefetch } = useFacultyDashboard();
  const { settings, widgets } = useDashboardSettings();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await invalidateAndRefetch();
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 600);
    }
  };

  const isWidgetVisible = (id: string) => {
    return widgets.some((w) => w.id === id && w.visible);
  };

  return (
    <div className={`space-y-6 ${settings.compactMode ? 'p-1' : ''} ${settings.animationsEnabled ? 'transition-all duration-200' : ''}`}>
      {/* PWA Network Status Banner */}
      <PwaOfflineBanner />

      {/* Header Toolbar & Breadcrumbs */}
      <DashboardBreadcrumb
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCalendar={() => setIsCalendarModalOpen(true)}
        onOpenNotificationCenter={() => setIsNotificationCenterOpen(true)}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Faculty Welcome Hero Banner */}
      <div className="p-6 bg-gradient-to-r from-[#002147] via-[#003366] to-[#00A651] rounded-3xl text-white shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Background decorative accent */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none" />

        <div className="space-y-1 z-10 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-3xs font-black uppercase tracking-wider bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Faculty Operations Portal
            </span>
            <span className="text-3xs text-slate-300 font-medium">
              Academic Year 2026-27
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
            Welcome back, {user?.fullName || 'Dr. Faculty Member'} 👋
          </h1>

          <p className="text-xs text-slate-200 leading-relaxed opacity-90">
            {user?.department || 'Department of Organon of Medicine & Homoeopathic Philosophy'} • Senior Lecturer & Clinical Consultant
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 shrink-0">
          <button
            onClick={() => setIsCustomizerOpen(true)}
            className="px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-right cursor-pointer transition"
          >
            <span className="text-3xs font-extrabold uppercase text-slate-300 block flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" /> Layout
            </span>
            <span className="text-xs font-black text-emerald-300">Customize Grid</span>
          </button>
          <div className="px-3.5 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-right">
            <span className="text-3xs font-extrabold uppercase text-slate-300 block">Today's OPD Shift</span>
            <span className="text-xs font-black text-emerald-300">Room 4 (11:30 AM)</span>
          </div>
        </div>
      </div>

      {/* Dynamic Widget Rendering based on User Customizer Preferences */}
      {isWidgetVisible('statistics') && <DashboardStatistics />}

      {/* Schedule Row */}
      {(isWidgetVisible('upcomingClasses') || isWidgetVisible('todaysSchedule')) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {isWidgetVisible('upcomingClasses') && (
            <div className={isWidgetVisible('todaysSchedule') ? 'lg:col-span-2' : 'lg:col-span-3'}>
              <UpcomingClasses />
            </div>
          )}
          {isWidgetVisible('todaysSchedule') && (
            <div className={isWidgetVisible('upcomingClasses') ? 'lg:col-span-1' : 'lg:col-span-3'}>
              <TodaysSchedule />
            </div>
          )}
        </div>
      )}

      {/* Quick Actions Panel */}
      {isWidgetVisible('quickActions') && <QuickActions />}

      {/* Analytics & Performance Charts */}
      {isWidgetVisible('performanceChart') && <PerformanceChart />}

      {/* Academic & Clinical Summaries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isWidgetVisible('attendanceSummary') && <AttendanceSummary />}
        {isWidgetVisible('assignmentSummary') && <AssignmentSummary />}
        {isWidgetVisible('researchSummary') && <ResearchSummary />}
        {isWidgetVisible('librarySummary') && <LibrarySummary />}
        {isWidgetVisible('hospitalPostingSummary') && <HospitalPostingSummary />}
        {isWidgetVisible('calendarWidget') && <CalendarWidget />}
      </div>

      {/* Notices, Activities & Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {isWidgetVisible('noticeBoard') && (
          <div className={isWidgetVisible('notificationWidget') || isWidgetVisible('recentActivities') ? 'lg:col-span-2' : 'lg:col-span-3'}>
            <NoticeBoard />
          </div>
        )}
        <div className="lg:col-span-1 space-y-6">
          {isWidgetVisible('notificationWidget') && <NotificationWidget />}
          {isWidgetVisible('recentActivities') && <RecentActivities />}
        </div>
      </div>

      {/* Student Queries & External Academic Resources */}
      {isWidgetVisible('dashboardWidgets') && <DashboardWidgets />}

      {/* Dialog Modals */}
      <QuickSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <NotificationCenterModal isOpen={isNotificationCenterOpen} onClose={() => setIsNotificationCenterOpen(false)} />
      <DashboardCalendarModal isOpen={isCalendarModalOpen} onClose={() => setIsCalendarModalOpen(false)} />
      <DashboardCustomizerModal isOpen={isCustomizerOpen} onClose={() => setIsCustomizerOpen(false)} />
      <DashboardSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};
