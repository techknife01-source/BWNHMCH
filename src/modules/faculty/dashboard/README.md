# Smart Homeopathic Medical College Digital Ecosystem — Faculty Dashboard Module

Welcome to the **Faculty Operations & Academic Portal** dashboard module. This enterprise dashboard empowers senior lecturers, department heads, and clinical consultants at the Homeopathic Medical College to manage academic lectures, clinical OPD duties, student logbook evaluations, CCRH research projects, e-library requisitions, and departmental circulars seamlessly.

---

## 📁 Directory & Folder Structure

```
src/modules/faculty/dashboard/
├── api/                             # Mock & backend API service integrations
│   └── facultyDashboardApi.ts       # Query endpoints for metrics, classes, activities
├── components/                      # Reusable UI widgets, charts & enterprise dialogs
│   ├── DashboardCalendarModal.tsx   # Month/Week/Day academic calendar & OPD duty roster
│   ├── DashboardCustomizerModal.tsx # Reorder & hide/show dashboard cards modal
│   ├── DashboardSettingsModal.tsx   # Theme, compact density, & alert settings modal
│   ├── NotificationCenterModal.tsx  # Unread count, filters, priorities & infinite scroll
│   ├── PwaOfflineBanner.tsx         # PWA network detection & cache status banner
│   ├── QuickSearchModal.tsx         # Cross-entity debounced search engine (Cmd+K)
│   ├── ReusableCharts.tsx           # Chart.js wrappers for trends & teaching hours
│   └── WidgetContainer.tsx          # Card container with loading/error/retry states
├── hooks/                           # Custom React state & React Query hooks
│   ├── useDashboardSettings.ts      # LocalStorage layout & settings persistence hook
│   ├── useFacultyDashboardHooks.ts  # TanStack React Query data hooks
│   └── useNotificationCenter.ts     # Notification center state & filtering hook
├── schemas/                         # Zod validation schemas for faculty forms
│   └── dashboardSchemas.ts
├── types/                           # TypeScript interfaces & types
│   └── dashboardTypes.ts
├── utils/                           # Formatting, calculations & date utilities
│   └── dashboardUtils.ts
├── __tests__/                       # Unit & integration test suites
│   ├── AnalyticsWidgets.test.ts
│   ├── Calendar.test.ts
│   ├── DashboardSettings.test.ts
│   ├── NotificationCenter.test.ts
│   ├── QuickActions.test.ts
│   └── QuickSearch.test.ts
├── AssignmentSummary.tsx            # Student logbook & assignment status card
├── AttendanceSummary.tsx            # Attendance register summary card
├── CalendarWidget.tsx               # Compact mini-calendar widget
├── DashboardBreadcrumb.tsx          # Navigation breadcrumb & toolbar actions
├── DashboardContent.tsx             # Main layout grid & customizable widget engine
├── DashboardHeader.tsx             # Top navigation header & quick search trigger
├── DashboardLayout.tsx             # Page layout wrapper (Sidebar + Header + Content)
├── DashboardPage.tsx               # Route page entry point
├── DashboardSidebar.tsx            # Faculty portal navigation sidebar
├── DashboardStatistics.tsx          # Key metric counter cards
├── DashboardWidgets.tsx             # Student queries & external portal links
├── HospitalPostingSummary.tsx       # OPD & IPD ward duty roster card
├── LibrarySummary.tsx               # E-Library & monograph requisition card
├── NoticeBoard.tsx                  # Department circulars & HOD notices
├── NotificationWidget.tsx           # Compact alerts & circulars widget
├── PerformanceChart.tsx             # Tabbed performance analytics chart
├── QuickActions.tsx                 # 8-card quick action shortcut panel
├── RecentActivities.tsx             # Audited activity log timeline stream
├── ResearchSummary.tsx              # CCRH & AYUSH research project status
├── TodaysSchedule.tsx               # Time-slot lecture schedule timeline
├── UpcomingClasses.tsx              # Live today's classes & attendance register trigger
└── README.md                        # Complete module documentation (this file)
```

---

## 🎯 Component Responsibilities

1. **`DashboardContent`**: The central grid container that dynamically renders active widgets based on user layout order and visibility preferences. Hosts top-level dialog modals (Quick Search, Notification Center, Calendar, Customizer, Settings) and PWA banner.
2. **`NotificationCenterModal`**: Full enterprise notification center. Supports unread count tracking, category filtering (Academic, Department, Hospital, Research, Library, System), priority thresholds (Low, Medium, High, Critical), search query matching, date filters, mark all read, and pagination.
3. **`DashboardCalendarModal`**: Interactive academic calendar supporting Month, Week, and Day views. Highlights lecture classes, OPD hospital duties, exam vivas, assignment deadlines, and CCRH research reviews.
4. **`DashboardCustomizerModal`**: Allows faculty members to reorder dashboard cards (move up/down) or hide unnecessary widgets. Preferences persist automatically in browser storage (`localStorage`).
5. **`DashboardSettingsModal`**: Manages appearance themes (Light/Dark/System), interface compactness, micro-animations, default landing focus, and notification channel preferences.
6. **`QuickSearchModal`**: Triggered via `Cmd + K` or search bar click. Debounced search engine querying across students, subjects, assignments, research projects, e-books, departments, circular notices, and hospital OPD shifts.
7. **`QuickActions`**: Provides quick 1-click navigation cards for:
   - *Take Attendance* (`/faculty/attendance`)
   - *Upload Notes* (`/faculty/study-material`)
   - *Create Assignment* (`/faculty/assignments`)
   - *Publish Marks* (`/faculty/results`)
   - *Open Timetable* (`/faculty/classes`)
   - *Department Notice* (`/faculty/department`)
   - *Library Requisition* (`/faculty/library`)
   - *Hospital Duty Roster* (`/faculty/hospital`)
8. **`RecentActivities`**: Timeline stream showcasing audited records of marked registers, submitted assignments, research paper updates, and grade postings with activity category filters and pagination.

---

## ⚓ Hook Usage & State Persistence

- **`useDashboardSettings()`**: Handles browser storage persistence under key `FACULTY_DASHBOARD_SETTINGS_V2`. Provides:
  - `widgets`: Active visible widgets ordered by preference.
  - `toggleWidgetVisibility(id)`: Hide/show specific cards.
  - `moveWidget(id, direction)`: Shift card order.
  - `updateSettings(partial)`: Theme, compact mode, animation toggles.
  - `restoreDefaultLayout()`: Resets layout back to default state.
- **`useNotificationCenter()`**: Manages live notification state:
  - `notifications`: Filtered & paginated list.
  - `unreadCount`: Dynamic badge count.
  - `markAsRead(id)` & `markAllAsRead()`: Read status triggers.
  - `categoryFilter`, `priorityFilter`, `dateRangeFilter`: Multi-facet filters.
- **`useFacultyDashboard()`**: Wraps TanStack React Query (`@tanstack/react-query`) to manage asynchronous refetching, caching, and cache invalidation.

---

## ⚡ Performance & Accessibility Features

- **Debounced Search Input**: Prevents UI stutter during typing by debouncing quick search queries.
- **Keyboard Navigation**: `Cmd + K` shortcut opens Quick Search; `ESC` closes any open modal. Full focus trap and `aria-label` tags included.
- **PWA Network Resilience**: Listens to browser `online` and `offline` window events to notify faculty when working in offline cache mode or when reconnecting.
