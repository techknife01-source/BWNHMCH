import React from 'react';
import { DepartmentInformation } from '../../types/profile.types';
import { Building2, Phone, Clock, MapPin, BookOpen, ShieldCheck } from 'lucide-react';

interface DepartmentInfoSectionProps {
  departmentInfo: DepartmentInformation;
}

export const DepartmentInfoSection: React.FC<DepartmentInfoSectionProps> = ({ departmentInfo }) => {
  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-emerald-600" />
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Departmental & Academic Designation
          </h3>
        </div>
        {departmentInfo.isHod && (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Head of Department (HOD)
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-1">
          <span className="text-3xs font-black uppercase text-slate-400 tracking-wider">
            Department Name
          </span>
          <p className="text-xs font-black text-slate-900 dark:text-white">
            {departmentInfo.departmentName} ({departmentInfo.code})
          </p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-1">
          <span className="text-3xs font-black uppercase text-slate-400 tracking-wider">
            Academic Designation
          </span>
          <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">
            {departmentInfo.designation}
          </p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-1">
          <span className="text-3xs font-black uppercase text-slate-400 tracking-wider">
            Date of Joining Department
          </span>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {departmentInfo.joiningDate}
          </p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-1">
          <span className="text-3xs font-black uppercase text-slate-400 tracking-wider">
            Faculty Cabin / Office Location
          </span>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            {departmentInfo.cabinNumber}
          </p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-1">
          <span className="text-3xs font-black uppercase text-slate-400 tracking-wider">
            Intercom / Office Extension
          </span>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            {departmentInfo.officeExtensionPhone}
          </p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-1">
          <span className="text-3xs font-black uppercase text-slate-400 tracking-wider">
            Student Office Hours
          </span>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            {departmentInfo.officeHours}
          </p>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-emerald-600" /> Assigned Academic Courses & Batches
        </h4>
        <div className="flex flex-wrap gap-2">
          {departmentInfo.assignedCourses.map((course) => (
            <span
              key={course}
              className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold"
            >
              {course}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
