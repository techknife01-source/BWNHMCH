import React, { useState } from 'react';
import { adminHrService } from '../../../services/adminHrService';
import { JoiningProcess } from '../../../types/adminHr';
import { UserCheck, CheckSquare, Square, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export const JoiningProcessView: React.FC = () => {
  const [joiningList, setJoiningList] = useState<JoiningProcess[]>(adminHrService.getJoiningProcesses());

  const toggleChecklistItem = (id: string, key: keyof JoiningProcess['checklist']) => {
    const proc = joiningList.find((p) => p.id === id);
    if (!proc) return;

    const updatedChecklist = { ...proc.checklist, [key]: !proc.checklist[key] };
    adminHrService.updateJoiningChecklist(id, updatedChecklist);
    setJoiningList(adminHrService.getJoiningProcesses());
    toast.success('Onboarding checklist updated');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex justify-between items-center">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-600" />
            <span>Staff Onboarding & Joining Checklist ({joiningList.length})</span>
          </h2>
          <p className="text-xs text-slate-500">
            Document verification, biometric enrolment, institutional email account setup, ID card issue & orientation
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {joiningList.map((proc) => (
          <div key={proc.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600">{proc.empIdAssigned}</span>
                <h3 className="font-black text-base text-slate-900 dark:text-white">{proc.candidateName}</h3>
                <p className="text-xs text-slate-500">{proc.designationName} • <strong className="text-slate-700 dark:text-slate-300">{proc.departmentName}</strong></p>
              </div>

              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-xs font-black ${
                  proc.status === 'COMPLETED'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {proc.status}
                </span>
                <p className="text-[11px] text-slate-400 mt-1">Expected Joining: {proc.expectedJoiningDate}</p>
              </div>
            </div>

            {/* Checklist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              {[
                { key: 'documentsVerified', label: '1. Documents & Degrees Verified' },
                { key: 'biometricEnrolled', label: '2. Biometric Attendance Enrolled' },
                { key: 'idCardIssued', label: '3. Physical ID Card Issued' },
                { key: 'emailAccountCreated', label: '4. Institutional Email Created' },
                { key: 'bankDetailsSubmitted', label: '5. Bank Payroll Details Submitted' },
                { key: 'orientationCompleted', label: '6. Department Orientation Completed' },
              ].map((item) => {
                const isDone = proc.checklist[item.key as keyof JoiningProcess['checklist']];
                return (
                  <button
                    key={item.key}
                    onClick={() => toggleChecklistItem(proc.id, item.key as keyof JoiningProcess['checklist'])}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer transition ${
                      isDone
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-900 dark:text-emerald-200'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="font-bold">{item.label}</span>
                    {isDone ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
