import React from 'react';
import { FullFacultyProfileData } from '../types/profile.types';
import { Camera, Building2, Download, ShieldCheck, Stethoscope, Mail, Phone, MapPin, Award } from 'lucide-react';

interface ProfileHeaderProps {
  profile: FullFacultyProfileData;
  onOpenPhotoModal: () => void;
  onOpenEditModal?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  onOpenPhotoModal,
}) => {
  const handleDownloadSummary = () => {
    const summaryText = `
FACULTY ACADEMIC & CLINICAL PROFILE
====================================
Name: ${profile.personalInfo.fullName}
Employee ID: ${profile.employeeId}
Designation: ${profile.departmentInfo.designation}
Department: ${profile.departmentInfo.departmentName}
Medical Council Reg No: ${profile.registrationDetails.registrationNumber}
Council Name: ${profile.registrationDetails.councilName}
Official Email: ${profile.contactInfo.officialEmail}
Phone: ${profile.contactInfo.mobileNumber}
OPD Duty: ${profile.opdScheduleSlot} (${profile.opdRoomNo})

ACADEMIC QUALIFICATIONS:
${profile.academicQualifications
  .map((q) => `- ${q.degree} in ${q.specialization} (${q.university}, ${q.yearOfPassing})`)
  .join('\n')}

RESEARCH PROJECTS:
${profile.researchExperience
  .map((r) => `- ${r.title} [${r.role}] (${r.year})`)
  .join('\n')}
    `;

    const blob = new Blob([summaryText.trim()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${profile.personalInfo.fullName.replace(/\s+/g, '_')}_Profile.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-gradient-to-r from-[#002147] via-[#003366] to-[#00A651] rounded-3xl text-white shadow-xl relative overflow-hidden space-y-6">
      {/* Decorative skewed backdrop */}
      <div className="absolute -right-10 top-0 bottom-0 w-1/2 bg-white/5 skew-x-12 pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 z-10 relative">
        {/* Left: Avatar & Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar with Camera Trigger */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white/30 overflow-hidden shadow-2xl bg-white/10 flex items-center justify-center">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.personalInfo.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-black text-3xl text-white">
                  {profile.personalInfo.fullName.charAt(0)}
                </span>
              )}
            </div>

            <button
              onClick={onOpenPhotoModal}
              className="absolute bottom-0 right-0 p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg border-2 border-white transition transform group-hover:scale-110 cursor-pointer"
              title="Upload / Change Photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Details */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-3xs font-black uppercase tracking-wider bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                {profile.employeeId}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-3xs font-black uppercase tracking-wider bg-white/10 text-slate-200 border border-white/20 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> NCH Verified Faculty
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              {profile.personalInfo.fullName}
            </h1>

            <p className="text-xs sm:text-sm font-semibold text-emerald-200 flex items-center gap-1.5 flex-wrap">
              <span>{profile.departmentInfo.designation}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-200">
                <Building2 className="w-3.5 h-3.5" />
                {profile.departmentInfo.departmentName}
              </span>
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-emerald-300" />
                {profile.contactInfo.officialEmail}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-300" />
                {profile.contactInfo.mobileNumber}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                {profile.contactInfo.presentAddress.city}, WB
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Cards */}
        <div className="flex flex-wrap items-center lg:flex-col lg:items-end gap-3 w-full lg:w-auto shrink-0">
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-left lg:text-right w-full sm:w-auto">
            <span className="text-3xs font-black uppercase text-slate-300 block flex items-center lg:justify-end gap-1">
              <Stethoscope className="w-3 h-3 text-emerald-300" /> OPD Duty Schedule
            </span>
            <span className="text-xs font-black text-emerald-300 block mt-0.5">
              {profile.opdScheduleSlot}
            </span>
            <span className="text-3xs text-slate-300 font-semibold block">
              {profile.opdRoomNo}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadSummary}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-300" />
              <span>Export Bio</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
