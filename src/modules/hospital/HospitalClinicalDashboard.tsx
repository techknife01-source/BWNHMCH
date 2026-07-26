import React, { useState } from 'react';
import { IpdDashboard } from './clinical/components/IpdDashboard';
import { BedWardManagement } from './clinical/components/BedWardManagement';
import { ElectronicMedicalRecord } from './clinical/components/ElectronicMedicalRecord';
import { ClinicalNotificationsPanel } from './clinical/components/ClinicalNotificationsPanel';
import { IpdAdmissionModal } from './clinical/components/IpdAdmissionModal';
import { BedTransferModal } from './clinical/components/BedTransferModal';
import { DischargeModal } from './clinical/components/DischargeModal';
import { hospitalClinicalService } from '../../services/hospitalClinicalService';
import {
  Bed,
  FileText,
  Bell,
  Activity,
  UserCheck,
  Stethoscope,
  Building2,
  Plus,
} from 'lucide-react';

export const HospitalClinicalDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'wards' | 'emr' | 'alerts'>('dashboard');

  // Selected EMR Patient
  const [selectedEmrIpdNo, setSelectedEmrIpdNo] = useState<string>('IPD-2026-0001');

  // Modals state
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [transferIpdNo, setTransferIpdNo] = useState<string | null>(null);

  const [isDischargeOpen, setIsDischargeOpen] = useState(false);
  const [dischargeIpdNo, setDischargeIpdNo] = useState<string | null>(null);

  const handleOpenEmrForPatient = (ipdNo: string) => {
    setSelectedEmrIpdNo(ipdNo);
    setActiveTab('emr');
  };

  const handleOpenTransfer = (ipdNo: string) => {
    setTransferIpdNo(ipdNo);
    setIsTransferOpen(true);
  };

  const handleOpenDischarge = (ipdNo: string) => {
    setDischargeIpdNo(ipdNo);
    setIsDischargeOpen(true);
  };

  const transferAdmission = transferIpdNo ? hospitalClinicalService.getAdmissionByIpdNo(transferIpdNo) || null : null;
  const dischargeAdmission = dischargeIpdNo ? hospitalClinicalService.getAdmissionByIpdNo(dischargeIpdNo) || null : null;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Main Navigation Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#002147] text-white">
              <Stethoscope className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-lg font-black text-slate-900 dark:text-white">
                Hospital Clinical & IPD Management Module
              </h1>
              <p className="text-xs text-slate-500">
                Inpatient Admissions, Ward & Bed Management, EMR Workstation, Clinical Notes, Prescriptions & Vitals
              </p>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800/60 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#002147] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Activity className="w-4 h-4 text-blue-400" />
            <span>IPD Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('wards')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'wards'
                ? 'bg-[#002147] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Bed className="w-4 h-4 text-emerald-400" />
            <span>Bed & Ward Grid</span>
          </button>

          <button
            onClick={() => setActiveTab('emr')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'emr'
                ? 'bg-[#002147] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>EMR Workstation</span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'alerts'
                ? 'bg-[#002147] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Bell className="w-4 h-4 text-rose-400" />
            <span>Clinical Alerts</span>
          </button>
        </div>
      </div>

      {/* Main Tab Views */}
      {activeTab === 'dashboard' && (
        <IpdDashboard
          onOpenAdmissionModal={() => setIsAdmissionOpen(true)}
          onSelectPatientEmr={handleOpenEmrForPatient}
          onOpenTransferModal={handleOpenTransfer}
          onOpenDischargeModal={handleOpenDischarge}
          onNavigateToWards={() => setActiveTab('wards')}
          onNavigateToEmr={() => setActiveTab('emr')}
          onNavigateToAlerts={() => setActiveTab('alerts')}
        />
      )}

      {activeTab === 'wards' && (
        <BedWardManagement
          onSelectPatientEmr={handleOpenEmrForPatient}
          onOpenTransferModal={handleOpenTransfer}
        />
      )}

      {activeTab === 'emr' && (
        <ElectronicMedicalRecord initialIpdNo={selectedEmrIpdNo} />
      )}

      {activeTab === 'alerts' && (
        <ClinicalNotificationsPanel onSelectPatientEmr={handleOpenEmrForPatient} />
      )}

      {/* Shared Modals */}
      <IpdAdmissionModal
        isOpen={isAdmissionOpen}
        onClose={() => setIsAdmissionOpen(false)}
        onSuccess={() => setActiveTab('dashboard')}
      />

      <BedTransferModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        onSuccess={() => setActiveTab('wards')}
        admission={transferAdmission}
      />

      <DischargeModal
        isOpen={isDischargeOpen}
        onClose={() => setIsDischargeOpen(false)}
        onSuccess={() => setActiveTab('dashboard')}
        admission={dischargeAdmission}
      />
    </div>
  );
};
