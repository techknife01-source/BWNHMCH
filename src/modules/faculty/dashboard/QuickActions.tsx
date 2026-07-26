import React, { useState } from 'react';
import {
  CheckSquare,
  Upload,
  FilePlus,
  Award,
  Calendar,
  Megaphone,
  Library,
  Stethoscope,
  X,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const actions = [
    {
      id: 'attendance',
      label: 'Take Attendance',
      desc: 'Mark daily subject register',
      icon: CheckSquare,
      color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/80',
      borderColor: 'border-emerald-200/80 dark:border-emerald-800',
      route: '/faculty/attendance',
    },
    {
      id: 'upload-notes',
      label: 'Upload Notes',
      desc: 'Share PPTs & e-books',
      icon: Upload,
      color: 'bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900/80',
      borderColor: 'border-blue-200/80 dark:border-blue-800',
      route: '/faculty/study-material',
    },
    {
      id: 'create-assignment',
      label: 'Create Assignment',
      desc: 'Post new logbook task',
      icon: FilePlus,
      color: 'bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-950/60 dark:text-purple-300 dark:hover:bg-purple-900/80',
      route: '/faculty/assignments',
    },
    {
      id: 'publish-marks',
      label: 'Publish Marks',
      desc: 'Internal assessment entry',
      icon: Award,
      color: 'bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 dark:hover:bg-amber-900/80',
      route: '/faculty/results',
    },
    {
      id: 'timetable',
      label: 'Open Timetable',
      desc: 'Weekly lecture roster',
      icon: Calendar,
      color: 'bg-teal-50 text-teal-700 hover:bg-teal-100 dark:bg-teal-950/60 dark:text-teal-300 dark:hover:bg-teal-900/80',
      route: '/faculty/classes',
    },
    {
      id: 'dept-notice',
      label: 'Department Notice',
      desc: 'Post HOD circular',
      icon: Megaphone,
      color: 'bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 dark:hover:bg-rose-900/80',
      route: '/faculty/department',
    },
    {
      id: 'library',
      label: 'Library Requisition',
      desc: 'Request new books',
      icon: Library,
      color: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900/80',
      route: '/faculty/library',
    },
    {
      id: 'hospital',
      label: 'Hospital Duty',
      desc: 'OPD roster & IPD rounds',
      icon: Stethoscope,
      color: 'bg-sky-50 text-sky-700 hover:bg-sky-100 dark:bg-sky-950/60 dark:text-sky-300 dark:hover:bg-sky-900/80',
      route: '/faculty/hospital',
    },
  ];

  const handleAction = (act: typeof actions[0]) => {
    if (act.route) {
      navigate(act.route);
    } else {
      setActiveModal(act.id);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
            Faculty Quick Actions
          </h4>
          <p className="text-2xs text-slate-500">Frequent tasks and operational tools</p>
        </div>
        <span className="text-3xs font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/80 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
          8 Shortcuts
        </span>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-between animate-fade-in">
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4" /> {toastMessage}
          </span>
          <button onClick={() => setToastMessage(null)} className="cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Grid of Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;

          return (
            <button
              key={act.id}
              onClick={() => handleAction(act)}
              className={`p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 text-left transition transform active:scale-98 cursor-pointer flex flex-col justify-between space-y-2 group ${act.color}`}
            >
              <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 w-fit shadow-2xs group-hover:scale-105 transition">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-extrabold text-xs text-slate-900 dark:text-white leading-tight">
                  {act.label}
                </h5>
                <p className="text-3xs opacity-80 mt-0.5 truncate">{act.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
