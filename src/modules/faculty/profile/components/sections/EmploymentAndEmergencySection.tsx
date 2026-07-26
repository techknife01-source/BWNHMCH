import React, { useState } from 'react';
import { EmploymentDetails, EmergencyContact } from '../../types/profile.types';
import { emergencyContactSchema } from '../../schemas/profile.schema';
import { FileCheck, Phone, Edit2, Save, AlertCircle, ShieldCheck } from 'lucide-react';

interface EmploymentAndEmergencySectionProps {
  employmentDetails: EmploymentDetails;
  emergencyContact: EmergencyContact;
  onSaveEmergency: (data: Partial<EmergencyContact>) => Promise<void>;
  isSaving: boolean;
}

export const EmploymentAndEmergencySection: React.FC<EmploymentAndEmergencySectionProps> = ({
  employmentDetails,
  emergencyContact,
  onSaveEmergency,
  isSaving,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<EmergencyContact>({ ...emergencyContact });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof EmergencyContact, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = emergencyContactSchema.safeParse(formData);
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

    await onSaveEmergency(formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Official Employment Details */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <FileCheck className="w-5 h-5 text-emerald-600" />
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Institutional Employment & Payroll Record
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-1">
            <span className="text-3xs font-black uppercase text-slate-400 tracking-wider">
              Faculty Employee ID
            </span>
            <p className="text-xs font-black text-slate-900 dark:text-white">
              {employmentDetails.employeeId}
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-1">
            <span className="text-3xs font-black uppercase text-slate-400 tracking-wider">
              Employment Type
            </span>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {employmentDetails.employmentType}
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-1">
            <span className="text-3xs font-black uppercase text-slate-400 tracking-wider">
              Pay Matrix Grade / Scale
            </span>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {employmentDetails.payScaleGrade}
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-1">
            <span className="text-3xs font-black uppercase text-slate-400 tracking-wider">
              Provident Fund (UAN No.)
            </span>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {employmentDetails.providentFundUan || 'N/A'}
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-1">
            <span className="text-3xs font-black uppercase text-slate-400 tracking-wider">
              Date of Joining College
            </span>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {employmentDetails.dateOfJoiningInstitution}
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-1">
            <span className="text-3xs font-black uppercase text-slate-400 tracking-wider">
              Probation Period Status
            </span>
            <p className="text-xs font-bold text-emerald-600">
              {employmentDetails.probationStatus}
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-rose-600" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Emergency Contact Details
            </h3>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Edit Emergency Contact</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...emergencyContact });
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
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5 text-white" />
                <span>{isSaving ? 'Saving...' : 'Save Emergency Contact'}</span>
              </button>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1">
            <label className="text-3xs font-black uppercase text-slate-400 tracking-wider">
              Contact Person Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-bold"
              />
            ) : (
              <p className="text-xs font-extrabold text-slate-900 dark:text-white">
                {emergencyContact.name}
              </p>
            )}
            {errors.name && <p className="text-3xs text-rose-500">{errors.name}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-3xs font-black uppercase text-slate-400 tracking-wider">
              Relationship
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.relationship}
                onChange={(e) => handleInputChange('relationship', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-bold"
              />
            ) : (
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {emergencyContact.relationship}
              </p>
            )}
            {errors.relationship && <p className="text-3xs text-rose-500">{errors.relationship}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-3xs font-black uppercase text-slate-400 tracking-wider">
              Primary Emergency Phone
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.primaryPhone}
                onChange={(e) => handleInputChange('primaryPhone', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-bold"
              />
            ) : (
              <p className="text-xs font-bold text-rose-600 dark:text-rose-400">
                {emergencyContact.primaryPhone}
              </p>
            )}
            {errors.primaryPhone && <p className="text-3xs text-rose-500">{errors.primaryPhone}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-3xs font-black uppercase text-slate-400 tracking-wider">
              Secondary Contact Phone
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.secondaryPhone || ''}
                onChange={(e) => handleInputChange('secondaryPhone', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-bold"
              />
            ) : (
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {emergencyContact.secondaryPhone || 'N/A'}
              </p>
            )}
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-3xs font-black uppercase text-slate-400 tracking-wider">
              Full Residential Address
            </label>
            {isEditing ? (
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-bold"
              />
            ) : (
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {emergencyContact.address}
              </p>
            )}
            {errors.address && <p className="text-3xs text-rose-500">{errors.address}</p>}
          </div>
        </form>
      </div>
    </div>
  );
};
