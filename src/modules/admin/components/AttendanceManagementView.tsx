import React, { useState } from 'react';
import { adminHrService } from '../../../services/adminHrService';
import { StaffAttendance, AttendanceStatus } from '../../../types/adminHr';
import { UserCheck, Calendar, Clock, Plus, Filter, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export const AttendanceManagementView: React.FC = () => {
  const [attendances, setAttendances] = useState<StaffAttendance[]>(adminHrService.getAttendance());
  const employees = adminHrService.getEmployees();

  const [selectedDate, setSelectedDate] = useState<string>('2026-07-25');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');

  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.empId || '');
  const [markStatus, setMarkStatus] = useState<AttendanceStatus>('PRESENT');
  const [checkInTime, setCheckInTime] = useState('09:00 AM');
  const [checkOutTime, setCheckOutTime] = useState('05:00 PM');
  const [remarks, setRemarks] = useState('Manual admin check-in');

  const filteredAttendance = attendances.filter((att) => {
    const matchesDate = !selectedDate || att.date === selectedDate;
    const matchesStatus = selectedStatusFilter === 'ALL' || att.status === selectedStatusFilter;
    return matchesDate && matchesStatus;
  });

  const handleMarkAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((e) => e.empId === selectedEmpId || e.id === selectedEmpId);
    if (!emp) {
      toast.error('Select employee');
      return;
    }

    const newRecord = adminHrService.markAttendance({
      empId: emp.empId,
      empName: emp.fullName,
      departmentName: emp.departmentName,
      date: selectedDate,
      checkInTime,
      checkOutTime,
      status: markStatus,
      workHours: markStatus === 'PRESENT' ? 8.0 : markStatus === 'HALF_DAY' ? 4.0 : 0,
      remarks,
    });

    setAttendances(adminHrService.getAttendance());
    toast.success(`Attendance marked as ${markStatus} for ${emp.fullName}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600" />
            <span>Staff Biometric & Daily Attendance Log</span>
          </h2>
          <p className="text-xs text-slate-500">
            Daily check-in / check-out records, late arrival tracking & manual attendance logger
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold">
          <Calendar className="w-4 h-4 text-slate-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
          />
        </div>
      </div>

      {/* Grid: Manual Logger + Attendance Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: Manual Logger Form */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Mark / Override Attendance</span>
          </h3>

          <form onSubmit={handleMarkAttendance} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Select Staff Member</label>
              <select
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.empId}>
                    {emp.fullName} ({emp.empId}) - {emp.departmentName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Attendance Status</label>
              <select
                value={markStatus}
                onChange={(e) => setMarkStatus(e.target.value as AttendanceStatus)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
              >
                <option value="PRESENT">PRESENT</option>
                <option value="ABSENT">ABSENT</option>
                <option value="LATE">LATE</option>
                <option value="HALF_DAY">HALF DAY</option>
                <option value="ON_DUTY">ON DUTY</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Check-In</label>
                <input
                  type="text"
                  value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Check-Out</label>
                <input
                  type="text"
                  value={checkOutTime}
                  onChange={(e) => setCheckOutTime(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Remarks</label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#002147] hover:bg-blue-900 text-white font-bold rounded-xl shadow-xs cursor-pointer transition"
            >
              Save Attendance Record
            </button>
          </form>
        </div>

        {/* Right 2 Cols: Attendance Log Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-sm text-slate-900 dark:text-white">
              Attendance Log ({filteredAttendance.length})
            </h3>

            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
            >
              <option value="ALL">All Statuses</option>
              <option value="PRESENT">PRESENT</option>
              <option value="ABSENT">ABSENT</option>
              <option value="LATE">LATE</option>
              <option value="HALF_DAY">HALF DAY</option>
              <option value="ON_DUTY">ON DUTY</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
                  <th className="p-3">Staff Name</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Check In / Out</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredAttendance.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">
                      No attendance records found for this date/filter.
                    </td>
                  </tr>
                ) : (
                  filteredAttendance.map((att) => (
                    <tr key={att.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-3">
                        <p className="font-bold text-slate-900 dark:text-white">{att.empName}</p>
                        <p className="text-[10px] text-blue-600">{att.empId}</p>
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">{att.departmentName}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                        {att.checkInTime || '--'} - {att.checkOutTime || '--'}
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          att.status === 'PRESENT'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : att.status === 'LATE'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {att.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500 italic text-[11px]">{att.remarks || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
