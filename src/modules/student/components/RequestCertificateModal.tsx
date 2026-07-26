import React, { useState } from 'react';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { Textarea } from '../../../components/common/Textarea';
import { CertificateType } from '../types/studentErp.types';
import { studentErpService } from '../services/studentErp.service';
import { Award, FileText } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RequestCertificateModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [certType, setCertType] = useState<CertificateType>('BONAFIDE');
  const [title, setTitle] = useState('Bonafide Student Certificate');
  const [purpose, setPurpose] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTypeChange = (val: string) => {
    const type = val as CertificateType;
    setCertType(type);
    switch (type) {
      case 'BONAFIDE':
        setTitle('Bonafide Student Certificate');
        break;
      case 'TRANSFER':
        setTitle('College Transfer & Migration Certificate');
        break;
      case 'CONDUCT':
        setTitle('Character & Conduct Certificate');
        break;
      case 'FEE_NOC':
        setTitle('Fee Clearance No Dues Certificate (NOC)');
        break;
      case 'LIBRARY_NOC':
        setTitle('E-Library Book Clearance Certificate');
        break;
      case 'INTERNSHIP_COMPLETION':
        setTitle('BHMS Clinical Internship Completion Certificate');
        break;
      case 'ATTENDANCE_CERTIFICATE':
        setTitle('Official WBUHS Attendance Percentage Certificate');
        break;
      default:
        setTitle('Certificate Application');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!purpose) {
      setErrorMsg('Please state the purpose for requesting this certificate.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await studentErpService.requestCertificate(certType, title, purpose);
      if (res.success) {
        onSuccess();
        onClose();
        setPurpose('');
      } else {
        setErrorMsg(res.message || 'Failed to submit request');
      }
    } catch {
      setErrorMsg('Error submitting certificate request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Official Academic Certificate"
      subtitle="Issued by Principal & Administrative Office with Holographic QR Stamp"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 text-xs bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 rounded-lg">
            {errorMsg}
          </div>
        )}

        <Select
          label="Certificate Category *"
          value={certType}
          onChange={(e) => handleTypeChange(e.target.value)}
          options={[
            { label: 'Bonafide Student Certificate', value: 'BONAFIDE' },
            { label: 'Fee Clearance No Dues (NOC)', value: 'FEE_NOC' },
            { label: 'Library Book Clearance (NOC)', value: 'LIBRARY_NOC' },
            { label: 'Character & Conduct Certificate', value: 'CONDUCT' },
            { label: 'Official WBUHS Attendance Certificate', value: 'ATTENDANCE_CERTIFICATE' },
            { label: 'BHMS Internship Completion Certificate', value: 'INTERNSHIP_COMPLETION' },
            { label: 'Transfer / Migration Certificate', value: 'TRANSFER' },
          ]}
        />

        <Input
          label="Document Name"
          value={title}
          readOnly
          disabled
        />

        <Textarea
          label="Purpose / Authority Requesting Certificate *"
          placeholder="State reason (e.g. Bank Account opening, Passport Office, WBUHS Scholarship, Internship Application)..."
          rows={3}
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          required
        />

        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg text-xs text-amber-800 dark:text-amber-300">
          Note: Verified certificates are processed within 1-2 working days and available for instant PDF download in your portal.
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isSubmitting} leftIcon={<Award className="h-4 w-4" />}>
            Submit Certificate Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};
