import React, { useState } from 'react';
import { adminHrService } from '../../../services/adminHrService';
import { EmployeeDocument } from '../../../types/adminHr';
import { Modal } from '../../../components/common/Modal';
import { FileText, Plus, Eye, CheckCircle, Search, Upload, File } from 'lucide-react';
import toast from 'react-hot-toast';

export const EmployeeDocumentsView: React.FC = () => {
  const [documents, setDocuments] = useState<EmployeeDocument[]>(adminHrService.getDocuments());
  const employees = adminHrService.getEmployees();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<EmployeeDocument | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFormData, setUploadFormData] = useState({
    empId: employees[0]?.empId || 'BHMC-T-001',
    title: 'MD Degree Certificate',
    docType: 'DEGREE_CERTIFICATE' as EmployeeDocument['docType'],
    fileName: 'Degree_Certificate.pdf',
    fileSize: '2.5 MB',
  });

  const filteredDocs = documents.filter(
    (d) =>
      d.empName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((e) => e.empId === uploadFormData.empId || e.id === uploadFormData.empId);
    if (!emp) return;

    adminHrService.addDocument({
      empId: emp.empId,
      empName: emp.fullName,
      title: uploadFormData.title,
      docType: uploadFormData.docType,
      fileUrl: '/docs/sample_document.pdf',
      fileName: uploadFormData.fileName,
      fileSize: uploadFormData.fileSize,
      verifiedBy: 'Mr. Somnath Ganguly (AO)',
      status: 'VERIFIED',
    });

    toast.success('Document uploaded and verified successfully!');
    setDocuments(adminHrService.getDocuments());
    setIsUploadModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>Employee Institutional Document Repository ({documents.length})</span>
          </h2>
          <p className="text-xs text-slate-500">
            Aadhaar cards, PAN cards, homoeopathic council registration certificates & degree certificates
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4 py-2.5 bg-[#002147] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Staff Document</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs text-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search documents by staff name, ID or document title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <File className="w-5 h-5" />
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {doc.status}
                </span>
              </div>

              <h3 className="font-black text-slate-900 dark:text-white text-sm">{doc.title}</h3>
              <p className="text-xs font-bold text-blue-600">{doc.empName} ({doc.empId})</p>
              <p className="text-[11px] text-slate-500">{doc.fileName} • {doc.fileSize}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
              <span className="text-[10px] text-slate-400">Uploaded {doc.uploadedAt}</span>
              <button
                onClick={() => {
                  setSelectedDocForPreview(doc);
                  setIsPreviewOpen(true);
                }}
                className="px-3 py-1.5 bg-[#002147] text-white font-bold rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} title={`Document Preview: ${selectedDocForPreview?.title}`}>
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-center space-y-2">
            <FileText className="w-12 h-12 text-blue-600 mx-auto" />
            <h4 className="font-black text-base text-slate-900 dark:text-white">{selectedDocForPreview?.title}</h4>
            <p className="text-slate-500">{selectedDocForPreview?.empName} ({selectedDocForPreview?.empId})</p>
            <p className="text-[11px] text-slate-400">Verified by: {selectedDocForPreview?.verifiedBy}</p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
            <p className="font-bold">Official Document Metadata:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1 text-[11px]">
              <li>Type: {selectedDocForPreview?.docType}</li>
              <li>File: {selectedDocForPreview?.fileName} ({selectedDocForPreview?.fileSize})</li>
              <li>Verification Hash: 8f9a2b4c1e0d3f7a</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* Upload Modal */}
      <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} title="Upload Staff Document">
        <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Select Staff Member</label>
            <select
              value={uploadFormData.empId}
              onChange={(e) => setUploadFormData({ ...uploadFormData, empId: e.target.value })}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.empId}>{emp.fullName} ({emp.empId})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Document Title *</label>
            <input
              type="text"
              required
              value={uploadFormData.title}
              onChange={(e) => setUploadFormData({ ...uploadFormData, title: e.target.value })}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Document Type</label>
            <select
              value={uploadFormData.docType}
              onChange={(e) => setUploadFormData({ ...uploadFormData, docType: e.target.value as EmployeeDocument['docType'] })}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
            >
              <option value="DEGREE_CERTIFICATE">DEGREE CERTIFICATE</option>
              <option value="REGISTRATION_CERTIFICATE">REGISTRATION CERTIFICATE</option>
              <option value="AADHAAR">AADHAAR CARD</option>
              <option value="PAN">PAN CARD</option>
              <option value="EXPERIENCE_LETTER">EXPERIENCE LETTER</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-800 font-bold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#002147] text-white font-bold rounded-xl shadow-xs cursor-pointer"
            >
              Upload Document
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
