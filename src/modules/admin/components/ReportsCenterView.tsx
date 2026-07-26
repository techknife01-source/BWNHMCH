import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  Printer,
  Table,
  Building2,
  GraduationCap,
  DollarSign,
  Users,
} from 'lucide-react';

export const ReportsCenterView: React.FC = () => {
  const [reportType, setReportType] = useState<'attendance' | 'academic' | 'finance' | 'hospital'>('attendance');

  const handleDownloadPdf = (name: string) => {
    alert(`Generating official signed PDF report for: ${name}`);
  };

  const handleDownloadExcel = (name: string) => {
    alert(`Exporting raw data table to Excel (.xlsx) for: ${name}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#002147] text-white p-6 rounded-2xl shadow-md border border-blue-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500 text-white font-extrabold text-[10px] rounded-full uppercase">
              INSTITUTIONAL REPORT GENERATOR
            </span>
            <span className="text-xs text-blue-200">• NCH Regulatory Compliance</span>
          </div>
          <h2 className="text-2xl font-black mt-1">Institutional Audit Reports & Export Desk</h2>
          <p className="text-xs text-blue-200">
            Generate, preview & export accredited PDF & Excel reports for university submission, AYUSH audits & internal review
          </p>
        </div>
      </div>

      {/* Report Categories */}
      <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setReportType('attendance')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 ${
            reportType === 'attendance'
              ? 'bg-[#002147] text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-400" />
          <span>Biometric Attendance Reports</span>
        </button>

        <button
          onClick={() => setReportType('academic')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 ${
            reportType === 'academic'
              ? 'bg-[#002147] text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-amber-400" />
          <span>Academic & Result Gradeheets</span>
        </button>

        <button
          onClick={() => setReportType('finance')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 ${
            reportType === 'finance'
              ? 'bg-[#002147] text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4 text-blue-400" />
          <span>Treasury & Fee Ledgers</span>
        </button>

        <button
          onClick={() => setReportType('hospital')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 ${
            reportType === 'hospital'
              ? 'bg-[#002147] text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4 text-purple-400" />
          <span>50-Bed Hospital Clinical Logs</span>
        </button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportType === 'attendance' && (
          <>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Monthly Student Biometric Attendance Summary</h3>
              <p className="text-xs text-slate-500">Subject-wise theory and practical attendance for 1st-4th Year BHMS students (NCH 75% Mandate Audit)</p>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleDownloadPdf('Student Biometric Attendance Summary')}
                  className="px-3 py-1.5 bg-[#002147] text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" /> PDF Report
                </button>
                <button
                  onClick={() => handleDownloadExcel('Student Biometric Attendance Summary')}
                  className="px-3 py-1.5 bg-[#00A651] text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <Table className="w-3.5 h-3.5" /> Excel (.xlsx)
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Faculty Bio-Punch & Duty Muster Register</h3>
              <p className="text-xs text-slate-500">Monthly in-out biometric punch log for professors, readers & hospital clinical tutors</p>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleDownloadPdf('Faculty Duty Muster Register')}
                  className="px-3 py-1.5 bg-[#002147] text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" /> PDF Report
                </button>
                <button
                  onClick={() => handleDownloadExcel('Faculty Duty Muster Register')}
                  className="px-3 py-1.5 bg-[#00A651] text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <Table className="w-3.5 h-3.5" /> Excel (.xlsx)
                </button>
              </div>
            </div>
          </>
        )}

        {reportType === 'academic' && (
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">WBUHS Annual Examination Tabulation Register</h3>
            <p className="text-xs text-slate-500">Official marks breakdown across Organon, Materia Medica, Repertory & Surgery</p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleDownloadPdf('WBUHS Examination Tabulation Register')}
                className="px-3 py-1.5 bg-[#002147] text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" /> PDF Report
              </button>
              <button
                onClick={() => handleDownloadExcel('WBUHS Examination Tabulation Register')}
                className="px-3 py-1.5 bg-[#00A651] text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Table className="w-3.5 h-3.5" /> Excel (.xlsx)
              </button>
            </div>
          </div>
        )}

        {reportType === 'finance' && (
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Institutional Treasury Annual Audit Ledger</h3>
            <p className="text-xs text-slate-500">Student fee collection, hospital OPD receipts, faculty payroll & operating expenditure log</p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleDownloadPdf('Treasury Annual Audit Ledger')}
                className="px-3 py-1.5 bg-[#002147] text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" /> PDF Report
              </button>
              <button
                onClick={() => handleDownloadExcel('Treasury Annual Audit Ledger')}
                className="px-3 py-1.5 bg-[#00A651] text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Table className="w-3.5 h-3.5" /> Excel (.xlsx)
              </button>
            </div>
          </div>
        )}

        {reportType === 'hospital' && (
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Attached Hospital Monthly OPD & IPD Clinical Census</h3>
            <p className="text-xs text-slate-500">Departmental patient count, bed turnover rate, remedy prescription audit & pathology tests count</p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleDownloadPdf('Hospital Clinical Census')}
                className="px-3 py-1.5 bg-[#002147] text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" /> PDF Report
              </button>
              <button
                onClick={() => handleDownloadExcel('Hospital Clinical Census')}
                className="px-3 py-1.5 bg-[#00A651] text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Table className="w-3.5 h-3.5" /> Excel (.xlsx)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
