import React, { useState, useMemo } from 'react';
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
  Briefcase,
  FileText
} from 'lucide-react';
import {
  hospitalStaffService,
  HospitalStaffMember,
  StaffRoleCategory
} from '../../../services/hospitalStaffService';
import { useAuth } from '../../../hooks/useAuth';

export const HospitalStaffDirectory: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_SUPER_ADMIN' || user?.role === 'ROLE_HOSPITAL_STAFF';

  // State
  const [staffList, setStaffList] = useState<HospitalStaffMember[]>(() => hospitalStaffService.getAllStaff());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleCategory, setSelectedRoleCategory] = useState<string>('ALL');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [selectedDesignation, setSelectedDesignation] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [showAdminControls, setShowAdminControls] = useState<boolean>(isAdmin);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<HospitalStaffMember | null>(null);
  const [deletingStaffId, setDeletingStaffId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<Omit<HospitalStaffMember, 'id'>>({
    slNo: 44,
    empId: 'SL-44',
    name: '',
    roleCategory: 'MEDICAL_STAFF',
    department: 'MEDICAL STAFF (HOSPITAL SECTION)',
    designation: '',
    status: 'ACTIVE'
  });

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const refreshStaff = () => {
    setStaffList(hospitalStaffService.getAllStaff());
  };

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
        if (!matchesSlNo && !matchesName && !matchesEmpId && !matchesDept && !matchesDesig) {
          return false;
        }
      }
      return true;
    });
  }, [staffList, selectedRoleCategory, selectedDepartment, selectedDesignation, searchQuery]);

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
    const nextSl = (Math.max(...staffList.map((s) => s.slNo || 0), 0)) + 1;
    setFormData({
      slNo: nextSl,
      empId: `SL-${nextSl}`,
      name: '',
      roleCategory: 'MEDICAL_STAFF',
      department: 'MEDICAL STAFF (HOSPITAL SECTION)',
      designation: '',
      status: 'ACTIVE'
    });
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
      joiningYear: member.joiningYear
    });
    setIsAddModalOpen(true);
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter staff name.');
      return;
    }
    if (!formData.designation.trim()) {
      alert('Please enter designation.');
      return;
    }

    if (editingStaff) {
      hospitalStaffService.updateStaffMember(editingStaff.id, formData);
      showNotification(`Staff record updated for ${formData.name}`);
    } else {
      hospitalStaffService.addStaffMember(formData);
      showNotification(`New staff member ${formData.name} added successfully.`);
    }

    setIsAddModalOpen(false);
    refreshStaff();
  };

  const handleDeleteStaff = (id: string, name: string) => {
    hospitalStaffService.deleteStaffMember(id);
    showNotification(`Staff record for ${name} deleted successfully.`);
    setDeletingStaffId(null);
    refreshStaff();
  };

  const handleResetDefault = () => {
    if (window.confirm('Reset hospital staff directory to the official 43 PDF records?')) {
      hospitalStaffService.resetToDefault();
      refreshStaff();
      showNotification('Hospital staff directory reset to the official 43 PDF records.');
    }
  };

  const getRoleCategoryBadge = (category: StaffRoleCategory) => {
    switch (category) {
      case 'MEDICAL_STAFF':
        return <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">Medical Staff</span>;
      case 'OFFICE_STAFF':
        return <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-md bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">Office Staff</span>;
      case 'PARAMEDICAL_STAFF':
        return <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-md bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800">Para - Medical Staff</span>;
      case 'NON_MEDICAL_STAFF':
        return <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">Non - Medical Staff</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#002147] text-white rounded-2xl shadow-2xl border border-emerald-500/50 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-3xl bg-[#002147] text-white p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 opacity-10 pointer-events-none">
          <Users className="w-96 h-96 text-white" />
        </div>

        <div className="relative z-10 space-y-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-black rounded-full uppercase tracking-wider border border-emerald-500/30">
              Official Document Record
            </span>
            <span className="px-3.5 py-1 bg-blue-500/20 text-blue-300 text-xs font-black rounded-full uppercase tracking-wider border border-blue-500/30">
              Complete Hospital Staff Directory (43 Records)
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Burdwan Homoeopathic Medical College & Hospital
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Official staff roster of Medical, Para-Medical, Office, and Non-Medical personnel serving the Hospital Section.
          </p>

          {/* Quick Stats Pills */}
          <div className="pt-2 flex flex-wrap gap-2 sm:gap-3 text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center gap-2">
              <FileText className="w-4 h-4 text-white" />
              <span>Total Staff Records: <strong className="text-white">{counts.all}</strong></span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-emerald-400" />
              <span>Medical Staff: <strong className="text-white">{counts.medical}</strong></span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-purple-400" />
              <span>Para-Medical Staff: <strong className="text-white">{counts.paramedical}</strong></span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>Office Staff: <strong className="text-white">{counts.office}</strong></span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Non-Medical Staff: <strong className="text-white">{counts.nonmedical}</strong></span>
            </div>
          </div>
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
            <Stethoscope className="w-3.5 h-3.5" />
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
            <UserCheck className="w-3.5 h-3.5" />
            Para - Medical Staff ({counts.paramedical})
          </button>
          <button
            onClick={() => setSelectedRoleCategory('OFFICE_STAFF')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
              selectedRoleCategory === 'OFFICE_STAFF'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
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

        {/* View Mode & Admin Controls Toggle */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('table')}
              title="Table View (Official Layout)"
              className={`p-1.5 rounded-lg transition ${viewMode === 'table' ? 'bg-white dark:bg-slate-900 shadow text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              title="Grid View"
              className={`p-1.5 rounded-lg transition ${viewMode === 'grid' ? 'bg-white dark:bg-slate-900 shadow text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowAdminControls(!showAdminControls)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition flex items-center gap-1.5 ${
                showAdminControls
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              {showAdminControls ? 'Admin Editing On' : 'Enable Admin Edit'}
            </button>
          )}

          {isAdmin && showAdminControls && (
            <button
              onClick={handleOpenAdd}
              className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Staff</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-slate-50 dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by SL No, staff name, department, designation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-3 py-2 bg-white dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none"
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
              className="w-full px-3 py-2 bg-white dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none"
            >
              <option value="ALL">All Designations ({designations.length})</option>
              {designations.map((des, idx) => (
                <option key={idx} value={des}>
                  {des}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Summary & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-2xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800">
          <div>
            Showing <strong className="text-slate-900 dark:text-white font-bold">{filteredStaff.length}</strong> of {staffList.length} staff records
            {(selectedRoleCategory !== 'ALL' || selectedDepartment !== 'ALL' || selectedDesignation !== 'ALL' || searchQuery) && (
              <span className="ml-2 text-blue-600 dark:text-blue-400 font-semibold">(Filtered)</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {(selectedRoleCategory !== 'ALL' || selectedDepartment !== 'ALL' || selectedDesignation !== 'ALL' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedRoleCategory('ALL');
                  setSelectedDepartment('ALL');
                  setSelectedDesignation('ALL');
                  setSearchQuery('');
                }}
                className="text-xs text-rose-600 dark:text-rose-400 font-bold hover:underline"
              >
                Clear Filters
              </button>
            )}

            {showAdminControls && (
              <button
                onClick={handleResetDefault}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
                title="Reset to official 43 PDF records"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Directory
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Staff Display */}
      {filteredStaff.length === 0 ? (
        <div className="p-12 text-center bg-slate-50 dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
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
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-[#002147] text-white text-xs font-bold rounded-xl"
          >
            Show All Hospital Staff (43 Records)
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW (Matching Official Document Structure) */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#002147] text-white text-2xs uppercase tracking-wider font-extrabold border-b border-slate-800">
                  <th className="p-4 w-20 text-center">SL NO.</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Staff Name</th>
                  <th className="p-4">Designation</th>
                  <th className="p-4">Category</th>
                  {isAdmin && showAdminControls && <th className="p-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                    <td className="p-4 text-center font-black text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/50">
                      #{staff.slNo}
                    </td>

                    <td className="p-4">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                        {staff.department}
                      </span>
                    </td>

                    <td className="p-4 font-bold text-slate-900 dark:text-white text-sm">
                      {staff.name}
                    </td>

                    <td className="p-4 font-extrabold text-blue-700 dark:text-blue-300 text-xs">
                      {staff.designation}
                    </td>

                    <td className="p-4">
                      {getRoleCategoryBadge(staff.roleCategory)}
                    </td>

                    {isAdmin && showAdminControls && (
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(staff)}
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition"
                            title="Edit Record"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingStaffId(staff.id)}
                            className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((staff) => (
            <div
              key={staff.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-4 shadow-xs hover:shadow-md transition relative flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      SL NO. #{staff.slNo}
                    </span>
                    <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                      {staff.name}
                    </h3>
                  </div>
                  <div>
                    {getRoleCategoryBadge(staff.roleCategory)}
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Designation</span>
                    <p className="font-extrabold text-blue-600 dark:text-blue-400 text-xs">
                      {staff.designation}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Department</span>
                    <p className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                      {staff.department}
                    </p>
                  </div>
                </div>
              </div>

              {isAdmin && showAdminControls && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-1">
                  <button
                    onClick={() => handleOpenEdit(staff)}
                    className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition"
                    title="Edit Record"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingStaffId(staff.id)}
                    className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition"
                    title="Delete Record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {editingStaff ? `Edit Staff Member: ${editingStaff.name}` : 'Add New Hospital Staff Member'}
                </h3>
                <p className="text-xs text-slate-500">Official hospital personnel roster management</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">SL NO.</label>
                  <input
                    type="number"
                    required
                    value={formData.slNo || ''}
                    onChange={(e) => setFormData({ ...formData, slNo: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Staff Category</label>
                  <select
                    value={formData.roleCategory}
                    onChange={(e) => setFormData({ ...formData, roleCategory: e.target.value as StaffRoleCategory })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  >
                    <option value="MEDICAL_STAFF">Medical Staff</option>
                    <option value="PARAMEDICAL_STAFF">Para - Medical Staff</option>
                    <option value="OFFICE_STAFF">Office Staff</option>
                    <option value="NON_MEDICAL_STAFF">Non - Medical Staff</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Staff Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DR. SUSMITA CHATTERJEE."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                >
                  <option value="MEDICAL STAFF (HOSPITAL SECTION)">MEDICAL STAFF (HOSPITAL SECTION)</option>
                  <option value="PARA - MEDICAL STAFF (HOSPITAL SECTION)">PARA - MEDICAL STAFF (HOSPITAL SECTION)</option>
                  <option value="OFFICE STAFF (HOSPITAL SECTION)">OFFICE STAFF (HOSPITAL SECTION)</option>
                  <option value="NON - MEDICAL STAFF (HOSPITAL SECTION)">NON - MEDICAL STAFF (HOSPITAL SECTION)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Designation</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUPERINTENDENT / STAFF NURSE."
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#002147] hover:bg-[#001530] text-white font-bold rounded-xl text-xs shadow-md"
                >
                  {editingStaff ? 'Update Staff Member' : 'Save Staff Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingStaffId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-7 h-7 shrink-0" />
              <h3 className="text-base font-black">Confirm Staff Record Removal</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to delete this staff member record from the official hospital directory?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingStaffId(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const target = staffList.find((s) => s.id === deletingStaffId);
                  if (target) handleDeleteStaff(target.id, target.name);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
