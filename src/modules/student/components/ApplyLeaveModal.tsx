import React, { useState } from 'react';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Textarea } from '../../../components/common/Textarea';
import { Select } from '../../../components/common/Select';
import { FileUpload } from '../../../components/common/FileUpload';
import { LeaveType } from '../types/studentErp.types';
import { studentErpService } from '../services/studentErp.service';
import { Calendar, FileText } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ApplyLeaveModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [leaveType, setLeaveType] = useState<LeaveType>('MEDICAL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 1;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await studentErpService.applyLeave({
        leaveType,
        startDate,
        endDate,
        totalDays: calculateDays(),
        reason,
        attachmentUrl: file ? file.name : undefined,
      });

      if (res.success) {
        onSuccess();
        onClose();
        setReason('');
        setStartDate('');
        setEndDate('');
        setFile(null);
      } else {
        setErrorMsg(res.message || 'Failed to submit leave application');
      }
    } catch {
      setErrorMsg('Error submitting leave application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Apply for Student Leave"
      subtitle="Leave request will be submitted to the Principal & Medical Superintendent"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 text-xs bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 rounded-lg">
            {errorMsg}
          </div>
        )}

        <Select
          label="Leave Category"
          value={leaveType}
          onChange={(e) => setLeaveType(e.target.value as LeaveType)}
          options={[
            { label: 'Medical Leave (Prescription required)', value: 'MEDICAL' },
            { label: 'Casual / Personal Leave', value: 'CASUAL' },
            { label: 'Duty Leave (NSS / Sports / Hospital Duty)', value: 'DUTY_LEAVE' },
            { label: 'Academic / Seminar Representation Leave', value: 'ACADEMIC' },
          ]}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            type="date"
            label="Start Date *"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <Input
            type="date"
            label="End Date *"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        {startDate && endDate && (
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium flex items-center justify-between">
            <span>Calculated Duration:</span>
            <span className="font-bold">{calculateDays()} Day(s)</span>
          </div>
        )}

        <Textarea
          label="Reason for Leave *"
          placeholder="State specific medical symptoms, clinical doctor recommendation, or academic reason..."
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Medical Prescription / Supporting Document Attachment
          </label>
          <FileUpload
            value={file ? [file] : []}
            onChange={(files) => setFile(files[0] || null)}
            accept=".pdf,.jpg,.png"
            maxSize={5 * 1024 * 1024}
            multiple={false}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isSubmitting} leftIcon={<Calendar className="h-4 w-4" />}>
            Submit Leave Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};
