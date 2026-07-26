import React, { useState } from 'react';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Textarea } from '../../../components/common/Textarea';
import { FileUpload } from '../../../components/common/FileUpload';
import { Assignment } from '../../../types/index';
import { assignmentApi } from '../../../services/api/assignment.api';
import { Upload, FileText, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  assignment: Assignment | null;
  onSuccess: () => void;
}

export const SubmitAssignmentModal: React.FC<Props> = ({ isOpen, onClose, assignment, onSuccess }) => {
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [submissionLink, setSubmissionLink] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!assignment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('notes', submissionNotes);
      formData.append('link', submissionLink);
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const res = await assignmentApi.submitAssignment(assignment.id, formData);
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setErrorMsg(res.message || 'Failed to submit assignment');
      }
    } catch {
      setErrorMsg('An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Submit Assignment: ${assignment.subjectCode}`}
      subtitle={assignment.title}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 text-xs bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 rounded-lg">
            {errorMsg}
          </div>
        )}

        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl space-y-2 border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Subject: <strong>{assignment.subjectName}</strong></span>
            <span>Due Date: <strong className="text-amber-600 dark:text-amber-400">{assignment.dueDate}</strong></span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{assignment.description}</p>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Attach Document / Solution PDF
          </label>
          <FileUpload
            value={selectedFile ? [selectedFile] : []}
            onChange={(files) => setSelectedFile(files[0] || null)}
            accept=".pdf,.doc,.docx"
            maxSize={10 * 1024 * 1024}
            multiple={false}
          />
        </div>

        <div>
          <Input
            label="Optional Google Drive / GitHub Solution Link"
            placeholder="https://drive.google.com/file/d/..."
            value={submissionLink}
            onChange={(e) => setSubmissionLink(e.target.value)}
          />
        </div>

        <div>
          <Textarea
            label="Submission Notes & Miasmatic References"
            placeholder="Enter clinical case findings, organon aphorisms cited, or summary..."
            rows={3}
            value={submissionNotes}
            onChange={(e) => setSubmissionNotes(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isSubmitting} leftIcon={<Upload className="h-4 w-4" />}>
            Submit Assignment
          </Button>
        </div>
      </form>
    </Modal>
  );
};
