import React, { useState } from 'react';
import { PersonalInformation } from '../../types/profile.types';
import { personalInfoSchema } from '../../schemas/profile.schema';
import { User, Save, Edit2, X, Check, Shield } from 'lucide-react';

interface PersonalInfoSectionProps {
  personalInfo: PersonalInformation;
  onSave: (data: Partial<PersonalInformation>) => Promise<void>;
  isSaving: boolean;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  personalInfo,
  onSave,
  isSaving,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<PersonalInformation>({ ...personalInfo });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof PersonalInformation, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const handleLanguageToggle = (lang: string) => {
    const currentLangs = formData.languagesKnown || [];
    const updated = currentLangs.includes(lang)
      ? currentLangs.filter((l) => l !== lang)
      : [...currentLangs, lang];
    handleInputChange('languagesKnown', updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = personalInfoSchema.safeParse(formData);
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          formattedErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(formattedErrors);
      return;
    }

    await onSave(formData);
    setIsEditing(false);
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-emerald-600" />
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Personal Information
          </h3>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Edit Personal Details</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setFormData({ ...personalInfo });
                setIsEditing(false);
                setErrors({});
              }}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-4 py-1.5 bg-[#002147] hover:bg-[#003366] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-3xs font-black uppercase text-slate-400 tracking-wider">
              Full Legal Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-bold focus:ring-2 focus:ring-emerald-500"
              />
            ) : (
              <p className="text-xs font-extrabold text-slate-900 dark:text-white">
                {personalInfo.fullName}
              </p>
            )}
            {errors.fullName && <p className="text-3xs text-rose-500">{errors.fullName}</p>}
          </div>

          {/* Father's Name */}
          <div className="space-y-1">
            <label className="text-3xs font-black uppercase text-slate-400 tracking-wider">
              Father's Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.fatherName}
                onChange={(e) => handleInputChange('fatherName', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-bold focus:ring-2 focus:ring-emerald-500"
              />
            ) : (
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {personalInfo.fatherName}
              </p>
            )}
            {errors.fatherName && <p className="text-3xs text-rose-500">{errors.fatherName}</p>}
          </div>

          {/* Mother's Name */}
          <div className="space-y-1">
            <label className="text-3xs font-black uppercase text-slate-400 tracking-wider">
              Mother's Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.motherName}
                onChange={(e) => handleInputChange('motherName', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-bold focus:ring-2 focus:ring-emerald-500"
              />
            ) : (
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {personalInfo.motherName}
              </p>
            )}
            {errors.motherName && <p className="text-3xs text-rose-500">{errors.motherName}</p>}
          </div>

          {/* Date of Birth */}
          <div className="space-y-1">
            <label className="text-3xs font-black uppercase text-slate-400 tracking-wider">
              Date of Birth
            </label>
            {isEditing ? (
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => handleInputChange('dob', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-bold focus:ring-2 focus:ring-emerald-500"
              />
            ) : (
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {personalInfo.dob}
              </p>
            )}
            {errors.dob && <p className="text-3xs text-rose-500">{errors.dob}</p>}
          </div>

          {/* Gender */}
          <div className="space-y-1">
            <label className="text-3xs font-black uppercase text-slate-400 tracking-wider">
              Gender
            </label>
            {isEditing ? (
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-bold focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {personalInfo.gender}
              </p>
            )}
          </div>

          {/* Blood Group */}
          <div className="space-y-1">
            <label className="text-3xs font-black uppercase text-slate-400 tracking-wider">
              Blood Group
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.bloodGroup}
                onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-bold focus:ring-2 focus:ring-emerald-500"
              />
            ) : (
              <p className="text-xs font-bold text-rose-600 dark:text-rose-400">
                {personalInfo.bloodGroup}
              </p>
            )}
          </div>

          {/* Nationality */}
          <div className="space-y-1">
            <label className="text-3xs font-black uppercase text-slate-400 tracking-wider">
              Nationality
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.nationality}
                onChange={(e) => handleInputChange('nationality', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-bold focus:ring-2 focus:ring-emerald-500"
              />
            ) : (
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {personalInfo.nationality}
              </p>
            )}
          </div>

          {/* Marital Status */}
          <div className="space-y-1">
            <label className="text-3xs font-black uppercase text-slate-400 tracking-wider">
              Marital Status
            </label>
            {isEditing ? (
              <select
                value={formData.maritalStatus}
                onChange={(e) => handleInputChange('maritalStatus', e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-bold focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            ) : (
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {personalInfo.maritalStatus}
              </p>
            )}
          </div>

          {/* Languages Known */}
          <div className="space-y-1 sm:col-span-2">
            <label className="text-3xs font-black uppercase text-slate-400 tracking-wider">
              Languages Spoken & Written
            </label>
            {isEditing ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {['English', 'Bengali', 'Hindi', 'Sanskrit', 'Urdu'].map((lang) => {
                  const isChecked = (formData.languagesKnown || []).includes(lang);
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => handleLanguageToggle(lang)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1 ${
                        isChecked
                          ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 text-slate-500'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                      <span>{lang}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {personalInfo.languagesKnown.map((lang) => (
                  <span
                    key={lang}
                    className="px-2.5 py-0.5 rounded-full text-2xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
