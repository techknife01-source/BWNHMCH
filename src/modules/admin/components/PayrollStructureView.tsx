import React, { useState } from 'react';
import { adminHrService } from '../../../services/adminHrService';
import { PayrollRecord } from '../../../types/adminHr';
import { Modal } from '../../../components/common/Modal';
import { CreditCard, DollarSign, Printer, CheckCircle, Calculator, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export const PayrollStructureView: React.FC = () => {
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>(adminHrService.getPayrolls());
  const [selectedMonth, setSelectedMonth] = useState('2026-07');

  const [selectedPayslip, setSelectedPayslip] = useState<PayrollRecord | null>(null);
  const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);

  const handleProcessPayroll = () => {
    const count = adminHrService.processMonthlyPayroll(selectedMonth);
    setPayrolls(adminHrService.getPayrolls());
    toast.success(`Processed salary slips for ${selectedMonth} (${count} generated)`);
  };

  const handleOpenPayslip = (pay: PayrollRecord) => {
    setSelectedPayslip(pay);
    setIsPayslipModalOpen(true);
  };

  const totalMonthlyGross = payrolls.reduce((sum, p) => sum + p.grossSalary, 0);
  const totalMonthlyNet = payrolls.reduce((sum, p) => sum + p.netSalary, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            <span>Staff Payroll Structure & Salary Disburse Engine</span>
          </h2>
          <p className="text-xs text-slate-500">
            Basic pay, HRA, DA, PF deductions, TDS tax computation & monthly payslip dispatch
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
          />
          <button
            onClick={handleProcessPayroll}
            className="px-4 py-2 bg-[#002147] hover:bg-blue-900 text-white font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <Calculator className="w-4 h-4" />
            <span>Process Payroll</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-500 uppercase">Gross Monthly Payroll</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">₹{totalMonthlyGross.toLocaleString()}</h3>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-500 uppercase">Total PF & Tax Deductions</p>
          <h3 className="text-2xl font-black text-rose-600 mt-1">₹{(totalMonthlyGross - totalMonthlyNet).toLocaleString()}</h3>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-500 uppercase">Net Monthly Bank Disburse</p>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">₹{totalMonthlyNet.toLocaleString()}</h3>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 space-y-4">
        <h3 className="font-black text-sm text-slate-900 dark:text-white">Generated Salary Slips ({payrolls.length})</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
                <th className="p-3">Staff Member</th>
                <th className="p-3">Designation & Dept</th>
                <th className="p-3">Gross Salary</th>
                <th className="p-3">Deductions</th>
                <th className="p-3">Net Disburse</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {payrolls.map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-slate-900 dark:text-white">
                    {pay.empName} <span className="text-[10px] text-blue-600 block">{pay.empId}</span>
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{pay.designationName} ({pay.departmentName})</td>
                  <td className="p-3 font-semibold">₹{pay.grossSalary.toLocaleString()}</td>
                  <td className="p-3 text-rose-600">₹{pay.totalDeductions.toLocaleString()}</td>
                  <td className="p-3 font-black text-emerald-600">₹{pay.netSalary.toLocaleString()}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleOpenPayslip(pay)}
                      className="px-3 py-1.5 bg-[#002147] text-white font-bold rounded-lg cursor-pointer flex items-center gap-1 inline-flex"
                    >
                      <FileText className="w-3.5 h-3.5" /> View Payslip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payslip Modal */}
      <Modal isOpen={isPayslipModalOpen} onClose={() => setIsPayslipModalOpen(false)} title={`Salary Slip: ${selectedPayslip?.empName} (${selectedPayslip?.monthYear})`}>
        {selectedPayslip && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-[#002147] text-white rounded-2xl text-center space-y-1">
              <h3 className="font-black text-base">SMART HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL</h3>
              <p className="text-[11px] text-blue-200">Official Monthly Pay Advice Slip ({selectedPayslip.monthYear})</p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <p><strong>Employee:</strong> {selectedPayslip.empName}</p>
              <p><strong>EMP ID:</strong> {selectedPayslip.empId}</p>
              <p><strong>Department:</strong> {selectedPayslip.departmentName}</p>
              <p><strong>Designation:</strong> {selectedPayslip.designationName}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl space-y-1">
                <h4 className="font-black text-emerald-800 dark:text-emerald-300 uppercase">Earnings</h4>
                <p>Basic Pay: ₹{selectedPayslip.basicPay.toLocaleString()}</p>
                <p>HRA: ₹{selectedPayslip.hra.toLocaleString()}</p>
                <p>DA: ₹{selectedPayslip.da.toLocaleString()}</p>
                <p>Special Allowance: ₹{selectedPayslip.specialAllowance.toLocaleString()}</p>
                <p className="font-bold border-t pt-1 mt-1">Gross Earnings: ₹{selectedPayslip.grossSalary.toLocaleString()}</p>
              </div>

              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl space-y-1">
                <h4 className="font-black text-rose-800 dark:text-rose-300 uppercase">Deductions</h4>
                <p>Provident Fund (PF): ₹{selectedPayslip.pfDeduction.toLocaleString()}</p>
                <p>Tax TDS: ₹{selectedPayslip.tdsDeduction.toLocaleString()}</p>
                <p>Other Deductions: ₹{selectedPayslip.otherDeductions.toLocaleString()}</p>
                <p className="font-bold border-t pt-1 mt-1">Total Deductions: ₹{selectedPayslip.totalDeductions.toLocaleString()}</p>
              </div>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/60 rounded-xl flex justify-between items-center text-sm font-black">
              <span>NET SALARY PAYABLE:</span>
              <span className="text-emerald-600 text-lg">₹{selectedPayslip.netSalary.toLocaleString()}</span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#002147] text-white font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print Payslip
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
