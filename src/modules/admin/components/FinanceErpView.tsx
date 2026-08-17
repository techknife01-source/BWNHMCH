import React, { useState } from 'react';
import {
  CreditCard,
  Receipt,
  DollarSign,
  TrendingUp,
  Download,
  Search,
  Plus,
  CheckCircle2,
  FileText,
  Building2,
  Calendar,
  Award,
  Users,
  PieChart,
  ShieldCheck,
} from 'lucide-react';

interface FeeStructure {
  id: string;
  course: string;
  yearSemester: string;
  tuitionFee: number;
  developmentFee: number;
  labHospitalFee: number;
  libraryFee: number;
  totalAnnualFee: number;
}

interface FeePaymentReceipt {
  id: string;
  receiptNo: string;
  studentName: string;
  rollNo: string;
  course: string;
  amountPaid: number;
  paymentMode: 'UPI' | 'NET_BANKING' | 'CASH' | 'DEMAND_DRAFT';
  transactionRef: string;
  paidDate: string;
  status: 'SUCCESS' | 'PENDING' | 'REFUNDED';
}

export const FinanceErpView: React.FC = () => {
  const [feeStructures] = useState<FeeStructure[]>([
    {
      id: 'FS-01',
      course: 'BHMS (Bachelor of Homoeopathic Medicine & Surgery)',
      yearSemester: '1st Professional Year',
      tuitionFee: 36000,
      developmentFee: 5000,
      labHospitalFee: 8000,
      libraryFee: 2000,
      totalAnnualFee: 51000,
    },
    {
      id: 'FS-02',
      course: 'BHMS (Bachelor of Homoeopathic Medicine & Surgery)',
      yearSemester: '2nd Professional Year',
      tuitionFee: 36000,
      developmentFee: 5000,
      labHospitalFee: 8000,
      libraryFee: 2000,
      totalAnnualFee: 51000,
    },
    {
      id: 'FS-03',
      course: 'MD Homoeopathy (Materia Medica / Organon)',
      yearSemester: '1st Year MD',
      tuitionFee: 65000,
      developmentFee: 10000,
      labHospitalFee: 15000,
      libraryFee: 5000,
      totalAnnualFee: 95000,
    },
  ]);

  const [receipts, setReceipts] = useState<FeePaymentReceipt[]>([
    {
      id: 'RCT-001',
      receiptNo: 'BHMC/2026/0891',
      studentName: 'Surojit Das',
      rollNo: 'BHMS/2023/042',
      course: 'BHMS 2nd Year',
      amountPaid: 51000,
      paymentMode: 'UPI',
      transactionRef: 'UPI/6192019201@ybl',
      paidDate: '2026-07-10',
      status: 'SUCCESS',
    },
    {
      id: 'RCT-002',
      receiptNo: 'BHMC/2026/0892',
      studentName: 'Ananya Mukherjee',
      rollNo: 'BHMS/2026/001',
      course: 'BHMS 1st Year',
      amountPaid: 25500,
      paymentMode: 'NET_BANKING',
      transactionRef: 'SBI/NEFT/0192830129',
      paidDate: '2026-07-15',
      status: 'SUCCESS',
    },
  ]);

  const [activeTab, setActiveTab] = useState<'counter' | 'structures' | 'scholarships' | 'expenses' | 'budget'>('counter');
  const [searchQuery, setSearchQuery] = useState('');

  // Counter Form
  const [studentRoll, setStudentRoll] = useState('');
  const [collectAmount, setCollectAmount] = useState('');
  const [payMode, setPayMode] = useState<'UPI' | 'NET_BANKING' | 'CASH' | 'DEMAND_DRAFT'>('UPI');

  const handleCollectFee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentRoll || !collectAmount) return;

    const newReceipt: FeePaymentReceipt = {
      id: `RCT-${Date.now()}`,
      receiptNo: `BHMC/2026/${Math.floor(1000 + Math.random() * 9000)}`,
      studentName: 'Enrolled Scholar (' + studentRoll + ')',
      rollNo: studentRoll,
      course: 'BHMS Academic Year',
      amountPaid: parseFloat(collectAmount),
      paymentMode: payMode,
      transactionRef: `TXN/${Math.floor(100000 + Math.random() * 900000)}`,
      paidDate: new Date().toISOString().split('T')[0],
      status: 'SUCCESS',
    };

    setReceipts([newReceipt, ...receipts]);
    setStudentRoll('');
    setCollectAmount('');
    alert(`Fee Collection Receipt generated successfully!\nReceipt No: ${newReceipt.receiptNo}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#002147] text-white p-6 rounded-2xl shadow-md border border-blue-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-400 text-slate-900 font-extrabold text-[10px] rounded-full uppercase">
              FINANCE & ACCOUNTS TERMINAL
            </span>
            <span className="text-xs text-blue-200">• Treasury & Audit Desk</span>
          </div>
          <h2 className="text-2xl font-black mt-1">Institutional Fee Collection & Financial ERP</h2>
          <p className="text-xs text-blue-200">
            Student tuition fee collection counter, instant printable receipts, WBMDFC scholarship waivers & departmental budgets
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Exporting Treasury Financial Ledger (Excel)...')}
            className="px-4 py-2 bg-[#00A651] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Financial Ledger (Excel)</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('counter')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'counter'
              ? 'bg-[#002147] text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Receipt className="w-4 h-4 text-emerald-400" />
          <span>Fee Collection Counter</span>
        </button>

        <button
          onClick={() => setActiveTab('structures')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'structures'
              ? 'bg-[#002147] text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4 text-amber-400" />
          <span>Fee Structure Register</span>
        </button>

        <button
          onClick={() => setActiveTab('scholarships')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'scholarships'
              ? 'bg-[#002147] text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4 text-purple-400" />
          <span>Govt Scholarships & Waivers</span>
        </button>

        <button
          onClick={() => setActiveTab('budget')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'budget'
              ? 'bg-[#002147] text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <PieChart className="w-4 h-4 text-blue-400" />
          <span>Departmental Budgets</span>
        </button>
      </div>

      {/* Counter View */}
      {activeTab === 'counter' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Collection Form */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-500" />
              <span>Collect Fee Dues</span>
            </h3>

            <form onSubmit={handleCollectFee} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Student Roll / Enrolment No
                </label>
                <input
                  type="text"
                  placeholder="e.g. BHMS/2023/042"
                  value={studentRoll}
                  onChange={(e) => setStudentRoll(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Amount to Collect (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 25500"
                  value={collectAmount}
                  onChange={(e) => setCollectAmount(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-extrabold text-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Payment Gateway / Mode
                </label>
                <select
                  value={payMode}
                  onChange={(e) => setPayMode(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                >
                  <option value="UPI">UPI / QR Payment</option>
                  <option value="NET_BANKING">Net Banking / NEFT</option>
                  <option value="CASH">Cash Counter Collection</option>
                  <option value="DEMAND_DRAFT">Demand Draft (Bank)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#00A651] hover:bg-emerald-600 text-white font-bold rounded-xl transition cursor-pointer"
              >
                Issue Receipt & Update Treasury
              </button>
            </form>
          </div>

          {/* Receipts Log */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Recent Payment Receipts</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
                    <th className="p-3">Receipt No</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Amount Paid</th>
                    <th className="p-3">Mode & Ref</th>
                    <th className="p-3 text-right">Receipt PDF</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                  {receipts.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-bold text-blue-600">{r.receiptNo}</td>
                      <td className="p-3">
                        <p className="font-bold text-slate-900 dark:text-white">{r.studentName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{r.rollNo}</p>
                      </td>
                      <td className="p-3 font-extrabold text-emerald-600">₹{r.amountPaid.toLocaleString()}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-bold text-[10px]">
                          {r.paymentMode}
                        </span>
                        <div className="text-[9px] text-slate-400 font-mono">{r.transactionRef}</div>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => alert(`Printing official receipt ${r.receiptNo}...`)}
                          className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold rounded-lg transition cursor-pointer text-slate-800 dark:text-slate-200"
                        >
                          Print Slip
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

      {/* Fee Structures */}
      {activeTab === 'structures' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {feeStructures.map((fs) => (
            <div
              key={fs.id}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
            >
              <div className="flex justify-between items-start">
                <span className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 font-extrabold text-[10px]">
                  {fs.yearSemester}
                </span>
                <span className="text-lg font-black text-slate-900 dark:text-white">
                  ₹{fs.totalAnnualFee.toLocaleString()} / Year
                </span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{fs.course}</h3>

              <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between"><span>Tuition Fee:</span><span className="font-bold">₹{fs.tuitionFee.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Development Fee:</span><span className="font-bold">₹{fs.developmentFee.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Clinical & Lab Fee:</span><span className="font-bold">₹{fs.labHospitalFee.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Library Access:</span><span className="font-bold">₹{fs.libraryFee.toLocaleString()}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Scholarships */}
      {activeTab === 'scholarships' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">State Government Scholarship Reconciliation</h3>
          <p className="text-xs text-slate-500">Aikyashree, Swami Vivekananda Merit-cum-Means (SVMCM), & Kanyashree Prakalpa waivers</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800">
              <p className="font-bold text-purple-900 dark:text-purple-300">SVMCM Scholarship Beneficiaries</p>
              <p className="text-2xl font-black text-purple-700 dark:text-purple-400 mt-1">42 Scholars</p>
              <p className="text-[10px] text-slate-500 mt-1">₹60,000 / Year stipend credited directly to bank</p>
            </div>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <p className="font-bold text-emerald-900 dark:text-emerald-300">Aikyashree Minority Welfare</p>
              <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1">28 Scholars</p>
              <p className="text-[10px] text-slate-500 mt-1">WBMDFC official disbursement verified</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800">
              <p className="font-bold text-blue-900 dark:text-blue-300">Kanyashree K3 Higher Studies</p>
              <p className="text-2xl font-black text-blue-700 dark:text-blue-400 mt-1">19 Scholars</p>
              <p className="text-[10px] text-slate-500 mt-1">Department of Higher Education, Govt of WB</p>
            </div>
          </div>
        </div>
      )}

      {/* Budgets */}
      {activeTab === 'budget' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Annual Institutional Budget Allocations (2026-27)</h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">30-Bed Attached Hospital Consumables & OPD Pharmacy</p>
                <p className="text-[10px] text-slate-500">Dilutions, tinctures, biochemic salts & clinical equipment</p>
              </div>
              <span className="font-mono font-extrabold text-blue-600">₹45,00,000</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Academic Faculty & Teaching Salary Pool</p>
                <p className="text-[10px] text-slate-500">Monthly payroll for 48 teaching professors & clinical tutors</p>
              </div>
              <span className="font-mono font-extrabold text-blue-600">₹1,80,00,000</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
