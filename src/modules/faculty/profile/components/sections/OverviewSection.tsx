import React from 'react';
import { FullFacultyProfileData } from '../../types/profile.types';
import { GraduationCap, Award, FlaskConical, Stethoscope, Building2, ShieldCheck, Mail, Phone, Calendar, Clock, MapPin } from 'lucide-react';

interface OverviewSectionProps {
  profile: FullFacultyProfileData;
  onNavigateTab: (tab: any) => void;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({ profile, onNavigateTab }) => {
  return (
    <div className="space-y-6">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-3xs font-extrabold uppercase text-slate-400 tracking-wider">Degrees Held</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {profile.academicQualifications.length} Qualifications
          </div>
          <p className="text-3xs text-slate-500 font-medium">
            Highest: DHMS (West Bengal Council of Homoeopathic Medicine), MD (Organon of Medicine)
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-3xs font-extrabold uppercase text-slate-400 tracking-wider">Teaching Exp.</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            12+ Years
          </div>
          <p className="text-3xs text-slate-500 font-medium">
            Since August 2012
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-3xs font-extrabold uppercase text-slate-400 tracking-wider">Research Papers</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600">
              <FlaskConical className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {profile.researchExperience.length} Published
          </div>
          <p className="text-3xs text-slate-500 font-medium">
            CCRH Grant Funded
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-3xs font-extrabold uppercase text-slate-400 tracking-wider">Council Status</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
            {profile.registrationDetails.status}
          </div>
          <p className="text-3xs text-slate-500 font-medium">
            Valid Upto Sept 2028
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Bio & Key Academic Credentials */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio Card */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center justify-between">
              <span>Faculty Academic Profile Summary</span>
              <button
                onClick={() => onNavigateTab('personal')}
                className="text-2xs font-bold text-emerald-600 hover:underline cursor-pointer"
              >
                Edit Bio
              </button>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Dr. Swapna Roy is an Associate Professor in the Department of Organon of Medicine & Homoeopathic Philosophy at BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL. With over 12 years of clinical and undergraduate teaching experience, she specializes in miasmatic classification of chronic diseases, constitutional case taking, and autoimmune homoeopathic prescribing.
            </p>
          </div>

          {/* Academic Qualifications List */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                Academic Degrees & Honors
              </h3>
              <button
                onClick={() => onNavigateTab('academic')}
                className="text-2xs font-bold text-emerald-600 hover:underline cursor-pointer"
              >
                View All ({profile.academicQualifications.length})
              </button>
            </div>

            <div className="space-y-3">
              {profile.academicQualifications.map((q) => (
                <div
                  key={q.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs text-slate-900 dark:text-white">
                        {q.degree}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        {q.specialization}
                      </span>
                    </div>
                    <p className="text-2xs text-slate-500 font-medium">
                      {q.institution} • {q.university}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200 block">
                      {q.percentageOrGrade}
                    </span>
                    <span className="text-3xs text-slate-400 font-bold block">
                      Passed Year: {q.yearOfPassing}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: OPD Duty & Department Snapshot */}
        <div className="space-y-6">
          {/* Clinical OPD Duty Snapshot */}
          <div className="p-6 bg-gradient-to-br from-[#002147] to-[#003366] text-white rounded-3xl shadow-md space-y-4">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-emerald-400" />
              <h3 className="font-extrabold text-sm">Hospital Clinical OPD Duty</h3>
            </div>

            <div className="space-y-2 pt-1 border-t border-white/10 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">Designated OPD:</span>
                <span className="font-bold text-emerald-300">{profile.opdRoomNo}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">Shift Timings:</span>
                <span className="font-bold text-slate-100">{profile.opdScheduleSlot}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">Clinical Specialty:</span>
                <span className="font-bold text-slate-100">General & Chronic Organon OPD</span>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('professional')}
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-xs font-bold transition text-center cursor-pointer block"
            >
              Manage Hospital Posting
            </button>
          </div>

          {/* Department & Cabin Info */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              Department & Cabin
            </h3>

            <div className="space-y-2 text-xs">
              <p className="text-slate-600 dark:text-slate-300 font-semibold">
                {profile.departmentInfo.departmentName}
              </p>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl space-y-1">
                <div className="flex justify-between">
                  <span className="text-3xs text-slate-400 uppercase font-bold">Cabin Location:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{profile.departmentInfo.cabinNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-3xs text-slate-400 uppercase font-bold">Office Extension:</span>
                  <span className="font-bold text-emerald-600">{profile.departmentInfo.officeExtensionPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-3xs text-slate-400 uppercase font-bold">Office Hours:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{profile.departmentInfo.officeHours}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
