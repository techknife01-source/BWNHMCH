import React, { useState } from 'react';
import { adminHrService } from '../../../services/adminHrService';
import { Employee, EmployeeType, EmployeeStatus } from '../../../types/adminHr';
import { StaffProfileModal } from './StaffProfileModal';
import { Modal } from '../../../components/common/Modal';
import {
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Building2,
  Mail,
  Phone,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface EmployeeManagementViewProps {
  isAddModalOpenInitially?: boolean;
  onCloseAddModalInitially?: () => void;
}

export const EmployeeManagementView: React.FC<EmployeeManagementViewProps> = ({
  isAddModalOpenInitially = false,
  onCloseAddModalInitially,
}) => {
  const [employees, setEmployees] = useState<Employee[]>(adminHrService.getEmployees());
  const departments = adminHrService.getDepartments();
  const designations = adminHrService.getDesignations();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('ALL');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Modals state
  const [selectedEmployeeForView, setSelectedEmployeeForView] = useState<Employee | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [isFormModalOpen, setIsFormModalOpen] = useState(isAddModalOpenInitially);
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    empId: '',
    fullName: '',
    email: '',
    phone: '',
    gender: 'MALE' as Employee['gender'],
    dob: '1985-05-15',
    joiningDate: '2022-01-01',
    departmentId: departments[0]?.id || 'DEP-001',
    designationId: designations[0]?.id || 'DES-001',
    employeeType: 'TEACHING' as EmployeeType,
    status: 'ACTIVE' as EmployeeStatus,
    qualification: 'BHMS, MD (Homoeopathy)',
    experienceYears: 5,
    bloodGroup: 'O+',
    address: 'Kolkata, West Bengal',
    aadhaarNo: '1234 5678 9012',
    panNo: 'ABCDE1234F',
    bankName: 'State Bank of India',
    accountNo: '30123456789',
    ifscCode: 'SBIN0000001',
    salaryBasic: 65000,
  });

  const refreshEmployees = () => {
    setEmployees(adminHrService.getEmployees());
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.departmentName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDeptFilter === 'ALL' || emp.departmentId === selectedDeptFilter || emp.departmentName === selectedDeptFilter;
    const matchesType = selectedTypeFilter === 'ALL' || emp.employeeType === selectedTypeFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' || emp.status === selectedStatusFilter;

    return matchesSearch && matchesDept && matchesType && matchesStatus;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredEmployees.length / pageSize) || 1;
  const paginatedEmployees = filteredEmployees.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleOpenAdd = () => {
    setEditingEmp(null);
    setFormData({
      empId: `BHMC-${Date.now().toString().slice(-4)}`,
      fullName: '',
      email: '',
      phone: '',
      gender: 'MALE',
      dob: '1988-06-20',
      joiningDate: new Date().toISOString().split('T')[0],
      departmentId: departments[0]?.id || 'DEP-001',
      designationId: designations[0]?.id || 'DES-001',
      employeeType: 'TEACHING',
      status: 'ACTIVE',
      qualification: 'BHMS, MD (Homoeopathy)',
      experienceYears: 5,
      bloodGroup: 'O+',
      address: 'College Street, Kolkata',
      aadhaarNo: '4589 9012 3456',
      panNo: 'XYZAB1234K',
      bankName: 'State Bank of India',
      accountNo: '30987654321',
      ifscCode: 'SBIN0000001',
      salaryBasic: 65000,
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setEditingEmp(emp);
    setFormData({
      empId: emp.empId,
      fullName: emp.fullName,
      email: emp.email,
      phone: emp.phone,
      gender: emp.gender,
      dob: emp.dob,
      joiningDate: emp.joiningDate,
      departmentId: emp.departmentId,
      designationId: emp.designationId,
      employeeType: emp.employeeType,
      status: emp.status,
      qualification: emp.qualification,
      experienceYears: emp.experienceYears,
      bloodGroup: emp.bloodGroup,
      address: emp.address,
      aadhaarNo: emp.aadhaarNo,
      panNo: emp.panNo,
      bankName: emp.bankDetails.bankName,
      accountNo: emp.bankDetails.accountNo,
      ifscCode: emp.bankDetails.ifscCode,
      salaryBasic: emp.salaryBasic,
    });
    setIsFormModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) {
      toast.error('Please enter Full Name and Email');
      return;
    }

    const deptObj = departments.find((d) => d.id === formData.departmentId) || departments[0];
    const desObj = designations.find((d) => d.id === formData.designationId) || designations[0];

    if (editingEmp) {
      adminHrService.updateEmployee(editingEmp.id, {
        empId: formData.empId,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        dob: formData.dob,
        joiningDate: formData.joiningDate,
        departmentId: deptObj.id,
        departmentName: deptObj.name,
        designationId: desObj.id,
        designationName: desObj.title,
        employeeType: formData.employeeType,
        status: formData.status,
        qualification: formData.qualification,
        experienceYears: formData.experienceYears,
        bloodGroup: formData.bloodGroup,
        address: formData.address,
        aadhaarNo: formData.aadhaarNo,
        panNo: formData.panNo,
        bankDetails: {
          bankName: formData.bankName,
          accountNo: formData.accountNo,
          ifscCode: formData.ifscCode,
          branch: 'Main Branch',
        },
        salaryBasic: Number(formData.salaryBasic),
      });
      toast.success('Staff details updated successfully!');
    } else {
      adminHrService.addEmployee({
        empId: formData.empId,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        dob: formData.dob,
        joiningDate: formData.joiningDate,
        departmentId: deptObj.id,
        departmentName: deptObj.name,
        designationId: desObj.id,
        designationName: desObj.title,
        employeeType: formData.employeeType,
        status: formData.status,
        qualification: formData.qualification,
        experienceYears: formData.experienceYears,
        bloodGroup: formData.bloodGroup,
        emergencyContact: {
          name: 'Emergency Contact',
          relationship: 'Family',
          phone: formData.phone,
        },
        address: formData.address,
        aadhaarNo: formData.aadhaarNo,
        panNo: formData.panNo,
        bankDetails: {
          bankName: formData.bankName,
          accountNo: formData.accountNo,
          ifscCode: formData.ifscCode,
          branch: 'Main Branch',
        },
        salaryBasic: Number(formData.salaryBasic),
      });
      toast.success('New staff member added successfully!');
    }

    setIsFormModalOpen(false);
    if (onCloseAddModalInitially) onCloseAddModalInitially();
    refreshEmployees();
  };

  const handleDelete = (emp: Employee) => {
    if (confirm(`Are you sure you want to delete staff record for ${emp.fullName}?`)) {
      adminHrService.deleteEmployee(emp.id);
      toast.success('Employee record deleted');
      refreshEmployees();
    }
  };

  const handleOpenView = (emp: Employee) => {
    setSelectedEmployeeForView(emp);
    setIsViewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Employee & Faculty Staff Directory ({employees.length})</span>
          </h2>
          <p className="text-xs text-slate-500">
            Institutional personnel records, teaching faculty, hospital staff & non-teaching administration
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#002147] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Staff Member</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, ID, email or dept..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter Department */}
        <div>
          <select
            value={selectedDeptFilter}
            onChange={(e) => {
              setSelectedDeptFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        {/* Filter Type */}
        <div>
          <select
            value={selectedTypeFilter}
            onChange={(e) => {
              setSelectedTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Staff Categories</option>
            <option value="TEACHING">Teaching Faculty</option>
            <option value="HOSPITAL_STAFF">Hospital Staff</option>
            <option value="NON_TEACHING">Non-Teaching</option>
            <option value="ADMINISTRATIVE">Administrative</option>
          </select>
        </div>

        {/* Filter Status */}
        <div>
          <select
            value={selectedStatusFilter}
            onChange={(e) => {
              setSelectedStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Employment Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="ON_LEAVE">ON LEAVE</option>
            <option value="PROBATION">PROBATION</option>
            <option value="RESIGNED">RESIGNED</option>
          </select>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800 font-bold">
                <th className="p-3.5">Staff Details</th>
                <th className="p-3.5">Department & Position</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Qualifications</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No employee records match the filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#002147] text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {emp.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-xs">{emp.fullName}</p>
                          <p className="text-[10px] text-blue-600 dark:text-blue-400 font-mono font-semibold">{emp.empId}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <p className="font-bold text-slate-800 dark:text-slate-200">{emp.designationName}</p>
                      <p className="text-[11px] text-slate-500">{emp.departmentName}</p>
                    </td>

                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                        {emp.employeeType.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="p-3.5 text-slate-600 dark:text-slate-400 font-medium">
                      {emp.qualification}
                    </td>

                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                        emp.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {emp.status}
                      </span>
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenView(emp)}
                          title="View Staff Profile"
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(emp)}
                          title="Edit Employee"
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(emp)}
                          title="Delete Record"
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950 dark:text-rose-300 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
          <span>
            Showing {filteredEmployees.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, filteredEmployees.length)} of {filteredEmployees.length} staff
          </span>

          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 font-bold text-slate-700 dark:text-slate-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Staff Profile View Modal */}
      <StaffProfileModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        employee={selectedEmployeeForView}
      />

      {/* Add / Edit Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          if (onCloseAddModalInitially) onCloseAddModalInitially();
        }}
        title={editingEmp ? `Edit Staff Member: ${editingEmp.fullName}` : 'Add New Staff Member'}
        size="lg"
      >
        <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Employee ID Code *</label>
              <input
                type="text"
                required
                value={formData.empId}
                onChange={(e) => setFormData({ ...formData, empId: e.target.value })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="Dr. Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Institutional Email *</label>
              <input
                type="email"
                required
                placeholder="name@bhmc.edu.in"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Mobile Phone *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Department</label>
              <select
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Designation</label>
              <select
                value={formData.designationId}
                onChange={(e) => setFormData({ ...formData, designationId: e.target.value })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold"
              >
                {designations.map((d) => (
                  <option key={d.id} value={d.id}>{d.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Staff Category</label>
              <select
                value={formData.employeeType}
                onChange={(e) => setFormData({ ...formData, employeeType: e.target.value as EmployeeType })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold"
              >
                <option value="TEACHING">Teaching Faculty</option>
                <option value="HOSPITAL_STAFF">Hospital Staff</option>
                <option value="NON_TEACHING">Non-Teaching</option>
                <option value="ADMINISTRATIVE">Administrative</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Employment Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as EmployeeStatus })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="ON_LEAVE">ON LEAVE</option>
                <option value="PROBATION">PROBATION</option>
                <option value="RESIGNED">RESIGNED</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Qualification</label>
              <input
                type="text"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Basic Monthly Pay (₹)</label>
              <input
                type="number"
                value={formData.salaryBasic}
                onChange={(e) => setFormData({ ...formData, salaryBasic: Number(e.target.value) })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => {
                setIsFormModalOpen(false);
                if (onCloseAddModalInitially) onCloseAddModalInitially();
              }}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-[#002147] text-white font-bold rounded-xl shadow-xs hover:bg-blue-900 cursor-pointer"
            >
              {editingEmp ? 'Update Staff Member' : 'Save New Staff'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
