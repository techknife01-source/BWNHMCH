import React from 'react';
import { Card } from '../common/Card';
import { CheckCircle2, AlertCircle, Clock, Calendar } from 'lucide-react';
import { SubjectAttendance } from '../../types/index';

interface AttendanceCardProps {
  subject: SubjectAttendance;
}

export const AttendanceCard: React.FC<AttendanceCardProps> = ({ subject }) => {
  const isGood = subject.percentage >= 75;

  return (
    <Card className="p-5 border border-slate-200/80 dark:border-slate-800 space-y-3 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-black uppercase text-slate-400 font-mono tracking-wider">
            {subject.subjectCode}
          </span>
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
            {subject.subjectName}
          </h4>
          <p className="text-2xs text-slate-500 mt-0.5">Faculty: {subject.facultyName}</p>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-black flex items-center gap-1 ${
            isGood
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
          }`}
        >
          {isGood ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
          <span>{subject.percentage.toFixed(1)}%</span>
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-2xs text-slate-500 font-semibold">
          <span>Classes Attended: {subject.attendedClasses} / {subject.totalClasses}</span>
          <span>{isGood ? 'Satisfactory' : 'Low Attendance Alert'}</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isGood ? 'bg-[#00A651]' : 'bg-rose-500'
            }`}
            style={{ width: `${Math.min(100, subject.percentage)}%` }}
          />
        </div>
      </div>
    </Card>
  );
};
