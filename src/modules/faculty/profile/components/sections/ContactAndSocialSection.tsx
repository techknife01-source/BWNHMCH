import React, { useState } from 'react';
import { ContactInformation } from '../../types/profile.types';
import { contactInfoSchema } from '../../schemas/profile.schema';
import { PhoneCall, Mail, MapPin, Globe, Edit2, Save, ExternalLink } from 'lucide-react';

interface ContactSectionProps {
  contactInfo: ContactInformation;
  onSave: (data: Partial<ContactInformation>) => Promise<void>;
  isSaving: boolean;
}

export const ContactAndSocialSection: React.FC<ContactSectionProps> = ({
  contactInfo,
  onSave,
  isSaving,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ContactInformation>({ ...contactInfo });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (field: keyof ContactInformation, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (
    type: 'presentAddress' | 'permanentAddress',
    field: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactInfoSchema.safeParse(formData);
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        formattedErrors[issue.path.join('.')] = issue.message;
      });
      setErrors(formattedErrors);
      return;
    }

    await onSave(formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Contact Channels */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Official & Personal Contact Details
            </h3>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Edit Contact Info</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...contactInfo });
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
                <span>{isSaving ? 'Saving...' : 'Save Contact'}</span>
              </button>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-3xs font-black uppercase text-slate-400 tracking-wider">
                Official Institutional Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.officialEmail}
                  onChange={(e) => handleFieldChange('officialEmail', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-bold"
                />
              ) : (
                <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> {contactInfo.officialEmail}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-3xs font-black uppercase text-slate-400 tracking-wider">
                Personal Email ID
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.personalEmail}
                  onChange={(e) => handleFieldChange('personalEmail', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-bold"
                />
              ) : (
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> {contactInfo.personalEmail}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-3xs font-black uppercase text-slate-400 tracking-wider">
                Primary Mobile Phone
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.mobileNumber}
                  onChange={(e) => handleFieldChange('mobileNumber', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-bold"
                />
              ) : (
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600" /> {contactInfo.mobileNumber}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-3xs font-black uppercase text-slate-400 tracking-wider">
                Alternate Contact Number
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.alternateMobileNumber || ''}
                  onChange={(e) => handleFieldChange('alternateMobileNumber', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-bold"
                />
              ) : (
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {contactInfo.alternateMobileNumber || 'N/A'}
                </p>
              )}
            </div>
          </div>

          {/* Addresses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            {/* Present Address */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-2">
              <h4 className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Present Address
              </h4>

              {isEditing ? (
                <div className="space-y-2 text-xs">
                  <input
                    type="text"
                    placeholder="Street / Flat"
                    value={formData.presentAddress.street}
                    onChange={(e) => handleAddressChange('presentAddress', 'street', e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="City"
                      value={formData.presentAddress.city}
                      onChange={(e) => handleAddressChange('presentAddress', 'city', e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                    <input
                      type="text"
                      placeholder="Pincode"
                      value={formData.presentAddress.pincode}
                      onChange={(e) => handleAddressChange('presentAddress', 'pincode', e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {contactInfo.presentAddress.street}, {contactInfo.presentAddress.city},{' '}
                  {contactInfo.presentAddress.state} - {contactInfo.presentAddress.pincode},{' '}
                  {contactInfo.presentAddress.country}
                </p>
              )}
            </div>

            {/* Permanent Address */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-2">
              <h4 className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" /> Permanent Address
              </h4>

              <p className="text-xs text-slate-600 dark:text-slate-300">
                {contactInfo.permanentAddress.street}, {contactInfo.permanentAddress.city},{' '}
                {contactInfo.permanentAddress.state} - {contactInfo.permanentAddress.pincode},{' '}
                {contactInfo.permanentAddress.country}
              </p>
            </div>
          </div>
        </form>
      </div>

      {/* Social & Research Web Handles */}
      {contactInfo.socialLinks && (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Globe className="w-5 h-5 text-purple-600" /> Research & Academic Social Links
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {contactInfo.socialLinks.googleScholar && (
              <a
                href={contactInfo.socialLinks.googleScholar}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 transition flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                <span>Google Scholar</span>
                <ExternalLink className="w-3.5 h-3.5 text-purple-600" />
              </a>
            )}

            {contactInfo.socialLinks.researchGate && (
              <a
                href={contactInfo.socialLinks.researchGate}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 transition flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                <span>ResearchGate</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
              </a>
            )}

            {contactInfo.socialLinks.orcid && (
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span>ORCID ID: {contactInfo.socialLinks.orcid}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
