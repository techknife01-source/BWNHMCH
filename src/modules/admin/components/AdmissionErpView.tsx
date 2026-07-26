import React, { useState } from 'react';
import {
  UserPlus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  FileCheck,
  Award,
  Filter,
  Download,
  Eye,
  Building2,
  Sparkles,
  Phone,
  Mail,
  GraduationCap,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface AdmissionApplication {
  id: string;
  applicationNo: string;
  applicantName: string;
  neetRoll: string;
  neetScore: number;
  neetRank: number;
  category: 'GENERAL' | 'OBC-A' | 'OBC-B' | 'SC' | 'ST' | 'EWS';
  courseApplied: 'BHMS' | 'MD_HOMOEOPATHY' | 'PARAMEDICAL';
  phone: string;
  email: string;
  appliedDate: string;
  docStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  counselingStatus: 'REGISTERED' | 'SEAT_ALLOTTED' | 'ADMISSION_CONFIRMED' | 'WITHDRAWN';
  allottedQuota: 'STATE_QUOTA_85' | 'ALL_INDIA_QUOTA_15' | 'MANAGEMENT';
}

export const AdmissionErpView: React.FC = () => {
  const [applications, setApplications] = useState<AdmissionApplication[]>([
    {
      id: 'ADM-2026-001',
      applicationNo: 'WBMCC/2026/89102',
      applicantName: 'Ananya Mukherjee',
      neetRoll: '2604102934',
      neetScore: 542,
      neetRank: 18450,
      category: 'GENERAL',
      courseApplied: 'BHMS',
      phone: '+91 98312 45890',
      email: 'ananya.m@gmail.com',
      appliedDate: '2026-07-12',
      docStatus: 'VERIFIED',
      counselingStatus: 'SEAT_ALLOTTED',
      allottedQuota: 'STATE_QUOTA_85',
    },
    {
      id: 'ADM-2026-002',
      applicationNo: 'WBMCC/2026/89108',
      applicantName: 'Rahul Dev Barman',
      neetRoll: '2604108821',
      neetScore: 498,
      neetRank: 24110,
      category: 'OBC-B',
      courseApplied: 'BHMS',
      phone: '+91 97480 12398',
      email: 'rahul.barman@gmail.com',
      appliedDate: '2026-07-14',
      docStatus: 'PENDING',
      counselingStatus: 'REGISTERED',
      allottedQuota: 'STATE_QUOTA_85',
    },
    {
      id: 'ADM-2026-003',
      applicationNo: 'AACCC/2026/10294',
      applicantName: 'Priya Kumari Gupta',
      neetRoll: '2601103381',
      neetScore: 575,
      neetRank: 12900,
      category: 'GENERAL',
      courseApplied: 'BHMS',
      phone: '+91 94330 90812',
      email: 'priya.gupta@gmail.com',
      appliedDate: '2026-07-15',
      docStatus: 'VERIFIED',
      counselingStatus: 'ADMISSION_CONFIRMED',
      allottedQuota: 'ALL_INDIA_QUOTA_15',
    },
    {
      id: 'ADM-2026-004',
      applicationNo: 'WBMCC/2026/89211',
      applicantName: 'Subhajit Roy',
      neetRoll: '2604109912',
      neetScore: 432,
      neetRank: 38200,
      category: 'SC',
      courseApplied: 'BHMS',
      phone: '+91 91234 56789',
      email: 'subhajit.roy@gmail.com',
      appliedDate: '2026-07-18',
      docStatus: 'VERIFIED',
      counselingStatus: 'SEAT_ALLOTTED',
      allottedQuota: 'STATE_QUOTA_85',
    },
  ]);

  const [activeSubTab, setActiveSubTab] = useState<'applications' | 'merit-list' | 'verification' | 'workflow'>('applications');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedApp, setSelectedApp] = useState<AdmissionApplication | null>(null);

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicationNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.neetRoll.includes(searchQuery);

    const matchesCat = categoryFilter === 'ALL' || app.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || app.counselingStatus === statusFilter;

    return matchesSearch && matchesCat && matchesStatus;
  });

  const meritSortedApps = [...applications].sort((a, b) => b.neetScore - a.neetScore);

  const handleVerifyDocs = (id: string, status: 'VERIFIED' | 'REJECTED') => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, docStatus: status } : a))
    );
  };

  const handleConfirmAdmission = (id: string) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, counselingStatus: 'ADMISSION_CONFIRMED' } : a))
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#002147] text-white p-6 rounded-2xl shadow-md border border-blue-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-400 text-slate-900 font-extrabold text-[10px] rounded-full uppercase">
              AYUSH NEET-UG COUNSELING 2026-27
            </span>
            <span className="text-xs text-blue-200">• State & AIQ Allotment Desk</span>
          </div>
          <h2 className="text-2xl font-black mt-1">Online Admission ERP Terminal</h2>
          <p className="text-xs text-blue-200">
            Process candidate applications, document verification, WBMCC merit ranking list & seat confirmation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Exporting Admission Register Excel...')}
            className="px-4 py-2 bg-[#00A651] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Admissions (Excel)</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('applications')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'applications'
              ? 'bg-[#002147] text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <UserPlus className="w-4 h-4 text-amber-400" />
          <span>Application Directory ({applications.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('merit-list')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'merit-list'
              ? 'bg-[#002147] text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4 text-emerald-400" />
          <span>NEET Merit List & Ranks</span>
        </button>

        <button
          onClick={() => setActiveSubTab('verification')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'verification'
              ? 'bg-[#002147] text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileCheck className="w-4 h-4 text-blue-400" />
          <span>Physical Document Verification Desk</span>
        </button>

        <button
          onClick={() => setActiveSubTab('workflow')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'workflow'
              ? 'bg-[#002147] text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Admission Workflow Pipeline</span>
        </button>
      </div>

      {/* Main Content Area */}
      {activeSubTab === 'applications' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-3 text-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search candidate name, WBMCC application no, or NEET roll..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-200"
            >
              <option value="ALL">All Categories</option>
              <option value="GENERAL">General</option>
              <option value="OBC-A">OBC-A</option>
              <option value="OBC-B">OBC-B</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="EWS">EWS</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-200"
            >
              <option value="ALL">All Statuses</option>
              <option value="REGISTERED">Registered</option>
              <option value="SEAT_ALLOTTED">Seat Allotted</option>
              <option value="ADMISSION_CONFIRMED">Admission Confirmed</option>
              <option value="WITHDRAWN">Withdrawn</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
                    <th className="p-3">Application No</th>
                    <th className="p-3">Candidate Name</th>
                    <th className="p-3">NEET Score & Rank</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Quota</th>
                    <th className="p-3">Doc Status</th>
                    <th className="p-3">Admission Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                      <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">{app.applicationNo}</td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">
                        <div>{app.applicantName}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span><Phone className="w-2.5 h-2.5 inline mr-1" />{app.phone}</span>
                          <span><Mail className="w-2.5 h-2.5 inline mr-1" />{app.email}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-extrabold text-slate-800 dark:text-slate-200">{app.neetScore} Marks</div>
                        <div className="text-[10px] text-slate-500">AIR Rank: #{app.neetRank.toLocaleString()}</div>
                      </td>
                      <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-bold text-[10px]">
                          {app.category}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-400 font-medium text-[11px]">
                        {app.allottedQuota === 'STATE_QUOTA_85' ? 'State Quota (85%)' : 'All India Quota (15%)'}
                      </td>
                      <td className="p-3">
                        {app.docStatus === 'VERIFIED' ? (
                          <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 w-max">
                            <CheckCircle2 className="w-3 h-3" /> VERIFIED
                          </span>
                        ) : app.docStatus === 'PENDING' ? (
                          <span className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 font-bold text-[10px] rounded-full border border-amber-200 dark:border-amber-800 flex items-center gap-1 w-max">
                            <Clock className="w-3 h-3" /> PENDING
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 font-bold text-[10px] rounded-full border border-red-200 dark:border-red-800 flex items-center gap-1 w-max">
                            <XCircle className="w-3 h-3" /> REJECTED
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        {app.counselingStatus === 'ADMISSION_CONFIRMED' ? (
                          <span className="px-2.5 py-1 bg-emerald-600 text-white font-black text-[10px] rounded-full flex items-center gap-1 w-max shadow-xs">
                            <CheckCircle2 className="w-3 h-3" /> ENROLLED
                          </span>
                        ) : app.counselingStatus === 'SEAT_ALLOTTED' ? (
                          <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-[10px] rounded-full border border-blue-200 dark:border-blue-800 flex items-center gap-1 w-max">
                            <Award className="w-3 h-3" /> SEAT ALLOTTED
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-[10px] rounded-full flex items-center gap-1 w-max">
                            REGISTERED
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-lg transition cursor-pointer"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'merit-list' && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>BHMS Merit Ranking Register (2026-27 Session)</span>
              </h3>
              <p className="text-xs text-slate-500">Sorted by NEET-UG 2026 Score & Percentile Rank</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
                  <th className="p-3">State Rank</th>
                  <th className="p-3">Applicant Name</th>
                  <th className="p-3">NEET Score</th>
                  <th className="p-3">All India Rank</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Allotment Preference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                {meritSortedApps.map((app, index) => (
                  <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-black text-amber-600 dark:text-amber-400">#00{index + 1}</td>
                    <td className="p-3 font-sans font-bold text-slate-900 dark:text-white">{app.applicantName}</td>
                    <td className="p-3 font-extrabold text-emerald-600">{app.neetScore}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">#{app.neetRank.toLocaleString()}</td>
                    <td className="p-3 font-sans font-bold">{app.category}</td>
                    <td className="p-3 font-sans text-slate-500">{app.courseApplied} (Full Time)</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'verification' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono font-bold text-blue-600">{app.applicationNo}</span>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{app.applicantName}</h3>
                  <p className="text-xs text-slate-500">NEET Score: {app.neetScore} | AIR: #{app.neetRank}</p>
                </div>
                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 font-bold text-[10px] rounded-md">
                  {app.category}
                </span>
              </div>

              <div className="space-y-2 text-xs border-t border-b border-slate-100 dark:border-slate-800 py-3">
                <p className="font-bold text-slate-700 dark:text-slate-300">Mandatory Checklist Verification:</p>
                <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                  <li className="flex items-center justify-between">
                    <span>1. NEET 2026 Scorecard & Admit Card</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </li>
                  <li className="flex items-center justify-between">
                    <span>2. Class 10 & 12 Passing Marksheets</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </li>
                  <li className="flex items-center justify-between">
                    <span>3. WBMCC Domicile Certificate (a1/a2)</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </li>
                  <li className="flex items-center justify-between">
                    <span>4. Medical Fitness & Caste Certificate</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </li>
                </ul>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-slate-500">Document Status: {app.docStatus}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleVerifyDocs(app.id, 'VERIFIED')}
                    className="px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition cursor-pointer"
                  >
                    Approve Docs
                  </button>
                  <button
                    onClick={() => handleVerifyDocs(app.id, 'REJECTED')}
                    className="px-3 py-1.5 bg-red-100 text-red-600 font-bold text-xs rounded-xl hover:bg-red-200 transition cursor-pointer"
                  >
                    Reject
                  </button>
                  {app.counselingStatus !== 'ADMISSION_CONFIRMED' && (
                    <button
                      onClick={() => handleConfirmAdmission(app.id)}
                      className="px-3 py-1.5 bg-[#002147] text-white font-bold text-xs rounded-xl transition cursor-pointer"
                    >
                      Confirm Seat
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === 'workflow' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Admission Lifecycle Stages</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800 space-y-1">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center mx-auto">1</span>
              <p className="font-bold text-xs text-slate-900 dark:text-white">WBMCC Registration</p>
              <p className="text-[10px] text-slate-500">Online NEET choice filling</p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800 space-y-1">
              <span className="w-8 h-8 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center mx-auto">2</span>
              <p className="font-bold text-xs text-slate-900 dark:text-white">Seat Allotment</p>
              <p className="text-[10px] text-slate-500">Allotment letter issued</p>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 space-y-1">
              <span className="w-8 h-8 rounded-full bg-amber-600 text-white font-black text-xs flex items-center justify-center mx-auto">3</span>
              <p className="font-bold text-xs text-slate-900 dark:text-white">Physical Document Verification</p>
              <p className="text-[10px] text-slate-500">Original certificates checked</p>
            </div>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-1">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center mx-auto">4</span>
              <p className="font-bold text-xs text-slate-900 dark:text-white">Fee Deposit & Enrolment</p>
              <p className="text-[10px] text-slate-500">Roll number generated</p>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-black text-base text-slate-900 dark:text-white">Candidate Details</h3>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                <XCircle className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                <div>
                  <p className="text-slate-400">Application No</p>
                  <p className="font-bold font-mono text-blue-600">{selectedApp.applicationNo}</p>
                </div>
                <div>
                  <p className="text-slate-400">NEET Roll No</p>
                  <p className="font-bold font-mono">{selectedApp.neetRoll}</p>
                </div>
                <div>
                  <p className="text-slate-400">NEET Score</p>
                  <p className="font-extrabold text-emerald-600">{selectedApp.neetScore} Marks</p>
                </div>
                <div>
                  <p className="text-slate-400">All India Rank</p>
                  <p className="font-extrabold">#{selectedApp.neetRank.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <p className="text-slate-400">Applicant Name</p>
                <p className="font-bold text-sm text-slate-900 dark:text-white">{selectedApp.applicantName}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-slate-400">Contact Phone</p>
                  <p className="font-bold">{selectedApp.phone}</p>
                </div>
                <div>
                  <p className="text-slate-400">Email Address</p>
                  <p className="font-bold">{selectedApp.email}</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
