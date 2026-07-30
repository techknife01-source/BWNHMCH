import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Card } from '../../components/common/Card';
import { Search, ChevronRight, Building2, Users, BookOpen, ShieldCheck, Edit, Sparkles } from 'lucide-react';
import { departmentCmsService } from '../../services/departmentCmsService';
import { DepartmentCMSData } from '../../types/departmentCms';
import { DepartmentCMSView } from '../../modules/department/components/DepartmentCMSView';

export const DepartmentsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialDeptId = searchParams.get('id') || searchParams.get('dept') || null;

  const [departments, setDepartments] = useState<DepartmentCMSData[]>([]);
  const [search, setSearch] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(initialDeptId);

  useEffect(() => {
    // Load live CMS departments
    const list = departmentCmsService.getDepartments();
    setDepartments(list);
  }, [selectedDeptId]);

  // Sync URL search params
  const handleSelectDepartment = (id: string | null) => {
    setSelectedDeptId(id);
    if (id) {
      setSearchParams({ dept: id });
    } else {
      setSearchParams({});
    }
  };

  const filteredDepts = departments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    (d.hod && d.hod.toLowerCase().includes(search.toLowerCase())) ||
    d.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      <Breadcrumb
        items={
          selectedDeptId
            ? [
                { label: 'Academic Departments', href: '/departments' },
                { label: departments.find((d) => d.id === selectedDeptId)?.name || 'Department View' }
              ]
            : [{ label: 'Academic Departments' }]
        }
      />

      {/* If a department is selected, render full CMS view */}
      {selectedDeptId ? (
        <DepartmentCMSView
          departmentId={selectedDeptId}
          onBackToList={() => handleSelectDepartment(null)}
        />
      ) : (
        <>
          {/* Banner Header */}
          <div className="rounded-3xl bg-[#002147] text-white p-8 sm:p-12 shadow-xl space-y-4 relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 opacity-10 pointer-events-none">
              <Building2 className="w-96 h-96 text-white" />
            </div>

            <div className="relative z-10 space-y-3 max-w-3xl">
              <span className="px-3.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-black rounded-full uppercase tracking-wider border border-emerald-500/30">
                CMS-Enabled Academic Faculties
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                Academic & Clinical Departments
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Our departments combine fundamental medical sciences with classical Homoeopathic research. Each department page is CMS-ready supporting full curriculum data, methodology, faculty rosters, galleries, research, and downloads.
              </p>

              {/* Search Bar */}
              <div className="pt-2 max-w-md relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search department, HOD name, or code..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white/10 text-white placeholder-slate-400 border border-white/20 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            </div>
          </div>

          {/* Department Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDepts.map((dept) => (
              <Card
                key={dept.id}
                className="p-6 space-y-4 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                      {dept.code}
                    </span>
                    <span className="text-2xs text-slate-400 font-bold flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-400" />
                      {(dept.facultyList || []).length} Faculty
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white line-clamp-2 group-hover:text-emerald-600 transition">
                    {dept.name}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {dept.description}
                  </p>

                  {dept.hod && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                      <span className="font-bold text-slate-700 dark:text-slate-300">HOD:</span> {dept.hod}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleSelectDepartment(dept.id)}
                  className="mt-4 w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-[#002147] hover:text-white dark:hover:bg-[#00A651] text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Explore Department Page</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
