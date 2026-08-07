import React, { useState } from 'react';
import { Bell, CheckCircle2, AlertTriangle, FileText, Stethoscope, GraduationCap, Users, Award, BookOpen, UserPlus, Check } from 'lucide-react';
import { Popover } from '../common/Popover';

interface NotificationItem {
  id: string;
  category: 'Notice' | 'Hospital Alert' | 'Student Alert' | 'Faculty Alert' | 'Exam Alert' | 'Admission Alert' | 'Library Alert';
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: any;
  color: string;
}

export const Notifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('unread');
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      category: 'Notice',
      title: 'Principal Circular #2026-04',
      message: 'Independence Day flag hoisting & hospital emergency duty schedule published.',
      time: '12m ago',
      read: false,
      icon: FileText,
      color: 'text-blue-500 bg-blue-50 border-blue-100 dark:bg-blue-950/50'
    },
    {
      id: '2',
      category: 'Hospital Alert',
      title: 'OPD Patient Surge Notice',
      message: 'Dr. Soumitra De OPD clinic reached capacity. Additional doctors allocated to OPD Counter 3.',
      time: '45m ago',
      read: false,
      icon: Stethoscope,
      color: 'text-rose-500 bg-rose-50 border-rose-100 dark:bg-rose-950/50'
    },
    {
      id: '3',
      category: 'Exam Alert',
      title: 'WBUHS BHMS 3rd Year Viva Roster',
      message: 'Organon & Repertory viva voce hall tickets ready for download.',
      time: '2h ago',
      read: false,
      icon: Award,
      color: 'text-purple-500 bg-purple-50 border-purple-100 dark:bg-purple-950/50'
    },
    {
      id: '4',
      category: 'Student Alert',
      title: 'Attendance Warning (3rd Sem)',
      message: '3 scholars falling short of 75% mandatory clinical attendance for July 2026.',
      time: '4h ago',
      read: true,
      icon: GraduationCap,
      color: 'text-amber-500 bg-amber-50 border-amber-100 dark:bg-amber-950/50'
    },
    {
      id: '5',
      category: 'Library Alert',
      title: 'Book Overdue Notification',
      message: 'Kent Repertory (Copy #12) due for return by 24 Jul 2026.',
      time: '1d ago',
      read: true,
      icon: BookOpen,
      color: 'text-emerald-500 bg-emerald-50 border-emerald-100 dark:bg-emerald-950/50'
    },
    {
      id: '6',
      category: 'Admission Alert',
      title: 'NEET AYUSH 2nd Round Counseling',
      message: '15 candidates assigned to BHMC&H for physical document verification.',
      time: '2d ago',
      read: true,
      icon: UserPlus,
      color: 'text-teal-500 bg-teal-50 border-teal-100 dark:bg-teal-950/50'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const toggleRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const displayedList = activeTab === 'unread' ? notifications.filter(n => !n.read) : notifications;

  return (
    <Popover
      trigger={
        <button
          className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 transition cursor-pointer"
          title="Notification Center"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            </span>
          )}
        </button>
      }
      className="w-80 sm:w-96 p-0 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-3.5 bg-slate-50 dark:bg-slate-950">
        <div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5 text-[#00A651]" />
            Notification Center
          </span>
          <p className="text-[10px] text-slate-400">AYUSH Campus & Hospital Stream</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-[10px] font-bold text-[#002147] dark:text-[#00A651] hover:underline"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 dark:border-slate-800 text-3xs font-bold uppercase tracking-wider bg-white dark:bg-slate-900">
        <button
          onClick={() => setActiveTab('unread')}
          className={`flex-1 py-2 text-center border-b-2 transition ${
            activeTab === 'unread'
              ? 'border-[#002147] text-[#002147] dark:border-[#00A651] dark:text-[#00A651]'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-2 text-center border-b-2 transition ${
            activeTab === 'all'
              ? 'border-[#002147] text-[#002147] dark:border-[#00A651] dark:text-[#00A651]'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          All History ({notifications.length})
        </button>
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 custom-scrollbar">
        {displayedList.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 space-y-1">
            <Check className="w-6 h-6 mx-auto text-emerald-500" />
            <p className="font-bold">All caught up!</p>
            <p className="text-[10px]">No unread alerts in your queue.</p>
          </div>
        ) : (
          displayedList.map((n) => {
            const Icon = n.icon;
            return (
              <div
                key={n.id}
                onClick={() => toggleRead(n.id)}
                className={`p-3 transition cursor-pointer flex items-start space-x-3 ${
                  !n.read
                    ? 'bg-emerald-50/30 dark:bg-emerald-950/20 hover:bg-emerald-50/60'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className={`p-2 rounded-xl border shrink-0 ${n.color}`}>
                  <Icon className="h-4 w-4" />
                </div>

                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                      {n.category}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">{n.time}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{n.title}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight">{n.message}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 text-center">
        <span className="text-[10px] text-slate-400 font-medium">Auto-synced with WBUHS & College Server</span>
      </div>
    </Popover>
  );
};
