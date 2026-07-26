import React, { useState } from 'react';
import { Card } from '../../../components/common/Card';
import { Select } from '../../../components/common/Select';
import { Badge } from '../../../components/common/Badge';
import { hospitalCoreService } from '../../../services/hospitalCoreService';
import { DoctorSchedule } from '../../../types/hospital';
import {
  Stethoscope,
  Calendar,
  Clock,
  Building2,
  CheckCircle,
  XCircle,
  ToggleLeft,
  ToggleRight,
  UserCheck,
  ShieldCheck,
  Users,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const DoctorScheduleAvailability: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const departments = hospitalCoreService.getDepartments();
  const doctors = hospitalCoreService.getDoctors(selectedDepartment);

  const handleToggleAvailability = (doctorId: string, currentStatus: boolean) => {
    hospitalCoreService.toggleDoctorAvailability(doctorId, !currentStatus);
    toast.success(`Doctor availability toggled to ${!currentStatus ? 'AVAILABLE' : 'OFF-DUTY'}`);
    setSelectedDepartment((prev) => prev); // force refresh
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Doctor Schedule & Live Availability</h2>
          <p className="text-xs text-slate-500">
            Monitor doctor shifts, OPD room assignments, and live availability toggles
          </p>
        </div>

        <Select
          options={[
            { value: 'ALL', label: 'All Hospital Departments' },
            ...departments.map((d) => ({ value: d.name, label: d.name })),
          ]}
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="w-64"
        />
      </div>

      {/* Department Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {departments.map((dept) => (
          <Card
            key={dept.id}
            className={`p-3 space-y-2 border-l-4 cursor-pointer transition ${
              dept.activeDoctorsCount > 0 ? 'border-l-emerald-500' : 'border-l-rose-400 opacity-80'
            }`}
            onClick={() => setSelectedDepartment(dept.name)}
          >
            <div className="flex justify-between items-start">
              <p className="font-extrabold text-xs text-slate-900 dark:text-white truncate">{dept.name}</p>
              <span className="text-[10px] font-black uppercase text-slate-400">{dept.code}</span>
            </div>
            <p className="text-[11px] text-slate-500 truncate">HOD: {dept.headOfDepartment}</p>
            <div className="flex justify-between items-center pt-1 border-t border-slate-100 dark:border-slate-800 text-[11px]">
              <span className="text-slate-600 dark:text-slate-400">{dept.opdRoom}</span>
              <Badge variant={dept.activeDoctorsCount > 0 ? 'accent' : 'danger'}>
                {dept.activeDoctorsCount > 0 ? `${dept.activeDoctorsCount} Doctor Active` : 'Offline'}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* Doctor Duty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doc) => (
          <Card key={doc.id} className="p-5 space-y-4 relative overflow-hidden">
            {/* Top Status Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={doc.imageUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80'}
                  alt={doc.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
                />
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{doc.name}</h3>
                  <p className="text-[11px] text-[#002147] dark:text-blue-400 font-semibold">{doc.qualification}</p>
                  <p className="text-[10px] text-slate-500">{doc.designation}</p>
                </div>
              </div>
            </div>

            {/* Department & Room */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Department:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{doc.department}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">OPD Room:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{doc.roomNo}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Shift Hours:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{doc.dutyShift}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Tokens Issued Today:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {doc.totalTokensIssued} / {doc.maxDailyTokens}
                </span>
              </div>
            </div>

            {/* Specialization Notes */}
            <p className="text-[11px] text-slate-500 italic bg-amber-50/50 dark:bg-amber-950/20 p-2 rounded-lg border border-amber-100 dark:border-amber-900/30">
              <span className="font-bold not-italic">Clinical Focus:</span> {doc.specialization}
            </p>

            {/* Live Availability Toggle Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Live OPD Status:</span>
                <Badge variant={doc.isAvailable ? 'accent' : 'danger'}>
                  {doc.isAvailable ? 'IN CLINIC' : 'OFF DUTY'}
                </Badge>
              </div>

              <button
                onClick={() => handleToggleAvailability(doc.id, doc.isAvailable)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  doc.isAvailable
                    ? 'bg-rose-100 hover:bg-rose-200 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300'
                    : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                }`}
              >
                {doc.isAvailable ? (
                  <>
                    <ToggleRight className="w-4 h-4 text-rose-600" />
                    <span>Mark Off-Duty</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-4 h-4 text-emerald-600" />
                    <span>Mark In-Clinic</span>
                  </>
                )}
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
