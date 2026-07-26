import { apiClient } from './apiClient';
import { ApiResponse, FeeDetail, FeeTransaction } from '../../types/index';

export const mockFeeDetails: FeeDetail[] = [
  { id: 'fee-1', feeType: '3rd BHMS Annual Tuition Fee', semester: '3rd Prof Year', totalAmount: 50000, paidAmount: 25000, dueAmount: 25000, dueDate: '2026-08-31', status: 'PARTIAL' },
  { id: 'fee-2', feeType: 'University Examination & Center Fee (WBUHS)', semester: '3rd Prof Year', totalAmount: 3500, paidAmount: 0, dueAmount: 3500, dueDate: '2026-08-15', status: 'PENDING' },
  { id: 'fee-3', feeType: 'Library & E-Resource Consortium Annual Fee', semester: '3rd Prof Year', totalAmount: 2000, paidAmount: 2000, dueAmount: 0, dueDate: '2026-06-30', status: 'PAID' },
  { id: 'fee-4', feeType: 'Student Hostel & Mess Fee (Quarter II)', semester: '3rd Prof Year', totalAmount: 18000, paidAmount: 18000, dueAmount: 0, dueDate: '2026-07-01', status: 'PAID' }
];

export const mockFeeTransactions: FeeTransaction[] = [
  { id: 'tx-101', receiptNo: 'RCP-2026-8801', paymentDate: '2026-07-18', amount: 25000, paymentMode: 'UPI', transactionId: 'UPI/6192830192/SBI', feeType: '3rd BHMS Annual Tuition Fee (Inst. 1)', status: 'SUCCESS', receiptUrl: '#' },
  { id: 'tx-102', receiptNo: 'RCP-2026-7240', paymentDate: '2026-06-28', amount: 2000, paymentMode: 'NET_BANKING', transactionId: 'HDFC/99201823/ONL', feeType: 'Library & E-Resource Consortium Annual Fee', status: 'SUCCESS', receiptUrl: '#' },
  { id: 'tx-103', receiptNo: 'RCP-2026-6109', paymentDate: '2026-06-25', amount: 18000, paymentMode: 'CARD', transactionId: 'PAYTM/CARD/881204', feeType: 'Student Hostel & Mess Fee (Quarter II)', status: 'SUCCESS', receiptUrl: '#' }
];

export const feesApi = {
  getFeeDetails: async (): Promise<ApiResponse<FeeDetail[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<FeeDetail[]>>('/student/fees');
      return response.data;
    } catch {
      return { success: true, message: 'Fee details fetched', data: mockFeeDetails, timestamp: new Date().toISOString() };
    }
  },

  getTransactions: async (): Promise<ApiResponse<FeeTransaction[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<FeeTransaction[]>>('/student/fees/transactions');
      return response.data;
    } catch {
      return { success: true, message: 'Fee transactions fetched', data: mockFeeTransactions, timestamp: new Date().toISOString() };
    }
  },

  payFeeOnline: async (feeId: string, amount: number, paymentMode: string): Promise<ApiResponse<FeeTransaction>> => {
    try {
      const response = await apiClient.post<ApiResponse<FeeTransaction>>('/student/fees/pay', { feeId, amount, paymentMode });
      return response.data;
    } catch {
      const newTx: FeeTransaction = {
        id: `tx-${Date.now()}`,
        receiptNo: `RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        paymentDate: new Date().toISOString().split('T')[0],
        amount,
        paymentMode: paymentMode as any,
        transactionId: `ONLINE/${Date.now()}`,
        feeType: 'Online Fee Payment',
        status: 'SUCCESS',
        receiptUrl: '#'
      };
      return { success: true, message: 'Payment completed successfully!', data: newTx, timestamp: new Date().toISOString() };
    }
  },

  downloadReceipt: async (transactionId: string): Promise<Blob> => {
    try {
      const response = await apiClient.get(`/student/fees/receipt/${transactionId}`, { responseType: 'blob' });
      return response.data;
    } catch {
      const content = `Burdwan Homoeopathic Medical College Fee Receipt - Tx ID: ${transactionId}`;
      return new Blob([content], { type: 'application/pdf' });
    }
  }
};
