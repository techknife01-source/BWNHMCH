import React, { useState } from 'react';
import { CMSData } from '../types';
import { Globe, Save, Building, Phone, Mail, FileText, CheckCircle2 } from 'lucide-react';

interface CMSWebsiteEditorProps {
  cmsData: CMSData;
  onUpdateCMS: (data: CMSData) => void;
}

export const CMSWebsiteEditor: React.FC<CMSWebsiteEditorProps> = ({ cmsData, onUpdateCMS }) => {
  const [formData, setFormData] = useState<CMSData>(cmsData);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCMS(formData);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#002147] dark:text-blue-400" />
            <h3 className="text-sm font-black uppercase tracking-wider text-[#002147] dark:text-white">
              Website CMS Content Manager
            </h3>
          </div>
          <p className="text-3xs text-slate-400 mt-1">
            Real-time editor for college public portal text, history, mission, vision, address, and SEO metadata.
          </p>
        </div>

        {successMsg && (
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 rounded-full text-3xs font-bold uppercase tracking-wider animate-bounce">
            ✓ Public Website Updated
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-2xs">
        {/* COLLEGE METADATA */}
        <div className="p-4 bg-slate-50/60 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800 rounded-2xl space-y-4">
          <h4 className="text-3xs font-bold uppercase text-[#002147] dark:text-blue-300 tracking-wider">
            General College Identity & Contact Details
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-500 uppercase text-3xs">Institution Official Title</label>
              <input
                type="text"
                required
                value={formData.collegeName}
                onChange={e => setFormData({ ...formData, collegeName: e.target.value })}
                className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-500 uppercase text-3xs">Official Campus Address</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-500 uppercase text-3xs">Contact Phone Lines</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-500 uppercase text-3xs">Official Admin Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900"
              />
            </div>
          </div>
        </div>

        {/* CMS TEXT BLOCKS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase text-3xs">About College Overview</label>
            <textarea
              rows={4}
              required
              value={formData.aboutText}
              onChange={e => setFormData({ ...formData, aboutText: e.target.value })}
              className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 leading-relaxed"
            ></textarea>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase text-3xs">Institutional History (Est. 1958)</label>
            <textarea
              rows={4}
              required
              value={formData.historyText}
              onChange={e => setFormData({ ...formData, historyText: e.target.value })}
              className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 leading-relaxed"
            ></textarea>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase text-3xs">Mission Statement</label>
            <textarea
              rows={3}
              required
              value={formData.missionText}
              onChange={e => setFormData({ ...formData, missionText: e.target.value })}
              className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 leading-relaxed"
            ></textarea>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase text-3xs">Vision Statement</label>
            <textarea
              rows={3}
              required
              value={formData.visionText}
              onChange={e => setFormData({ ...formData, visionText: e.target.value })}
              className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 leading-relaxed"
            ></textarea>
          </div>
        </div>

        {/* SEO METADATA */}
        <div className="p-4 bg-slate-50/60 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800 rounded-2xl space-y-3">
          <h4 className="text-3xs font-bold uppercase text-[#002147] dark:text-blue-300 tracking-wider">
            SEO & Search Engine Optimization Configuration
          </h4>

          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase text-3xs">SEO Title Tag</label>
            <input
              type="text"
              required
              value={formData.seoTitle}
              onChange={e => setFormData({ ...formData, seoTitle: e.target.value })}
              className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase text-3xs">Meta Description</label>
            <input
              type="text"
              required
              value={formData.seoDescription}
              onChange={e => setFormData({ ...formData, seoDescription: e.target.value })}
              className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-[#002147] hover:bg-[#001833] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-2 shadow-md"
        >
          <Save className="w-4 h-4" />
          <span>Publish Website CMS Changes</span>
        </button>
      </form>
    </div>
  );
};
