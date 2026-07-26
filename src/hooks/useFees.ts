import { useState, useEffect, useCallback } from 'react';
import { feesApi } from '../services/api/fees.api';
import { FeeDetail, FeeTransaction } from '../types/index';

export const useFees = () => {
  const [feeDetails, setFeeDetails] = useState<FeeDetail[]>([]);
  const [transactions, setTransactions] = useState<FeeTransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFees = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [feeRes, txRes] = await Promise.all([
        feesApi.getFeeDetails(),
        feesApi.getTransactions(),
      ]);

      if (feeRes.data) setFeeDetails(feeRes.data);
      if (txRes.data) setTransactions(txRes.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch fee details');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFees();
  }, [fetchFees]);

  const payFee = async (feeId: string, amount: number, paymentMode: string) => {
    try {
      const res = await feesApi.payFeeOnline(feeId, amount, paymentMode);
      if (res.data) {
        setTransactions((prev) => [res.data, ...prev]);
        setFeeDetails((prev) =>
          prev.map((f) => {
            if (f.id === feeId) {
              const newPaid = f.paidAmount + amount;
              const newDue = Math.max(0, f.totalAmount - newPaid);
              return {
                ...f,
                paidAmount: newPaid,
                dueAmount: newDue,
                status: newDue === 0 ? 'PAID' : 'PARTIAL'
              };
            }
            return f;
          })
        );
      }
      return res;
    } catch (err: any) {
      throw err;
    }
  };

  const downloadReceipt = async (transactionId: string, receiptNo: string) => {
    try {
      const blob = await feesApi.downloadReceipt(transactionId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Fee_Receipt_${receiptNo}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Download receipt error:', err);
    }
  };

  return {
    feeDetails,
    transactions,
    isLoading,
    error,
    refetch: fetchFees,
    payFee,
    downloadReceipt,
  };
};
