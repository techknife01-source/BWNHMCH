import React from 'react';
import { adminHrService } from '../../../services/adminHrService';
import {
  PieChart,
  Users,
  Award,
  TrendingUp,
  UserCheck,
  Building2,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const HrDashboardView: React.FC = () => {
  const stats = adminHrService.getAdminStats();
  const departments = adminHrService.getDepartments();
  const employees = adminHrService.getEmployees();

  // Gender breakdown percentages
  const malePercentage = Math.round((stats.maleCount / (stats.totalEmployees || 1)) * 100);
  const femalePercentage = 100 - malePercentage;

  // Category breakdown percentages
  const teachingPerc = Math.round((stats.teachingStaff / (stats.totalEmployees || 1)) * 100);
  const hospitalPerc = Math.round((stats.hospitalStaff / (stats.totalEmployees || 1)) * 100);
  const nonTeachingPerc = 100 - teachingPerc - hospitalPerc;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <PieChart className="w-5 h-5 text-indigo-600" />
            <span>Human Resource Analytics & Workforce Metrics</span>
          </h2>
          <p className="text-xs text-slate-500">
            Workforce distribution, gender diversity, retention ratios, and departmental staffing benchmarks
          </p>
        </div>

        <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-bold text-xs rounded-xl border border-indigo-200 dark:border-indigo-800">
          Academic Year 2026-2027
        </span>
      </div>

      {/* HR Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase">Faculty Retention</span>
            <span className="p-2 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">96.4%</h3>
          <p className="text-[11px] text-slate-500 mt-1">Institutional annual retention index</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase">Gender Ratio</span>
            <span className="p-2 bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 rounded-lg">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">{malePercentage}% M : {femalePercentage}% F</h3>
          <p className="text-[11px] text-slate-500 mt-1">Balanced workforce ratio</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase">Avg Experience</span>
            <span className="p-2 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded-lg">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">12.8 Yrs</h3>
          <p className="text-[11px] text-slate-500 mt-1">Senior medical & teaching tenure</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase">Attendance Rate</span>
            <span className="p-2 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded-lg">
              <UserCheck className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">94.2%</h3>
          <p className="text-[11px] text-slate-500 mt-1">Monthly average punctuality</p>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workforce Category Breakdown */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span>Staff Composition & Personnel Category Ratio</span>
          </h3>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-blue-700 dark:text-blue-400">Teaching Faculty ({stats.teachingStaff})</span>
                <span>{teachingPerc}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${teachingPerc}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-emerald-700 dark:text-emerald-400">Hospital Medical & Nursing Staff ({stats.hospitalStaff})</span>
                <span>{hospitalPerc}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: `${hospitalPerc}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-purple-700 dark:text-purple-400">Administrative & Non-Teaching ({stats.nonTeachingStaff})</span>
                <span>{nonTeachingPerc}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full transition-all duration-500" style={{ width: `${nonTeachingPerc}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Department Staffing Benchmarks */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>Departmental Staff Strength Benchmarks</span>
          </h3>

          <div className="space-y-3 max-h-56 overflow-y-auto pr-1 text-xs">
            {departments.map((dept) => (
              <div key={dept.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{dept.name}</p>
                  <p className="text-[11px] text-slate-500">HOD: {dept.hodName}</p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded-lg font-bold text-xs">
                    {dept.staffCount} Staff Members
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
