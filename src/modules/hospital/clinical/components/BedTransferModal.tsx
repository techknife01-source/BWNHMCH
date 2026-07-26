import React, { useState } from 'react';
import { Modal } from '../../../../components/common/Modal';
import { Select } from '../../../../components/common/Select';
import { Input } from '../../../../components/common/Input';
import { Button } from '../../../../components/common/Button';
import { hospitalClinicalService } from '../../../../services/hospitalClinicalService';
import { IpdAdmission } from '../../../../types/clinical';
import { ArrowLeftRight, Bed, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface BedTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  admission: IpdAdmission | null;
}

export const BedTransferModal: React.FC<BedTransferModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  admission,
}) => {
  if (!admission) return null;

  const wards = hospitalClinicalService.getWards();

  const [toWardId, setToWardId] = useState(admission.wardId);
  const [toRoomId, setToRoomId] = useState(admission.roomId);
  const [toBedId, setToBedId] = useState('');
  const [reason, setReason] = useState('');
  const [transferredBy, setTransferredBy] = useState('Duty Nurse / Resident Doctor');

  const availableRooms = hospitalClinicalService.getRooms(toWardId);
  const availableBeds = hospitalClinicalService.getBeds(toWardId, toRoomId, 'AVAILABLE');

  const handleWardChange = (wardId: string) => {
    setToWardId(wardId);
    const rooms = hospitalClinicalService.getRooms(wardId);
    const firstRoomId = rooms[0]?.id || '';
    const beds = hospitalClinicalService.getBeds(wardId, firstRoomId, 'AVAILABLE');
    setToRoomId(firstRoomId);
    setToBedId(beds[0]?.id || '');
  };

  const handleRoomChange = (roomId: string) => {
    setToRoomId(roomId);
    const beds = hospitalClinicalService.getBeds(toWardId, roomId, 'AVAILABLE');
    setToBedId(beds[0]?.id || '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toBedId) {
      toast.error('Please select an available target bed.');
      return;
    }

    hospitalClinicalService.transferPatientBed(
      admission.ipdNo,
      toWardId,
      toRoomId,
      toBedId,
      reason || 'Clinical / Administrative request',
      transferredBy
    );

    toast.success(`Bed Transfer Completed for ${admission.patientName}!`);
    onSuccess();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ward / Bed Transfer Request" className="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
          <p className="font-bold text-slate-900 dark:text-white">{admission.patientName} ({admission.ipdNo})</p>
          <p className="text-[11px] text-slate-500">
            Current Position: <span className="font-bold text-blue-600">{admission.wardName}</span> • Room: {admission.roomNo} • Bed: <span className="font-bold">{admission.bedNo}</span>
          </p>
        </div>

        <div className="space-y-3 p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-xl">
          <p className="font-bold text-blue-950 dark:text-blue-300 flex items-center gap-1.5">
            <ArrowLeftRight className="w-4 h-4 text-blue-600" />
            <span>Select Target Destination</span>
          </p>

          <Select
            label="Target Ward *"
            options={wards.map((w) => ({ value: w.id, label: `${w.name} (${w.availableBeds} Available)` }))}
            value={toWardId}
            onChange={(e) => handleWardChange(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Target Room *"
              options={
                availableRooms.length > 0
                  ? availableRooms.map((r) => ({ value: r.id, label: `${r.roomNo} (${r.roomType})` }))
                  : [{ value: '', label: 'No Rooms' }]
              }
              value={toRoomId}
              onChange={(e) => handleRoomChange(e.target.value)}
            />

            <Select
              label="Target Bed *"
              options={
                availableBeds.length > 0
                  ? availableBeds.map((b) => ({ value: b.id, label: `Bed ${b.bedNo}` }))
                  : [{ value: '', label: 'No Available Beds' }]
              }
              value={toBedId}
              onChange={(e) => setToBedId(e.target.value)}
            />
          </div>
        </div>

        <Input
          label="Reason for Transfer *"
          placeholder="e.g. Isolation requirement / Step-down from ICU / Patient preference"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />

        <Input
          label="Authorized By"
          value={transferredBy}
          onChange={(e) => setTransferredBy(e.target.value)}
        />

        <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={!toBedId}>
            Execute Transfer
          </Button>
        </div>
      </form>
    </Modal>
  );
};
