import React from 'react';
import { Card } from '../common/Card';
import { FileText, Calendar, Clock, CheckCircle2, AlertCircle, Upload, MessageSquare } from 'lucide-react';
import { Assignment } from '../../types/index';

interface AssignmentCardProps {
  assignment: Assignment;
  onSubmitClick?: (assignment: Assignment) => void;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({ assignment, onSubmitClick }) => {
  const getStatusBadge = () => {
    switch (assignment.status) {
      case 'SUBMITTED':
        return <span className="px-2.5 py-0.5 rounded-full text-2xs font-black bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">Submitted</span>;
      case 'GRADED':
        return <span className="px-2.5 py-0.5 rounded-full text-2xs font-black bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">Graded</span>;
      case 'OVERDUE':
        return <span className="px-2.5 py-0.5 rounded-full text-2xs font-black bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">Overdue</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-2xs font-black bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">Pending</span>;
    }
  };

  return (
    <Card className="p-5 border border-slate-200/80 dark:border-slate-800 space-y-3.5 hover:shadow-md transition">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
            {assignment.subjectName} ({assignment.subjectCode})
          </span>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
            {assignment.title}
          </h3>
          <p className="text-2xs text-slate-500">Assigned by: {assignment.facultyName}</p>
        </div>
        {getStatusBadge()}
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
        {assignment.description}
      </p>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-2xs text-slate-500 gap-2">
        <div className="flex items-center space-x-3">
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Due: {assignment.dueDate}</span>
          <span className="font-bold text-slate-700 dark:text-slate-300">Max Marks: {assignment.totalMarks}</span>
        </div>

        {assignment.status === 'GRADED' && assignment.obtainedMarks !== undefined && (
          <span className="font-black text-emerald-600 dark:text-emerald-400 text-xs">
            Marks: {assignment.obtainedMarks} / {assignment.totalMarks}
          </span>
        )}

        {(assignment.status === 'PENDING' || assignment.status === 'OVERDUE') && onSubmitClick && (
          <button
            onClick={() => onSubmitClick(assignment)}
            className="px-3 py-1.5 bg-[#002147] hover:bg-[#001530] text-white font-bold rounded-xl text-2xs transition flex items-center gap-1 cursor-pointer"
          >
            <Upload className="w-3 h-3" />
            <span>Upload Work</span>
          </button>
        )}
      </div>

      {assignment.feedback && (
        <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl text-2xs text-slate-600 dark:text-slate-300 flex items-start gap-2 border border-slate-100 dark:border-slate-800">
          <MessageSquare className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-900 dark:text-white block font-bold">Faculty Feedback:</strong>
            {assignment.feedback}
          </div>
        </div>
      )}
    </Card>
  );
};
