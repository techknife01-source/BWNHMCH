import React, { useState } from 'react';
import { Modal } from '../../../components/common/Modal';
import { Employee } from '../../../types/adminHr';
import { adminHrService } from '../../../services/adminHrService';
import { useAuth } from '../../../contexts/AuthContext';
import { canDeleteStaff } from '../../../utils/permissionHelper';
import {
  User,
  Briefcase,
  FileText,
  CreditCard,
  Building2,
  Phone,
  Mail,
  MapPin,
  Award,
  Calendar,
  CheckCircle,
  XCircle,
  Printer,
  QrCode,
  Trash2,
} from 'lucide-react';

interface StaffProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onDeleteRequest?: (employee: Employee) => void;
}

export const StaffProfileModal: React.FC<StaffProfileModalProps> = ({
  isOpen,
  onClose,
  employee,
  onDeleteRequest,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'info' | 'employment' | 'documents' | 'payroll' | 'idcard'>('info');

  if (!employee) return null;

  const employeeDocs = adminHrService.getDocuments().filter((d) => d.empId === employee.empId || d.empId === employee.id);
  const employeePayrolls = adminHrService.getPayrolls().filter((p) => p.empId === employee.empId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Staff Record: ${employee.fullName} (${employee.empId})`} size="xl">
      <div className="space-y-5">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="w-16 h-16 rounded-full bg-[#002147] text-white font-black text-xl flex items-center justify-center shrink-0 border-2 border-blue-500 shadow-sm">
            {employee.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">{employee.fullName}</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                employee.status === 'ACTIVE'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                {employee.status}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                {employee.employeeType.replace('_', ' ')}
              </span>
            </div>

            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              {employee.designationName} • <span className="text-blue-600 dark:text-blue-400">{employee.departmentName}</span>
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400" /> {employee.email}</span>
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {employee.phone}</span>
            </div>
          </div>

          {canDeleteStaff(user) && onDeleteRequest && (
            <button
              onClick={() => onDeleteRequest(employee)}
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-300 font-bold text-xs rounded-xl border border-rose-200 dark:border-rose-800/80 transition flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
              title="Delete Staff Member Record"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Staff</span>
            </button>
          )}
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 text-xs font-bold gap-4">
          <button
            onClick={() => setActiveTab('info')}
            className={`pb-2 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'info' ? 'border-[#002147] text-[#002147] dark:border-blue-400 dark:text-blue-400 font-black' : 'border-transparent text-slate-500'
            }`}
          >
            <User className="w-4 h-4" /> Personal Profile
          </button>
          <button
            onClick={() => setActiveTab('employment')}
            className={`pb-2 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'employment' ? 'border-[#002147] text-[#002147] dark:border-blue-400 dark:text-blue-400 font-black' : 'border-transparent text-slate-500'
            }`}
          >
            <Briefcase className="w-4 h-4" /> Service Details
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`pb-2 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'documents' ? 'border-[#002147] text-[#002147] dark:border-blue-400 dark:text-blue-400 font-black' : 'border-transparent text-slate-500'
            }`}
          >
            <FileText className="w-4 h-4" /> Documents ({employeeDocs.length})
          </button>
          <button
            onClick={() => setActiveTab('payroll')}
            className={`pb-2 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'payroll' ? 'border-[#002147] text-[#002147] dark:border-blue-400 dark:text-blue-400 font-black' : 'border-transparent text-slate-500'
            }`}
          >
            <CreditCard className="w-4 h-4" /> Salary History
          </button>
          <button
            onClick={() => setActiveTab('idcard')}
            className={`pb-2 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'idcard' ? 'border-[#002147] text-[#002147] dark:border-blue-400 dark:text-blue-400 font-black' : 'border-transparent text-slate-500'
            }`}
          >
            <QrCode className="w-4 h-4" /> Digital ID Card
          </button>
        </div>

        {/* Tab Body */}
        <div className="pt-2 text-xs">
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] text-blue-600">Identity Details</h4>
                <p><strong>Date of Birth:</strong> {employee.dob}</p>
                <p><strong>Gender:</strong> {employee.gender}</p>
                <p><strong>Blood Group:</strong> {employee.bloodGroup}</p>
                <p><strong>Aadhaar Number:</strong> {employee.aadhaarNo}</p>
                <p><strong>PAN Number:</strong> {employee.panNo}</p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] text-emerald-600">Emergency & Address</h4>
                <p><strong>Contact Person:</strong> {employee.emergencyContact.name} ({employee.emergencyContact.relationship})</p>
                <p><strong>Emergency Phone:</strong> {employee.emergencyContact.phone}</p>
                <p><strong>Residential Address:</strong> {employee.address}</p>
              </div>
            </div>
          )}

          {activeTab === 'employment' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] text-blue-600">Academic & Service Records</h4>
                <p><strong>Highest Qualification:</strong> {employee.qualification}</p>
                <p><strong>Experience:</strong> {employee.experienceYears} Years</p>
                <p><strong>Date of Joining:</strong> {employee.joiningDate}</p>
                <p><strong>Basic Scale:</strong> ₹{employee.salaryBasic.toLocaleString()} / month</p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] text-purple-600">Bank Disburse Details</h4>
                <p><strong>Bank Name:</strong> {employee.bankDetails.bankName}</p>
                <p><strong>Account Number:</strong> {employee.bankDetails.accountNo}</p>
                <p><strong>IFSC Code:</strong> {employee.bankDetails.ifscCode}</p>
                <p><strong>Branch:</strong> {employee.bankDetails.branch}</p>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-3">
              {employeeDocs.length === 0 ? (
                <p className="text-slate-500 text-center py-4">No verified documents uploaded yet for this staff member.</p>
              ) : (
                employeeDocs.map((doc) => (
                  <div key={doc.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{doc.title}</p>
                      <p className="text-slate-500 text-[11px]">{doc.docType} • {doc.fileSize} • Uploaded {doc.uploadedAt}</p>
                    </div>
                    <span className="flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">
                      <CheckCircle className="w-3.5 h-3.5" /> Verified
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'payroll' && (
            <div className="space-y-3">
              {employeePayrolls.length === 0 ? (
                <p className="text-slate-500 text-center py-4">No salary slips generated for this employee yet.</p>
              ) : (
                employeePayrolls.map((pay) => (
                  <div key={pay.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Pay Period: {pay.monthYear}</p>
                      <p className="text-slate-500 text-[11px]">Gross: ₹{pay.grossSalary.toLocaleString()} | Net: <strong className="text-emerald-600">₹{pay.netSalary.toLocaleString()}</strong></p>
                    </div>
                    <span className="px-2.5 py-1 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded-lg font-bold">
                      {pay.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'idcard' && (
            <div className="flex flex-col items-center justify-center p-4">
              <div className="w-full max-w-sm bg-gradient-to-br from-[#002147] to-[#003366] text-white p-5 rounded-2xl shadow-xl border-2 border-amber-400 space-y-3 text-center">
                <div className="border-b border-blue-400/40 pb-2">
                  <h4 className="font-black text-sm tracking-wider uppercase">BHMC & Hospital</h4>
                  <p className="text-[9px] text-blue-200">Smart Homeopathic Medical College, West Bengal</p>
                </div>

                <div className="w-20 h-20 mx-auto rounded-full bg-white text-[#002147] font-black text-2xl flex items-center justify-center border-2 border-amber-400 shadow-md">
                  {employee.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </div>

                <div>
                  <h3 className="font-black text-base">{employee.fullName}</h3>
                  <p className="text-xs font-semibold text-amber-300">{employee.designationName}</p>
                  <p className="text-[11px] text-blue-200">{employee.departmentName}</p>
                </div>

                <div className="bg-white/10 p-2 rounded-xl text-[10px] space-y-1 text-left">
                  <p><strong>ID No:</strong> {employee.empId}</p>
                  <p><strong>Blood Group:</strong> {employee.bloodGroup}</p>
                  <p><strong>Emergency:</strong> {employee.emergencyContact.phone}</p>
                </div>

                <div className="flex items-center justify-center gap-2 pt-1">
                  <QrCode className="w-12 h-12 text-white bg-white/20 p-1 rounded-lg" />
                </div>
              </div>

              <button
                onClick={() => window.print()}
                className="mt-4 px-4 py-2 bg-[#002147] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print Staff Credential Card
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
