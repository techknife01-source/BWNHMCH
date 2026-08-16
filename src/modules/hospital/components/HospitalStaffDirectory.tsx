import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Users,
  Stethoscope,
  Building2,
  Phone,
  Mail,
  Plus,
  Edit2,
  Trash2,
  Clock,
  ShieldCheck,
  RotateCcw,
  LayoutGrid,
  List,
  CheckCircle2,
  UserCheck,
  AlertCircle,
  X,
  BadgeCheck,
  Award,
  Eye,
  Lock,
  CheckSquare,
  Square,
  Download,
  Calendar,
  FileSpreadsheet,
  ArrowRightLeft,
  Table as TableIcon
} from 'lucide-react';
import {
  hospitalStaffService,
  HospitalStaffMember,
  StaffRoleCategory
} from '../../../services/hospitalStaffService';
import { staffApi } from '../../../services/api/staff.api';
import { useAuth } from '../../../contexts/AuthContext';
import { isSuperAdmin, isAdmin, isPrincipal, isVicePrincipal } from '../../../utils/permissionHelper';
import toast from 'react-hot-toast';

export const HospitalStaffDirectory: React.FC = () => {
  const { user } = useAuth();
  
  // Authorized roles matching reference Faculty/Doctor implementation
  const isAuthorized = isSuperAdmin(user) || isAdmin(user) || isPrincipal(user) || isVicePrincipal(user);

  // State
  const [staffList, setStaffList] = useState<HospitalStaffMember[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleCategory, setSelectedRoleCategory] = useState<string>('ALL');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [selectedDesignation, setSelectedDesignation] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [showAdminControls, setShowAdminControls] = useState<boolean>(isAuthorized);

  // Selection & Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<HospitalStaffMember | null>(null);
  const [deletingStaffTarget, setDeletingStaffTarget] = useState<{ id?: string; bulk?: boolean } | null>(null);
  const [viewDetailStaff, setViewDetailStaff] = useState<HospitalStaffMember | null>(null);

  // Photo & Saving state
  const [isSaving, setIsSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<Omit<HospitalStaffMember, 'id'>>({
    slNo: 1,
    empId: 'SL-1',
    name: '',
    roleCategory: 'MEDICAL_STAFF',
    department: 'MEDICAL STAFF (HOSPITAL SECTION)',
    designation: '',
    qualification: '',
    email: '',
    contactNumber: '',
    registrationNumber: '',
    joiningDate: '',
    promotionDate: '',
    status: 'ACTIVE',
    biography: ''
  });

  const refreshStaff = async () => {
    const list = await hospitalStaffService.fetchStaffAsync();
    setStaffList(list);
  };

  useEffect(() => {
    refreshStaff();
  }, []);

  // Reset pagination on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedRoleCategory, selectedDepartment, selectedDesignation, selectedStatus]);

  // Derive unique departments & designations for filters
  const departments = useMemo(() => {
    const set = new Set<string>();
    staffList.forEach((s) => s.department && set.add(s.department));
    return Array.from(set).sort();
  }, [staffList]);

  const designations = useMemo(() => {
    const set = new Set<string>();
    staffList.forEach((s) => s.designation && set.add(s.designation));
    return Array.from(set).sort();
  }, [staffList]);

  // Filtered staff list
  const filteredStaff = useMemo(() => {
    return staffList.filter((s) => {
      // Public Mode: ONLY show Active Staff unless Admin
      if ((!isAuthorized || !showAdminControls) && s.status === 'INACTIVE') {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'ALL' && s.status !== selectedStatus) {
        return false;
      }
      // Role / Category filter
      if (selectedRoleCategory !== 'ALL' && s.roleCategory !== selectedRoleCategory) {
        return false;
      }
      // Department filter
      if (selectedDepartment !== 'ALL' && s.department !== selectedDepartment) {
        return false;
      }
      // Designation filter
      if (selectedDesignation !== 'ALL' && s.designation !== selectedDesignation) {
        return false;
      }
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSlNo = s.slNo?.toString() === q || `sl-${s.slNo}`.includes(q) || `sl${s.slNo}`.includes(q);
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesEmpId = s.empId.toLowerCase().includes(q);
        const matchesDept = s.department.toLowerCase().includes(q);
        const matchesDesig = s.designation.toLowerCase().includes(q);
        const matchesQual = (s.qualification || '').toLowerCase().includes(q);
        const matchesEmail = (s.email || '').toLowerCase().includes(q);
        const matchesReg = (s.registrationNumber || '').toLowerCase().includes(q);

        if (
          !matchesSlNo &&
          !matchesName &&
          !matchesEmpId &&
          !matchesDept &&
          !matchesDesig &&
          !matchesQual &&
          !matchesEmail &&
          !matchesReg
        ) {
          return false;
        }
      }
      return true;
    });
  }, [staffList, selectedRoleCategory, selectedDepartment, selectedDesignation, selectedStatus, searchQuery, isAuthorized, showAdminControls]);

  // Paginated Staff List
  const paginatedStaff = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStaff.slice(start, start + pageSize);
  }, [filteredStaff, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredStaff.length / pageSize) || 1;

  // Selection Logic
  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedStaff.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedStaff.map((s) => s.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Counts by Category
  const counts = useMemo(() => {
    return {
      all: staffList.length,
      medical: staffList.filter((s) => s.roleCategory === 'MEDICAL_STAFF').length,
      office: staffList.filter((s) => s.roleCategory === 'OFFICE_STAFF').length,
      paramedical: staffList.filter((s) => s.roleCategory === 'PARAMEDICAL_STAFF').length,
      nonmedical: staffList.filter((s) => s.roleCategory === 'NON_MEDICAL_STAFF').length,
    };
  }, [staffList]);

  // Handlers
  const handleOpenAdd = () => {
    const nextSl = Math.max(...staffList.map((s) => s.slNo || 0), 0) + 1;
    setFormData({
      slNo: nextSl,
      empId: `SL-${nextSl}`,
      name: '',
      roleCategory: 'MEDICAL_STAFF',
      department: 'MEDICAL STAFF (HOSPITAL SECTION)',
      designation: '',
      qualification: '',
      contactNumber: '',
      email: '',
      registrationNumber: '',
      joiningDate: new Date().toISOString().split('T')[0],
      promotionDate: '',
      status: 'ACTIVE',
      biography: ''
    });
    setPhotoFile(null);
    setEditingStaff(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (member: HospitalStaffMember) => {
    setEditingStaff(member);
    setFormData({
      slNo: member.slNo,
      empId: member.empId,
      name: member.name,
      roleCategory: member.roleCategory,
      department: member.department,
      designation: member.designation,
      qualification: member.qualification || '',
      contactNumber: member.contactNumber || '',
      email: member.email || '',
      photoUrl: member.photoUrl || '',
      availability: member.availability || 'AVAILABLE',
      dutyShift: member.dutyShift || '',
      opdCounter: member.opdCounter || '',
      status: member.status,
      joiningYear: member.joiningYear,
      joiningDate: member.joiningDate || (member.joiningYear ? `01-08-${member.joiningYear}` : ''),
      promotionDate: member.promotionDate || '',
      specialization: member.specialization || '',
      experience: member.experience || '',
      registrationNumber: member.registrationNumber || '',
      biography: member.biography || '',
    });
    setPhotoFile(null);
    setIsAddModalOpen(true);
  };

  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Staff name is required');
      return;
    }

    setIsSaving(true);
    try {
      if (editingStaff) {
        await hospitalStaffService.updateStaffMemberAsync(editingStaff.id, formData);

        if (photoFile) {
          await staffApi.uploadStaffPhoto(editingStaff.id, photoFile);
        }

        toast.success(`Staff record for '${formData.name}' updated successfully.`);
      } else {
        const newStaff = await hospitalStaffService.addStaffMemberAsync(formData);

        if (photoFile && newStaff?.id) {
          await staffApi.uploadStaffPhoto(newStaff.id, photoFile);
        }

        toast.success(`Staff member '${formData.name}' added successfully.`);
      }

      setIsAddModalOpen(false);
      setEditingStaff(null);
      setPhotoFile(null);
      await refreshStaff();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save staff record.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingStaffTarget) return;

    try {
      if (deletingStaffTarget.bulk && selectedIds.length > 0) {
        for (const id of selectedIds) {
          await hospitalStaffService.deleteStaffMemberAsync(id);
        }
        toast.success(`${selectedIds.length} staff records deleted successfully.`);
        setSelectedIds([]);
      } else if (deletingStaffTarget.id) {
        const targetMember = staffList.find((s) => s.id === deletingStaffTarget.id);
        await hospitalStaffService.deleteStaffMemberAsync(deletingStaffTarget.id);
        toast.success(`Staff record for '${targetMember?.name || 'staff member'}' deleted.`);
      }
      setDeletingStaffTarget(null);
      await refreshStaff();
    } catch (err: any) {
      toast.error(err?.message || 'Deletion failed.');
    }
  };

  const handleBulkStatus = async (newStatus: 'ACTIVE' | 'INACTIVE') => {
    if (selectedIds.length === 0) return;
    try {
      for (const id of selectedIds) {
        await hospitalStaffService.updateStaffMemberAsync(id, { status: newStatus });
      }
      toast.success(`${selectedIds.length} staff status updated to ${newStatus}.`);
      setSelectedIds([]);
      await refreshStaff();
    } catch (err: any) {
      toast.error('Bulk status update failed.');
    }
  };

  const handleExportCSV = () => {
    const itemsToExport = selectedIds.length > 0 
      ? staffList.filter((s) => selectedIds.includes(s.id))
      : filteredStaff;

    const headers = ['SL No', 'Emp ID', 'Name', 'Role Category', 'Department', 'Designation', 'Qualification', 'Email', 'Phone', 'Reg No', 'Joining Date', 'Status'];
    const rows = itemsToExport.map((s) => [
      s.slNo,
      s.empId,
      `"${s.name}"`,
      s.roleCategory,
      `"${s.department}"`,
      `"${s.designation}"`,
      `"${s.qualification || ''}"`,
      s.email || '',
      s.contactNumber || '',
      s.registrationNumber || '',
      s.joiningDate || '',
      s.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Hospital_Staff_Directory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetDefault = async () => {
    if (window.confirm('Reset staff directory to the official hospital records?')) {
      hospitalStaffService.resetToDefault();
      toast.success('Directory reset to official records.');
      await refreshStaff();
    }
  };

  const getRoleCategoryBadge = (category: StaffRoleCategory) => {
    switch (category) {
      case 'MEDICAL_STAFF':
        return (
          <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-[10px] rounded-full uppercase border border-emerald-200 dark:border-emerald-800">
            Medical Staff
          </span>
        );
      case 'PARAMEDICAL_STAFF':
        return (
          <span className="px-2.5 py-0.5 bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-extrabold text-[10px] rounded-full uppercase border border-purple-200 dark:border-purple-800">
            Para-Medical Staff
          </span>
        );
      case 'OFFICE_STAFF':
        return (
          <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-extrabold text-[10px] rounded-full uppercase border border-blue-200 dark:border-blue-800">
            Office Staff
          </span>
        );
      case 'NON_MEDICAL_STAFF':
        return (
          <span className="px-2.5 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-extrabold text-[10px] rounded-full uppercase border border-amber-200 dark:border-amber-800">
            Non-Medical Staff
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-800 font-bold text-[10px] rounded-full uppercase">
            Staff
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#002147] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-2xs font-black uppercase tracking-wider rounded-full border border-emerald-500/30">
              Official Hospital Directory
            </span>
            <span className="text-2xs text-blue-200 font-bold">• Burdwan Homoeopathic Medical College & Hospital</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Doctor & Hospital Staff Management
          </h2>
          <p className="text-xs text-blue-200 max-w-2xl">
            Official personnel roster managing Medical Officers, Paramedical Technicians, Office Personnel, and Non-Medical Hospital Staff with complete qualifications, registrations, and status records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 z-10 shrink-0">
          {isAuthorized ? (
            <>
              <button
                onClick={handleOpenAdd}
                className="px-4 py-2.5 bg-[#00A651] hover:bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Staff Member
              </button>
              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl transition flex items-center gap-1.5 cursor-pointer backdrop-blur-sm border border-white/20"
              >
                <Download className="w-4 h-4 text-emerald-400" /> Export CSV
              </button>
            </>
          ) : (
            <div className="px-3.5 py-2 bg-amber-500/20 text-amber-200 border border-amber-500/30 rounded-2xl text-xs font-bold flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-300" />
              <span>Public Directory View Mode</span>
            </div>
          )}
        </div>
      </div>

      {/* Role Category Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedRoleCategory('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
              selectedRoleCategory === 'ALL'
                ? 'bg-[#002147] text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Staff ({counts.all})
          </button>
          <button
            onClick={() => setSelectedRoleCategory('MEDICAL_STAFF')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
              selectedRoleCategory === 'MEDICAL_STAFF'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
            }`}
          >
            <div className="w-3.5 h-3.5" />
            Medical Staff ({counts.medical})
          </button>
          <button
            onClick={() => setSelectedRoleCategory('PARAMEDICAL_STAFF')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
              selectedRoleCategory === 'PARAMEDICAL_STAFF'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100'
            }`}
          >
            <div className="w-3.5 h-3.5" />
            Para-Medical Staff ({counts.paramedical})
          </button>
          <button
            onClick={() => setSelectedRoleCategory('OFFICE_STAFF')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
              selectedRoleCategory === 'OFFICE_STAFF'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100'
            }`}
          >
            <div className="w-3.5 h-3.5" />
            Office Staff ({counts.office})
          </button>
          <button
            onClick={() => setSelectedRoleCategory('NON_MEDICAL_STAFF')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
              selectedRoleCategory === 'NON_MEDICAL_STAFF'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Non - Medical Staff ({counts.nonmedical})
          </button>
        </div>

        {/* View Mode & Admin Toggle */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-[#002147] dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" /> Table
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white dark:bg-slate-700 text-[#002147] dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Cards
            </button>
          </div>

          {isAuthorized && (
            <button
              onClick={() => setShowAdminControls(!showAdminControls)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition flex items-center gap-1.5 ${
                showAdminControls
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              {showAdminControls ? 'Admin Controls Active' : 'Enable Controls'}
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, designation, department, qualification, email, reg no..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#00A651]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
            >
              <option value="ALL">All Departments ({departments.length})</option>
              {departments.map((d, idx) => (
                <option key={idx} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Designation Filter */}
          <div>
            <select
              value={selectedDesignation}
              onChange={(e) => setSelectedDesignation(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
            >
              <option value="ALL">All Designations ({designations.length})</option>
              {designations.map((des, idx) => (
                <option key={idx} value={des}>
                  {des}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        {/* Filter Summary & Bulk Actions Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-2xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800">
          <div>
            Showing <strong className="text-slate-900 dark:text-white font-bold">{filteredStaff.length}</strong> of {staffList.length} staff records
            {(selectedRoleCategory !== 'ALL' || selectedDepartment !== 'ALL' || selectedDesignation !== 'ALL' || selectedStatus !== 'ALL' || searchQuery) && (
              <span className="ml-2 text-blue-600 dark:text-blue-400 font-semibold">(Filtered)</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {(selectedRoleCategory !== 'ALL' || selectedDepartment !== 'ALL' || selectedDesignation !== 'ALL' || selectedStatus !== 'ALL' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedRoleCategory('ALL');
                  setSelectedDepartment('ALL');
                  setSelectedDesignation('ALL');
                  setSelectedStatus('ALL');
                  setSearchQuery('');
                }}
                className="text-xs text-rose-600 dark:text-rose-400 font-bold hover:underline"
              >
                Clear Filters
              </button>
            )}

            {isAuthorized && showAdminControls && (
              <button
                onClick={handleResetDefault}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
                title="Reset to official records"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Directory
              </button>
            )}
          </div>
        </div>

        {/* Bulk Action Bar */}
        {isAuthorized && selectedIds.length > 0 && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-emerald-50/60 dark:bg-emerald-950/30 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800">
            <span className="text-xs font-black text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-600" />
              {selectedIds.length} staff member(s) selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleBulkStatus('ACTIVE')}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-2xs rounded-xl cursor-pointer transition shadow-xs"
              >
                Set Active
              </button>
              <button
                onClick={() => handleBulkStatus('INACTIVE')}
                className="px-3.5 py-1.5 bg-slate-700 hover:bg-slate-800 text-white font-bold text-2xs rounded-xl cursor-pointer transition shadow-xs"
              >
                Set Inactive
              </button>
              <button
                onClick={() => setDeletingStaffTarget({ bulk: true })}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-2xs rounded-xl flex items-center gap-1 cursor-pointer transition shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Staff Display */}
      {filteredStaff.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
          <Users className="w-12 h-12 mx-auto text-slate-400" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No staff members match your filter criteria</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search query, department, or designation filter settings.
          </p>
          <button
            onClick={() => {
              setSelectedRoleCategory('ALL');
              setSelectedDepartment('ALL');
              setSelectedDesignation('ALL');
              setSelectedStatus('ALL');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-[#002147] text-white text-xs font-bold rounded-xl"
          >
            Show All Hospital Staff ({staffList.length} Records)
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* REFERENCE TABLE VIEW (Matching Faculty/Doctor Management Table Architecture) */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#002147] text-white font-extrabold border-b border-slate-800">
                  {isAuthorized && (
                    <th className="p-3.5 text-center w-10">
                      <button onClick={toggleSelectAll} className="text-slate-300 hover:text-white cursor-pointer">
                        {selectedIds.length > 0 && selectedIds.length === paginatedStaff.length ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                  )}
                  <th className="p-3.5 w-16">Photo</th>
                  <th className="p-3.5">Staff Name</th>
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
                {paginatedStaff.map((staff) => {
                  const isSelected = selectedIds.includes(staff.id);
                  const photoSrc = staff.photoUrl || staffApi.getStaffPhotoUrl(staff.id);
                  return (
                    <tr
                      key={staff.id}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition ${
                        isSelected ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''
                      }`}
                    >
                      {isAuthorized && (
                        <td className="p-3.5 text-center">
                          <button onClick={() => toggleSelectOne(staff.id)} className="text-slate-400 cursor-pointer">
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      )}

                      <td className="p-3.5">
                        {photoSrc ? (
                          <img
                            src={photoSrc}
                            alt={staff.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                              (e.target as HTMLElement).nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-10 h-10 rounded-xl bg-[#002147] text-white font-extrabold text-xs flex items-center justify-center border border-emerald-500 shadow-2xs ${
                            photoSrc ? 'hidden' : ''
                          }`}
                        >
                          {staff.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <button
                          onClick={() => setViewDetailStaff(staff)}
                          className="font-extrabold text-slate-900 dark:text-white hover:text-[#00A651] transition text-left block cursor-pointer"
                        >
                          {staff.name}
                        </button>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {staff.empId || `SL-${staff.slNo}`}
                        </span>
                      </td>

                      <td className="p-3.5 font-bold text-slate-700 dark:text-slate-300">
                        {staff.designation}
                      </td>

                      <td className="p-3.5">
                        <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-[10px] rounded-lg inline-block truncate max-w-[160px]">
                          {staff.department}
                        </span>
                      </td>

                      <td className="p-3.5 font-semibold text-slate-700 dark:text-slate-300">
                        {staff.qualification || (staff.roleCategory === 'MEDICAL_STAFF' ? 'BHMS' : '—')}
                      </td>

                      <td className="p-3.5 space-y-0.5 text-2xs">
                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[140px]">{staff.email || '—'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-500">
                          <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{staff.contactNumber || '—'}</span>
                        </div>
                      </td>

                      <td className="p-3.5 font-mono text-[10px] text-slate-500">
                        {staff.registrationNumber || '—'}
                      </td>

                      <td className="p-3.5 text-slate-500 font-medium text-2xs">
                        {staff.joiningDate || (staff.joiningYear ? `01-08-${staff.joiningYear}` : '—')}
                      </td>

                      <td className="p-3.5 text-slate-500 font-medium font-mono text-2xs">
                        {staff.promotionDate || '—'}
                      </td>

                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-0.5 text-[10px] font-black rounded-full ${
                            staff.status === 'ACTIVE'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {staff.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setViewDetailStaff(staff)}
                            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition cursor-pointer"
                            title="View Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {isAuthorized && (
                            <>
                              <button
                                onClick={() => handleOpenEdit(staff)}
                                className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition cursor-pointer"
                                title="Edit Record"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeletingStaffTarget({ id: staff.id })}
                                className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition cursor-pointer"
                                title="Delete Record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              Showing {filteredStaff.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, filteredStaff.length)} of {filteredStaff.length} staff records
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="text-2xs font-bold text-slate-400">Rows per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-2xs font-bold"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold disabled:opacity-40 hover:bg-slate-100 cursor-pointer"
                >
                  Prev
                </button>
                <span className="px-2 font-bold text-slate-700 dark:text-slate-300">
                  {currentPage} / {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold disabled:opacity-40 hover:bg-slate-100 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* REFERENCE CARDS VIEW (Matching Faculty/Doctor Management Card Architecture) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedStaff.map((staff) => {
            const isSelected = selectedIds.includes(staff.id);
            const photoSrc = staff.photoUrl || staffApi.getStaffPhotoUrl(staff.id);
            return (
              <div
                key={staff.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-4 shadow-xs hover:shadow-md transition relative flex flex-col justify-between ${
                  isSelected ? 'ring-2 ring-emerald-500 bg-emerald-50/20' : ''
                }`}
              >
                <div className="space-y-3">
                  {/* Top Bar: Checkbox, Avatar, Department & Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {isAuthorized && (
                        <button onClick={() => toggleSelectOne(staff.id)} className="text-slate-400 cursor-pointer">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      )}
                      {photoSrc ? (
                        <img
                          src={photoSrc}
                          alt={staff.name}
                          className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                            (e.target as HTMLElement).nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-12 h-12 rounded-2xl bg-[#002147] text-white font-extrabold text-sm flex items-center justify-center border border-emerald-500 shadow-xs ${
                          photoSrc ? 'hidden' : ''
                        }`}
                      >
                        {staff.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-[10px] rounded-lg">
                        {staff.department}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-[9px] font-black rounded-full ${
                          staff.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {staff.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {/* Header Title */}
                  <div>
                    <h3
                      onClick={() => setViewDetailStaff(staff)}
                      className="font-extrabold text-base text-slate-900 dark:text-white hover:text-[#00A651] transition cursor-pointer leading-snug"
                    >
                      {staff.name}
                    </h3>
                    <p className="text-xs font-extrabold text-blue-600 dark:text-blue-400">{staff.designation}</p>
                  </div>

                  {/* Detail Info Box */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-2 text-2xs text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-semibold truncate">{staff.qualification || (staff.roleCategory === 'MEDICAL_STAFF' ? 'BHMS' : '—')}</span>
                    </div>
                    {staff.email && (
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{staff.email}</span>
                      </div>
                    )}
                    {staff.contactNumber && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{staff.contactNumber}</span>
                      </div>
                    )}
                    {staff.registrationNumber && (
                      <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500">
                        <BadgeCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>Reg: {staff.registrationNumber}</span>
                      </div>
                    )}
                    {staff.joiningDate && (
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                        <span>Joined: {staff.joiningDate}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => setViewDetailStaff(staff)}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 hover:bg-slate-200 cursor-pointer"
                    title="View Profile"
                  >
                    <Eye className="w-3.5 h-3.5" /> View
                  </button>
                  {isAuthorized && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(staff)}
                        className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition cursor-pointer"
                        title="Edit Record"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingStaffTarget({ id: staff.id })}
                        className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition cursor-pointer"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: VIEW STAFF PROFILE DETAIL MODAL */}
      {viewDetailStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 max-w-lg w-full space-y-6 shadow-2xl relative">
            <button
              onClick={() => setViewDetailStaff(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              title="Close Profile"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              {viewDetailStaff.photoUrl ? (
                <img
                  src={viewDetailStaff.photoUrl}
                  alt={viewDetailStaff.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-[#002147] shadow-md shrink-0"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-[#002147] text-white font-black text-xl flex items-center justify-center shrink-0 border-2 border-emerald-500 shadow-md">
                  {viewDetailStaff.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </div>
              )}
              <div className="space-y-1.5">
                {getRoleCategoryBadge(viewDetailStaff.roleCategory)}
                <h3 className="text-lg font-black text-[#002147] dark:text-white leading-tight">
                  {viewDetailStaff.name}
                </h3>
                <p className="text-xs font-extrabold text-blue-600 dark:text-blue-400">{viewDetailStaff.designation}</p>
                <p className="text-2xs text-slate-500 font-semibold">{viewDetailStaff.department}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-2.5 text-xs text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700 pb-2">
                <span className="text-2xs font-bold text-slate-400 uppercase">Employee ID / SL</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{viewDetailStaff.empId || `SL-${viewDetailStaff.slNo}`}</span>
              </div>
              {viewDetailStaff.qualification && (
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">{viewDetailStaff.qualification}</span>
                </div>
              )}
              {viewDetailStaff.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                  <a href={`mailto:${viewDetailStaff.email}`} className="hover:underline font-medium">{viewDetailStaff.email}</a>
                </div>
              )}
              {viewDetailStaff.contactNumber && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <a href={`tel:${viewDetailStaff.contactNumber}`} className="hover:underline">{viewDetailStaff.contactNumber}</a>
                </div>
              )}
              {viewDetailStaff.registrationNumber && (
                <div className="flex items-center gap-2 font-mono text-2xs text-slate-500">
                  <BadgeCheck className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Registration No: {viewDetailStaff.registrationNumber}</span>
                </div>
              )}
              {viewDetailStaff.joiningDate && (
                <div className="flex items-center gap-2 text-2xs text-slate-500">
                  <Clock className="w-4 h-4 text-purple-500 shrink-0" />
                  <span>Joining Date: {viewDetailStaff.joiningDate}</span>
                </div>
              )}
              {viewDetailStaff.promotionDate && (
                <div className="flex items-center gap-2 text-2xs text-slate-500">
                  <Award className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Promotion Date: {viewDetailStaff.promotionDate}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-1">
                <span className="text-2xs font-bold text-slate-400 uppercase">Status</span>
                <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-full ${
                  viewDetailStaff.status === 'ACTIVE'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {viewDetailStaff.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {viewDetailStaff.biography && (
              <div className="space-y-1">
                <h4 className="text-2xs font-extrabold uppercase text-slate-400">Profile Summary</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  {viewDetailStaff.biography}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewDetailStaff(null)}
                className="px-5 py-2 bg-[#002147] text-white text-xs font-bold rounded-xl shadow-md hover:bg-blue-900 transition cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT STAFF MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {editingStaff ? `Edit Staff Member: ${editingStaff.name}` : 'Add New Hospital Staff Member'}
                </h3>
                <p className="text-xs text-slate-500">Official hospital personnel roster management</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Staff Category *</label>
                  <select
                    value={formData.roleCategory}
                    onChange={(e) => setFormData({ ...formData, roleCategory: e.target.value as StaffRoleCategory })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                  >
                    <option value="MEDICAL_STAFF">Medical Staff</option>
                    <option value="PARAMEDICAL_STAFF">Para - Medical Staff</option>
                    <option value="OFFICE_STAFF">Office Staff</option>
                    <option value="NON_MEDICAL_STAFF">Non - Medical Staff</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Staff Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DR. SUSMITA CHATTERJEE."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Designation *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SUPERINTENDENT / STAFF NURSE."
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Department *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MEDICAL STAFF (HOSPITAL SECTION)"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Qualification</label>
                  <input
                    type="text"
                    placeholder="e.g. M.D. (Hom.), B.Sc Nursing"
                    value={formData.qualification || ''}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Registration Number</label>
                  <input
                    type="text"
                    placeholder="e.g. WB-NCH-2020-042"
                    value={formData.registrationNumber || ''}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="staff@bwnhmch.ac.in"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Phone / Contact Number</label>
                  <input
                    type="text"
                    placeholder="+91 98321 00000"
                    value={formData.contactNumber || ''}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Joining Date</label>
                  <input
                    type="date"
                    value={formData.joiningDate || ''}
                    onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Promotion Date</label>
                  <input
                    type="date"
                    value={formData.promotionDate || ''}
                    onChange={(e) => setFormData({ ...formData, promotionDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Profile Summary / Remarks</label>
                <textarea
                  rows={2}
                  placeholder="Additional personnel details or responsibilities..."
                  value={formData.biography || ''}
                  onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Staff Photo Upload</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#00A651] hover:bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? 'Saving Record...' : 'Save Staff Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DELETE CONFIRMATION MODAL */}
      {deletingStaffTarget && (() => {
        const isBulk = deletingStaffTarget.bulk;
        const target = !isBulk && deletingStaffTarget.id ? staffList.find((s) => s.id === deletingStaffTarget.id) : null;
        const isDoctor = target?.roleCategory === 'MEDICAL_STAFF' || target?.name.toLowerCase().includes('dr.');
        const dialogTitle = isBulk 
          ? 'Delete Selected Members?' 
          : isDoctor 
          ? 'Delete this doctor?' 
          : 'Delete this staff member?';

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 text-rose-600">
                <AlertCircle className="w-7 h-7 shrink-0" />
                <h3 className="text-base font-black">{dialogTitle}</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {isBulk ? (
                  <>
                    Are you sure you want to delete all <strong className="text-slate-900 dark:text-white font-bold">{selectedIds.length}</strong> selected personnel records?
                  </>
                ) : (
                  <>
                    Are you sure you want to permanently delete the official staff record for{' '}
                    <strong className="text-slate-900 dark:text-white font-bold underline">
                      {target?.name || 'this member'}
                    </strong>?
                  </>
                )}
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeletingStaffTarget(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
