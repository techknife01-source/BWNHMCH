/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserRole, UserSession } from '../types';
import { ShieldAlert, Heart, Lock, Mail, KeyRound, ArrowLeft, RefreshCw, Key } from 'lucide-react';

interface AuthPagesProps {
  onLoginSuccess: (session: UserSession) => void;
  onNavigateHome: () => void;
}

export const AuthPages: React.FC<AuthPagesProps> = ({
  onLoginSuccess,
  onNavigateHome
}) => {
  const [authStep, setAuthStep] = useState<'login' | 'forgot' | 'otp' | 'reset'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  
  // Custom states for messages
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // DEMO ROLE PRESETS
  const demoAccounts: Record<UserRole, UserSession> = {
    super_admin: {
      role: 'super_admin',
      name: 'System SuperAdmin Office',
      email: 'admin@bhmch.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    principal: {
      role: 'principal',
      name: 'Dr. Susmita Chatterjee',
      email: 'principal@bhmch.com',
      avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      department: 'Practice of Medicine'
    },
    vice_principal: {
      role: 'vice_principal',
      name: 'Dr. R. N. Mukherjee',
      email: 'viceprincipal@bhmch.com',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      department: 'Organon of Medicine'
    },
    office_admin: {
      role: 'office_admin',
      name: 'Sanjeev Kumar',
      email: 'office.admin@bhmch.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    faculty: {
      role: 'faculty',
      name: 'Dr. Priyanka Maji',
      email: 'priyanka.maji2013@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      department: 'Materia Medica'
    },
    hod: {
      role: 'hod',
      name: 'Dr. Vandana Gupta (HOD)',
      email: 'hod.repertory@bhmch.com',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      department: 'Repertory'
    },
    hospital_superintendent: {
      role: 'hospital_superintendent',
      name: 'Dr. Partha Sarathi Chakraborty',
      email: 'superintendent@bhmch.com',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    librarian: {
      role: 'librarian',
      name: 'Subhashish Ghosh',
      email: 'library@bhmch.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    accountant: {
      role: 'accountant',
      name: 'Ramesh Chandra Roy',
      email: 'accounts@bhmch.com',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    reception: {
      role: 'reception',
      name: 'Anjali Sharma',
      email: 'reception@bhmch.com',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    admission_cell: {
      role: 'admission_cell',
      name: 'Admission Cell Desk',
      email: 'admission@bhmch.com',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    student: {
      role: 'student',
      name: 'Arjun Sen',
      email: 'arjun.sen@bhmch.com',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      regNo: 'BHMS/2023/045'
    },
    patient: {
      role: 'patient',
      name: 'Savitri Devi',
      email: 'savitri.patient@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    guest: {
      role: 'guest',
      name: 'Visitor / Prospective Student',
      email: 'guest.visitor@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    opd_staff: {
      role: 'opd_staff',
      name: 'Dr. Amit Roy',
      email: 'opd@bhmch.com',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      department: 'OPD General Medicine'
    }
  };

  const handleDemoLogin = (role: UserRole) => {
    onLoginSuccess(demoAccounts[role]);
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Bypass checking credentials, log in with selected role configuration
    onLoginSuccess(demoAccounts[selectedRole]);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setInfoMessage(`We've sent a 6-digit verification code to ${emailInput}.`);
    setAuthStep('otp');
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput) return;
    setInfoMessage(null);
    setAuthStep('reset');
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPassword) return;
    setInfoMessage('Password has been updated successfully. Please log in.');
    setAuthStep('login');
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] dark:bg-[#000f21] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 font-sans" id="auth_portal_root">
      
      {/* BRAND & CARD CONTAINER */}
      <div className="max-w-md w-full space-y-6">
        
        {/* BACK TO MAIN PORTAL */}
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center space-x-1.5 text-3xs font-black uppercase tracking-wider text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Back to College Portal</span>
        </button>

        {/* LOGO AREA */}
        <div className="text-center space-y-2">
          <img
            src="/college_logo.svg"
            alt="Official College Logo"
            className="mx-auto w-14 h-14 object-contain shadow-xs rounded-xl bg-white p-1 border border-slate-200"
          />
          <h2 className="text-lg font-black text-[#002147] dark:text-slate-100 tracking-tight uppercase">
            Burdwan HomoeoERP
          </h2>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
            Medical College Campus Management
          </p>
        </div>

        {/* ACTIVE MAIN BOX */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm space-y-6">
          
          {/* STEP 1: FORM LOGIN */}
          {authStep === 'login' && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                <span className="text-xs font-black text-[#002147] dark:text-slate-300 uppercase tracking-wider block">
                  Secure ERP Access
                </span>
                <span className="text-[9px] font-black text-[#00A651] bg-[#e6f6ee] dark:bg-slate-950 px-2.5 py-0.5 rounded border border-[#00a65115] uppercase">
                  AYUSH Standard v2.6
                </span>
              </div>

              {infoMessage && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-[#00A651] text-3xs font-bold rounded-xl text-center border border-emerald-100">
                  {infoMessage}
                </div>
              )}

              {/* ROLE PICKER */}
              <div className="space-y-1.5">
                <label className="text-4xs font-black text-slate-400 uppercase tracking-widest block">Select Login Counter</label>
                <div className="grid grid-cols-3 gap-1.5 text-4xs font-bold uppercase text-center">
                  {[
                    { id: 'student', label: 'Scholar' },
                    { id: 'faculty', label: 'Faculty' },
                    { id: 'hospital_staff', label: 'Clinician' },
                    { id: 'opd_staff', label: 'OPD Desk' },
                    { id: 'office_staff', label: 'Admin Office' },
                    { id: 'registrar', label: 'Registrar' },
                    { id: 'principal', label: 'Principal' }
                  ].map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRole(r.id as UserRole)}
                      className={`py-1.5 rounded-lg border transition ${
                        selectedRole === r.id
                          ? 'border-[#002147] bg-[#E6F0FF] text-[#002147] dark:border-white dark:bg-slate-800 dark:text-white'
                          : 'border-slate-100 dark:border-slate-800/80 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* FORM FIELDS */}
              <form onSubmit={handleFormLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-4xs font-black text-slate-400 uppercase tracking-widest block">Email Address / RegNo</label>
                  <div className="flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5">
                    <Mail className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                    <input
                      type="email"
                      required
                      placeholder={demoAccounts[selectedRole].email}
                      className="w-full text-xs bg-transparent focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-4xs font-black text-slate-400 uppercase tracking-widest block">Password</label>
                    <button
                      type="button"
                      onClick={() => setAuthStep('forgot')}
                      className="text-4xs font-bold text-[#00A651] hover:underline uppercase tracking-wide"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5">
                    <Lock className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full text-xs bg-transparent focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#002147] hover:bg-[#001630] text-white font-black text-[10px] uppercase tracking-widest transition shadow-xs cursor-pointer"
                >
                  Confirm Authentication
                </button>
              </form>

              {/* DEVELOPER TESTING SWITCH BOARD */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 mt-4">
                <span className="text-4xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-[#00A651] animate-spin" />
                  <span>Interactive Evaluator Account Switcher</span>
                </span>
                <p className="text-[10px] text-slate-500 lowercase first-letter:uppercase leading-relaxed">
                  Click any role to bypass passwords and log in directly to their dedicated medical, hospital, or registrar dashboard.
                </p>
                <div className="grid grid-cols-2 gap-1.5 text-3xs font-bold uppercase text-slate-600 dark:text-slate-300">
                  <button
                    onClick={() => handleDemoLogin('student')}
                    className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#00A651] transition text-left"
                  >
                    Student (Arjun)
                  </button>
                  <button
                    onClick={() => handleDemoLogin('faculty')}
                    className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#00A651] transition text-left"
                  >
                    Faculty (Dr. Maji)
                  </button>
                  <button
                    onClick={() => handleDemoLogin('hospital_superintendent')}
                    className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#00A651] transition text-left"
                  >
                    Hospital Superintendent
                  </button>
                  <button
                    onClick={() => handleDemoLogin('opd_staff')}
                    className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#00A651] transition text-left"
                  >
                    OPD Desk (Dr. Amit)
                  </button>
                  <button
                    onClick={() => handleDemoLogin('office_admin')}
                    className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#00A651] transition text-left"
                  >
                    Office Admin (Sanjeev)
                  </button>
                  <button
                    onClick={() => handleDemoLogin('librarian')}
                    className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#00A651] transition text-left"
                  >
                    Librarian (Subhashish)
                  </button>
                  <button
                    onClick={() => handleDemoLogin('principal')}
                    className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#00A651] transition text-left col-span-2 text-center text-[#00A651]"
                  >
                    Principal (Dr. Susmita Chatterjee)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: FORGOT PASSWORD */}
          {authStep === 'forgot' && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-xs font-black text-[#002147] dark:text-slate-300 uppercase tracking-wider block">
                  Reset Password Request
                </span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Provide your registered college staff or scholar email address. We will route an OTP validation token.
              </p>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Email Address</label>
                  <div className="flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5">
                    <Mail className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={e => setEmailInput(e.target.value)}
                      placeholder="e.g. principal@bhmch.com"
                      className="w-full text-xs bg-transparent focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-3xs uppercase tracking-wider font-bold">
                  <button
                    type="button"
                    onClick={() => setAuthStep('login')}
                    className="text-slate-500 font-bold hover:underline"
                  >
                    Back to Login
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-[#002147] hover:bg-[#00142c] text-white font-black tracking-wider text-[9px]"
                  >
                    Request Token
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: OTP VERIFICATION */}
          {authStep === 'otp' && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-xs font-black text-[#002147] dark:text-slate-300 uppercase tracking-wider block">
                  Verify Credentials Token
                </span>
              </div>
              {infoMessage && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 text-3xs font-medium rounded-xl text-center border border-amber-100">
                  {infoMessage}
                </div>
              )}
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Please input the 6-digit verification code. (Input any combination for testing)
              </p>

              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">6-Digit Code</label>
                  <div className="flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5">
                    <KeyRound className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpInput}
                      onChange={e => setOtpInput(e.target.value)}
                      placeholder="e.g. 123456"
                      className="w-full text-xs bg-transparent focus:outline-none font-mono tracking-widest text-center"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-3xs uppercase tracking-wider font-bold">
                  <button
                    type="button"
                    onClick={() => setAuthStep('login')}
                    className="text-slate-500 font-bold hover:underline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-[#002147] hover:bg-[#00142c] text-white font-black tracking-wider text-[9px]"
                  >
                    Verify Code
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 4: RESET PASSWORD */}
          {authStep === 'reset' && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-xs font-black text-[#002147] dark:text-slate-300 uppercase tracking-wider block">
                  Choose New Password
                </span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Create a high-entropy password to secure your medical archives and student listings.
              </p>

              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">New Password</label>
                  <div className="flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5">
                    <Key className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                    <input
                      type="password"
                      required
                      value={resetPassword}
                      onChange={e => setResetPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs bg-transparent focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#002147] hover:bg-[#00142c] text-white font-black text-[10px] rounded-xl uppercase tracking-widest transition shadow-xs"
                >
                  Save Password & Login
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
