import React, { useState } from 'react';
import { adminHrService } from '../../../services/adminHrService';
import { DepartmentItem } from '../../../types/adminHr';
import { Modal } from '../../../components/common/Modal';
import { Building2, Plus, Edit2, Trash2, Users, DollarSign, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export const DepartmentManagementView: React.FC = () => {
  const [departments, setDepartments] = useState<DepartmentItem[]>(adminHrService.getDepartments());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<DepartmentItem | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: 'ACADEMIC' as DepartmentItem['category'],
    hodName: '',
    hodEmail: '',
    staffCount: 5,
    budgetAllocated: 1500000,
    description: '',
    roomLocation: '',
  });

  const refreshDepts = () => {
    setDepartments(adminHrService.getDepartments());
  };

  const handleOpenAdd = () => {
    setEditingDept(null);
    setFormData({
      code: 'NEW',
      name: '',
      category: 'ACADEMIC',
      hodName: 'Dr. Faculty HOD',
      hodEmail: 'hod@bhmc.edu.in',
      staffCount: 5,
      budgetAllocated: 1500000,
      description: 'Departmental objectives and clinical laboratories.',
      roomLocation: 'Academic Block Floor 2',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (d: DepartmentItem) => {
    setEditingDept(d);
    setFormData({
      code: d.code,
      name: d.name,
      category: d.category,
      hodName: d.hodName,
      hodEmail: d.hodEmail,
      staffCount: d.staffCount,
      budgetAllocated: d.budgetAllocated,
      description: d.description,
      roomLocation: d.roomLocation,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Please enter department name');
      return;
    }

    if (editingDept) {
      adminHrService.updateDepartment(editingDept.id, formData);
      toast.success('Department details updated!');
    } else {
      adminHrService.addDepartment(formData);
      toast.success('New department added!');
    }

    setIsModalOpen(false);
    refreshDepts();
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete department ${name}?`)) {
      adminHrService.deleteDepartment(id);
      toast.success('Department deleted');
      refreshDepts();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <span>Institutional Department Management ({departments.length})</span>
          </h2>
          <p className="text-xs text-slate-500">
            Academic subjects, hospital clinical divisions, administrative units & budgetary allocations
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#002147] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Department</span>
        </button>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-500 transition"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">
                  {dept.code}
                </span>
                <span className="text-[10px] font-extrabold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full">
                  {dept.category}
                </span>
              </div>

              <h3 className="font-black text-base text-slate-900 dark:text-white">{dept.name}</h3>
              <p className="text-xs text-slate-500 line-clamp-2">{dept.description}</p>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
                <Users className="w-4 h-4 text-blue-500 shrink-0" />
                <span>HOD: {dept.hodName}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-500">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{dept.roomLocation}</span>
              </div>

              <div className="flex justify-between items-center pt-2 font-bold">
                <span className="text-slate-500">{dept.staffCount} Staff Members</span>
                <span className="text-emerald-600 dark:text-emerald-400">₹{(dept.budgetAllocated / 100000).toFixed(1)} L Budget</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => handleOpenEdit(dept)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-lg transition cursor-pointer flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => handleDelete(dept.id, dept.name)}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-lg transition cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingDept ? `Edit Department: ${editingDept.name}` : 'Add Department'}>
        <form onSubmit={handleSave} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Dept Code *</label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Department Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as DepartmentItem['category'] })}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold"
            >
              <option value="ACADEMIC">ACADEMIC</option>
              <option value="CLINICAL">CLINICAL</option>
              <option value="ADMINISTRATIVE">ADMINISTRATIVE</option>
              <option value="SUPPORT">SUPPORT</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">HOD Name</label>
            <input
              type="text"
              value={formData.hodName}
              onChange={(e) => setFormData({ ...formData, hodName: e.target.value })}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Location Room / Block</label>
            <input
              type="text"
              value={formData.roomLocation}
              onChange={(e) => setFormData({ ...formData, roomLocation: e.target.value })}
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
