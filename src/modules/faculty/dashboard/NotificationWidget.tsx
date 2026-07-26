import React, { useState } from 'react';
import { Bell, CheckCheck, AlertCircle, Info, GraduationCap, Building2, Stethoscope } from 'lucide-react';

export const NotificationWidget: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'academic' | 'hospital' | 'department'>('all');
  const [unreadCount, setUnreadCount] = useState(3);

  const notifications = [
    {
      id: 1,
      title: 'WBUHS Internal Assessment Paper Submission',
      desc: 'Question papers for 2nd BHMS Pathology term exam must be submitted by 28th July.',
      time: '10 mins ago',
      category: 'academic',
      priority: 'high',
      read: false,
    },
    {
      id: 2,
      title: 'Hospital OPD Schedule Adjustment',
      desc: 'Dr. Sharma assigned to cover Emergency Ward B on Saturday morning shift.',
      time: '1 hour ago',
      category: 'hospital',
      priority: 'medium',
      read: false,
    },
    {
      id: 3,
      title: 'Departmental Meeting Call',
      desc: 'HOD convened Organon of Medicine department faculty meeting on Friday 03:30 PM.',
      time: '3 hours ago',
      category: 'department',
      priority: 'normal',
      read: false,
    },
    {
      id: 4,
      title: 'CCRH Research Grant Progress Update',
      desc: 'Quarterly financial report for Migraine Clinical Trial has been verified.',
      time: 'Yesterday',
      category: 'academic',
      priority: 'normal',
      read: true,
    },
  ];

  const filtered = notifications.filter(
    (n) => filter === 'all' || n.category === filter
  );

  return (
    <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bell className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse" />
            )}
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Faculty Alerts & Circulars
            </h4>
            <p className="text-2xs text-slate-500">{unreadCount} unread notification(s)</p>
          </div>
        </div>

        <button
          onClick={() => setUnreadCount(0)}
          className="text-3xs font-extrabold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Mark Read</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {(['all', 'academic', 'hospital', 'department'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-2.5 py-1 text-3xs font-black rounded-lg transition uppercase tracking-wider shrink-0 cursor-pointer ${
              filter === cat
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-thin pr-1">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-3 rounded-xl border transition space-y-1 ${
              !item.read && unreadCount > 0
                ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-800/60'
                : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1 text-3xs font-black uppercase tracking-wider text-slate-500">
                {item.category === 'academic' && <GraduationCap className="w-3 h-3 text-blue-500" />}
                {item.category === 'hospital' && <Stethoscope className="w-3 h-3 text-teal-500" />}
                {item.category === 'department' && <Building2 className="w-3 h-3 text-purple-500" />}
                {item.category}
              </span>
              <span className="text-3xs text-slate-400">{item.time}</span>
            </div>

            <h5 className="font-extrabold text-xs text-slate-900 dark:text-white leading-tight">
              {item.title}
            </h5>
            <p className="text-3xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
