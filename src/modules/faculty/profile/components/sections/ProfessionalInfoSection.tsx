import React from 'react';
import { Stethoscope, Clock, MapPin, Calendar, Activity, CheckCircle2 } from 'lucide-react';

interface ProfessionalInfoSectionProps {
  opdScheduleSlot: string;
  opdRoomNo: string;
}

export const ProfessionalInfoSection: React.FC<ProfessionalInfoSectionProps> = ({
  opdScheduleSlot,
  opdRoomNo,
}) => {
  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-emerald-600" />
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Clinical Consultant & OPD Duties
          </h3>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
          <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" /> Active Duty Roster
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 bg-gradient-to-br from-[#002147] to-[#003366] text-white rounded-3xl shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-3xs font-extrabold uppercase text-slate-300 tracking-wider">
              Assigned Hospital OPD Room
            </span>
            <MapPin className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-lg font-black text-emerald-300">{opdRoomNo}</div>
          <p className="text-2xs text-slate-300">
            Main OPD Block • General Medicine & Organon Specialty Clinic
          </p>
        </div>

        <div className="p-5 bg-gradient-to-br from-[#002147] to-[#003366] text-white rounded-3xl shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-3xs font-extrabold uppercase text-slate-300 tracking-wider">
              Weekly OPD Shift Timings
            </span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-lg font-black text-slate-100">{opdScheduleSlot}</div>
          <p className="text-2xs text-slate-300">
            Attendance automatically synced with Clinical Hospital Portal
          </p>
        </div>
      </div>

      <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
          Clinical Specialty Areas & Case Taking Expertise
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Chronic Miasmatic Diagnosis & Prescribing
            </span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Autoimmune & Allergic Rhinitis Clinical Management
            </span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Rheumatoid Arthritis Constitutional Therapy
            </span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold text-slate-800 dark:text-slate-200">
              UG & PG Intern Clinical Bedside Guidance
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
