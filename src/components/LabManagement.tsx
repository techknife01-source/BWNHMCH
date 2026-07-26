import React, { useState } from 'react';
import { LabTestRecord } from '../types';
import { TestTube, FileCheck, Search, Plus, Printer, CheckCircle2, Clock } from 'lucide-react';

interface LabManagementProps {
  tests: LabTestRecord[];
  onUpdateTests: (tests: LabTestRecord[]) => void;
}

export const LabManagement: React.FC<LabManagementProps> = ({ tests, onUpdateTests }) => {
  const [localTests, setLocalTests] = useState<LabTestRecord[]>(tests);
  const [search, setSearch] = useState('');
  const [showBookModal, setShowBookModal] = useState(false);
  const [editingTest, setEditingTest] = useState<LabTestRecord | null>(null);

  const [bookForm, setBookForm] = useState({
    testName: 'Complete Blood Count (CBC)',
    patientName: '',
    caseNo: 'OPD/2026/04',
    requestedDate: new Date().toISOString().split('T')[0]
  });

  const [resultForm, setResultForm] = useState({
    status: 'Report Ready' as any,
    resultSummary: '',
    referenceRange: ''
  });

  const filteredTests = localTests.filter(
    t => t.patientName.toLowerCase().includes(search.toLowerCase()) || t.testName.toLowerCase().includes(search.toLowerCase()) || t.caseNo.toLowerCase().includes(search.toLowerCase())
  );

  const handleBookTest = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: LabTestRecord = {
      id: `lab_${Date.now()}`,
      testName: bookForm.testName,
      patientName: bookForm.patientName,
      caseNo: bookForm.caseNo,
      requestedDate: bookForm.requestedDate,
      status: 'Ordered'
    };

    const updated = [newRecord, ...localTests];
    setLocalTests(updated);
    onUpdateTests(updated);
    setShowBookModal(false);
  };

  const handleOpenResultEntry = (test: LabTestRecord) => {
    setEditingTest(test);
    setResultForm({
      status: test.status,
      resultSummary: test.resultSummary || '',
      referenceRange: test.referenceRange || 'Standard pathology reference ranges apply.'
    });
  };

  const handleSaveResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTest) return;

    const updated = localTests.map(t => {
      if (t.id === editingTest.id) {
        return {
          ...t,
          status: resultForm.status,
          resultSummary: resultForm.resultSummary,
          referenceRange: resultForm.referenceRange
        };
      }
      return t;
    });

    setLocalTests(updated);
    onUpdateTests(updated);
    setEditingTest(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <TestTube className="w-5 h-5 text-[#002147] dark:text-blue-400" />
            <h3 className="text-sm font-black uppercase tracking-wider text-[#002147] dark:text-white">
              BHMCH Clinical Pathology & Diagnostic Lab
            </h3>
          </div>
          <p className="text-3xs text-slate-400 mt-1">
            Pathological investigations, stool & urine microscopic analysis, biochemistry, and microbiology reports.
          </p>
        </div>

        <button
          onClick={() => setShowBookModal(true)}
          className="px-4 py-2 bg-[#002147] hover:bg-[#001833] text-white font-bold text-3xs uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Book Diagnostic Test</span>
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search patient, test name, case no..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-3xs bg-transparent focus:outline-none"
          />
        </div>
      </div>

      {/* LAB ORDERS LIST */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl overflow-x-auto text-2xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-4xs font-bold uppercase tracking-wider">
              <th className="py-2.5">Case No & Patient</th>
              <th className="py-2.5">Requested Investigation</th>
              <th className="py-2.5">Date Ordered</th>
              <th className="py-2.5">Processing Status</th>
              <th className="py-2.5">Result Findings</th>
              <th className="py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTests.map(test => (
              <tr key={test.id} className="border-b border-slate-50 dark:border-slate-850 hover:bg-slate-50/50">
                <td className="py-3">
                  <span className="font-bold text-slate-800 dark:text-slate-100 block">{test.patientName}</span>
                  <span className="text-4xs font-mono text-slate-400 block">{test.caseNo}</span>
                </td>
                <td className="py-3 font-semibold text-[#002147] dark:text-blue-300">{test.testName}</td>
                <td className="py-3 font-mono text-slate-500 text-3xs">{test.requestedDate}</td>
                <td className="py-3">
                  <span
                    className={`px-2 py-0.5 rounded text-4xs font-bold uppercase ${
                      test.status === 'Report Ready'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : test.status === 'Sample Collected'
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                    }`}
                  >
                    {test.status}
                  </span>
                </td>
                <td className="py-3">
                  {test.resultSummary ? (
                    <span className="text-3xs font-mono text-slate-700 dark:text-slate-300 line-clamp-1">{test.resultSummary}</span>
                  ) : (
                    <span className="text-4xs text-slate-400 italic">Pending Lab Analysis</span>
                  )}
                </td>
                <td className="py-3 text-right space-x-1 whitespace-nowrap">
                  <button
                    onClick={() => handleOpenResultEntry(test)}
                    className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 rounded font-bold text-4xs uppercase cursor-pointer"
                  >
                    Upload Result
                  </button>
                  {test.status === 'Report Ready' && (
                    <button
                      onClick={() => window.print()}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200 rounded font-bold text-4xs cursor-pointer inline-flex items-center gap-1"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Print PDF</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* BOOK TEST MODAL */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h4 className="text-sm font-black text-[#002147] dark:text-white uppercase">Order Diagnostic Lab Test</h4>
              <button onClick={() => setShowBookModal(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>

            <form onSubmit={handleBookTest} className="space-y-4 text-3xs font-bold uppercase text-slate-500">
              <div className="space-y-1">
                <label>Select Test Investigation</label>
                <select
                  value={bookForm.testName}
                  onChange={e => setBookForm({ ...bookForm, testName: e.target.value })}
                  className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-2xs bg-white dark:bg-slate-900"
                >
                  <option value="Complete Blood Count (CBC)">Complete Blood Count (CBC)</option>
                  <option value="Widal Slide Agglutination Test">Widal Slide Agglutination Test</option>
                  <option value="Stool Microscopic Examination">Stool Microscopic Examination</option>
                  <option value="Sputum AFB Stain for TB">Sputum AFB Stain for TB</option>
                  <option value="X-Ray Chest PA View">X-Ray Chest PA View</option>
                  <option value="Serum Bilirubin Total & Direct">Serum Bilirubin Total & Direct</option>
                </select>
              </div>

              <div className="space-y-1">
                <label>Patient Full Name</label>
                <input
                  type="text"
                  required
                  value={bookForm.patientName}
                  onChange={e => setBookForm({ ...bookForm, patientName: e.target.value })}
                  placeholder="e.g. Ramesh Chawla"
                  className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-2xs bg-transparent focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label>Case Registration No</label>
                  <input
                    type="text"
                    required
                    value={bookForm.caseNo}
                    onChange={e => setBookForm({ ...bookForm, caseNo: e.target.value })}
                    className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-2xs bg-transparent focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label>Date Requested</label>
                  <input
                    type="date"
                    required
                    value={bookForm.requestedDate}
                    onChange={e => setBookForm({ ...bookForm, requestedDate: e.target.value })}
                    className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-2xs bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
                >
                  Book Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT / UPLOAD RESULT MODAL */}
      {editingTest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-4xs font-bold text-slate-400 uppercase tracking-widest block">Pathology Result Desk</span>
                <h4 className="text-sm font-black text-[#002147] dark:text-white uppercase">{editingTest.testName}</h4>
              </div>
              <button onClick={() => setEditingTest(null)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>

            <form onSubmit={handleSaveResult} className="space-y-4 text-3xs font-bold uppercase text-slate-500">
              <div className="space-y-1">
                <label>Update Order Status</label>
                <select
                  value={resultForm.status}
                  onChange={e => setResultForm({ ...resultForm, status: e.target.value as any })}
                  className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-2xs bg-white dark:bg-slate-900"
                >
                  <option value="Ordered">Ordered</option>
                  <option value="Sample Collected">Sample Collected</option>
                  <option value="Under Testing">Under Testing</option>
                  <option value="Report Ready">Report Ready</option>
                </select>
              </div>

              <div className="space-y-1">
                <label>Pathology Findings & Result Summary</label>
                <textarea
                  rows={3}
                  required
                  value={resultForm.resultSummary}
                  onChange={e => setResultForm({ ...resultForm, resultSummary: e.target.value })}
                  placeholder="e.g. Hb: 12.8 g/dL, Total WBC: 7200 /cu.mm, ESR: 14 mm/hr..."
                  className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-2xs bg-transparent focus:outline-none"
                ></textarea>
              </div>

              <div className="space-y-1">
                <label>Reference Ranges</label>
                <input
                  type="text"
                  value={resultForm.referenceRange}
                  onChange={e => setResultForm({ ...resultForm, referenceRange: e.target.value })}
                  className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-2xs bg-transparent focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTest(null)}
                  className="w-1/2 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
                >
                  Save Result Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
