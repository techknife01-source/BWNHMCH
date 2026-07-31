import React, { useState } from 'react';
import { adminHrService } from '../../../services/adminHrService';
import { Employee } from '../../../types/adminHr';
import { QrCode, Printer, Search, ShieldCheck } from 'lucide-react';

export const IdentityCardsView: React.FC = () => {
  const employees = adminHrService.getEmployees();
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.empId || '');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmployees = employees.filter(
    (e) =>
      e.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.departmentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedEmployee = employees.find((e) => e.empId === selectedEmpId || e.id === selectedEmpId) || employees[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <QrCode className="w-5 h-5 text-indigo-600" />
            <span>Staff Digital Identity Cards & Credentials Generator</span>
          </h2>
          <p className="text-xs text-slate-500">
            Official high-resolution printable ID cards with embedded QR verification codes
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2.5 bg-[#002147] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print Staff ID Card</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: Staff Picker */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-black text-sm text-slate-900 dark:text-white">Select Staff Member</h3>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs"
            />
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1 text-xs">
            {filteredEmployees.map((emp) => (
              <button
                key={emp.id}
                onClick={() => setSelectedEmpId(emp.empId)}
                className={`w-full p-3 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                  selectedEmployee?.id === emp.id
                    ? 'bg-[#002147] text-white border-[#002147] shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <div>
                  <p className="font-bold">{emp.fullName}</p>
                  <p className={selectedEmployee?.id === emp.id ? 'text-blue-200 text-[10px]' : 'text-slate-500 text-[10px]'}>
                    {emp.empId} • {emp.departmentName}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right 2 Cols: ID Card Preview Container */}
        <div className="lg:col-span-2 bg-slate-100 dark:bg-slate-950 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner flex flex-col items-center justify-center">
          {selectedEmployee && (
            <div className="w-full max-w-md bg-gradient-to-br from-[#002147] via-[#003366] to-[#001833] text-white p-6 rounded-3xl shadow-2xl border-4 border-amber-400 relative overflow-hidden space-y-4">
              {/* Header Badge */}
              <div className="text-center border-b border-blue-400/30 pb-3 space-y-1">
                <div className="flex items-center justify-center gap-1 text-amber-300">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="font-mono text-[11px] font-black tracking-widest uppercase">BHMC HOSPITAL & COLLEGE</span>
                </div>
                <h3 className="font-extrabold text-xs text-slate-100">BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL, WB</h3>
                <p className="text-[9px] text-blue-200">Recognized by National Commission for Homoeopathy (NCH)</p>
              </div>

              {/* Avatar & Details */}
              <div className="flex flex-col sm:flex-row items-center gap-4 py-2">
                <div className="w-24 h-24 rounded-2xl bg-white text-[#002147] font-black text-3xl flex items-center justify-center border-2 border-amber-400 shadow-md shrink-0">
                  {selectedEmployee.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </div>

                <div className="text-center sm:text-left space-y-1">
                  <h2 className="text-lg font-black">{selectedEmployee.fullName}</h2>
                  <p className="text-xs font-bold text-amber-300">{selectedEmployee.designationName}</p>
                  <p className="text-xs text-blue-200">{selectedEmployee.departmentName}</p>
                  <p className="font-mono text-xs font-black text-blue-300 bg-blue-900/60 px-2 py-0.5 rounded-md inline-block">
                    ID: {selectedEmployee.empId}
                  </p>
                </div>
              </div>

              {/* Data Grid */}
              <div className="bg-white/10 p-3 rounded-2xl text-xs space-y-1.5 backdrop-blur-xs">
                <div className="flex justify-between">
                  <span className="text-blue-200">Blood Group:</span>
                  <span className="font-bold text-amber-300">{selectedEmployee.bloodGroup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Date of Joining:</span>
                  <span className="font-bold">{selectedEmployee.joiningDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Emergency Contact:</span>
                  <span className="font-bold">{selectedEmployee.emergencyContact.phone}</span>
                </div>
              </div>

              {/* QR Verification Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-blue-400/30 text-[10px]">
                <div className="space-y-0.5">
                  <p className="font-bold text-amber-300">AUTHORISED SIGNATORY</p>
                  <p className="text-slate-300">Principal Office, BHMC</p>
                </div>

                <QrCode className="w-12 h-12 text-white bg-white/20 p-1 rounded-xl shadow-xs" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
