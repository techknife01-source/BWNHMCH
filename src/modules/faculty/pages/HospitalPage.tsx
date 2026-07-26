import React, { useState, useEffect } from 'react';
import { FacultyLayout } from '../layout/FacultyLayout';
import {
  Stethoscope,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  FileCheck,
  Building2,
  Sparkles,
  ClipboardList,
} from 'lucide-react';
import { facultyErpService } from '../services/facultyErp.service';
import { OpdDutySchedule } from '../types';

export const HospitalPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'OPD' | 'IPD' | 'INTERNS'>('OPD');
  const [opdSchedule, setOpdSchedule] = useState<OpdDutySchedule[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const schedule = await facultyErpService.getOpdSchedule();
      setOpdSchedule(schedule);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FacultyLayout pageTitle="Hospital & OPD Duty">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-emerald-600" />
              Clinical Postings & OPD Duty Schedule
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              OPD consultation shifts, IPD ward rounds, and BHMS intern doctor clinical supervision.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('OPD')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'OPD'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              OPD Roster
            </button>
            <button
              onClick={() => setActiveTab('IPD')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'IPD'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              IPD Ward Rounds
            </button>
            <button
              onClick={() => setActiveTab('INTERNS')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'INTERNS'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Intern Logbooks
            </button>
          </div>
        </div>

        {/* TAB 1: OPD */}
        {activeTab === 'OPD' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {opdSchedule.map((opd) => (
                <div
                  key={opd.id}
                  className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs space-y-4 hover:border-emerald-500/50 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-3xs font-extrabold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {opd.day}
                    </span>
                    <span className="text-3xs font-bold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {opd.shift}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {opd.opdRoom}
                    </h3>
                    <p className="text-xs font-bold text-emerald-600 mt-1">
                      Department: {opd.department}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-center">
                      <span className="text-3xs font-extrabold text-slate-400 uppercase block">
                        Avg Patient Flow
                      </span>
                      <span className="text-sm font-black text-slate-900 dark:text-white block mt-0.5">
                        ~{opd.avgPatientVolume} / Shift
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-center">
                      <span className="text-3xs font-extrabold text-slate-400 uppercase block">
                        Interns Supervised
                      </span>
                      <span className="text-sm font-black text-slate-900 dark:text-white block mt-0.5">
                        {opd.assignedInternsCount} Interns
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: IPD */}
        {activeTab === 'IPD' && (
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-emerald-600" />
              In-Patient Department (IPD) Ward Rounds
            </h3>
            <p className="text-xs text-slate-500">
              Assigned bed-head ticket reviews, daily remedy follow-up observations, and intern case discussion logs.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded-md text-3xs font-bold uppercase">
                  Male In-Patient Ward
                </span>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Ward 2 - Beds 01 to 12 (Organon & Chronic)
                </h4>
                <p className="text-3xs text-slate-500">
                  Daily Ward Round: 08:30 AM - 09:30 AM • Supervised Interns: Dr. Rahul V. & Dr. Tanvi S.
                </p>
              </div>

              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
                <span className="px-2 py-0.5 bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 rounded-md text-3xs font-bold uppercase">
                  Female In-Patient Ward
                </span>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Ward 4 - Beds 15 to 25 (Paediatrics & Gynaec)
                </h4>
                <p className="text-3xs text-slate-500">
                  Daily Ward Round: 01:00 PM - 01:30 PM • Supervised Interns: Dr. Swati P. & Dr. Amit K.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: INTERNS */}
        {activeTab === 'INTERNS' && (
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              BHMS Intern Doctor Logbook Approvals
            </h3>
            <p className="text-xs text-slate-500">
              Verify case taking, remedy selection, and prescription approvals recorded by intern doctors.
            </p>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-2">
              {[
                { name: 'Dr. Rahul Verma (Intern)', cases: 18, pending: 2, batch: 'Internship Batch 2025-26' },
                { name: 'Dr. Tanvi Sen (Intern)', cases: 22, pending: 0, batch: 'Internship Batch 2025-26' },
                { name: 'Dr. Amit Kumar (Intern)', cases: 15, pending: 3, batch: 'Internship Batch 2025-26' },
              ].map((intern, i) => (
                <div key={i} className="pt-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-extrabold text-slate-900 dark:text-white block">
                      {intern.name}
                    </span>
                    <span className="text-3xs text-slate-400">
                      {intern.batch} • {intern.cases} Cases Approved
                    </span>
                  </div>
                  <button
                    onClick={() => alert(`Reviewing logbook for ${intern.name}`)}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-3xs font-extrabold hover:bg-emerald-700 transition cursor-pointer"
                  >
                    Verify Logbook ({intern.pending} Pending)
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </FacultyLayout>
  );
};
