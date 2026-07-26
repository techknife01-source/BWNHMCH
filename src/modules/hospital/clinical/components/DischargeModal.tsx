import React, { useState } from 'react';
import { Modal } from '../../../../components/common/Modal';
import { Select } from '../../../../components/common/Select';
import { Textarea } from '../../../../components/common/Textarea';
import { Button } from '../../../../components/common/Button';
import { hospitalClinicalService } from '../../../../services/hospitalClinicalService';
import { IpdAdmission } from '../../../../types/clinical';
import { FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

interface DischargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  admission: IpdAdmission | null;
}

export const DischargeModal: React.FC<DischargeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  admission,
}) => {
  if (!admission) return null;

  const [dischargeType, setDischargeType] = useState<'DISCHARGED' | 'LAMA' | 'DECEASED'>('DISCHARGED');
  const [conditionOnDischarge, setConditionOnDischarge] = useState<'Cured' | 'Improved' | 'Unchanged' | 'Referred' | 'Expired'>('Improved');
  const [dischargeSummary, setDischargeSummary] = useState(
    `Patient ${admission.patientName} was admitted on ${admission.admittedAt} with ${admission.primaryDiagnosis}. Clinical progress evaluated under Homoeopathic treatment. Vital signs stable at discharge. Prescribed Sac Lac and constitutional remedy for follow-up.`
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    hospitalClinicalService.dischargePatient(
      admission.ipdNo,
      dischargeType,
      dischargeSummary,
      conditionOnDischarge
    );

    toast.success(`Patient Discharge Recorded for ${admission.patientName}`);
    onSuccess();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Patient Discharge & Summary Generator" className="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
          <p className="font-bold text-slate-900 dark:text-white">{admission.patientName} (IPD: {admission.ipdNo})</p>
          <p className="text-[11px] text-slate-500">
            Admitted: {admission.admittedAt} • Ward: {admission.wardName} ({admission.bedNo}) • Doctor: {admission.admittingDoctorName}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Discharge Type *"
            options={[
              { value: 'DISCHARGED', label: 'Normal Discharge' },
              { value: 'LAMA', label: 'LAMA (Left Against Medical Advice)' },
              { value: 'DECEASED', label: 'Expired / Deceased' },
            ]}
            value={dischargeType}
            onChange={(e) => setDischargeType(e.target.value as any)}
          />

          <Select
            label="Condition at Discharge *"
            options={[
              { value: 'Improved', label: 'Improved / Symptomatic Relief' },
              { value: 'Cured', label: 'Cured' },
              { value: 'Unchanged', label: 'Unchanged' },
              { value: 'Referred', label: 'Referred to Higher Centre' },
              { value: 'Expired', label: 'Expired' },
            ]}
            value={conditionOnDischarge}
            onChange={(e) => setConditionOnDischarge(e.target.value as any)}
          />
        </div>

        <Textarea
          label="Clinical Discharge Summary & Instructions *"
          rows={5}
          value={dischargeSummary}
          onChange={(e) => setDischargeSummary(e.target.value)}
          required
        />

        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start space-x-2 text-[11px] text-amber-800 dark:text-amber-300">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            Confirming discharge will mark Bed <span className="font-bold">{admission.bedNo}</span> as{' '}
            <span className="font-bold text-rose-600">DIRTY / CLEANING REQUIRED</span> and update IPD status to{' '}
            <span className="font-bold">{dischargeType}</span>.
          </p>
        </div>

        <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" type="submit">
            Confirm Patient Discharge
          </Button>
        </div>
      </form>
    </Modal>
  );
};
