import React, { useState, useEffect } from 'react';
import { departmentStaffService, DepartmentStaffMember } from '../../../services/departmentStaffService';
import { departmentCmsService } from '../../../services/departmentCmsService';
import { Card } from '../../../components/common/Card';
import { useAuth } from '../../../contexts/AuthContext';
import { isSuperAdmin, isAdmin, isPrincipal, isVicePrincipal } from '../../../utils/permissionHelper';
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  ArrowRightLeft,
  Upload,
  Download,
  FileSpreadsheet,
  CheckSquare,
  Square,
  X,
  ShieldAlert,
  Mail,
  Phone,
  Award,
  Calendar,
  Building2,
  UserCheck,
  CheckCircle2,
  XCircle,
  FileText,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const DepartmentStaffManagementPanel: React.FC = () => {
  const { user } = useAuth();
  const isAuthorized = isSuperAdmin(user) || isAdmin(user) || isPrincipal(user) || isVicePrincipal(user);

  // Departments list for dropdown
  const departments = departmentCmsService.getDepartments();

  // Search & Filters
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'name' | 'department' | 'designation'>('name');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const [staffData, setStaffData] = useState(() =>
    departmentStaffService.getFilteredStaff({
      search,
      departmentId: deptFilter,
      status: statusFilter,
      sortBy,
      page,
      pageSize,
    })
  );

  // Selection & Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeptTarget, setBulkDeptTarget] = useState(departments[0]?.id || 'org');

  // Modals & Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{ id?: string; bulk?: boolean } | null>(null);

  // Editing Item
  const [editingStaff, setEditingStaff] = useState<Partial<DepartmentStaffMember>>({
    name: '',
    departmentId: departments[0]?.id || 'org',
    designation: 'Assistant Professor',
    qualification: 'M.D. (Hom.)',
    email: '',
    phone: '',
    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    joiningDate: '2020-08-01',
    experienceYears: '5+ Years',
    registrationNumber: 'WB-NCH-2020-001',
    biography: '',
    status: 'Active',
  });

  const loadData = () => {
    const res = departmentStaffService.getFilteredStaff({
      search,
      departmentId: deptFilter,
      status: statusFilter,
      sortBy,
      page,
      pageSize,
    });
    setStaffData(res);
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('bhmch_department_cms_updated', handleUpdate);
    return () => window.removeEventListener('bhmch_department_cms_updated', handleUpdate);
  }, [search, deptFilter, statusFilter, sortBy, page, pageSize]);

  const toggleSelectAll = () => {
    if (selectedIds.length === staffData.data.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(staffData.data.map((s) => s.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setEditingStaff((prev) => ({
        ...prev,
        photoUrl: event.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthorized) {
      toast.error('Permission denied: Authorized admin role required.');
      return;
    }
    if (!editingStaff.name || !editingStaff.email) {
      toast.error('Please enter name and email.');
      return;
    }

    if (editingStaff.id) {
      departmentStaffService.updateStaff(editingStaff.id, editingStaff);
    } else {
      departmentStaffService.addStaff(editingStaff);
    }
    setIsModalOpen(false);
    loadData();
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmTarget) return;
    if (deleteConfirmTarget.bulk) {
      departmentStaffService.bulkDelete(selectedIds);
      setSelectedIds([]);
    } else if (deleteConfirmTarget.id) {
      departmentStaffService.deleteStaff(deleteConfirmTarget.id);
    }
    setDeleteConfirmTarget(null);
    loadData();
  };

  const handleBulkTransfer = () => {
    if (selectedIds.length === 0) return;
    departmentStaffService.bulkTransfer(selectedIds, bulkDeptTarget);
    setSelectedIds([]);
    setIsTransferModalOpen(false);
    loadData();
  };

  const handleExport = () => {
    const jsonStr = departmentStaffService.exportStaff(selectedIds.length > 0 ? selectedIds : undefined);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BHMCH_Department_Staff_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast.success('Department staff records exported!');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      departmentStaffService.importStaff(event.target?.result as string);
      loadData();
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2.5 bg-emerald-50 dark:bg-emerald-950/80 text-[#00A651] rounded-2xl">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Department Faculty & Staff Management
            </h2>
            <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-extrabold text-2xs rounded-full">
              {staffData.total} Total Staff
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Add faculty members, update qualifications & designations, upload photos, and transfer faculty between academic departments.
          </p>
        </div>

        {isAuthorized ? (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setEditingStaff({
                  name: '',
                  departmentId: departments[0]?.id || 'org',
                  designation: 'Assistant Professor',
                  qualification: 'M.D. (Hom.)',
                  email: '',
                  phone: '',
                  photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
                  joiningDate: '2020-08-01',
                  experienceYears: '5+ Years',
                  registrationNumber: 'WB-NCH-2020-001',
                  biography: '',
                  status: 'Active',
                });
                setIsModalOpen(true);
              }}
              className="px-4 py-2.5 bg-[#00A651] hover:bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Faculty / Staff
            </button>
            <button
              onClick={handleExport}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-2xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Export
            </button>
            <label className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-2xl transition flex items-center gap-1.5 cursor-pointer">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Import
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>
        ) : (
          <div className="px-3 py-1.5 bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 rounded-xl text-2xs font-extrabold flex items-center gap-1">
            <ShieldAlert className="w-4 h-4" /> Read-Only Mode
          </div>
        )}
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search faculty by name, qualification, email, registration..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#00A651]"
            />
          </div>

          <div>
            <select
              value={deptFilter}
              onChange={(e) => {
                setDeptFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
            >
              <option value="ALL">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Toolbar */}
        {isAuthorized && selectedIds.length > 0 && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-emerald-50/50 dark:bg-emerald-950/20 p-3 rounded-2xl">
            <span className="text-xs font-black text-emerald-800 dark:text-emerald-300">
              {selectedIds.length} faculty record(s) selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsTransferModalOpen(true)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-2xs rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" /> Transfer Department
              </button>
              <button
                onClick={() => {
                  departmentStaffService.bulkStatusUpdate(selectedIds, 'Active');
                  setSelectedIds([]);
                  loadData();
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-2xs rounded-xl cursor-pointer"
              >
                Set Active
              </button>
              <button
                onClick={() => {
                  departmentStaffService.bulkStatusUpdate(selectedIds, 'Inactive');
                  setSelectedIds([]);
                  loadData();
                }}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white font-bold text-2xs rounded-xl cursor-pointer"
              >
                Set Inactive
              </button>
              <button
                onClick={() => setDeleteConfirmTarget({ bulk: true })}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-2xs rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Staff Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {staffData.data.map((staff) => {
          const isSelected = selectedIds.includes(staff.id);
          return (
            <Card
              key={staff.id}
              className={`p-5 space-y-4 border transition rounded-3xl relative ${
                isSelected ? 'ring-2 ring-emerald-400 border-emerald-500 bg-emerald-50/10' : 'border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start gap-3">
                {isAuthorized && (
                  <button onClick={() => toggleSelectOne(staff.id)} className="mt-1 text-slate-400">
                    {isSelected ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4" />}
                  </button>
                )}

                <img
                  src={staff.photoUrl}
                  alt={staff.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                />

                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded truncate max-w-[140px]">
                      {staff.departmentName}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-black rounded-full ${
                        staff.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {staff.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">{staff.name}</h3>
                  <p className="text-2xs font-extrabold text-slate-600 dark:text-slate-300">{staff.designation}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-1.5 text-2xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate font-semibold">{staff.qualification}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{staff.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{staff.phone}</span>
                </div>
                {staff.registrationNumber && (
                  <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px]">
                    <span>Reg No: {staff.registrationNumber}</span>
                  </div>
                )}
              </div>

              {isAuthorized && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setEditingStaff(staff);
                      setIsModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-extrabold text-2xs rounded-xl flex items-center gap-1 hover:bg-blue-100 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                  </button>

                  <button
                    onClick={() => setDeleteConfirmTarget({ id: staff.id })}
                    className="px-3 py-1.5 bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 font-extrabold text-2xs rounded-xl flex items-center gap-1 hover:bg-rose-100 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {staffData.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500">
            Page {staffData.page} of {staffData.totalPages} ({staffData.total} staff)
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={page >= staffData.totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* MODAL 1: Add / Edit Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full my-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                {editingStaff.id ? 'Edit Faculty / Staff Member' : 'Add New Department Faculty Member'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={editingStaff.name || ''}
                    onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 mb-1">Department *</label>
                  <select
                    value={editingStaff.departmentId || departments[0]?.id}
                    onChange={(e) => setEditingStaff({ ...editingStaff, departmentId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 mb-1">Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. Professor & HOD, Associate Professor..."
                    value={editingStaff.designation || ''}
                    onChange={(e) => setEditingStaff({ ...editingStaff, designation: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 mb-1">Qualification</label>
                  <input
                    type="text"
                    placeholder="e.g. M.D. (Hom.), B.H.M.S..."
                    value={editingStaff.qualification || ''}
                    onChange={(e) => setEditingStaff({ ...editingStaff, qualification: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={editingStaff.email || ''}
                    onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editingStaff.phone || ''}
                    onChange={(e) => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 mb-1">Registration No</label>
                  <input
                    type="text"
                    value={editingStaff.registrationNumber || ''}
                    onChange={(e) => setEditingStaff({ ...editingStaff, registrationNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 mb-1">Joining Date</label>
                  <input
                    type="date"
                    value={editingStaff.joiningDate || ''}
                    onChange={(e) => setEditingStaff({ ...editingStaff, joiningDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 mb-1">Status</label>
                  <select
                    value={editingStaff.status || 'Active'}
                    onChange={(e) => setEditingStaff({ ...editingStaff, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 mb-1">Faculty Photo URL or File Upload</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={editingStaff.photoUrl || ''}
                    onChange={(e) => setEditingStaff({ ...editingStaff, photoUrl: e.target.value })}
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                  <label className="px-3 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl cursor-pointer">
                    Upload
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 mb-1">Academic & Clinical Biography</label>
                <textarea
                  rows={2}
                  value={editingStaff.biography || ''}
                  onChange={(e) => setEditingStaff({ ...editingStaff, biography: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00A651] hover:bg-emerald-600 text-white font-extrabold rounded-xl shadow-md"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Transfer Department Modal */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 max-w-md w-full space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-blue-600" /> Transfer Faculty Members
            </h3>
            <p className="text-xs text-slate-500">
              Select the new department for the {selectedIds.length} selected faculty member(s). Their profile will automatically move to the new department page.
            </p>

            <div>
              <label className="block text-2xs font-bold text-slate-600 mb-1">New Target Department</label>
              <select
                value={bulkDeptTarget}
                onChange={(e) => setBulkDeptTarget(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsTransferModalOpen(false)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkTransfer}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-md"
              >
                Execute Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Delete Confirmation */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 max-w-md w-full space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <Trash2 className="w-6 h-6" />
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Confirm Faculty Removal</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {deleteConfirmTarget.bulk
                ? `Are you sure you want to remove ${selectedIds.length} selected faculty member(s)?`
                : 'Are you sure you want to remove this faculty member from the department?'}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmTarget(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
