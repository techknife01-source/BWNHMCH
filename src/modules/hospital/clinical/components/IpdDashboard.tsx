import React, { useState } from 'react';
import { Card } from '../../../../components/common/Card';
import { Badge } from '../../../../components/common/Badge';
import { Select } from '../../../../components/common/Select';
import { Input } from '../../../../components/common/Input';
import { Button } from '../../../../components/common/Button';
import { hospitalClinicalService } from '../../../../services/hospitalClinicalService';
import { IpdAdmission } from '../../../../types/clinical';
import {
  Bed,
  UserCheck,
  Building2,
  Bell,
  Search,
  Plus,
  ArrowLeftRight,
  LogOut,
  Stethoscope,
  Activity,
  HeartPulse,
  Sparkles,
} from 'lucide-react';

interface IpdDashboardProps {
  onOpenAdmissionModal: () => void;
  onSelectPatientEmr: (ipdNo: string) => void;
  onOpenTransferModal: (ipdNo: string) => void;
  onOpenDischargeModal: (ipdNo: string) => void;
  onNavigateToWards: () => void;
  onNavigateToEmr: () => void;
  onNavigateToAlerts: () => void;
}

export const IpdDashboard: React.FC<IpdDashboardProps> = ({
  onOpenAdmissionModal,
  onSelectPatientEmr,
  onOpenTransferModal,
  onOpenDischargeModal,
  onNavigateToWards,
  onNavigateToEmr,
  onNavigateToAlerts,
}) => {
  const summary = hospitalClinicalService.getIpdSummary();
  const wards = hospitalClinicalService.getWards();

  const [wardFilter, setWardFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ADMITTED');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const admissions = hospitalClinicalService.getAdmissions(statusFilter, wardFilter, searchQuery);

  return (
    <div className="space-y-6">
      {/* High Level Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="p-3.5 space-y-1 bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-slate-900 dark:to-slate-900 border-blue-200 dark:border-slate-800">
          <div className="flex justify-between items-center text-blue-600">
            <UserCheck className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase text-blue-600">IPD Census</span>
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white">{summary.totalAdmitted}</p>
          <p className="text-[10px] text-slate-500 font-medium">Currently Admitted</p>
        </Card>

        <Card className="p-3.5 space-y-1 bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-slate-900 dark:to-slate-900 border-emerald-200 dark:border-slate-800">
          <div className="flex justify-between items-center text-emerald-600">
            <Bed className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase text-emerald-600">Beds Occupied</span>
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white">{summary.occupiedBeds} / {summary.totalBeds}</p>
          <p className="text-[10px] text-emerald-600 font-bold">{summary.occupancyRate}% Occupancy Rate</p>
        </Card>

        <Card className="p-3.5 space-y-1 bg-gradient-to-br from-cyan-50 to-sky-50/50 dark:from-slate-900 dark:to-slate-900 border-cyan-200 dark:border-slate-800">
          <div className="flex justify-between items-center text-cyan-600">
            <Bed className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase text-cyan-600">Available Beds</span>
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white">{summary.availableBeds}</p>
          <p className="text-[10px] text-slate-500 font-medium">Ready for Admission</p>
        </Card>

        <Card className="p-3.5 space-y-1 bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-slate-900 dark:to-slate-900 border-amber-200 dark:border-slate-800">
          <div className="flex justify-between items-center text-amber-600">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase text-amber-600">Housekeeping</span>
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white">{summary.cleaningBeds}</p>
          <p className="text-[10px] text-amber-600 font-medium">Beds Pending Cleaning</p>
        </Card>

        <Card className="p-3.5 space-y-1 bg-gradient-to-br from-rose-50 to-pink-50/50 dark:from-slate-900 dark:to-slate-900 border-rose-200 dark:border-slate-800">
          <div className="flex justify-between items-center text-rose-600">
            <Bell className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase text-rose-600">Clinical Alerts</span>
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white">{summary.unreadAlertsCount}</p>
          <p className="text-[10px] text-rose-600 font-medium">Unacknowledged</p>
        </Card>

        <Card className="p-3.5 space-y-2 flex flex-col justify-center bg-[#002147] text-white">
          <Button
            variant="primary"
            onClick={onOpenAdmissionModal}
            className="w-full text-xs font-extrabold flex items-center justify-center gap-1.5 py-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Admission</span>
          </Button>
        </Card>
      </div>

      {/* Ward Occupancy Progress Summary */}
      <Card className="p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Ward Occupancy & Bed Distribution</span>
          </h3>
          <button
            onClick={onNavigateToWards}
            className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
          >
            Manage All Wards & Rooms →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {wards.map((ward) => {
            const pct = ward.totalBeds > 0 ? Math.round((ward.occupiedBeds / ward.totalBeds) * 100) : 0;
            return (
              <div
                key={ward.id}
                onClick={onNavigateToWards}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 cursor-pointer hover:border-blue-300 transition"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900 dark:text-white truncate">{ward.name}</span>
                  <span className="text-[10px] font-black text-slate-400">{ward.code}</span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      pct > 80 ? 'bg-rose-500' : pct > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[11px] font-semibold text-slate-500">
                  <span>{ward.occupiedBeds} / {ward.totalBeds} Beds</span>
                  <span className="text-emerald-600 font-bold">{ward.availableBeds} Free</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Inpatient Census Table Section */}
      <Card className="p-5 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-emerald-600" />
              <span>Inpatient Census Directory ({admissions.length})</span>
            </h3>
            <p className="text-xs text-slate-500">
              Active admissions, ward/bed locations, primary diagnosis & clinical workflows
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <Input
                placeholder="Search patient / IPD / UHID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 text-xs h-8 w-48 sm:w-64"
              />
            </div>

            <Select
              options={[
                { value: 'ALL', label: 'All Wards' },
                ...wards.map((w) => ({ value: w.id, label: w.name })),
              ]}
              value={wardFilter}
              onChange={(e) => setWardFilter(e.target.value)}
              className="h-8 text-xs w-40"
            />

            <Select
              options={[
                { value: 'ADMITTED', label: 'Currently Admitted' },
                { value: 'DISCHARGED', label: 'Discharged' },
                { value: 'ALL', label: 'All History' },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 text-xs w-36"
            />
          </div>
        </div>

        {/* Patient Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="p-3">IPD No / Patient Details</th>
                <th className="p-3">Ward & Bed Allocation</th>
                <th className="p-3">Admitting Consultant</th>
                <th className="p-3">Primary Diagnosis & Miasm</th>
                <th className="p-3">Admission Date</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {admissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                    No active inpatient records found matching filter criteria.
                  </td>
                </tr>
              ) : (
                admissions.map((adm) => (
                  <tr key={adm.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition">
                    <td className="p-3 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-[#002147] dark:text-blue-400">{adm.ipdNo}</span>
                        <Badge variant={adm.status === 'ADMITTED' ? 'accent' : 'primary'}>
                          {adm.status}
                        </Badge>
                      </div>
                      <p className="font-extrabold text-slate-900 dark:text-white text-xs">{adm.patientName}</p>
                      <p className="text-[10px] text-slate-500">
                        {adm.gender}, {adm.age} yrs • UHID: <span className="font-mono font-bold">{adm.uhid}</span>
                      </p>
                    </td>

                    <td className="p-3">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 dark:text-white block">{adm.wardName}</span>
                        <span className="text-[11px] font-bold text-emerald-600 block">Bed {adm.bedNo} ({adm.roomNo})</span>
                      </div>
                    </td>

                    <td className="p-3">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">{adm.admittingDoctorName}</span>
                      <span className="text-[10px] text-slate-500 block">{adm.department}</span>
                    </td>

                    <td className="p-3 max-w-xs">
                      <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{adm.primaryDiagnosis}</p>
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
                        Miasm: {adm.miasmaticDiagnosis}
                      </span>
                    </td>

                    <td className="p-3 text-[11px] text-slate-500">
                      {adm.admittedAt}
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => onSelectPatientEmr(adm.ipdNo)}
                          className="px-2.5 py-1.5 bg-[#002147] hover:bg-[#001833] text-white rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1"
                          title="Open Full EMR Workstation"
                        >
                          <Stethoscope className="w-3.5 h-3.5 text-blue-300" />
                          <span>EMR</span>
                        </button>

                        {adm.status === 'ADMITTED' && (
                          <>
                            <button
                              onClick={() => onOpenTransferModal(adm.ipdNo)}
                              className="px-2 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1"
                              title="Transfer Ward or Bed"
                            >
                              <ArrowLeftRight className="w-3.5 h-3.5" />
                              <span>Transfer</span>
                            </button>

                            <button
                              onClick={() => onOpenDischargeModal(adm.ipdNo)}
                              className="px-2 py-1.5 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 text-rose-700 dark:text-rose-300 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1"
                              title="Discharge Patient"
                            >
                              <LogOut className="w-3.5 h-3.5" />
                              <span>Discharge</span>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
