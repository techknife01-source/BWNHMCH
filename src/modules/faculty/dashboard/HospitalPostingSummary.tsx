import React from 'react';
import { Stethoscope, ArrowUpRight, Users, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHospitalNotifications } from './hooks/useFacultyDashboardHooks';
import { WidgetContainer } from './components/WidgetContainer';

export const HospitalPostingSummary: React.FC = () => {
  const navigate = useNavigate();
  const { hospitalNotification, isLoading, isError, error, refetch } = useHospitalNotifications();

  return (
    <WidgetContainer
      title="Clinical OPD & Hospital Postings"
      subtitle="Shift rosters & intern clinical logbook approvals"
      icon={Stethoscope}
      iconColorClass="text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60"
      isLoading={isLoading}
      isError={isError}
      error={error}
      isEmpty={!hospitalNotification}
      emptyMessage="No clinical duty notifications found."
      onRetry={refetch}
      headerAction={
        <button
          onClick={() => navigate('/faculty/hospital')}
          className="text-2xs font-extrabold text-teal-600 hover:text-teal-700 dark:text-teal-400 flex items-center gap-1 cursor-pointer"
        >
          <span>Hospital Portal</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      }
    >
      <div className="space-y-3">
        <div className="p-3 rounded-xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200/60 dark:border-teal-900/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-3xs font-black uppercase tracking-wider text-teal-700 dark:text-teal-400">
              Next Clinical Shift Today
            </span>
            <span className="px-2 py-0.5 text-3xs font-black rounded-md bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200">
              Assigned OPD
            </span>
          </div>

          <h5 className="font-extrabold text-sm text-slate-900 dark:text-white">
            {hospitalNotification?.opdShift || 'General Medicine OPD Room 4'}
          </h5>

          <div className="flex items-center justify-between text-2xs font-bold text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              {hospitalNotification?.shiftTime || '11:30 AM - 02:30 PM'}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-teal-600" />
              {hospitalNotification?.internsCount || 6} Posted Interns
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-3xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
              Pending Logbook Approvals
            </span>
            <h6 className="font-extrabold text-xs text-slate-900 dark:text-white">
              {hospitalNotification?.statusNotice || 'Intern Case Record Approval Pending'}
            </h6>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-extrabold text-xs shrink-0">
            {hospitalNotification?.approvalPendingCount || 3} Pending
          </span>
        </div>
      </div>
    </WidgetContainer>
  );
};
