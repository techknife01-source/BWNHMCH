import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserDisplayDesignation, isFacultyUser } from '../../utils/permissionHelper';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Award, 
  Key, 
  ShieldCheck, 
  Activity, 
  Calendar, 
  Clock, 
  Smartphone, 
  Globe, 
  CheckCircle2, 
  Lock,
  Camera,
  Edit3
} from 'lucide-react';
import { motion } from 'framer-motion';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'academic' | 'security' | 'activity'>('profile');

  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || 'Dr. Susmita Chatterjee',
    email: user?.email || 'principal@bwnhmch.ac.in',
    phone: user?.phoneNumber || '+91 98321 45678',
    department: user?.department || 'Organon of Medicine & Homoeopathic Philosophy',
    designation: getUserDisplayDesignation(user),
    address: 'Rajbati, Purba Bardhaman, West Bengal 713104',
    regNo: 'WB-NCH-1994-0821',
    qualification: 'M.D. (Hom.), Ph.D.',
    experienceYears: '28 Years'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess(true);
    setTimeout(() => setPasswordSuccess(false), 3000);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const loginHistory = [
    { id: '1', device: 'Chrome on macOS (M2 Max)', ip: '182.73.192.42', location: 'Burdwan, WB, India', time: 'Today, 09:15 AM', current: true },
    { id: '2', device: 'HomoeoERP Android App (v2.6)', ip: '47.15.201.88', location: 'Burdwan, WB, India', time: 'Yesterday, 04:30 PM', current: false },
    { id: '3', device: 'Firefox on Windows 11 Pro', ip: '182.73.192.40', location: 'Kolkata, WB, India', time: '21 Jul 2026, 11:20 AM', current: false }
  ];

  const recentActivities = [
    { id: 'a1', action: 'Approved BHMS 3rd Year Attendance Report', category: 'Academic', timestamp: 'Today, 10:30 AM' },
    { id: 'a2', action: 'Signed OPD Emergency Duty Roster (Aug 2026)', category: 'Hospital', timestamp: 'Today, 09:45 AM' },
    { id: 'a3', action: 'Published Research Circular #NCH-2026-04', category: 'IQAC', timestamp: 'Yesterday, 03:15 PM' },
    { id: 'a4', action: 'Updated Personal Profile Information', category: 'Security', timestamp: '20 Jul 2026, 05:00 PM' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#002147] via-[#003366] to-[#00A651] text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
          <div className="relative group self-start">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-white/20 overflow-hidden shadow-xl flex items-center justify-center text-3xl font-black">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={formData.fullName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white">{formData.fullName.charAt(0)}</span>
              )}
            </div>
            <button className="absolute bottom-1 right-1 p-2 rounded-lg bg-[#00A651] hover:bg-emerald-600 text-white shadow-md transition">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/10 uppercase tracking-wider">
                {getUserDisplayDesignation(user)}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                {isFacultyUser(user) ? 'Active Academic Faculty' : 'Verified Portal Account'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{formData.fullName}</h1>
            <p className="text-sm text-slate-200 font-medium flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4 text-emerald-400" /> {formData.department}</span>
              <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-emerald-400" /> Reg: {formData.regNo}</span>
            </p>
          </div>

          <button 
            onClick={() => setIsEditing(!isEditing)} 
            className="self-start md:self-center px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold flex items-center gap-2 backdrop-blur-sm transition"
          >
            <Edit3 className="w-4 h-4" />
            <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto gap-2 text-sm font-medium">
        {[
          { id: 'profile', label: 'Personal Details', icon: User },
          { id: 'academic', label: 'Academic & Experience', icon: Award },
          { id: 'security', label: 'Security & Sessions', icon: ShieldCheck },
          { id: 'activity', label: 'Activity Logs', icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#002147] text-[#002147] dark:border-[#00A651] dark:text-[#00A651] font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <User className="w-5 h-5 text-[#002147] dark:text-[#00A651]" />
                Personal Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Full Name</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 disabled:opacity-80"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled={!isEditing}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 disabled:opacity-80"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Phone Number</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 disabled:opacity-80"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Department</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 disabled:opacity-80"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Residential Address</label>
                  <textarea
                    rows={2}
                    disabled={!isEditing}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 disabled:opacity-80"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                    Cancel
                  </button>
                  <button onClick={() => setIsEditing(false)} className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#002147] text-white hover:bg-[#001530]">
                    Save Changes
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'academic' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#002147] dark:text-[#00A651]" />
                Academic Credentials & Qualifications
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Qualifications</label>
                  <input type="text" disabled value={formData.qualification} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Medical Council Reg. No.</label>
                  <input type="text" disabled value={formData.regNo} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Teaching & Clinical Experience</label>
                  <input type="text" disabled value={formData.experienceYears} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Designation</label>
                  <input type="text" disabled value={formData.designation} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200" />
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">Key Academic Achievements</h3>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                  <li>Author of 14 peer-reviewed research papers in Homoeopathic Repertory & Organon</li>
                  <li>Member of WBUHS Academic Board & NCH Curriculum Advisory Committee</li>
                  <li>Principal Supervisor for 8 M.D. (Hom.) Scholars</li>
                </ul>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Change Password */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Key className="w-5 h-5 text-[#002147] dark:text-[#00A651]" />
                  Change Account Password
                </h2>

                {passwordSuccess && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-medium rounded-xl border border-emerald-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Password updated successfully!</span>
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit} className="space-y-4 text-sm max-w-md">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Current Password</label>
                    <input
                      type="password"
                      required
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#002147] hover:bg-[#001530] text-white text-xs font-bold transition">
                    Update Password
                  </button>
                </form>
              </div>

              {/* Active Sessions */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-[#002147] dark:text-[#00A651]" />
                  Active Devices & Login Sessions
                </h2>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {loginHistory.map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                          {item.device}
                          {item.current && <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Current</span>}
                        </p>
                        <p className="text-slate-500 text-[11px]">{item.ip} • {item.location} • {item.time}</p>
                      </div>
                      {!item.current && (
                        <button className="text-rose-600 hover:underline font-semibold text-2xs">Revoke</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'activity' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#002147] dark:text-[#00A651]" />
                Recent System Activity Log
              </h2>

              <div className="space-y-3">
                {recentActivities.map((act) => (
                  <div key={act.id} className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/80 flex items-start justify-between text-xs">
                    <div className="space-y-1">
                      <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px] uppercase tracking-wider">
                        {act.category}
                      </span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{act.action}</p>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">{act.timestamp}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Security Status
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">2-Factor Authentication</span>
                <span className="font-bold text-emerald-600">Enabled</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Password Health</span>
                <span className="font-bold text-emerald-600">Strong (89%)</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Role Authority</span>
                <span className="font-bold text-[#002147] dark:text-slate-200">Level 1 Admin</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-slate-900 rounded-2xl p-5 border border-emerald-100 dark:border-emerald-900/50 space-y-3 text-xs">
            <h3 className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              Institutional Identity
            </h3>
            <p className="text-emerald-800/80 dark:text-slate-300 leading-relaxed">
              Your account is verified by the WBUHS Digital Registrar Portal. All official signatures match registered medical credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
