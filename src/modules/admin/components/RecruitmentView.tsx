import React, { useState } from 'react';
import { adminHrService } from '../../../services/adminHrService';
import { JobRequisition, CandidateApplication } from '../../../types/adminHr';
import { Modal } from '../../../components/common/Modal';
import { Briefcase, Plus, UserCheck, Calendar, DollarSign, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

export const RecruitmentView: React.FC = () => {
  const [requisitions, setRequisitions] = useState<JobRequisition[]>(adminHrService.getJobRequisitions());
  const [candidates, setCandidates] = useState<CandidateApplication[]>(adminHrService.getCandidateApplications());

  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);
  const [jobFormData, setJobFormData] = useState({
    jobCode: 'REQ-2026-03',
    title: 'Professor - Homoeopathic Repertory',
    departmentName: 'Case Taking & Repertory',
    vacancies: 1,
    minQualification: 'MD (Homoeopathy)',
    minExperienceYears: 8,
    status: 'OPEN' as JobRequisition['status'],
    postedDate: '2026-07-20',
    closingDate: '2026-08-31',
    salaryRange: '₹1,10,000 - ₹1,35,000 / month',
    description: 'Senior academic teaching and research lead for repertory software lab.',
  });

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    adminHrService.addJobRequisition(jobFormData);
    toast.success('Job requisition published!');
    setRequisitions(adminHrService.getJobRequisitions());
    setIsNewJobModalOpen(false);
  };

  const handleUpdateCandidateStatus = (id: string, status: CandidateApplication['status']) => {
    adminHrService.updateCandidateStatus(id, status);
    toast.success(`Candidate status updated to ${status}`);
    setCandidates(adminHrService.getCandidateApplications());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-600" />
            <span>Faculty & Medical Staff Recruitment ({requisitions.length} Open Requisitions)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Publish vacancies, screen candidate applications, schedule interviews & select recruits
          </p>
        </div>

        <button
          onClick={() => setIsNewJobModalOpen(true)}
          className="px-4 py-2.5 bg-[#002147] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Job Requisition</span>
        </button>
      </div>

      {/* Open Positions Grid */}
      <div className="space-y-4">
        <h3 className="font-black text-sm text-slate-900 dark:text-white">Active Job Vacancies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requisitions.map((req) => (
            <div key={req.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-950 px-2.5 py-1 rounded-lg">
                  {req.jobCode}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {req.vacancies} Vacancy
                </span>
              </div>

              <div>
                <h4 className="font-black text-base text-slate-900 dark:text-white">{req.title}</h4>
                <p className="text-xs font-semibold text-blue-600">{req.departmentName}</p>
                <p className="text-xs text-slate-500 mt-1">{req.description}</p>
              </div>

              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs space-y-1">
                <p><strong>Min Qualification:</strong> {req.minQualification} ({req.minExperienceYears}+ yrs exp)</p>
                <p><strong>Salary Range:</strong> {req.salaryRange}</p>
                <p><strong>Closing Date:</strong> {req.closingDate}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Candidate Pipeline */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-emerald-600" />
          <span>Candidate Application Pipeline ({candidates.length})</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
                <th className="p-3">Candidate Name</th>
                <th className="p-3">Position Applied</th>
                <th className="p-3">Qualifications</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {candidates.map((can) => (
                <tr key={can.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="p-3">
                    <p className="font-bold text-slate-900 dark:text-white">{can.candidateName}</p>
                    <p className="text-[10px] text-slate-500">{can.email} • {can.phone}</p>
                  </td>
                  <td className="p-3 text-slate-700 dark:text-slate-300 font-semibold">{can.requisitionTitle}</td>
                  <td className="p-3 text-slate-500">{can.qualification} ({can.experienceYears} yrs)</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      can.status === 'SELECTED'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : can.status === 'SHORTLISTED'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {can.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => handleUpdateCandidateStatus(can.id, 'SELECTED')}
                        className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg cursor-pointer"
                      >
                        Select
                      </button>
                      <button
                        onClick={() => handleUpdateCandidateStatus(can.id, 'REJECTED')}
                        className="px-2.5 py-1 bg-rose-600 text-white font-bold rounded-lg cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isNewJobModalOpen} onClose={() => setIsNewJobModalOpen(false)} title="Publish Job Requisition">
        <form onSubmit={handleAddJob} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Job Title *</label>
            <input
              type="text"
              required
              value={jobFormData.title}
              onChange={(e) => setJobFormData({ ...jobFormData, title: e.target.value })}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Department</label>
            <input
              type="text"
              value={jobFormData.departmentName}
              onChange={(e) => setJobFormData({ ...jobFormData, departmentName: e.target.value })}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Vacancies</label>
              <input
                type="number"
                value={jobFormData.vacancies}
                onChange={(e) => setJobFormData({ ...jobFormData, vacancies: Number(e.target.value) })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Closing Date</label>
              <input
                type="date"
                value={jobFormData.closingDate}
                onChange={(e) => setJobFormData({ ...jobFormData, closingDate: e.target.value })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setIsNewJobModalOpen(false)}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-800 font-bold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#002147] text-white font-bold rounded-xl shadow-xs cursor-pointer"
            >
              Publish Job
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
