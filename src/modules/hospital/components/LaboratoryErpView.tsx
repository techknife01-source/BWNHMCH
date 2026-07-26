import React, { useState } from 'react';
import {
  FlaskConical,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Activity,
  Download,
  Barcode,
  Settings,
  Calendar,
} from 'lucide-react';

interface LabTestItem {
  id: string;
  testCode: string;
  testName: string;
  category: 'PATHOLOGY' | 'BIOCHEMISTRY' | 'MICROBIOLOGY' | 'HAEMATOLOGY' | 'SEROLOGY';
  normalRange: string;
  sampleType: 'BLOOD' | 'URINE' | 'STOOL' | 'SPUTUM' | 'SWAB';
  price: number;
}

interface LabReport {
  id: string;
  sampleId: string;
  patientName: string;
  uhid: string;
  testName: string;
  collectedDate: string;
  resultValue: string;
  status: 'SAMPLE_COLLECTED' | 'PROCESSING' | 'REPORT_READY';
  technicianName: string;
}

export const LaboratoryErpView: React.FC = () => {
  const [testCatalogue] = useState<LabTestItem[]>([
    {
      id: 'TST-001',
      testCode: 'LAB-CBC',
      testName: 'Complete Blood Count (CBC)',
      category: 'HAEMATOLOGY',
      normalRange: 'Hb: 13-17 g/dL, WBC: 4000-11000 /cu.mm',
      sampleType: 'BLOOD',
      price: 250,
    },
    {
      id: 'TST-002',
      testCode: 'LAB-LFT',
      testName: 'Liver Function Test (LFT Profile)',
      category: 'BIOCHEMISTRY',
      normalRange: 'Bilirubin Total: 0.2-1.2 mg/dL, SGOT: 5-40 U/L',
      sampleType: 'BLOOD',
      price: 650,
    },
    {
      id: 'TST-003',
      testCode: 'LAB-KFT',
      testName: 'Kidney Function Test (KFT / Renal)',
      category: 'BIOCHEMISTRY',
      normalRange: 'Urea: 15-40 mg/dL, Creatinine: 0.6-1.2 mg/dL',
      sampleType: 'BLOOD',
      price: 550,
    },
    {
      id: 'TST-004',
      testCode: 'LAB-URINE',
      testName: 'Urine Routine & Microscopic',
      category: 'PATHOLOGY',
      normalRange: 'Pus cells: 0-2 /hpf, Albumin: Nil',
      sampleType: 'URINE',
      price: 150,
    },
  ]);

  const [labReports, setLabReports] = useState<LabReport[]>([
    {
      id: 'REP-001',
      sampleId: 'SMP-2026-8801',
      patientName: 'Subhasish Ghosh',
      uhid: 'UHID-2026-8812',
      testName: 'Complete Blood Count (CBC)',
      collectedDate: '2026-07-25 08:30 AM',
      resultValue: 'Hb: 14.2 g/dL, Total Leucocyte Count: 7,800 /cu.mm, Platelets: 2.4 Lakhs',
      status: 'REPORT_READY',
      technicianName: 'Swapan Kumar Paul (Sr. Tech)',
    },
    {
      id: 'REP-002',
      sampleId: 'SMP-2026-8805',
      patientName: 'Ankita Chatterji',
      uhid: 'UHID-2026-8902',
      testName: 'Liver Function Test (LFT Profile)',
      collectedDate: '2026-07-25 09:15 AM',
      resultValue: 'Pending Clinical Analyzer Processing',
      status: 'PROCESSING',
      technicianName: 'Swapan Kumar Paul (Sr. Tech)',
    },
  ]);

  const [activeTab, setActiveTab] = useState<'reports' | 'catalogue' | 'equipment'>('reports');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample Log Form
  const [patientName, setPatientName] = useState('');
  const [selectedTest, setSelectedTest] = useState('LAB-CBC');

  const handleRegisterSample = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName) return;

    const test = testCatalogue.find((t) => t.testCode === selectedTest);

    const newReport: LabReport = {
      id: `REP-${Date.now()}`,
      sampleId: `SMP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: patientName,
      uhid: `UHID-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      testName: test?.testName || 'Diagnostic Test',
      collectedDate: new Date().toLocaleString(),
      resultValue: 'Sample Collected - Awaiting Analysis',
      status: 'SAMPLE_COLLECTED',
      technicianName: 'Clinical Lab Technician',
    };

    setLabReports([newReport, ...labReports]);
    setPatientName('');
    alert('Pathology Sample Barcode Registered successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#001833] text-white p-6 rounded-2xl shadow-md border border-blue-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-purple-500 text-white font-extrabold text-[10px] rounded-full uppercase">
              CLINICAL PATHOLOGY & LAB ERP
            </span>
            <span className="text-xs text-blue-200">• Attached Hospital Diagnostic Lab</span>
          </div>
          <h2 className="text-2xl font-black mt-1">Diagnostic Pathology & Biochemistry Terminal</h2>
          <p className="text-xs text-blue-200">
            Pathology test catalogue, sample barcode collection, automated clinical analyzer results & equipment logs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Exporting Pathology Workload Register (Excel)...')}
            className="px-4 py-2 bg-[#00A651] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Lab Workload (Excel)</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'reports'
              ? 'bg-[#002147] text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Samples & Diagnostic Reports ({labReports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('catalogue')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'catalogue'
              ? 'bg-[#002147] text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FlaskConical className="w-4 h-4 text-purple-400" />
          <span>Pathology Test Catalogue ({testCatalogue.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('equipment')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'equipment'
              ? 'bg-[#002147] text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Settings className="w-4 h-4 text-blue-400" />
          <span>Analyzer Equipment Calibration</span>
        </button>
      </div>

      {/* Reports View */}
      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sample Registration */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Barcode className="w-4 h-4 text-purple-500" />
              <span>Collect Sample & Generate Barcode</span>
            </h3>

            <form onSubmit={handleRegisterSample} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Patient Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Subhasish Ghosh"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select Diagnostic Test
                </label>
                <select
                  value={selectedTest}
                  onChange={(e) => setSelectedTest(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                >
                  {testCatalogue.map((t) => (
                    <option key={t.id} value={t.testCode}>
                      {t.testName} (₹{t.price})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#002147] hover:bg-blue-900 text-white font-bold rounded-xl transition cursor-pointer"
              >
                Print Sample Barcode & Enqueue
              </button>
            </form>
          </div>

          {/* Reports List */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Active Diagnostic Reports</h3>
            <div className="space-y-3 text-xs">
              {labReports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono font-bold text-purple-600">{rep.sampleId}</span>
                      <h4 className="font-extrabold text-slate-900 dark:text-white">{rep.patientName} ({rep.uhid})</h4>
                      <p className="text-[10px] text-slate-400">{rep.testName} | Collected: {rep.collectedDate}</p>
                    </div>
                    {rep.status === 'REPORT_READY' ? (
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full">
                        READY
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-bold text-[10px] rounded-full">
                        PROCESSING
                      </span>
                    )}
                  </div>

                  <p className="font-mono text-[11px] p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold">
                    {rep.resultValue}
                  </p>

                  <div className="flex justify-between items-center pt-1 text-[10px] text-slate-400">
                    <span>Technician: {rep.technicianName}</span>
                    <button
                      onClick={() => alert(`Downloading signed PDF diagnostic report ${rep.sampleId}...`)}
                      className="px-3 py-1 bg-purple-600 text-white font-bold rounded-lg cursor-pointer flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" /> Print Signed Report (PDF)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Test Catalogue */}
      {activeTab === 'catalogue' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testCatalogue.map((t) => (
            <div
              key={t.id}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2"
            >
              <div className="flex justify-between items-start">
                <span className="font-mono text-[10px] font-bold text-purple-600">{t.testCode}</span>
                <span className="text-sm font-black text-emerald-600">₹{t.price}</span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{t.testName}</h3>
              <p className="text-xs text-slate-500 font-mono">Normal Range: {t.normalRange}</p>
            </div>
          ))}
        </div>
      )}

      {/* Equipment View */}
      {activeTab === 'equipment' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Diagnostic Analyzer Calibration Status</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1 border border-slate-200 dark:border-slate-700">
              <p className="font-bold text-slate-900 dark:text-white">Fully Automated Bio-Chemistry Analyzer (Erba XL-200)</p>
              <p className="text-[10px] text-emerald-600 font-extrabold">STATUS: CALIBRATED (Next Due: 15 Aug 2026)</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1 border border-slate-200 dark:border-slate-700">
              <p className="font-bold text-slate-900 dark:text-white">3-Part Differential Cell Counter (Horiba Microsemi 60)</p>
              <p className="text-[10px] text-emerald-600 font-extrabold">STATUS: CALIBRATED (Next Due: 28 Aug 2026)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
