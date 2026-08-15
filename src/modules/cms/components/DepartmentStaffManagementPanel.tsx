import React, { useState, useEffect } from 'react';
import { departmentStaffService, DepartmentStaffService, DepartmentStaffMember } from '../../../services/departmentStaffService';
import { departmentCmsService } from '../../../services/departmentCmsService';
import { facultyApi } from '../../../services/api/faculty.api';
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
  Table as TableIcon,
  LayoutGrid,
  RefreshCw,
  Eye,
  Lock,
  Sparkles,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const DepartmentStaffManagementPanel: React.FC = () => {
  const { user } = useAuth();
  
  // Authorized roles: Super Admin, Admin, Principal, Vice Principal
  const isAuthorized = isSuperAdmin(user) || isAdmin(user) || isPrincipal(user) || isVicePrincipal(user);

  // Departments list for dropdown
  const departments = departmentCmsService.getDepartments();

  // Search & Filters
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'name' | 'department' | 'designation'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const [staffData, setStaffData] = useState(() =>
    departmentStaffService.getFilteredStaff({
      search,
      departmentId: deptFilter,
      status: statusFilter,
      sortBy,
      sortOrder,
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
  const [viewDetailStaff, setViewDetailStaff] = useState<DepartmentStaffMember | null>(null);

  // Photo Upload & Form Saving State
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      if (photoPreviewUrl) {
        URL.revokeObjectURL(photoPreviewUrl);
      }
    };
  }, [photoPreviewUrl]);

  // Form State
  const [editingStaff, setEditingStaff] = useState<Partial<DepartmentStaffMember>>({
    name: '',
    departmentId: departments[0]?.id || 'org',
    designation: 'Assistant Professor',
    qualification: 'M.D. (Hom.)',
    specialization: 'Clinical Homoeopathy',
    email: '',
    phone: '',
    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    joiningDate: '2020-08-01',
    experienceYears: '5+ Years',
    registrationNumber: 'WB-NCH-2020-001',
    biography: '',
    status: 'Active',
  });

  const loadData = async () => {
    const res = await departmentStaffService.getFilteredStaffAsync({
      search,
      departmentId: deptFilter,
      status: statusFilter,
      sortBy,
      sortOrder,
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
  }, [search, deptFilter, statusFilter, sortBy, sortOrder, page, pageSize]);

  const toggleSelectAll = () => {
    if (selectedIds.length === staffData.data.length && staffData.data.length > 0) {
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

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid image format. Allowed formats: JPEG, PNG, WebP.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      toast.error('Image file size exceeds 15MB. Please choose a smaller image.');
      return;
    }

    setSelectedPhotoFile(file);

    // Clean up previous blob preview URL if any
    if (photoPreviewUrl) {
      URL.revokeObjectURL(photoPreviewUrl);
    }
    const tempPreviewUrl = URL.createObjectURL(file);
    setPhotoPreviewUrl(tempPreviewUrl);
  };

  const handleSaveStaff = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (!isAuthorized) {
      toast.error('Access Denied: Only Super Admin, Admin, Principal, and Vice Principal can manage faculty.');
      return;
    }
    if (!editingStaff || !editingStaff.name || !editingStaff.name.trim()) {
      toast.error('Full Name is required. Please enter faculty name.');
      return;
    }

    const isEditMode = Boolean(editingStaff?.id && String(editingStaff.id).trim().length > 0);

    try {
      setIsSaving(true);

      let savedMember: DepartmentStaffMember | null = null;
      let activeId: string = '';

      if (isEditMode) {
        const id = editingStaff.id!.trim();
        console.log('[FACULTY EDIT] EXISTING RECORD ID:', id);

        const payload = DepartmentStaffService.normalizeFacultyForApi(editingStaff);
        console.log('[FACULTY EDIT] CALLING REAL PUT:', `/api/v1/faculty/${id}`, payload);

        savedMember = await departmentStaffService.updateStaffAsync(id, editingStaff);
        console.log('[FACULTY EDIT] REAL PUT RESPONSE:', savedMember);
        activeId = id;
      } else {
        console.log('[FACULTY CREATE] CALLING REAL POST');

        const payload = DepartmentStaffService.normalizeFacultyForApi(editingStaff);
        console.log('[FACULTY CREATE] POST PAYLOAD:', payload);

        savedMember = await departmentStaffService.addStaffAsync(editingStaff);
        console.log('[FACULTY CREATE] REAL POST RESPONSE:', savedMember);

        if (!savedMember || !savedMember.id) {
          throw new Error('Faculty created but backend did not return a valid record ID.');
        }
        activeId = savedMember.id;
      }

      // Handle photo upload ONLY if a new photo file was selected
      if (selectedPhotoFile && activeId) {
        const loadingToastId = toast.loading('Uploading photo to Google Drive...');
        try {
          setIsUploadingPhoto(true);
          const uploadRes: any = await facultyApi.uploadFacultyPhoto(activeId, selectedPhotoFile);
          if (uploadRes && uploadRes.success) {
            toast.success('Photo uploaded & saved to Google Drive successfully!', { id: loadingToastId });
          } else {
            toast.error(uploadRes?.message || 'Photo upload failed. Please try again.', { id: loadingToastId });
          }
        } catch (uploadErr: any) {
          console.error('[FACULTY PHOTO] UPLOAD FAILED:', uploadErr);
          toast.error(`Photo upload failed: ${uploadErr?.response?.data?.message || uploadErr?.message || 'Server error'}`, { id: loadingToastId });
        } finally {
          setIsUploadingPhoto(false);
        }
      }

      // Mandatory Database Verification: Re-fetch directly from database API before claiming success
      const verifiedMember = await departmentStaffService.getFacultyByIdAsync(activeId);
      console.log(isEditMode ? '[FACULTY EDIT] DATABASE VERIFICATION:' : '[FACULTY CREATE] DATABASE VERIFICATION:', verifiedMember);
      if (!verifiedMember) {
        throw new Error(`Database verification failed: Could not re-fetch faculty ID '${activeId}' from MongoDB Atlas.`);
      }

      // Reload entire list from MongoDB Atlas API to refresh React state
      await loadData();

      setSelectedPhotoFile(null);
      if (photoPreviewUrl) {
        URL.revokeObjectURL(photoPreviewUrl);
        setPhotoPreviewUrl(null);
      }
      setIsModalOpen(false);

      toast.success(isEditMode ? 'Faculty details updated & verified in MongoDB Atlas!' : 'Faculty member record added & verified!');
    } catch (saveErr: any) {
      console.error(isEditMode ? '[FACULTY EDIT] UPDATE FAILED:' : '[FACULTY CREATE] CREATE FAILED:', saveErr);
      toast.error(isEditMode ? `Faculty update failed: ${saveErr?.message || 'Database was not confirmed.'}` : `Faculty creation failed: ${saveErr?.message || 'Database was not confirmed.'}`);
    } finally {
      setIsSaving(false);
      setIsUploadingPhoto(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!isAuthorized) {
      toast.error('Access Denied: Only Super Admin, Admin, Principal, and Vice Principal can delete faculty.');
      return;
    }
    if (!deleteConfirmTarget) return;
    if (deleteConfirmTarget.bulk) {
      for (const id of selectedIds) {
        await departmentStaffService.deleteStaffAsync(id);
      }
      setSelectedIds([]);
    } else if (deleteConfirmTarget.id) {
      await departmentStaffService.deleteStaffAsync(deleteConfirmTarget.id);
    }
    setDeleteConfirmTarget(null);
    await loadData();
  };

  const handleOpenEditModal = async (staff: DepartmentStaffMember) => {
    setSelectedPhotoFile(null);
    const fullRecord = await departmentStaffService.getFacultyByIdAsync(staff.id);
    setEditingStaff(fullRecord || staff);
    setIsModalOpen(true);
  };

  const handleOpenViewModal = async (staff: DepartmentStaffMember) => {
    const fullRecord = await departmentStaffService.getFacultyByIdAsync(staff.id);
    setViewDetailStaff(fullRecord || staff);
  };

  const handleBulkTransfer = () => {
    if (!isAuthorized) {
      toast.error('Access Denied: Only Super Admin, Admin, Principal, and Vice Principal can transfer faculty.');
      return;
    }
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
    a.download = `BHMCH_Centralized_Faculty_Directory_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast.success('Faculty directory exported successfully.');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAuthorized) {
      toast.error('Access Denied: Only Super Admin, Admin, Principal, and Vice Principal can import faculty.');
      return;
    }
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
          <div className="flex flex-wrap items-center gap-2">
            <span className="p-2.5 bg-[#002147] text-white rounded-2xl">
              <Users className="w-5 h-5 text-emerald-400" />
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#002147] dark:text-white">
              Centralized Faculty Directory
            </h2>
            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/80 text-[#00A651] font-extrabold text-2xs rounded-full border border-emerald-300 dark:border-emerald-800">
              {staffData.total} Total Registered Faculty
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Institutional Directory synchronizing faculty rosters, qualifications, designations, and department assignments across all academic departments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isAuthorized ? (
            <>
              <button
                onClick={() => {
                  setSelectedPhotoFile(null);
                  setEditingStaff({
                    name: '',
                    departmentId: departments[0]?.id || 'org',
                    designation: 'Assistant Professor',
                    qualification: 'M.D. (Hom.)',
                    specialization: 'Clinical Homoeopathy',
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
                <Plus className="w-4 h-4" /> Add Faculty Member
              </button>
              <button
                onClick={handleExport}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-2xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4 text-blue-600" /> Export
              </button>
              <label className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-2xl transition flex items-center gap-1.5 cursor-pointer">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Import
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>
            </>
          ) : (
            <div className="px-3.5 py-2 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-2xl text-xs font-bold flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-600" />
              <span>Student / Visitor View-Only Mode</span>
            </div>
          )}
        </div>
      </div>

      {/* Search, Filter & View Toggle Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, designation, qualification, email, reg no..."
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

          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center">
              <button
                onClick={() => setViewMode('table')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-700 text-[#002147] dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" /> Table
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition ${
                  viewMode === 'cards'
                    ? 'bg-white dark:bg-slate-700 text-[#002147] dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> Cards
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Action Toolbar for Authorized Managers */}
        {isAuthorized && selectedIds.length > 0 && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-emerald-50/60 dark:bg-emerald-950/30 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800">
            <span className="text-xs font-black text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-600" />
              {selectedIds.length} faculty member(s) selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsTransferModalOpen(true)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-2xs rounded-xl flex items-center gap-1 cursor-pointer transition shadow-xs"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" /> Transfer Department
              </button>
              <button
                onClick={() => {
                  departmentStaffService.bulkStatusUpdate(selectedIds, 'Active');
                  setSelectedIds([]);
                  loadData();
                }}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-2xs rounded-xl cursor-pointer transition shadow-xs"
              >
                Set Active
              </button>
              <button
                onClick={() => {
                  departmentStaffService.bulkStatusUpdate(selectedIds, 'Inactive');
                  setSelectedIds([]);
                  loadData();
                }}
                className="px-3.5 py-1.5 bg-slate-700 hover:bg-slate-800 text-white font-bold text-2xs rounded-xl cursor-pointer transition shadow-xs"
              >
                Set Inactive
              </button>
              <button
                onClick={() => setDeleteConfirmTarget({ bulk: true })}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-2xs rounded-xl flex items-center gap-1 cursor-pointer transition shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* VIEW 1: FACULTY TABLE VIEW */}
      {viewMode === 'table' ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#002147] text-white font-extrabold border-b border-slate-200 dark:border-slate-800">
                  {isAuthorized && (
                    <th className="p-3.5 text-center w-10">
                      <button onClick={toggleSelectAll} className="text-slate-300 hover:text-white">
                        {selectedIds.length > 0 && selectedIds.length === staffData.data.length ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                  )}
                  <th className="p-3.5 w-16">Photo</th>
                  <th className="p-3.5">Faculty Name</th>
                  <th className="p-3.5">Designation</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">Qualification</th>
                  <th className="p-3.5">Email & Phone</th>
                  <th className="p-3.5">Reg. No</th>
                  <th className="p-3.5">Joining Date</th>
                  <th className="p-3.5">Promotion Date</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {staffData.data.length === 0 ? (
                  <tr>
                    <td colSpan={isAuthorized ? 12 : 11} className="p-8 text-center text-slate-500">
                      No faculty records found matching your search filters.
                    </td>
                  </tr>
                ) : (
                  staffData.data.map((staff) => {
                    const isSelected = selectedIds.includes(staff.id);
                    return (
                      <tr
                        key={staff.id}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition ${
                          isSelected ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''
                        }`}
                      >
                        {isAuthorized && (
                          <td className="p-3.5 text-center">
                            <button onClick={() => toggleSelectOne(staff.id)} className="text-slate-400">
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                        )}

                        <td className="p-3.5">
                          <img
                            src={
                              staff.photoUrl && !staff.photoUrl.startsWith('blob:')
                                ? staff.photoUrl
                                : facultyApi.getFacultyPhotoUrl(staff.id, staff.photo?.driveFileId)
                            }
                            alt={staff.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
                          />
                        </td>

                        <td className="p-3.5">
                          <button
                            onClick={() => setViewDetailStaff(staff)}
                            className="font-extrabold text-slate-900 dark:text-white hover:text-[#00A651] transition text-left block"
                          >
                            {staff.name}
                          </button>
                        </td>

                        <td className="p-3.5 font-bold text-slate-700 dark:text-slate-300">
                          {staff.designation}
                        </td>

                        <td className="p-3.5">
                          <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-[10px] rounded-lg inline-block">
                            {staff.departmentName}
                          </span>
                        </td>

                        <td className="p-3.5 font-semibold text-slate-700 dark:text-slate-300">
                          {staff.qualification}
                        </td>

                        <td className="p-3.5 space-y-0.5 text-2xs">
                          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[140px]">{staff.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-500">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{staff.phone}</span>
                          </div>
                        </td>

                        <td className="p-3.5 font-mono text-[10px] text-slate-500">
                          {staff.registrationNumber || 'N/A'}
                        </td>

                        <td className="p-3.5 text-slate-500 font-medium">
                          {staff.joiningDate || '2020-08-01'}
                        </td>

                        <td className="p-3.5 text-slate-500 font-medium font-mono text-2xs">
                          {staff.promotionDate || '—'}
                        </td>

                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-0.5 text-[10px] font-black rounded-full ${
                              staff.status === 'Active'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}
                          >
                            {staff.status}
                          </span>
                        </td>

                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenViewModal(staff)}
                              className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                              title="View Full Profile"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {isAuthorized && (
                              <>
                                <button
                                  onClick={() => handleOpenEditModal(staff)}
                                  className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg cursor-pointer"
                                  title="Edit Faculty Member"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmTarget({ id: staff.id })}
                                  className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg cursor-pointer"
                                  title="Remove Faculty Member"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* VIEW 2: FACULTY CARDS GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {staffData.data.map((staff) => {
            const isSelected = selectedIds.includes(staff.id);
            return (
              <Card
                key={staff.id}
                className={`p-5 space-y-4 border transition rounded-3xl relative ${
                  isSelected
                    ? 'ring-2 ring-emerald-400 border-emerald-500 bg-emerald-50/10'
                    : 'border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  {isAuthorized && (
                    <button onClick={() => toggleSelectOne(staff.id)} className="mt-1 text-slate-400">
                      {isSelected ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4" />}
                    </button>
                  )}

                  <img
                    src={
                      staff.photoUrl && !staff.photoUrl.startsWith('blob:')
                        ? staff.photoUrl
                        : facultyApi.getFacultyPhotoUrl(staff.id, staff.photo?.driveFileId)
                    }
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

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => handleOpenViewModal(staff)}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-2xs rounded-xl flex items-center gap-1 hover:bg-slate-200 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> Details
                  </button>

                  {isAuthorized && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleOpenEditModal(staff)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-extrabold text-2xs rounded-xl flex items-center gap-1 hover:bg-blue-100 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>

                      <button
                        onClick={() => setDeleteConfirmTarget({ id: staff.id })}
                        className="px-3 py-1.5 bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 font-extrabold text-2xs rounded-xl flex items-center gap-1 hover:bg-rose-100 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination Bar */}
      {staffData.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 gap-3">
          <span className="text-xs text-slate-500 font-medium">
            Showing Page <strong className="text-slate-900 dark:text-white">{staffData.page}</strong> of{' '}
            <strong className="text-slate-900 dark:text-white">{staffData.totalPages}</strong> ({staffData.total} faculty records)
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-40 transition cursor-pointer"
            >
              Previous
            </button>
            <span className="text-xs font-black px-2 text-slate-600 dark:text-slate-300">{page}</span>
            <button
              disabled={page >= staffData.totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-40 transition cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* MODAL 1: Add / Edit Faculty Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full my-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-[#002147] dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                {editingStaff.id ? 'Edit Faculty Profile' : 'Add New Faculty Member'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Samuel Roy"
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
                  <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 mb-1">Designation *</label>
                  <input
                    type="text"
                    placeholder="e.g. Professor & HOD, Associate Professor..."
                    value={editingStaff.designation || ''}
                    onChange={(e) => setEditingStaff({ ...editingStaff, designation: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 mb-1">Qualification *</label>
                  <input
                    type="text"
                    placeholder="e.g. M.D. (Hom.), B.H.M.S..."
                    value={editingStaff.qualification || ''}
                    onChange={(e) => setEditingStaff({ ...editingStaff, qualification: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    placeholder="faculty@bhmch.ac.in"
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
                    placeholder="+91 98300 00000"
                    value={editingStaff.phone || ''}
                    onChange={(e) => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 mb-1">Registration No (Optional)</label>
                  <input
                    type="text"
                    placeholder="WB-NCH-2020-001"
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
                  <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 mb-1">Promotion Date</label>
                  <input
                    type="date"
                    value={editingStaff.promotionDate || ''}
                    onChange={(e) => setEditingStaff({ ...editingStaff, promotionDate: e.target.value })}
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
                <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 mb-1">Faculty Photo URL or Upload</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://..."
                    value={editingStaff.photoUrl || ''}
                    onChange={(e) => setEditingStaff({ ...editingStaff, photoUrl: e.target.value })}
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    disabled={isUploadingPhoto}
                  />
                  <label className={`px-3 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl flex items-center gap-1.5 ${isUploadingPhoto ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                    <Upload className="w-4 h-4" />
                    Upload
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handlePhotoUpload}
                      disabled={isUploadingPhoto}
                      className="hidden"
                    />
                  </label>
                </div>
                {selectedPhotoFile && (
                  <p className="mt-1 text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Photo selected: {selectedPhotoFile.name} (Will upload to Google Drive on save)
                  </p>
                )}
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 mb-1">Academic Biography & Clinical Background</label>
                <textarea
                  rows={2}
                  placeholder="Academic qualifications, specialization, clinical experience..."
                  value={editingStaff.biography || ''}
                  onChange={(e) => setEditingStaff({ ...editingStaff, biography: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  disabled={isUploadingPhoto}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isUploadingPhoto}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    console.log('[FACULTY EDIT] SAVE BUTTON CLICKED DIRECTLY VIA ONCLICK');
                    void handleSaveStaff(e);
                  }}
                  disabled={isSaving || isUploadingPhoto}
                  className="px-5 py-2 bg-[#00A651] hover:bg-emerald-600 text-white font-extrabold rounded-xl shadow-md flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSaving || isUploadingPhoto ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving Record...
                    </>
                  ) : (
                    'Save Faculty Record'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Transfer Department Modal */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-extrabold text-[#002147] dark:text-white flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-blue-600" /> Transfer Faculty Between Departments
            </h3>
            <p className="text-xs text-slate-500">
              Transfer {selectedIds.length} selected faculty member(s) to a new academic department. Their profile and records will automatically move to the target department page.
            </p>

            <div>
              <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 mb-1">Target Department</label>
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

      {/* MODAL 3: Delete Confirmation Modal */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-600">
              <Trash2 className="w-6 h-6" />
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Confirm Removal</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {deleteConfirmTarget.bulk
                ? `Are you sure you want to remove ${selectedIds.length} selected faculty member(s) from the institutional directory?`
                : 'Are you sure you want to remove this faculty member?'}
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

      {/* MODAL 4: Faculty Details Profile Modal */}
      {viewDetailStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 max-w-lg w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setViewDetailStaff(null)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              <img
                src={
                  viewDetailStaff.photoUrl && !viewDetailStaff.photoUrl.startsWith('blob:')
                    ? viewDetailStaff.photoUrl
                    : facultyApi.getFacultyPhotoUrl(viewDetailStaff.id, viewDetailStaff.photo?.driveFileId)
                }
                alt={viewDetailStaff.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-[#00A651] shadow-md shrink-0"
              />
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-[#00A651] font-extrabold text-[10px] rounded-full uppercase">
                  {viewDetailStaff.departmentName}
                </span>
                <h3 className="text-lg font-extrabold text-[#002147] dark:text-white leading-tight">
                  {viewDetailStaff.name}
                </h3>
                <p className="text-xs font-bold text-emerald-600">{viewDetailStaff.designation}</p>
                <p className="text-2xs text-slate-500 font-semibold">{viewDetailStaff.qualification}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-2 text-xs text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <a href={`mailto:${viewDetailStaff.email}`} className="hover:underline font-medium">{viewDetailStaff.email}</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                <a href={`tel:${viewDetailStaff.phone}`} className="hover:underline">{viewDetailStaff.phone}</a>
              </div>
              {viewDetailStaff.registrationNumber && (
                <div className="flex items-center gap-2 font-mono text-2xs text-slate-500">
                  <Award className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Registration Number: {viewDetailStaff.registrationNumber}</span>
                </div>
              )}
              {viewDetailStaff.joiningDate && (
                <div className="flex items-center gap-2 text-2xs text-slate-500">
                  <Calendar className="w-4 h-4 text-purple-500 shrink-0" />
                  <span>Joining Date: {viewDetailStaff.joiningDate}</span>
                </div>
              )}
              {viewDetailStaff.promotionDate && (
                <div className="flex items-center gap-2 text-2xs text-slate-500">
                  <Award className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Promotion Date: {viewDetailStaff.promotionDate}</span>
                </div>
              )}
            </div>

            {viewDetailStaff.biography && (
              <div className="space-y-1">
                <h4 className="text-2xs font-extrabold uppercase text-slate-400">Academic & Clinical Profile</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  {viewDetailStaff.biography}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewDetailStaff(null)}
                className="px-5 py-2 bg-[#002147] text-white text-xs font-bold rounded-xl"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
