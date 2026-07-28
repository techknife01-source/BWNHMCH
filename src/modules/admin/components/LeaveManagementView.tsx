import React, { useState } from 'react';
import { adminHrService } from '../../../services/adminHrService';
import { LeaveApplication, LeaveType } from '../../../types/adminHr';
import { Modal } from '../../../components/common/Modal';
import { useAuth } from '../../../contexts/AuthContext';
import { canApproveLeave } from '../../../utils/permissionHelper';
import { CalendarCheck, Plus, CheckCircle, XCircle, Clock, FileText, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export const LeaveManagementView: React.FC = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState<LeaveApplication[]>(adminHrService.getLeaveApplications());
  const employees = adminHrService.getEmployees();

  // Filter
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');

  // Review Modal State
  const [selectedLeave, setSelectedLeave] = useState<LeaveApplication | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRemarks, setReviewRemarks] = useState('');

  // Apply Leave Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    empId: employees[0]?.empId || 'BHMC-T-001',
    leaveType: 'CASUAL' as LeaveType,
    startDate: '2026-08-01',
    endDate: '2026-08-02',
    totalDays: 2,
    reason: 'Family emergency',
  });

  const refreshList = () => setLeaves(adminHrService.getLeaveApplications());

  const filteredLeaves = leaves.filter((l) => selectedStatusFilter === 'ALL' || l.status === selectedStatusFilter);

  const handleOpenReview = (l: LeaveApplication) => {
    setSelectedLeave(l);
    setReviewRemarks('');
    setIsReviewModalOpen(true);
  };

  const handleApprove = () => {
    if (!selectedLeave) return;
    adminHrService.updateLeaveStatus(selectedLeave.id, 'APPROVED', 'Mr. Somnath Ganguly (AO)', reviewRemarks || 'Approved by HR');
    toast.success('Leave application APPROVED!');
    setIsReviewModalOpen(false);
    refreshList();
  };

  const handleReject = () => {
    if (!selectedLeave) return;
    adminHrService.updateLeaveStatus(selectedLeave.id, 'REJECTED', 'Mr. Somnath Ganguly (AO)', reviewRemarks || 'Rejected by HR');
    toast.error('Leave application REJECTED!');
    setIsReviewModalOpen(false);
    refreshList();
  };

  const handleApplyLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((e) => e.empId === formData.empId || e.id === formData.empId);
    if (!emp) return;

    adminHrService.applyLeave({
      empId: emp.empId,
      empName: emp.fullName,
      departmentName: emp.departmentName,
      leaveType: formData.leaveType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      totalDays: formData.totalDays,
      reason: formData.reason,
    });

    toast.success('Leave application submitted!');
    setIsApplyModalOpen(false);
    refreshList();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-amber-600" />
            <span>Staff Leave Management & Approval Workflow ({leaves.length})</span>
          </h2>
          <p className="text-xs text-slate-500">
            Casual leave, duty leave, medical leave, earned leave applications & balance tracking
          </p>
        </div>

        <button
          onClick={() => setIsApplyModalOpen(true)}
          className="px-4 py-2.5 bg-[#002147] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Apply Leave on Behalf</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex justify-between items-center text-xs">
        <span className="font-bold text-slate-700 dark:text-slate-300">Filter Status:</span>
        <div className="flex gap-1.5">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-extrabold transition cursor-pointer ${
                selectedStatusFilter === st
                  ? 'bg-[#002147] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Leave Applications List */}
      <div className="space-y-3">
        {filteredLeaves.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center text-slate-500 text-xs">
            No leave applications match the selected status.
          </div>
        ) : (
          filteredLeaves.map((l) => (
            <div
              key={l.id}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-slate-900 dark:text-white">{l.empName}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    {l.departmentName}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                    l.status === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : l.status === 'PENDING'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {l.status}
                  </span>
                </div>

                <p className="text-slate-600 dark:text-slate-300 font-semibold">
                  <span className="text-blue-600 dark:text-blue-400">{l.leaveType} LEAVE</span> ({l.totalDays} Days): {l.startDate} to {l.endDate}
                </p>

                <p className="text-slate-500 italic bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl text-[11px]">
                  "{l.reason}"
                </p>

                {l.reviewedBy && (
                  <p className="text-[10px] text-slate-400">
                    Reviewed by <strong>{l.reviewedBy}</strong>: {l.reviewRemarks}
                  </p>
                )}
              </div>

              <div className="shrink-0 flex items-center gap-2">
                {l.status === 'PENDING' ? (
                  canApproveLeave(user) ? (
                    <button
                      onClick={() => handleOpenReview(l)}
                      className="px-4 py-2 bg-[#002147] hover:bg-blue-900 text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
                    >
                      Review Application
                    </button>
                  ) : (
                    <span className="text-amber-600 font-bold text-[11px] bg-amber-50 dark:bg-amber-950 px-3 py-1.5 rounded-xl">
                      Pending Approval
                    </span>
                  )
                ) : (
                  <span className="text-slate-400 font-bold text-[11px] bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
                    Processed
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Leave Review Modal */}
      <Modal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} title={`Review Leave: ${selectedLeave?.empName}`}>
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
            <p><strong>Staff:</strong> {selectedLeave?.empName} ({selectedLeave?.departmentName})</p>
            <p><strong>Type:</strong> {selectedLeave?.leaveType} Leave ({selectedLeave?.totalDays} Days)</p>
            <p><strong>Duration:</strong> {selectedLeave?.startDate} to {selectedLeave?.endDate}</p>
            <p><strong>Reason:</strong> {selectedLeave?.reason}</p>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Approval / Rejection Remarks</label>
            <textarea
              rows={3}
              value={reviewRemarks}
              onChange={(e) => setReviewRemarks(e.target.value)}
              placeholder="Enter remarks for the applicant..."
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={handleReject}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl cursor-pointer"
            >
              Reject Leave
            </button>

            <button
              onClick={handleApprove}
              className="px-5 py-2 bg-[#00A651] hover:bg-[#008c44] text-white font-bold rounded-xl cursor-pointer"
            >
              Approve Leave
            </button>
          </div>
        </div>
      </Modal>

      {/* Apply Leave Modal */}
      <Modal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} title="Apply Leave for Staff">
        <form onSubmit={handleApplyLeaveSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Select Staff Member</label>
            <select
              value={formData.empId}
              onChange={(e) => setFormData({ ...formData, empId: e.target.value })}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.empId}>{emp.fullName} ({emp.empId})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Leave Type</label>
            <select
              value={formData.leaveType}
              onChange={(e) => setFormData({ ...formData, leaveType: e.target.value as LeaveType })}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
            >
              <option value="CASUAL">CASUAL LEAVE</option>
              <option value="DUTY">DUTY LEAVE</option>
              <option value="MEDICAL">MEDICAL LEAVE</option>
              <option value="EARNED">EARNED LEAVE</option>
              <option value="MATERNITY">MATERNITY LEAVE</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Reason</label>
            <textarea
              rows={2}
              required
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setIsApplyModalOpen(false)}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-800 font-bold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#002147] text-white font-bold rounded-xl shadow-xs cursor-pointer"
            >
              Submit Application
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
