import React, { useState } from 'react';
import { Modal } from '../../../../components/common/Modal';
import { Input } from '../../../../components/common/Input';
import { Select } from '../../../../components/common/Select';
import { Textarea } from '../../../../components/common/Textarea';
import { Button } from '../../../../components/common/Button';
import { hospitalCoreService } from '../../../../services/hospitalCoreService';
import { hospitalClinicalService } from '../../../../services/hospitalClinicalService';
import { Patient } from '../../../../types/hospital';
import { UserCheck, Stethoscope, Bed, DollarSign, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface IpdAdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  preSelectedPatient?: Patient | null;
}

export const IpdAdmissionModal: React.FC<IpdAdmissionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  preSelectedPatient,
}) => {
  const [patientLookup, setPatientLookup] = useState('');
  const [matchedPatient, setMatchedPatient] = useState<Patient | null>(preSelectedPatient || null);

  const doctors = hospitalCoreService.getDoctors();
  const wards = hospitalClinicalService.getWards();

  const [formData, setFormData] = useState({
    admittingDoctorId: doctors[0]?.id || '',
    wardId: wards[0]?.id || '',
    roomId: '',
    bedId: '',
    primaryDiagnosis: '',
    miasmaticDiagnosis: 'Psora' as const,
    admissionType: 'Routine OPD Transfer' as const,
    depositAmount: 1000,
    attendantName: '',
    attendantPhone: '',
  });

  const availableRooms = hospitalClinicalService.getRooms(formData.wardId);
  const availableBeds = hospitalClinicalService.getBeds(formData.wardId, formData.roomId, 'AVAILABLE');

  // Sync selected room/bed on ward change
  const handleWardChange = (wardId: string) => {
    const rooms = hospitalClinicalService.getRooms(wardId);
    const firstRoomId = rooms[0]?.id || '';
    const beds = hospitalClinicalService.getBeds(wardId, firstRoomId, 'AVAILABLE');
    setFormData({
      ...formData,
      wardId,
      roomId: firstRoomId,
      bedId: beds[0]?.id || '',
    });
  };

  const handleRoomChange = (roomId: string) => {
    const beds = hospitalClinicalService.getBeds(formData.wardId, roomId, 'AVAILABLE');
    setFormData({
      ...formData,
      roomId,
      bedId: beds[0]?.id || '',
    });
  };

  const handlePatientSearch = (query: string) => {
    setPatientLookup(query);
    if (!query) {
      setMatchedPatient(null);
      return;
    }
    const found = hospitalCoreService.getPatientByUhid(query);
    setMatchedPatient(found || null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchedPatient) {
      toast.error('Please lookup and select a registered patient by UHID.');
      return;
    }

    const doctor = doctors.find((d) => d.id === formData.admittingDoctorId);
    if (!doctor) {
      toast.error('Please select an admitting consultant doctor.');
      return;
    }

    if (!formData.bedId) {
      toast.error('No available bed selected. Please select a valid ward, room, and bed.');
      return;
    }

    const newAdm = hospitalClinicalService.admitPatient({
      uhid: matchedPatient.uhid,
      patientName: matchedPatient.fullName,
      age: matchedPatient.age,
      gender: matchedPatient.gender,
      phone: matchedPatient.phone,
      bloodGroup: matchedPatient.bloodGroup,
      admittingDoctorId: doctor.id,
      admittingDoctorName: doctor.name,
      department: doctor.department,
      wardId: formData.wardId,
      roomId: formData.roomId,
      bedId: formData.bedId,
      primaryDiagnosis: formData.primaryDiagnosis || 'Acute Clinical Evaluation',
      miasmaticDiagnosis: formData.miasmaticDiagnosis,
      admissionType: formData.admissionType,
      depositAmount: Number(formData.depositAmount) || 0,
      attendantName: formData.attendantName || matchedPatient.emergencyContactName || 'Family Member',
      attendantPhone: formData.attendantPhone || matchedPatient.emergencyContactPhone || matchedPatient.phone,
    });

    toast.success(`Patient Admitted Successfully! IPD No: ${newAdm.ipdNo}`);
    onSuccess();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="IPD New Patient Admission Form" className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Patient Lookup Section */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
          <label className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span>Search Registered Patient (UHID / Name / Phone) *</span>
          </label>
          <Input
            placeholder="Type UHID e.g. BHMC-2026-0001 or patient name..."
            value={patientLookup}
            onChange={(e) => handlePatientSearch(e.target.value)}
          />

          {matchedPatient ? (
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-emerald-950 dark:text-emerald-200">
                  {matchedPatient.fullName} ({matchedPatient.gender}, {matchedPatient.age} yrs)
                </p>
                <p className="text-[10px] text-emerald-700 dark:text-emerald-400">
                  UHID: <span className="font-mono font-bold">{matchedPatient.uhid}</span> • Blood: {matchedPatient.bloodGroup} • Ph: {matchedPatient.phone}
                </p>
              </div>
              <span className="px-2 py-1 bg-emerald-600 text-white font-bold rounded text-[10px]">
                SELECTED
              </span>
            </div>
          ) : (
            patientLookup && (
              <p className="text-rose-500 text-[11px] flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Patient not found. Please register patient first in OPD Reception.</span>
              </p>
            )
          )}
        </div>

        {/* Admitting Consultant & Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Admitting Consultant Doctor *"
            options={doctors.map((d) => ({ value: d.id, label: `${d.name} (${d.department})` }))}
            value={formData.admittingDoctorId}
            onChange={(e) => setFormData({ ...formData, admittingDoctorId: e.target.value })}
          />

          <Select
            label="Admission Type *"
            options={[
              { value: 'Routine OPD Transfer', label: 'Routine OPD Transfer' },
              { value: 'Emergency', label: 'Emergency Admission' },
              { value: 'Referral', label: 'External Hospital Referral' },
            ]}
            value={formData.admissionType}
            onChange={(e) => setFormData({ ...formData, admissionType: e.target.value as any })}
          />
        </div>

        {/* Ward, Room & Bed Selection */}
        <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-xl space-y-3">
          <p className="font-bold text-blue-950 dark:text-blue-300 flex items-center gap-1.5">
            <Bed className="w-4 h-4 text-blue-600" />
            <span>Ward, Room & Bed Allocation</span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              label="IPD Ward *"
              options={wards.map((w) => ({ value: w.id, label: `${w.name} (${w.availableBeds} Free)` }))}
              value={formData.wardId}
              onChange={(e) => handleWardChange(e.target.value)}
            />

            <Select
              label="Room *"
              options={
                availableRooms.length > 0
                  ? availableRooms.map((r) => ({ value: r.id, label: `${r.roomNo} (${r.roomType})` }))
                  : [{ value: '', label: 'No Rooms Available' }]
              }
              value={formData.roomId}
              onChange={(e) => handleRoomChange(e.target.value)}
            />

            <Select
              label="Bed Number *"
              options={
                availableBeds.length > 0
                  ? availableBeds.map((b) => ({ value: b.id, label: `Bed ${b.bedNo}` }))
                  : [{ value: '', label: 'No Beds Available' }]
              }
              value={formData.bedId}
              onChange={(e) => setFormData({ ...formData, bedId: e.target.value })}
            />
          </div>
        </div>

        {/* Clinical Diagnosis & Miasm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Primary Admission Diagnosis *"
            placeholder="e.g. Acute exacerbation of bronchial asthma"
            value={formData.primaryDiagnosis}
            onChange={(e) => setFormData({ ...formData, primaryDiagnosis: e.target.value })}
            required
          />

          <Select
            label="Miasmatic Assessment *"
            options={[
              { value: 'Psora', label: 'Psoric Miasm (Hypersensitivity & Inflammation)' },
              { value: 'Sycosis', label: 'Sycotic Miasm (Infiltration & Overgrowth)' },
              { value: 'Syphilis', label: 'Syphilitic Miasm (Destructive & Ulcerative)' },
              { value: 'Tubercular', label: 'Tubercular Miasm (Rapid emaciation/fever)' },
              { value: 'Mixed Miasm', label: 'Mixed Complex Miasm' },
            ]}
            value={formData.miasmaticDiagnosis}
            onChange={(e) => setFormData({ ...formData, miasmaticDiagnosis: e.target.value as any })}
          />
        </div>

        {/* Financial Deposit & Attendant Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Advance Deposit Amount (₹)"
            type="number"
            value={formData.depositAmount}
            onChange={(e) => setFormData({ ...formData, depositAmount: Number(e.target.value) })}
          />

          <Input
            label="Patient Attendant Name"
            placeholder="Name of family member"
            value={formData.attendantName}
            onChange={(e) => setFormData({ ...formData, attendantName: e.target.value })}
          />

          <Input
            label="Attendant Contact Phone"
            placeholder="10-digit mobile number"
            value={formData.attendantPhone}
            onChange={(e) => setFormData({ ...formData, attendantPhone: e.target.value })}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={!matchedPatient || !formData.bedId}>
            Confirm IPD Admission
          </Button>
        </div>
      </form>
    </Modal>
  );
};
