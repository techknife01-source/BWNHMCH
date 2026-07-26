import React, { useState } from 'react';
import { PrincipalProfile } from '../types';
import { Save, UserCheck, Shield, Edit3, Image, Mail, Phone, Award } from 'lucide-react';

interface PrincipalDeskCMSProps {
  profile: PrincipalProfile;
  onUpdate: (updated: PrincipalProfile) => void;
  isAdmin: boolean;
}

export const PrincipalDeskCMS: React.FC<PrincipalDeskCMSProps> = ({ profile, onUpdate, isAdmin }) => {
  const [formData, setFormData] = useState<PrincipalProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#002147] dark:text-blue-400" />
            <h3 className="text-sm font-black uppercase tracking-wider text-[#002147] dark:text-white">
              Principal Desk CMS Management
            </h3>
          </div>
          <p className="text-3xs text-slate-400 mt-0.5">
            Admin CMS control panel to update Principal credentials, message, and official contact details.
          </p>
        </div>
        {savedSuccess && (
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 rounded-full text-3xs font-bold uppercase tracking-wider animate-bounce">
            ✓ Updated Successfully
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 text-2xs">
        {/* Left Column: Image & Avatar Preview */}
        <div className="space-y-4 bg-slate-50 dark:bg-slate-950/60 p-5 rounded-2xl border border-slate-150 dark:border-slate-800 text-center">
          <div className="relative w-36 h-36 mx-auto rounded-2xl overflow-hidden shadow-md border-2 border-slate-200 dark:border-slate-700 group">
            <img
              src={formData.image}
              alt={formData.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-3xs font-bold uppercase text-slate-400 block">Principal Photo URL</label>
            <div className="relative">
              <Image className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                required
                disabled={!isAdmin}
                value={formData.image}
                onChange={e => setFormData({ ...formData, image: e.target.value })}
                className="w-full pl-8 pr-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-3xs bg-white dark:bg-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-3 bg-blue-50/50 dark:bg-slate-900/50 rounded-xl text-left space-y-1 text-4xs">
            <span className="font-bold text-[#002147] dark:text-blue-300 uppercase block">Active Desk Record</span>
            <p className="text-slate-500">
              Tenure Period: <strong className="text-slate-700 dark:text-slate-300">{formData.tenure}</strong>
            </p>
          </div>
        </div>

        {/* Right Columns: Inputs */}
        <div className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-500 uppercase text-3xs">Full Name</label>
              <input
                type="text"
                required
                disabled={!isAdmin}
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-2xs bg-white dark:bg-slate-900 font-bold text-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-500 uppercase text-3xs">Designation / Title</label>
              <input
                type="text"
                required
                disabled={!isAdmin}
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-2xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-500 uppercase text-3xs">Academic Qualifications</label>
              <div className="relative">
                <Award className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  required
                  disabled={!isAdmin}
                  value={formData.qualification}
                  onChange={e => setFormData({ ...formData, qualification: e.target.value })}
                  className="w-full pl-8 pr-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-2xs bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-500 uppercase text-3xs">Tenure Period</label>
              <input
                type="text"
                required
                disabled={!isAdmin}
                value={formData.tenure}
                onChange={e => setFormData({ ...formData, tenure: e.target.value })}
                className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-2xs bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-500 uppercase text-3xs">Official Email</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="email"
                  required
                  disabled={!isAdmin}
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-8 pr-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-2xs bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-500 uppercase text-3xs">Contact Hotline</label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  required
                  disabled={!isAdmin}
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-8 pr-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-2xs bg-white dark:bg-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase text-3xs">Principal's Official Desk Address Message</label>
            <textarea
              required
              disabled={!isAdmin}
              rows={4}
              value={formData.messageText}
              onChange={e => setFormData({ ...formData, messageText: e.target.value })}
              className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-xl text-2xs bg-white dark:bg-slate-900 leading-relaxed focus:outline-none focus:border-[#002147]"
            ></textarea>
          </div>

          {isAdmin && (
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#002147] hover:bg-[#001833] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-2 shadow-md"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Principal Desk Profile</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
