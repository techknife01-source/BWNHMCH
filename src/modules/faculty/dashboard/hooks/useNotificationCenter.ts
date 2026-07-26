import { useState, useMemo } from 'react';

export type NotificationCategory = 'Academic' | 'Department' | 'Hospital' | 'Research' | 'Library' | 'System';
export type NotificationPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  timestamp: string; // ISO date or formatted string for filtering
  category: NotificationCategory;
  priority: NotificationPriority;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'WBUHS Internal Assessment Paper Submission',
    desc: 'Question papers for 2nd BHMS Pathology term exam must be submitted to the Controller of Exams by 28th July 2026.',
    time: '10 mins ago',
    timestamp: '2026-07-24T08:30:00Z',
    category: 'Academic',
    priority: 'Critical',
    read: false,
    actionUrl: '/faculty/assignments',
    actionLabel: 'Go to Submissions',
  },
  {
    id: 'n2',
    title: 'Hospital Emergency OPD Shift Adjustment',
    desc: 'Dr. Sharma assigned to cover Emergency Ward B on Saturday morning shift due to clinical roster rotation.',
    time: '1 hour ago',
    timestamp: '2026-07-24T07:15:00Z',
    category: 'Hospital',
    priority: 'High',
    read: false,
    actionUrl: '/faculty/hospital',
    actionLabel: 'View Roster',
  },
  {
    id: 'n3',
    title: 'Departmental Faculty Roster Meeting Call',
    desc: 'HOD convened Organon of Medicine department faculty meeting on Friday 03:30 PM in Conference Room B.',
    time: '3 hours ago',
    timestamp: '2026-07-24T05:00:00Z',
    category: 'Department',
    priority: 'Medium',
    read: false,
    actionUrl: '/faculty/notices',
    actionLabel: 'Meeting Details',
  },
  {
    id: 'n4',
    title: 'AYUSH Extra-Mural Research Grant Progress Update',
    desc: 'Quarterly financial disbursement for Migraine Homoeopathic Clinical Trial has been verified by the CCRH committee.',
    time: 'Yesterday',
    timestamp: '2026-07-23T14:20:00Z',
    category: 'Research',
    priority: 'Low',
    read: true,
    actionUrl: '/faculty/research',
    actionLabel: 'Grant Summary',
  },
  {
    id: 'n5',
    title: 'New Homoeopathic E-Library Monographs Uploaded',
    desc: '15 rare digital manuscripts on Allen\'s Keynotes and Boenninghausen\'s Repertory are now available in the library portal.',
    time: '2 days ago',
    timestamp: '2026-07-22T10:00:00Z',
    category: 'Library',
    priority: 'Low',
    read: true,
    actionUrl: '/faculty/library',
    actionLabel: 'Browse E-Library',
  },
  {
    id: 'n6',
    title: 'System Maintenance & Server Backup Completed',
    desc: 'Biometric attendance sync engine and student result databases were upgraded to v3.2 successfully.',
    time: '3 days ago',
    timestamp: '2026-07-21T23:00:00Z',
    category: 'System',
    priority: 'Low',
    read: true,
  },
];

export function useNotificationCenter() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [dateRangeFilter, setDateRangeFilter] = useState<string>('All');
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      // Category filter
      if (categoryFilter !== 'All' && item.category !== categoryFilter) {
        return false;
      }
      // Priority filter
      if (priorityFilter !== 'All' && item.priority !== priorityFilter) {
        return false;
      }
      // Date filter
      if (dateRangeFilter === 'Today') {
        const itemDate = new Date(item.timestamp).toDateString();
        const todayDate = new Date().toDateString();
        if (itemDate !== todayDate) return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.desc.toLowerCase().includes(q);
        const matchesCat = item.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesCat) return false;
      }
      return true;
    });
  }, [notifications, categoryFilter, priorityFilter, dateRangeFilter, searchQuery]);

  const paginatedNotifications = useMemo(() => {
    return filteredNotifications.slice(0, page * itemsPerPage);
  }, [filteredNotifications, page]);

  const hasMore = paginatedNotifications.length < filteredNotifications.length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const loadMore = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('All');
    setPriorityFilter('All');
    setDateRangeFilter('All');
    setPage(1);
  };

  return {
    notifications: paginatedNotifications,
    totalFilteredCount: filteredNotifications.length,
    unreadCount,
    hasMore,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    priorityFilter,
    setPriorityFilter,
    dateRangeFilter,
    setDateRangeFilter,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loadMore,
    resetFilters,
  };
}
