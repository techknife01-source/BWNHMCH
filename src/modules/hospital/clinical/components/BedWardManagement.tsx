import React, { useState } from 'react';
import { Card } from '../../../../components/common/Card';
import { Badge } from '../../../../components/common/Badge';
import { Select } from '../../../../components/common/Select';
import { hospitalClinicalService } from '../../../../services/hospitalClinicalService';
import { WardInfo, RoomInfo, BedInfo } from '../../../../types/clinical';
import {
  Bed as BedIcon,
  Building2,
  Sparkles,
  Wrench,
  UserCheck,
  CheckCircle2,
  Clock,
  ArrowLeftRight,
  UserX,
  ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface BedWardManagementProps {
  onSelectPatientEmr: (ipdNo: string) => void;
  onOpenTransferModal: (ipdNo: string) => void;
}

export const BedWardManagement: React.FC<BedWardManagementProps> = ({
  onSelectPatientEmr,
  onOpenTransferModal,
}) => {
  const wards = hospitalClinicalService.getWards();
  const [selectedWardId, setSelectedWardId] = useState<string>(wards[0]?.id || 'ward-m');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const selectedWard = wards.find((w) => w.id === selectedWardId) || wards[0];
  const rooms = hospitalClinicalService.getRooms(selectedWardId);
  const beds = hospitalClinicalService.getBeds(selectedWardId, 'ALL', statusFilter);

  const handleBedCleaned = (bedId: string) => {
    hospitalClinicalService.updateBedStatus(bedId, 'AVAILABLE');
    toast.success('Bed marked as Cleaned & Available!');
    setSelectedWardId((prev) => prev); // force refresh
  };

  const handleBedMaintenance = (bedId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'MAINTENANCE' ? 'AVAILABLE' : 'MAINTENANCE';
    hospitalClinicalService.updateBedStatus(bedId, newStatus);
    toast.success(`Bed status updated to ${newStatus}`);
    setSelectedWardId((prev) => prev);
  };

  return (
    <div className="space-y-6">
      {/* Header & Ward Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BedIcon className="w-6 h-6 text-blue-600" />
            <span>Ward, Room & Live Bed Management Grid</span>
          </h2>
          <p className="text-xs text-slate-500">
            Real-time occupancy tracking, house-keeping cleaning status, and room amenities
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select
            options={[
              { value: 'ALL', label: 'All Bed Statuses' },
              { value: 'OCCUPIED', label: 'Occupied' },
              { value: 'AVAILABLE', label: 'Available' },
              { value: 'DIRTY_CLEANING', label: 'Cleaning Required' },
              { value: 'MAINTENANCE', label: 'Under Maintenance' },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-48"
          />
        </div>
      </div>

      {/* Ward Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {wards.map((ward) => {
          const isActive = ward.id === selectedWardId;
          return (
            <button
              key={ward.id}
              onClick={() => setSelectedWardId(ward.id)}
              className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                isActive
                  ? 'bg-[#002147] text-white border-[#002147] shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <p className="font-extrabold text-xs truncate">{ward.name}</p>
                <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {ward.code}
                </span>
              </div>
              <p className={`text-[10px] mt-1.5 ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                In-Charge: {ward.nurseInCharge}
              </p>
              <div className="flex items-center justify-between mt-3 text-[11px] font-bold">
                <span>{ward.occupiedBeds} / {ward.totalBeds} Occupied</span>
                <span className={isActive ? 'text-emerald-300' : 'text-emerald-600'}>
                  {ward.availableBeds} Free
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Ward Banner */}
      <Card className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-extrabold text-base">{selectedWard?.name} Overview</h3>
            <Badge variant="accent">{selectedWard?.genderRestriction} Restriction</Badge>
          </div>
          <p className="text-xs text-slate-300">
            Sister In-Charge: <span className="font-bold text-white">{selectedWard?.nurseInCharge}</span>
          </p>
        </div>

        <div className="flex items-center space-x-6 text-xs border-t md:border-t-0 pt-2 md:pt-0 border-slate-700">
          <div className="text-center">
            <p className="text-slate-400 text-[10px] uppercase font-bold">Total Capacity</p>
            <p className="text-base font-black">{selectedWard?.totalBeds} Beds</p>
          </div>
          <div className="text-center">
            <p className="text-rose-300 text-[10px] uppercase font-bold">Occupied</p>
            <p className="text-base font-black text-rose-400">{selectedWard?.occupiedBeds}</p>
          </div>
          <div className="text-center">
            <p className="text-emerald-300 text-[10px] uppercase font-bold">Available</p>
            <p className="text-base font-black text-emerald-400">{selectedWard?.availableBeds}</p>
          </div>
          <div className="text-center">
            <p className="text-amber-300 text-[10px] uppercase font-bold">Maintenance</p>
            <p className="text-base font-black text-amber-400">{selectedWard?.maintenanceBeds}</p>
          </div>
        </div>
      </Card>

      {/* Rooms and Bed Grid */}
      <div className="space-y-6">
        {rooms.map((room) => {
          const roomBeds = beds.filter((b) => b.roomId === room.id);
          return (
            <Card key={room.id} className="p-5 space-y-4">
              {/* Room Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">Room {room.roomNo}</h4>
                    <span className="text-xs text-slate-500 font-semibold">• {room.roomType}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {room.amenities.map((a, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-medium"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-[#002147] dark:text-blue-400">
                    ₹{room.chargePerDay} / day
                  </span>
                </div>
              </div>

              {/* Beds Grid for Room */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {roomBeds.length === 0 ? (
                  <p className="text-xs text-slate-400 italic col-span-full">No beds match filter in this room.</p>
                ) : (
                  roomBeds.map((bed) => {
                    const isOccupied = bed.status === 'OCCUPIED';
                    const isCleaning = bed.status === 'DIRTY_CLEANING';
                    const isMaintenance = bed.status === 'MAINTENANCE';

                    return (
                      <div
                        key={bed.id}
                        className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition relative overflow-hidden ${
                          isOccupied
                            ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40'
                            : isCleaning
                            ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40'
                            : isMaintenance
                            ? 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-800 opacity-75'
                            : 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40'
                        }`}
                      >
                        {/* Bed Header */}
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-1.5">
                            <BedIcon
                              className={`w-4 h-4 ${
                                isOccupied
                                  ? 'text-rose-600'
                                  : isCleaning
                                  ? 'text-amber-600'
                                  : isMaintenance
                                  ? 'text-slate-500'
                                  : 'text-emerald-600'
                              }`}
                            />
                            <span className="font-black text-xs text-slate-900 dark:text-white">
                              Bed {bed.bedNo}
                            </span>
                          </div>

                          <Badge
                            variant={
                              isOccupied
                                ? 'danger'
                                : isCleaning
                                ? 'warning'
                                : isMaintenance
                                ? 'primary'
                                : 'accent'
                            }
                          >
                            {isOccupied
                              ? 'OCCUPIED'
                              : isCleaning
                              ? 'CLEANING'
                              : isMaintenance
                              ? 'MAINTENANCE'
                              : 'AVAILABLE'}
                          </Badge>
                        </div>

                        {/* Bed Content */}
                        {isOccupied ? (
                          <div className="space-y-1 p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-rose-100 dark:border-rose-900/30 text-xs">
                            <p className="font-extrabold text-slate-900 dark:text-white truncate">
                              {bed.currentPatientName}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              IPD: <span className="font-bold text-blue-600">{bed.currentIpdNo}</span>
                            </p>
                            <p className="text-[10px] text-slate-500">UHID: {bed.currentUhid}</p>
                          </div>
                        ) : isCleaning ? (
                          <div className="p-2 rounded-lg bg-amber-100/50 dark:bg-amber-950/40 text-[11px] text-amber-900 dark:text-amber-200 space-y-1">
                            <p className="font-bold flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                              <span>Housekeeping Pending</span>
                            </p>
                            <p className="text-[10px]">Bed needs sanitization after discharge.</p>
                          </div>
                        ) : isMaintenance ? (
                          <div className="p-2 rounded-lg bg-slate-200/50 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                            <p className="font-bold flex items-center gap-1">
                              <Wrench className="w-3.5 h-3.5" />
                              <span>Under Repair</span>
                            </p>
                          </div>
                        ) : (
                          <div className="p-2 rounded-lg bg-emerald-100/40 dark:bg-emerald-950/30 text-[11px] text-emerald-800 dark:text-emerald-300">
                            <p className="font-bold">Ready for Admission</p>
                            <p className="text-[10px] text-emerald-600">Cleaned & sanitized</p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end space-x-1 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                          {isOccupied && bed.currentIpdNo && (
                            <>
                              <button
                                onClick={() => onSelectPatientEmr(bed.currentIpdNo!)}
                                className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold transition cursor-pointer"
                              >
                                View EMR
                              </button>
                              <button
                                onClick={() => onOpenTransferModal(bed.currentIpdNo!)}
                                className="px-2 py-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 rounded text-[10px] font-bold transition cursor-pointer flex items-center gap-1"
                              >
                                <ArrowLeftRight className="w-3 h-3" />
                                <span>Transfer</span>
                              </button>
                            </>
                          )}

                          {isCleaning && (
                            <button
                              onClick={() => handleBedCleaned(bed.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold transition cursor-pointer flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Mark Sanitized</span>
                            </button>
                          )}

                          {!isOccupied && (
                            <button
                              onClick={() => handleBedMaintenance(bed.id, bed.status)}
                              className="px-2 py-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-[10px] font-semibold cursor-pointer"
                            >
                              {isMaintenance ? 'Clear Maintenance' : 'Mark Repair'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
