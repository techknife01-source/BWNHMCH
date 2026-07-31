import React, { useState } from 'react';
import { HospitalCoreDashboard } from '../../modules/hospital/HospitalCoreDashboard';
import { HospitalClinicalDashboard } from '../../modules/hospital/HospitalClinicalDashboard';
import { PharmacyErpView } from '../../modules/hospital/components/PharmacyErpView';
import { LaboratoryErpView } from '../../modules/hospital/components/LaboratoryErpView';
import { Stethoscope, Building2, Pill, FlaskConical } from 'lucide-react';

export const HospitalPortalPage: React.FC = () => {
  const [activePortalTab, setActivePortalTab] = useState<'clinical' | 'core' | 'pharmacy' | 'lab'>('clinical');

  return (
    <div className="space-y-2">
      {/* Top Portal Terminal Mode Bar */}
      <div className="bg-[#001833] text-white px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-blue-900 shadow-xs text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-mono font-bold text-blue-300">BHMC HOSPITAL TERMINAL</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-300">BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL Hospital Portal</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar w-full sm:w-auto pb-1">
          <button
            onClick={() => setActivePortalTab('clinical')}
            className={`px-3 py-1.5 rounded-lg font-extrabold transition cursor-pointer flex items-center gap-1.5 ${
              activePortalTab === 'clinical'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-blue-300" />
            <span>IPD Clinical & EMR</span>
          </button>

          <button
            onClick={() => setActivePortalTab('core')}
            className={`px-3 py-1.5 rounded-lg font-extrabold transition cursor-pointer flex items-center gap-1.5 ${
              activePortalTab === 'core'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-300" />
            <span>OPD Reception</span>
          </button>

          <button
            onClick={() => setActivePortalTab('pharmacy')}
            className={`px-3 py-1.5 rounded-lg font-extrabold transition cursor-pointer flex items-center gap-1.5 ${
              activePortalTab === 'pharmacy'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Pill className="w-3.5 h-3.5 text-amber-300" />
            <span>Pharmacy ERP</span>
          </button>

          <button
            onClick={() => setActivePortalTab('lab')}
            className={`px-3 py-1.5 rounded-lg font-extrabold transition cursor-pointer flex items-center gap-1.5 ${
              activePortalTab === 'lab'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5 text-purple-300" />
            <span>Laboratory ERP</span>
          </button>
        </div>
      </div>

      {activePortalTab === 'clinical' && <HospitalClinicalDashboard />}
      {activePortalTab === 'core' && <HospitalCoreDashboard />}
      {activePortalTab === 'pharmacy' && <PharmacyErpView />}
      {activePortalTab === 'lab' && <LaboratoryErpView />}
    </div>
  );
};

