import React from 'react';
import { adminHrService } from '../../../services/adminHrService';
import { Network, Building2, Users, Crown, ShieldCheck } from 'lucide-react';

export const OrgStructureView: React.FC = () => {
  const departments = adminHrService.getDepartments();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex justify-between items-center">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-blue-600" />
            <span>Institutional Governance & Organizational Hierarchy</span>
          </h2>
          <p className="text-xs text-slate-500">
            Administrative leadership hierarchy, academic councils, hospital medical board & departmental divisions
          </p>
        </div>
      </div>

      {/* Organizational Chart Tree */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center space-y-8">
        {/* Tier 1: Principal & Governing Body */}
        <div className="flex flex-col items-center text-center space-y-2 relative">
          <div className="p-5 bg-[#002147] text-white rounded-2xl shadow-xl border-2 border-amber-400 w-80 space-y-1">
            <Crown className="w-6 h-6 text-amber-300 mx-auto" />
            <h3 className="font-black text-base">Dr. Samarjit Chaudhuri</h3>
            <p className="text-xs text-amber-300 font-bold">Principal & Medical Superintendent</p>
            <p className="text-[10px] text-blue-200">BHMS, MD (Hom), Ph.D (NCH)</p>
          </div>
          <div className="w-0.5 h-8 bg-slate-300 dark:bg-slate-700"></div>
        </div>

        {/* Tier 2: Vice Principal & Administrative Officer */}
        <div className="flex flex-wrap justify-center gap-8 relative">
          <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-md border border-slate-700 w-64 text-center space-y-1">
            <ShieldCheck className="w-5 h-5 text-blue-400 mx-auto" />
            <h4 className="font-bold text-sm">Prof. (Dr.) Anjan Kumar Das</h4>
            <p className="text-xs text-blue-300">Vice Principal & HOD Organon</p>
          </div>

          <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-md border border-slate-700 w-64 text-center space-y-1">
            <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto" />
            <h4 className="font-bold text-sm">Mr. Somnath Ganguly</h4>
            <p className="text-xs text-emerald-300">Administrative Officer & HR Lead</p>
          </div>
        </div>

        <div className="w-full max-w-3xl h-0.5 bg-slate-200 dark:bg-slate-700"></div>

        {/* Tier 3: Department Heads Grid */}
        <div className="w-full space-y-4">
          <h4 className="font-black text-sm text-slate-900 dark:text-white text-center">Department Heads & Academic Councils</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {departments.map((dept) => (
              <div key={dept.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-md">
                    {dept.code}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase text-slate-500">{dept.category}</span>
                </div>
                <h5 className="font-black text-slate-900 dark:text-white text-sm">{dept.name}</h5>
                <p className="text-slate-600 dark:text-slate-300 font-semibold">HOD: {dept.hodName}</p>
                <p className="text-[11px] text-slate-400">{dept.staffCount} Staff Members Assigned</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
