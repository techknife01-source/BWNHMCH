import React, { useState } from 'react';
import { HospitalOverview } from '../hospital/components/HospitalOverview';
import { PatientManagement } from '../hospital/components/PatientManagement';
import { OpdTokenQueue } from '../hospital/components/OpdTokenQueue';
import { DoctorScheduleAvailability } from '../hospital/components/DoctorScheduleAvailability';
import { AppointmentCalendarDesk } from '../hospital/components/AppointmentCalendarDesk';
import { ReceptionNotifsSettings } from '../hospital/components/ReceptionNotifsSettings';
import { Patient } from '../../types/hospital';
import {
  UserCheck,
  LayoutDashboard,
  Users,
  Ticket,
  Stethoscope,
  Calendar,
  Bell,
} from 'lucide-react';

export const ReceptionCoreTerminal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'patients' | 'queue' | 'doctors' | 'appointments' | 'notifications'
  >('overview');

  const [tokenPatient, setTokenPatient] = useState<Patient | null>(null);

  const handleIssueTokenForPatient = (patient: Patient) => {
    setTokenPatient(patient);
    setActiveTab('queue');
  };

  return (
    <div className="space-y-6">
      {/* Front Desk Reception Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-7 h-7 text-[#00A651]" />
            <span>Front Desk Reception Terminal</span>
          </h1>
          <p className="text-xs text-slate-500">
            Visitor queries, OPD Registration, Instant Token Tickets, Queue Call Overrides & Doctor Schedules
          </p>
        </div>

        {/* Sub Navigation Bar */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#002147] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Reception Desk</span>
          </button>

          <button
            onClick={() => setActiveTab('patients')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'patients'
                ? 'bg-[#002147] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Patient Search</span>
          </button>

          <button
            onClick={() => setActiveTab('queue')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'queue'
                ? 'bg-[#002147] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>OPD Ticket Queue</span>
          </button>

          <button
            onClick={() => setActiveTab('doctors')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'doctors'
                ? 'bg-[#002147] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Doctors Availability</span>
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'appointments'
                ? 'bg-[#002147] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Appointments</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'notifications'
                ? 'bg-[#002147] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Content Panes */}
      {activeTab === 'overview' && (
        <HospitalOverview
          onNavigate={(tab) => setActiveTab(tab as any)}
          onOpenRegisterModal={() => setActiveTab('patients')}
          onOpenTokenModal={() => setActiveTab('queue')}
          onOpenAppointmentModal={() => setActiveTab('appointments')}
        />
      )}

      {activeTab === 'patients' && (
        <PatientManagement onIssueTokenForPatient={handleIssueTokenForPatient} />
      )}

      {activeTab === 'queue' && (
        <OpdTokenQueue
          initialPatient={tokenPatient}
          onClearInitialPatient={() => setTokenPatient(null)}
        />
      )}

      {activeTab === 'doctors' && <DoctorScheduleAvailability />}

      {activeTab === 'appointments' && <AppointmentCalendarDesk />}

      {activeTab === 'notifications' && <ReceptionNotifsSettings />}
    </div>
  );
};
