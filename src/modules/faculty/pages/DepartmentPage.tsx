import React, { useState } from 'react';
import { FacultyLayout } from '../layout/FacultyLayout';
import { Building2, Edit, Check } from 'lucide-react';
import { departmentCmsService } from '../../../services/departmentCmsService';
import { DepartmentCMSView } from '../../department/components/DepartmentCMSView';

export const DepartmentPage: React.FC = () => {
  const departments = departmentCmsService.getDepartments();
  const [selectedDeptId, setSelectedDeptId] = useState<string>(departments[0]?.id || 'org');

  return (
    <FacultyLayout pageTitle="Department CMS Management">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              Faculty Department CMS Management
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Faculty and HOD CMS editing terminal. Update curriculum details, practical schedules, teaching aids, faculty roster, galleries, research, and downloads.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-2xs font-bold text-slate-500 uppercase tracking-wider">Select Department:</span>
            <select
              value={selectedDeptId}
              onChange={(e) => setSelectedDeptId(e.target.value)}
              className="px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.code} - {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* CMS View & Editor */}
        <DepartmentCMSView departmentId={selectedDeptId} />
      </div>
    </FacultyLayout>
  );
};
