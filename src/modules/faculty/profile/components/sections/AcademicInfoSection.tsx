import React, { useState } from 'react';
import { AcademicQualification } from '../../types/profile.types';
import { GraduationCap, ShieldCheck, Plus, FileText, CheckCircle2 } from 'lucide-react';

interface AcademicInfoSectionProps {
  qualifications: AcademicQualification[];
}

export const AcademicInfoSection: React.FC<AcademicInfoSectionProps> = ({ qualifications }) => {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-emerald-600" />
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Academic Credentials & Degrees
          </h3>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-1.5 bg-[#002147] hover:bg-[#003366] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Add Qualification</span>
        </button>
      </div>

      <div className="space-y-4">
        {qualifications.map((q) => (
          <div
            key={q.id}
            className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-3 relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-black text-sm shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{q.degree}</span>
                    {q.isVerified && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
                      </span>
                    )}
                  </h4>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Specialization: {q.specialization}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-sm font-black text-slate-900 dark:text-white block">
                  {q.percentageOrGrade}
                </span>
                <span className="text-3xs text-slate-400 font-extrabold uppercase">
                  Passed Year: {q.yearOfPassing}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
              <div>
                <span className="text-3xs font-black uppercase text-slate-400 block">Institution:</span>
                <span className="font-semibold">{q.institution}</span>
              </div>
              <div>
                <span className="text-3xs font-black uppercase text-slate-400 block">Affiliated University:</span>
                <span className="font-semibold">{q.university}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 font-bold">
          <span>Upload new qualification certificate to college academic registrar for verification.</span>
          <button
            onClick={() => setShowAddModal(false)}
            className="px-3 py-1 bg-emerald-600 text-white rounded-xl text-3xs font-black cursor-pointer"
          >
            Close Notice
          </button>
        </div>
      )}
    </div>
  );
};
