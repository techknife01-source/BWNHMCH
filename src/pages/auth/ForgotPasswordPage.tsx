import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useNotification } from '../../hooks/useNotification';
import { authApi } from '../../services/api/auth.api';
import { Mail, KeyRound, ArrowLeft } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState<'REQUEST' | 'RESET'>('REQUEST');
  const [isLoading, setIsLoading] = useState(false);
  const notification = useNotification();

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      notification.error('Please enter your institutional email');
      return;
    }
    try {
      setIsLoading(true);
      await authApi.forgotPassword(email);
      notification.success('Verification OTP sent to your email');
      setStep('RESET');
    } catch (err: any) {
      notification.error(err.response?.data?.message || 'Failed to dispatch OTP email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !newPassword) {
      notification.error('Please fill in both OTP code and new password');
      return;
    }
    try {
      setIsLoading(true);
      await authApi.resetPassword({ email, otp, newPassword });
      notification.success('Password updated successfully. Please sign in.');
    } catch (err: any) {
      notification.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black text-white">Reset Password</h2>
        <p className="text-xs text-slate-400">
          {step === 'REQUEST' ? 'Enter your registered email to receive an OTP' : 'Enter OTP code and set new password'}
        </p>
      </div>

      {step === 'REQUEST' ? (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <Input
            label="Institutional Registered Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@bhmch.ac.in"
            leftIcon={<Mail className="h-4 w-4" />}
          />
          <Button variant="primary" type="submit" isLoading={isLoading} className="w-full">
            Send OTP Code
          </Button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <Input
            label="6-Digit OTP Code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            leftIcon={<KeyRound className="h-4 w-4" />}
          />
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
          />
          <Button variant="accent" type="submit" isLoading={isLoading} className="w-full">
            Confirm & Reset Password
          </Button>
        </form>
      )}

      <div className="pt-2 text-center">
        <Link to="/login" className="inline-flex items-center text-xs text-blue-400 hover:underline">
          <ArrowLeft className="h-3.5 w-3.5 mr-1" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  );
};
