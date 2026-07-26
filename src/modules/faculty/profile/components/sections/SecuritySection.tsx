import React, { useState } from 'react';
import { SecuritySettings } from '../../types/profile.types';
import { changePasswordSchema } from '../../schemas/profile.schema';
import { profileService } from '../../services/profile.service';
import { Lock, Shield, Smartphone, KeyRound, Monitor, Trash2, CheckCircle2, AlertTriangle, QrCode } from 'lucide-react';

interface SecuritySectionProps {
  security: SecuritySettings;
  onTerminateSession: (sessionId: string) => Promise<void>;
}

export const SecuritySection: React.FC<SecuritySectionProps> = ({
  security,
  onTerminateSession,
}) => {
  // Password Change State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);
  const [isChangingPass, setIsChangingPass] = useState(false);

  // 2FA State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(security.twoFactorEnabled);
  const [showQrModal, setShowQrModal] = useState(false);

  // Password Strength Meter
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strengthScore = getPasswordStrength(newPass);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(null);

    const validation = changePasswordSchema.safeParse({
      currentPassword: currentPass,
      newPassword: newPass,
      confirmPassword: confirmPass,
    });

    if (!validation.success) {
      setPassError(validation.error.issues[0]?.message || 'Invalid password inputs');
      return;
    }

    setIsChangingPass(true);
    try {
      await profileService.changePassword(currentPass, newPass);
      setPassSuccess('Password updated successfully! Please re-login on other devices.');
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } catch (err: any) {
      setPassError(err?.message || 'Failed to update password');
    } finally {
      setIsChangingPass(false);
    }
  };

  const handleToggle2FA = async () => {
    const nextState = !twoFactorEnabled;
    if (nextState) {
      setShowQrModal(true);
    } else {
      await profileService.toggleTwoFactor(false);
      setTwoFactorEnabled(false);
    }
  };

  const confirmEnable2FA = async () => {
    await profileService.toggleTwoFactor(true);
    setTwoFactorEnabled(true);
    setShowQrModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Change Password Form */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <KeyRound className="w-5 h-5 text-emerald-600" />
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Security & Change Password
          </h3>
        </div>

        {passError && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-2xl text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{passError}</span>
          </div>
        )}

        {passSuccess && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-2xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{passSuccess}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-xl">
          <div className="space-y-1">
            <label className="text-3xs font-black uppercase text-slate-400 tracking-wider">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-3xs font-black uppercase text-slate-400 tracking-wider">
              New Password
            </label>
            <input
              type="password"
              required
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-bold"
            />

            {/* Strength meter bar */}
            {newPass.length > 0 && (
              <div className="space-y-1 pt-1">
                <div className="flex h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      strengthScore <= 2
                        ? 'w-1/3 bg-rose-500'
                        : strengthScore <= 4
                        ? 'w-2/3 bg-amber-500'
                        : 'w-full bg-emerald-500'
                    }`}
                  />
                </div>
                <p className="text-3xs font-extrabold text-slate-400 text-right">
                  Strength:{' '}
                  <span
                    className={
                      strengthScore <= 2
                        ? 'text-rose-500'
                        : strengthScore <= 4
                        ? 'text-amber-500'
                        : 'text-emerald-500'
                    }
                  >
                    {strengthScore <= 2 ? 'Weak' : strengthScore <= 4 ? 'Medium' : 'Strong'}
                  </span>
                </p>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-3xs font-black uppercase text-slate-400 tracking-wider">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-bold"
            />
          </div>

          <button
            type="submit"
            disabled={isChangingPass}
            className="px-5 py-2.5 bg-[#002147] hover:bg-[#003366] text-white rounded-2xl text-xs font-extrabold transition cursor-pointer disabled:opacity-50"
          >
            {isChangingPass ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Two-Factor Authentication (2FA) */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Two-Factor Authentication (2FA)
              </h3>
              <p className="text-3xs text-slate-500 font-medium">
                Add an extra layer of security using Google Authenticator or SMS.
              </p>
            </div>
          </div>

          <button
            onClick={handleToggle2FA}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer ${
              twoFactorEnabled
                ? 'bg-rose-50 dark:bg-rose-950 text-rose-600 border border-rose-200'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
          </button>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Monitor className="w-5 h-5 text-blue-600" />
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Active Logged-in Sessions
          </h3>
        </div>

        <div className="space-y-3">
          {security.activeSessions.map((sess) => (
            <div
              key={sess.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-black text-xs text-slate-900 dark:text-white">
                    {sess.device} — {sess.browser}
                  </span>
                  {sess.isCurrent && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      This Device
                    </span>
                  )}
                </div>
                <p className="text-3xs text-slate-500 font-medium">
                  IP: {sess.ipAddress} • Location: {sess.location} • Last Active: {sess.lastActive}
                </p>
              </div>

              {!sess.isCurrent && (
                <button
                  onClick={() => onTerminateSession(sess.id)}
                  className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-2xs font-extrabold transition cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Terminate</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Login History */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
          Recent Security Login Logs
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-3xs font-black uppercase text-slate-400">
                <th className="pb-2">Timestamp</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">IP Address</th>
                <th className="pb-2">Device & Browser</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {security.loginHistory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200">{item.timestamp}</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700">
                      {item.status}
                    </span>
                  </td>
                  <td className="py-2.5 font-mono text-3xs">{item.ipAddress}</td>
                  <td className="py-2.5">{item.device} ({item.location})</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2FA QR Code Setup Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-sm w-full p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <QrCode className="w-6 h-6" />
            </div>

            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Scan 2FA Authenticator QR Code
            </h3>

            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl inline-block border border-slate-200 dark:border-slate-700">
              <div className="w-36 h-36 bg-slate-900 text-white font-mono text-2xs flex items-center justify-center rounded-xl">
                [QR CODE PLACEHOLDER]
              </div>
            </div>

            <p className="text-3xs text-slate-500 font-semibold">
              Scan with Google Authenticator or Authy app, then confirm activation.
            </p>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setShowQrModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmEnable2FA}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Confirm 2FA Setup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
