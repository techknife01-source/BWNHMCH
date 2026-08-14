import React, { useState, useMemo } from 'react';
import {
  hospitalCoreService,
} from '../../../services/hospitalCoreService';
import { DoctorSchedule, DoctorAvailabilityStatus } from '../../../types/hospital';
import { Card } from '../../../components/common/Card';
import { useAuth } from '../../../contexts/AuthContext';
import { canManageOpdDoctors } from '../../../utils/permissionHelper';
import {
  Stethoscope,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Clock,
  Building2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  Upload,
  Calendar,
  ToggleLeft,
  ToggleRight,
  UserCheck,
  ShieldCheck,
  Award,
  Phone,
  FileText,
  RefreshCcw,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const OpdManagementPanel: React.FC = () => {
  const { user } = useAuth();
  const isAuthorized = canManageOpdDoctors(user);

  // Doctor List State
  const [doctors, setDoctors] = useState<DoctorSchedule[]>(() => hospitalCoreService.getAllDoctors());

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals & Active State
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Partial<DoctorSchedule> | null>(null);
  const [deletingDoctorId, setDeletingDoctorId] = useState<string | null>(null);

  // Form error state
  const [formError, setFormError] = useState<string | null>(null);

  // Department List
  const departments = useMemo(() => hospitalCoreService.getDepartments(), []);

  const refreshData = () => {
    setDoctors(hospitalCoreService.getAllDoctors());
  };

  // Filtered Doctors
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      // Department
      if (departmentFilter !== 'ALL' && doc.department !== departmentFilter) return false;
      // Availability Status
      if (availabilityFilter !== 'ALL' && doc.availabilityStatus !== availabilityFilter) return false;
      // Status
      if (statusFilter !== 'ALL' && doc.status !== statusFilter) return false;
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = doc.name.toLowerCase().includes(q);
        const matchesDept = doc.department.toLowerCase().includes(q);
        const matchesSpec = (doc.specialization || '').toLowerCase().includes(q);
        const matchesRoom = (doc.roomNo || '').toLowerCase().includes(q);
        const matchesReg = (doc.registrationNumber || '').toLowerCase().includes(q);
        if (!matchesName && !matchesDept && !matchesSpec && !matchesRoom && !matchesReg) {
          return false;
        }
      }
      return true;
    });
  }, [doctors, departmentFilter, availabilityFilter, statusFilter, searchQuery]);

  // Image Upload File Handler with Validation
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file format. Please select a JPEG, PNG, WEBP, GIF, or SVG image.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error(`Image size exceeds 10MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setEditingDoctor((prev) => ({
        ...prev,
        imageUrl: event.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Handlers
  const handleOpenAddDoctor = () => {
    setFormError(null);
    setEditingDoctor({
      name: '',
      qualification: 'M.D. (Hom.)',
      department: departments[0]?.name || 'Organon of Medicine',
      designation: 'OPD Consultant Doctor',
      roomNo: 'OPD Room 101',
      opdSchedule: 'Mon - Fri (09:00 AM - 01:00 PM)',
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      isAvailable: true,
      maxDailyTokens: 30,
      imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
      specialization: 'General Homoeopathic Practice',
      dutyShift: 'Morning (9 AM - 1 PM)',
      registrationNumber: '',
      experience: '5+ Years',
      startTime: '09:00',
      endTime: '13:00',
      consultationInfo: 'Daily Consultation by Token Appointment',
      description: '',
      availabilityStatus: 'Available',
      status: 'ACTIVE',
    });
    setIsDoctorModalOpen(true);
  };

  const handleOpenEditDoctor = (doc: DoctorSchedule) => {
    setFormError(null);
    setEditingDoctor({ ...doc });
    setIsDoctorModalOpen(true);
  };

  const handleOpenEditSchedule = (doc: DoctorSchedule) => {
    setFormError(null);
    setEditingDoctor({ ...doc });
    setIsScheduleModalOpen(true);
  };

  const handleSaveDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!editingDoctor?.name || !editingDoctor.name.trim()) {
      setFormError('Doctor name is required.');
      return;
    }
    if (!editingDoctor.department || !editingDoctor.department.trim()) {
      setFormError('Department is required.');
      return;
    }
    if (!editingDoctor.roomNo || !editingDoctor.roomNo.trim()) {
      setFormError('OPD Room / Counter number is required.');
      return;
    }
    if (editingDoctor.startTime && editingDoctor.endTime && editingDoctor.startTime >= editingDoctor.endTime) {
      setFormError('End time must be after start time.');
      return;
    }

    try {
      if (editingDoctor.id) {
        hospitalCoreService.updateDoctor(editingDoctor.id, editingDoctor);
        toast.success('OPD doctor updated successfully.');
      } else {
        hospitalCoreService.addDoctor(editingDoctor);
        toast.success('OPD doctor added successfully.');
      }
      setIsDoctorModalOpen(false);
      refreshData();
    } catch (err: any) {
      setFormError(err?.message || 'Failed to save doctor record.');
    }
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!editingDoctor?.id) return;
    if (!editingDoctor.roomNo || !editingDoctor.roomNo.trim()) {
      setFormError('OPD Room number is mandatory.');
      return;
    }
    if (editingDoctor.startTime && editingDoctor.endTime && editingDoctor.startTime >= editingDoctor.endTime) {
      setFormError('End time must be after start time.');
      return;
    }

    try {
      hospitalCoreService.updateOpdSchedule(editingDoctor.id, {
        availableDays: editingDoctor.availableDays || ['Mon', 'Wed', 'Fri'],
        startTime: editingDoctor.startTime || '09:00',
        endTime: editingDoctor.endTime || '13:00',
        roomNo: editingDoctor.roomNo,
        dutyShift: editingDoctor.dutyShift || 'Morning (9 AM - 1 PM)',
        opdSchedule: editingDoctor.opdSchedule,
      });
      toast.success('OPD schedule updated successfully.');
      setIsScheduleModalOpen(false);
      refreshData();
    } catch (err: any) {
      setFormError(err?.message || 'Failed to update OPD schedule.');
    }
  };

  const handleToggleStatus = (doc: DoctorSchedule) => {
    const newStatus = doc.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      hospitalCoreService.updateDoctor(doc.id, { status: newStatus });
      toast.success(`OPD Doctor marked as ${newStatus}`);
      refreshData();
    } catch (err: any) {
      toast.error(err?.message || 'Action failed.');
    }
  };

  const handleDeleteConfirm = () => {
    if (!deletingDoctorId) return;
    hospitalCoreService.deleteDoctor(deletingDoctorId);
    toast.success('OPD doctor record removed successfully.');
    setDeletingDoctorId(null);
    refreshData();
  };

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleDaySelection = (day: string) => {
    if (!editingDoctor) return;
    const currentDays = editingDoctor.availableDays || [];
    let updatedDays: string[];
    if (currentDays.includes(day)) {
      updatedDays = currentDays.filter((d) => d !== day);
    } else {
      updatedDays = [...currentDays, day];
    }
    setEditingDoctor({
      ...editingDoctor,
      availableDays: updatedDays,
      opdSchedule: `${updatedDays.join(', ')} (${editingDoctor.startTime || '09:00'} - ${editingDoctor.endTime || '13:00'})`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#002147] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-2xs font-black uppercase tracking-wider rounded-full border border-emerald-500/30">
              Super Admin Control
            </span>
            <span className="text-2xs text-blue-200 font-bold">• OPD Doctor Roster & Timetable Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            OPD Doctor & Schedule Management
          </h2>
          <p className="text-xs text-blue-200 max-w-2xl">
            Configure OPD doctor profiles, assigned clinical rooms, weekly shift schedules, consultation timings, and live availability statuses. Synchronized real-time with the public hospital portal.
          </p>
        </div>

        {isAuthorized && (
          <button
            onClick={handleOpenAddDoctor}
            className="px-5 py-3 bg-[#00A651] hover:bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow-md transition flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add OPD Doctor</span>
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search doctor by name, department, specialization, room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#00A651]"
            />
          </div>

          <div>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
            >
              <option value="ALL">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
            >
              <option value="ALL">All Availability Statuses</option>
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
              <option value="On Leave">On Leave</option>
              <option value="Temporarily Closed">Temporarily Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Doctor & Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <Stethoscope className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No OPD Doctors Found</h3>
            <p className="text-xs text-slate-500">No doctor records match the current filter criteria.</p>
          </div>
        ) : (
          filteredDoctors.map((doc) => (
            <Card key={doc.id} className="p-5 space-y-4 relative overflow-hidden flex flex-col justify-between border-slate-200 dark:border-slate-800">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <img
                    src={doc.imageUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80'}
                    alt={doc.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded truncate">
                        {doc.department}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-full ${
                          doc.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {doc.status || 'ACTIVE'}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white truncate mt-0.5">{doc.name}</h3>
                    <p className="text-2xs font-semibold text-[#002147] dark:text-blue-400 truncate">{doc.qualification}</p>
                  </div>
                </div>

                {/* Clinical Metadata Box */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-1.5 text-2xs text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">OPD Room/Desk:</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{doc.roomNo}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Days:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{doc.availableDays ? doc.availableDays.join(', ') : 'Mon - Fri'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Shift / Timing:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{doc.dutyShift || doc.opdSchedule}</span>
                  </div>
                  {doc.registrationNumber && (
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                      <span>Reg No:</span>
                      <span>{doc.registrationNumber}</span>
                    </div>
                  )}
                </div>

                {/* Specialization */}
                <p className="text-[11px] text-slate-500 italic bg-amber-50/50 dark:bg-amber-950/20 p-2 rounded-xl border border-amber-100 dark:border-amber-900/30">
                  <span className="font-bold not-italic">Clinical Focus:</span> {doc.specialization}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                <div className="flex items-center justify-between text-2xs">
                  <span className="font-bold text-slate-600 dark:text-slate-400">Live Status:</span>
                  <span
                    className={`px-2.5 py-0.5 text-[10px] font-black rounded-full ${
                      doc.availabilityStatus === 'Available' || doc.isAvailable
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : doc.availabilityStatus === 'On Leave'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {doc.availabilityStatus || (doc.isAvailable ? 'Available' : 'Unavailable')}
                  </span>
                </div>

                {isAuthorized && (
                  <div className="flex items-center justify-between gap-1.5 pt-1">
                    <button
                      onClick={() => handleOpenEditSchedule(doc)}
                      className="px-2.5 py-1.5 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold text-2xs rounded-xl hover:bg-blue-100 transition flex items-center gap-1 cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5" /> Schedule
                    </button>
                    <button
                      onClick={() => handleOpenEditDoctor(doc)}
                      className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold text-2xs rounded-xl hover:bg-emerald-100 transition flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit Doctor
                    </button>
                    <button
                      onClick={() => handleToggleStatus(doc)}
                      className="px-2.5 py-1.5 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-bold text-2xs rounded-xl hover:bg-slate-200 transition cursor-pointer"
                    >
                      {doc.status === 'ACTIVE' ? 'Deactivate' : 'Reactivate'}
                    </button>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* MODAL 1: ADD / EDIT OPD DOCTOR MODAL */}
      {isDoctorModalOpen && editingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full my-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-[#002147] dark:text-white flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-emerald-600" />
                {editingDoctor.id ? 'Edit OPD Doctor Profile' : 'Add New OPD Doctor'}
              </h3>
              <button onClick={() => setIsDoctorModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-rose-800 dark:text-rose-300 rounded-2xl text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveDoctor} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 mb-1">Doctor Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Subhash Chandra Roy"
                    value={editingDoctor.name || ''}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 mb-1">Department *</label>
                  <select
                    value={editingDoctor.department || departments[0]?.name}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 mb-1">Qualification *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. D.M.S., M.D. (Hom.)"
                    value={editingDoctor.qualification || ''}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, qualification: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 mb-1">Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Consultant & HOD"
                    value={editingDoctor.designation || ''}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, designation: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 mb-1">OPD Room / Counter *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. OPD Room 101"
                    value={editingDoctor.roomNo || ''}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, roomNo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 mb-1">Specialization</label>
                  <input
                    type="text"
                    placeholder="e.g. Chronic Miasmatic Diseases"
                    value={editingDoctor.specialization || ''}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, specialization: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 mb-1">Registration No</label>
                  <input
                    type="text"
                    placeholder="e.g. C-14502"
                    value={editingDoctor.registrationNumber || ''}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, registrationNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 mb-1">Availability Status</label>
                  <select
                    value={editingDoctor.availabilityStatus || 'Available'}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, availabilityStatus: e.target.value as DoctorAvailabilityStatus })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  >
                    <option value="Available">Available (In Clinic)</option>
                    <option value="Unavailable">Unavailable</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Temporarily Closed">Temporarily Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 mb-1">Active Status</label>
                  <select
                    value={editingDoctor.status || 'ACTIVE'}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              {/* Photo Upload & Preview */}
              <div>
                <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 mb-1">Profile Photo</label>
                <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <img
                    src={editingDoctor.imageUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80'}
                    alt="Preview"
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div className="space-y-1 flex-1 min-w-0">
                    <input
                      type="url"
                      placeholder="Image URL or upload file"
                      value={editingDoctor.imageUrl || ''}
                      onChange={(e) => setEditingDoctor({ ...editingDoctor, imageUrl: e.target.value })}
                      className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-2xs"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-200 dark:bg-slate-700 font-bold text-2xs rounded-lg cursor-pointer hover:bg-slate-300">
                      <Upload className="w-3.5 h-3.5" /> Upload File
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsDoctorModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#002147] dark:bg-[#00A651] text-white font-bold rounded-xl"
                >
                  Save OPD Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: OPD SCHEDULE MANAGEMENT MODAL */}
      {isScheduleModalOpen && editingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full my-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-[#002147] dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Manage OPD Schedule - {editingDoctor.name}
              </h3>
              <button onClick={() => setIsScheduleModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-rose-800 dark:text-rose-300 rounded-2xl text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveSchedule} className="space-y-4 text-xs">
              {/* OPD Days Selection (Mon - Sun) */}
              <div>
                <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                  OPD Active Days (Monday - Sunday)
                </label>
                <div className="flex flex-wrap gap-2">
                  {weekdays.map((day) => {
                    const isSelected = (editingDoctor.availableDays || []).includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDaySelection(day)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#002147] text-white shadow-xs dark:bg-[#00A651]'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Start & End Timing Validation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 mb-1">Start Time *</label>
                  <input
                    type="time"
                    required
                    value={editingDoctor.startTime || '09:00'}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, startTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 mb-1">End Time *</label>
                  <input
                    type="time"
                    required
                    value={editingDoctor.endTime || '13:00'}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, endTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 mb-1">OPD Room / Counter *</label>
                  <input
                    type="text"
                    required
                    value={editingDoctor.roomNo || ''}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, roomNo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 mb-1">Shift Hours Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Morning (9 AM - 1 PM)"
                    value={editingDoctor.dutyShift || ''}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, dutyShift: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#002147] dark:bg-[#00A651] text-white font-bold rounded-xl"
                >
                  Save OPD Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
