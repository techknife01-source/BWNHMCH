import React, { useState } from 'react';
import { adminHrService } from '../../../services/adminHrService';
import { HolidayItem } from '../../../types/adminHr';
import { Modal } from '../../../components/common/Modal';
import { Calendar, Plus, PartyPopper } from 'lucide-react';
import toast from 'react-hot-toast';

export const HolidayCalendarView: React.FC = () => {
  const [holidays, setHolidays] = useState<HolidayItem[]>(adminHrService.getHolidays());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    date: '2026-09-05',
    dayOfWeek: 'Saturday',
    type: 'ACADEMIC' as HolidayItem['type'],
    description: 'Teachers Day & Homoeopathic Faculty Honour Event',
    isMandatory: true,
  });

  const handleAddHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    adminHrService.addHoliday(formData);
    toast.success('Holiday added to calendar!');
    setHolidays(adminHrService.getHolidays());
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-rose-600" />
            <span>Institutional Official Holiday Calendar ({holidays.length})</span>
          </h2>
          <p className="text-xs text-slate-500">
            Gazetted holidays, Hahnemann Day, restricted leave days & academic recess schedule
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-[#002147] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Holiday</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {holidays.map((hol) => (
          <div
            key={hol.id}
            className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-4 hover:border-rose-500 transition"
          >
            <div className="p-3 bg-rose-50 dark:bg-rose-950 text-rose-600 rounded-2xl shrink-0 flex flex-col items-center justify-center text-center w-14">
              <PartyPopper className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-black uppercase">{hol.type.slice(0, 3)}</span>
            </div>

            <div className="space-y-1 text-xs">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                {hol.type}
              </span>
              <h3 className="font-black text-slate-900 dark:text-white text-sm">{hol.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 font-bold">{hol.date} ({hol.dayOfWeek})</p>
              <p className="text-slate-500 text-[11px]">{hol.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Official Holiday">
        <form onSubmit={handleAddHoliday} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Holiday Title *</label>
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
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Day of Week</label>
              <input
                type="text"
                value={formData.dayOfWeek}
                onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as HolidayItem['type'] })}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
            >
              <option value="GAZETTED">GAZETTED</option>
              <option value="RESTRICTED">RESTRICTED</option>
              <option value="ACADEMIC">ACADEMIC</option>
              <option value="INSTITUTIONAL">INSTITUTIONAL</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              className="px-4 py-2 bg-[#002147] text-white font-bold rounded-xl shadow-xs cursor-pointer"
            >
              Save Holiday
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
