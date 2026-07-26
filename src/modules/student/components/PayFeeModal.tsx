import React, { useState } from 'react';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { FeeDetail } from '../../../types/index';
import { feesApi } from '../../../services/api/fees.api';
import { CreditCard, CheckCircle, ShieldCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  fee: FeeDetail | null;
  onSuccess: () => void;
}

export const PayFeeModal: React.FC<Props> = ({ isOpen, onClose, fee, onSuccess }) => {
  const [paymentAmount, setPaymentAmount] = useState<number>(fee?.dueAmount || 0);
  const [paymentMode, setPaymentMode] = useState<string>('UPI');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentSuccessReceipt, setPaymentSuccessReceipt] = useState<string | null>(null);

  React.useEffect(() => {
    if (fee) {
      setPaymentAmount(fee.dueAmount);
    }
  }, [fee]);

  if (!fee) return null;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const res = await feesApi.payFeeOnline(fee.id, Number(paymentAmount), paymentMode);
      if (res.success && res.data) {
        setPaymentSuccessReceipt(res.data.receiptNo);
        onSuccess();
      }
    } catch {
      // fallback
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setPaymentSuccessReceipt(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={paymentSuccessReceipt ? 'Payment Complete' : 'Online Fee Payment'}
      subtitle={fee.feeType}
      size="md"
    >
      {paymentSuccessReceipt ? (
        <div className="py-6 text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Fee Paid Successfully!</h3>
            <p className="text-xs text-slate-500 mt-1">Receipt Number: <strong className="text-slate-800 dark:text-slate-200">{paymentSuccessReceipt}</strong></p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs space-y-1 text-slate-600 dark:text-slate-300">
            <div className="flex justify-between"><span>Amount Paid:</span> <strong>₹{paymentAmount.toLocaleString('en-IN')}</strong></div>
            <div className="flex justify-between"><span>Mode:</span> <strong>{paymentMode}</strong></div>
            <div className="flex justify-between"><span>Date:</span> <strong>{new Date().toLocaleDateString('en-IN')}</strong></div>
          </div>
          <div className="flex justify-center gap-2 pt-2">
            <Button variant="primary" onClick={handleClose}>
              Done & View History
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handlePayment} className="space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/70 rounded-xl space-y-2 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Total Outstanding Due:</span>
              <span className="font-bold text-red-600 dark:text-red-400">₹{fee.dueAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Due Date:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{fee.dueDate}</span>
            </div>
          </div>

          <Input
            type="number"
            label="Payment Amount (₹)"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(Number(e.target.value))}
            min={100}
            max={fee.dueAmount}
            required
          />

          <Select
            label="Select Payment Method"
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            options={[
              { label: 'BHIM UPI / GooglePay / PhonePe', value: 'UPI' },
              { label: 'Net Banking (SBI / HDFC / ICICI)', value: 'NET_BANKING' },
              { label: 'Debit / Credit Card (Visa / Mastercard)', value: 'CARD' },
            ]}
          />

          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>256-Bit SSL Encrypted SBI Gateway Payment Protection. Instant Receipt Generation.</span>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={onClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isProcessing} leftIcon={<CreditCard className="h-4 w-4" />}>
              Pay ₹{paymentAmount.toLocaleString('en-IN')} Now
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
