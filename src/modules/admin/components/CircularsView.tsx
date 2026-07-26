import React, { useState } from 'react';
import { adminHrService } from '../../../services/adminHrService';
import { InstitutionalCircular } from '../../../types/adminHr';
import { Modal } from '../../../components/common/Modal';
import { Bell, Plus, FileText, Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const CircularsView: React.FC = () => {
  const [circulars, setCirculars] = useState<InstitutionalCircular[]>(adminHrService.getCirculars());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: 'BHMS Final Term Examination Guidelines & Duty Allocation',
    circularNo: 'BHMC/ADMIN/2026/045',
    category: 'ACADEMIC' as InstitutionalCircular['category'],
    targetAudience: 'FACULTY' as InstitutionalCircular['targetAudience'],
    issuedBy: 'Principal & Academic Director',
    publishDate: '2026-07-25',
    content: 'All faculty members are requested to review the invigilation duty roster for upcoming term exams.',
  });

  const handleIssueCircular = (e: React.FormEvent) => {
    e.preventDefault();
    adminHrService.addCircular(formData);
    toast.success('Institutional circular published & broadcasted!');
    setCirculars(adminHrService.getCirculars());
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-600" />
            <span>Institutional Circulars & Official Administrative Orders ({circulars.length})</span>
          </h2>
          <p className="text-xs text-slate-500">
            Publish notices, university orders, hospital duty circulars & administrative mandates
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-[#002147] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Official Circular</span>
        </button>
      </div>

      {/* Grid */}
      <div className="space-y-4">
        {circulars.map((circ) => (
          <div
            key={circ.id}
            className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2.5 py-1 rounded-lg">
                  {circ.circularNo}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  {circ.category}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                  TARGET: {circ.targetAudience}
                </span>
              </div>

              <span className="text-xs text-slate-400 font-bold">Published: {circ.publishDate}</span>
            </div>

            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-base">{circ.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                {circ.content}
              </p>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Issued By: <strong>{circ.issuedBy}</strong></span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Broadcast Active
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Publish Official Circular">
        <form onSubmit={handleIssueCircular} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Circular Reference No *</label>
            <input
              type="text"
              required
              value={formData.circularNo}
              onChange={(e) => setFormData({ ...formData, circularNo: e.target.value })}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Circular Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as InstitutionalCircular['category'] })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
              >
                <option value="ACADEMIC">ACADEMIC</option>
                <option value="ADMINISTRATIVE">ADMINISTRATIVE</option>
                <option value="HOSPITAL">HOSPITAL</option>
                <option value="HOLIDAY">HOLIDAY</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Target Audience</label>
              <select
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value as InstitutionalCircular['targetAudience'] })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
              >
                <option value="ALL">ALL STAFF & STUDENTS</option>
                <option value="FACULTY">FACULTY ONLY</option>
                <option value="HOSPITAL_STAFF">HOSPITAL STAFF</option>
                <option value="STUDENTS">STUDENTS ONLY</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Content / Directive Text</label>
            <textarea
              rows={4}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-800 font-bold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#002147] text-white font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" /> Publish Circular
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
