import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import {
  ShieldAlert,
  Users,
  Image as ImageIcon,
  Stethoscope,
  Clock,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import { HospitalStaffDirectory } from '../../modules/hospital/components/HospitalStaffDirectory';
import { GalleryManagementPanel } from '../../modules/cms/components/GalleryManagementPanel';
import { OpdManagementPanel } from '../../modules/hospital/components/OpdManagementPanel';
import { ActivityAuditLogsView } from '../../modules/admin/components/ActivityAuditLogsView';

type SuperAdminTab = 'staff' | 'gallery' | 'opd_doctors' | 'opd_schedules' | 'audit_logs';

export const SuperAdminPortalPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SuperAdminTab>('staff');

  return (
    <div className="space-y-6 pb-12">
      {/* Super Admin Command Center Banner */}
      <div className="bg-[#002147] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Root Super Administrator Terminal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Super Admin Command Center
          </h1>
          <p className="text-slate-300 text-xs max-w-2xl leading-relaxed">
            Exclusive administrative control suite for Medical Staff, Campus Photo Gallery, OPD Doctors, Weekly OPD Timetables, and Security Audit Logs.
          </p>
        </div>

        <div className="flex items-center gap-2 z-10 shrink-0">
          <span className="px-3.5 py-1.5 bg-emerald-500/20 text-emerald-300 text-2xs font-black uppercase tracking-widest rounded-full border border-emerald-500/30 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> ROOT PRIVILEGES ACTIVE
          </span>
        </div>
      </div>

      {/* Super Admin Module Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 custom-scrollbar">
        {[
          { id: 'staff', label: '1. Medical Staff Management', icon: Users },
          { id: 'gallery', label: '2. Gallery Management', icon: ImageIcon },
          { id: 'opd_doctors', label: '3. OPD Doctor Management', icon: Stethoscope },
          { id: 'opd_schedules', label: '4. OPD Schedule Management', icon: Clock },
          { id: 'audit_logs', label: '5. Security Audit Logs', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SuperAdminTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider transition whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#002147] text-white shadow-md dark:bg-[#00A651]'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'staff' && (
        <div className="space-y-4">
          <HospitalStaffDirectory />
        </div>
      )}

      {activeTab === 'gallery' && (
        <div className="space-y-4">
          <GalleryManagementPanel />
        </div>
      )}

      {activeTab === 'opd_doctors' && (
        <div className="space-y-4">
          <OpdManagementPanel />
        </div>
      )}

      {activeTab === 'opd_schedules' && (
        <div className="space-y-4">
          <OpdManagementPanel />
        </div>
      )}

      {activeTab === 'audit_logs' && (
        <div className="space-y-4">
          <ActivityAuditLogsView />
        </div>
      )}
    </div>
  );
};
