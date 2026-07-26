import React from 'react';
import { RegistrationDetails, ProfessionalMembership } from '../../types/profile.types';
import { ShieldCheck, Calendar, FileText, Award, CheckCircle } from 'lucide-react';

interface RegistrationSectionProps {
  registrationDetails: RegistrationDetails;
  memberships: ProfessionalMembership[];
}

export const RegistrationAndMembershipsSection: React.FC<RegistrationSectionProps> = ({
  registrationDetails,
  memberships,
}) => {
  return (
    <div className="space-y-6">
      {/* State Medical Council Registration */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Medical Council Registration Details
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Verified Active Practitioner
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-1">
            <span className="text-3xs font-black uppercase text-slate-400 tracking-wider">
              Registration Number
            </span>
            <p className="text-xs font-black text-slate-900 dark:text-white">
              {registrationDetails.registrationNumber}
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-1">
            <span className="text-3xs font-black uppercase text-slate-400 tracking-wider">
              State Medical Council
            </span>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {registrationDetails.councilName}
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-1">
            <span className="text-3xs font-black uppercase text-slate-400 tracking-wider">
              State Jurisdiction
            </span>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {registrationDetails.state}
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-1">
            <span className="text-3xs font-black uppercase text-slate-400 tracking-wider">
              Registration Date
            </span>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {registrationDetails.registrationDate}
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-1">
            <span className="text-3xs font-black uppercase text-slate-400 tracking-wider">
              Next Council Renewal Due
            </span>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {registrationDetails.renewalDate}
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-1">
            <span className="text-3xs font-black uppercase text-slate-400 tracking-wider">
              Practice Status
            </span>
            <p className="text-xs font-bold text-emerald-600">
              {registrationDetails.status}
            </p>
          </div>
        </div>
      </div>

      {/* Professional Memberships */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <Award className="w-5 h-5 text-blue-600" />
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Professional Body Memberships
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {memberships.map((mb) => (
            <div
              key={mb.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {mb.membershipType}
                </span>
              </div>
              <h4 className="font-black text-xs text-slate-900 dark:text-white">
                {mb.organizationName}
              </h4>
              <p className="text-2xs text-slate-500 font-semibold">
                ID: {mb.membershipId}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
