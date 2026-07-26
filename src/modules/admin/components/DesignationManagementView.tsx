import React, { useState } from 'react';
import { adminHrService } from '../../../services/adminHrService';
import { DesignationItem } from '../../../types/adminHr';
import { Modal } from '../../../components/common/Modal';
import { Award, Plus, Edit2, Trash2, Shield, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

export const DesignationManagementView: React.FC = () => {
  const [designations, setDesignations] = useState<DesignationItem[]>(adminHrService.getDesignations());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDes, setEditingDes] = useState<DesignationItem | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    title: '',
    departmentCategory: 'ACADEMIC' as DesignationItem['departmentCategory'],
    payScaleGrade: 'Pay Level 10 (₹56,100 - ₹1,77,500)',
    minBasicPay: 56100,
    maxBasicPay: 177500,
    reportsTo: 'Principal',
    description: '',
  });

  const refreshList = () => setDesignations(adminHrService.getDesignations());

  const handleOpenAdd = () => {
    setEditingDes(null);
    setFormData({
      code: 'LECT',
      title: 'Assistant Professor / Lecturer',
      departmentCategory: 'ACADEMIC',
      payScaleGrade: 'Pay Level 10 (₹56,100 - ₹1,77,500)',
      minBasicPay: 56100,
      maxBasicPay: 177500,
      reportsTo: 'Professor & HOD',
      description: 'Lecturing, clinical practicals supervision, and exam paper setting.',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (d: DesignationItem) => {
    setEditingDes(d);
    setFormData({
      code: d.code,
      title: d.title,
      departmentCategory: d.departmentCategory,
      payScaleGrade: d.payScaleGrade,
      minBasicPay: d.minBasicPay,
      maxBasicPay: d.maxBasicPay,
      reportsTo: d.reportsTo,
      description: d.description,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error('Please enter title');
      return;
    }

    if (editingDes) {
      adminHrService.updateDesignation(editingDes.id, formData);
      toast.success('Designation updated!');
    } else {
      adminHrService.addDesignation(formData);
      toast.success('Designation created!');
    }

    setIsModalOpen(false);
    refreshList();
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Delete designation ${title}?`)) {
      adminHrService.deleteDesignation(id);
      toast.success('Designation deleted');
      refreshList();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600" />
            <span>Designation & Pay Scale Grade Master ({designations.length})</span>
          </h2>
          <p className="text-xs text-slate-500">
            Institutional position hierarchy, pay scale levels, reporting channels & role descriptions
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#002147] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Designation</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {designations.map((des) => (
          <div
            key={des.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-purple-500 transition"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs font-black text-purple-600 bg-purple-50 dark:bg-purple-950 px-2.5 py-1 rounded-lg">
                  {des.code}
                </span>
                <span className="text-[10px] font-extrabold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full">
                  {des.departmentCategory}
                </span>
              </div>

              <h3 className="font-black text-base text-slate-900 dark:text-white">{des.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2">{des.description}</p>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
                <p className="font-bold text-slate-800 dark:text-slate-200">{des.payScaleGrade}</p>
                <p className="text-[11px] text-slate-500">
                  Basic Pay Band: ₹{des.minBasicPay.toLocaleString()} - ₹{des.maxBasicPay.toLocaleString()}
                </p>
              </div>

              <p className="text-slate-500 text-[11px]">
                <strong>Reports To:</strong> {des.reportsTo}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => handleOpenEdit(des)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-lg transition cursor-pointer flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => handleDelete(des.id, des.title)}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-lg transition cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingDes ? `Edit Designation: ${editingDes.title}` : 'Add Designation'}>
        <form onSubmit={handleSave} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Code *</label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Designation Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Pay Scale Level Grade</label>
            <input
              type="text"
              value={formData.payScaleGrade}
              onChange={(e) => setFormData({ ...formData, payScaleGrade: e.target.value })}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Reports To</label>
            <input
              type="text"
              value={formData.reportsTo}
              onChange={(e) => setFormData({ ...formData, reportsTo: e.target.value })}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-800 font-bold rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#002147] text-white font-bold rounded-lg cursor-pointer"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
