import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Moon, 
  Sun, 
  Laptop, 
  Globe, 
  Bell, 
  Eye, 
  Sliders, 
  Check, 
  Building2,
  Phone,
  Mail,
  UserCheck,
  Stethoscope,
  FileText,
  Save,
  RotateCcw,
  ShieldCheck,
  MapPin
} from 'lucide-react';
import { institutionSettingsService, InstitutionSettings } from '../../services/institutionSettingsService';
import toast from 'react-hot-toast';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();

  // Active Tab: 'preferences' | 'institution'
  const [activeTab, setActiveTab] = useState<'preferences' | 'institution'>('preferences');

  // Preferences State
  const [language, setLanguage] = useState<'en' | 'bn' | 'hi'>('en');
  const [notifications, setNotifications] = useState({
    emailNotices: true,
    hospitalAlerts: true,
    academicUpdates: true,
    smsAlerts: false,
  });
  const [accessibility, setAccessibility] = useState({
    highContrast: false,
    fontSize: 'normal',
    reduceMotion: false,
    screenReader: false,
  });

  const [saved, setSaved] = useState(false);

  // Institution Contact & PDF Settings State
  const [instSettings, setInstSettings] = useState<InstitutionSettings>(() => institutionSettingsService.getSettings());
  const [isSavingInst, setIsSavingInst] = useState(false);

  useEffect(() => {
    const handleSettingsUpdate = () => {
      setInstSettings(institutionSettingsService.getSettings());
    };
    window.addEventListener('bhmch_institution_settings_updated', handleSettingsUpdate);
    return () => window.removeEventListener('bhmch_institution_settings_updated', handleSettingsUpdate);
  }, []);

  const handleSavePreferences = () => {
    setSaved(true);
    toast.success('System preferences saved successfully!');
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSaveInstitutionSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingInst(true);
    try {
      // Re-format full address
      const formatted = `${instSettings.addressLine1}, ${instSettings.addressLine2}, P.O. - ${instSettings.po}, ${instSettings.district}, ${instSettings.state} - ${instSettings.pincode}`;
      const updated = {
        ...instSettings,
        formattedAddress: formatted,
      };

      institutionSettingsService.saveSettings(updated);
      setInstSettings(updated);
      toast.success('Official Institutional Contacts & PDF Settings Updated!');
    } catch {
      toast.error('Failed to save institutional settings.');
    } finally {
      setIsSavingInst(false);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Are you sure you want to reset all institutional contact settings to official defaults?')) {
      const reset = institutionSettingsService.resetToDefaults();
      setInstSettings(reset);
      toast.success('Institutional settings reset to default values.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sliders className="w-6 h-6 text-[#002147] dark:text-[#00A651]" />
            System & Institutional Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage portal preferences, official institution contact details, principal secretariat hotline, and OPD Patient Card PDF templates.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setActiveTab('preferences')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === 'preferences'
                ? 'bg-white dark:bg-slate-900 text-[#002147] dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Preferences
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('institution')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'institution'
                ? 'bg-[#002147] text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Institution & PDF Settings</span>
          </button>
        </div>
      </div>

      {activeTab === 'preferences' ? (
        <div className="space-y-6">
          {/* Theme Settings */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-xs text-slate-400 flex items-center gap-2">
              <Sun className="w-4 h-4 text-[#00A651]" />
              Appearance & Visual Theme
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'light', label: 'Light Mode', icon: Sun, desc: 'Clean high-contrast light theme for daytime clinical work' },
                { id: 'dark', label: 'Dark Mode', icon: Moon, desc: 'Eye-safe twilight theme for evening research' },
                { id: 'system', label: 'System Default', icon: Laptop, desc: 'Automatically matches your OS configuration' },
              ].map((item) => {
                const Icon = item.icon;
                const active = theme === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setTheme(item.id as any)}
                    className={`p-4 rounded-xl border text-left transition flex flex-col justify-between h-28 ${
                      active
                        ? 'border-[#002147] dark:border-[#00A651] bg-slate-50 dark:bg-slate-800/80 ring-2 ring-[#002147]/10 dark:ring-[#00A651]/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Icon className={`w-5 h-5 ${active ? 'text-[#002147] dark:text-[#00A651]' : 'text-slate-400'}`} />
                      {active && <Check className="w-4 h-4 text-[#002147] dark:text-[#00A651]" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.label}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language Settings */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#00A651]" />
              Portal Language Selection
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'en', name: 'English', desc: 'Standard Academic & NCH Terminology' },
                { id: 'bn', name: 'বাংলা (Bengali)', desc: 'Official Regional Campus Communication' },
                { id: 'hi', name: 'हिन्दी (Hindi)', desc: 'National AYUSH Standard Support' },
              ].map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setLanguage(lang.id as any)}
                  className={`p-3.5 rounded-xl border text-left transition ${
                    language === lang.id
                      ? 'border-[#002147] dark:border-[#00A651] bg-slate-50 dark:bg-slate-800/80 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{lang.name}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{lang.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#00A651]" />
              Notification Subscriptions
            </h2>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {[
                { id: 'emailNotices', label: 'Official College Notices & Circulars', desc: 'Receive immediate email notifications when new notices are published by the Principal' },
                { id: 'hospitalAlerts', label: 'Hospital Emergency & OPD Roster Alerts', desc: 'Alerts regarding emergency duty calls, patient bed allocations, and doctor schedules' },
                { id: 'academicUpdates', label: 'Class Routines & Exam Schedule Changes', desc: 'Receive real-time notifications on routine modifications and hall ticket releases' },
                { id: 'smsAlerts', label: 'Urgent SMS Broadcasts', desc: 'Critical campus emergency or disaster management alerts via SMS' },
              ].map((item) => (
                <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{item.label}</p>
                    <p className="text-[11px] text-slate-500">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotifications({ ...notifications, [item.id]: !(notifications as any)[item.id] })}
                    className={`w-11 h-6 rounded-full transition relative p-0.5 ${
                      (notifications as any)[item.id] ? 'bg-[#002147] dark:bg-[#00A651]' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-md transform transition ${
                        (notifications as any)[item.id] ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Accessibility Controls */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#00A651]" />
              Accessibility & Display Controls
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Font Scaling</span>
                <div className="flex gap-2">
                  {['small', 'normal', 'large'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setAccessibility({ ...accessibility, fontSize: size })}
                      className={`flex-1 py-1.5 rounded-lg border text-center capitalize font-semibold ${
                        accessibility.fontSize === size
                          ? 'bg-[#002147] text-white border-[#002147]'
                          : 'bg-white dark:bg-slate-900 border-slate-200 text-slate-600'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">Reduce Motion & Animations</p>
                  <p className="text-[11px] text-slate-500">Minimizes Framer Motion UI transitions</p>
                </div>
                <button
                  onClick={() => setAccessibility({ ...accessibility, reduceMotion: !accessibility.reduceMotion })}
                  className={`w-10 h-5 rounded-full transition p-0.5 ${
                    accessibility.reduceMotion ? 'bg-[#00A651]' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transform transition ${accessibility.reduceMotion ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSavePreferences}
              className="px-6 py-3 rounded-xl bg-[#002147] hover:bg-[#001530] text-white font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Save Preferences</span>
            </button>
          </div>
        </div>
      ) : (
        /* Institution & PDF Settings Form */
        <form onSubmit={handleSaveInstitutionSettings} className="space-y-6 text-xs">
          <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-blue-900 dark:text-blue-200 font-bold">
              <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
              <div>
                <p className="text-xs">Dynamic Institutional Settings Management</p>
                <p className="text-[11px] font-normal text-blue-700 dark:text-blue-300">
                  Updates made here immediately propagate across the Header, Footer, Contact Page, About Page, Admission Helpline, and generated OPD Patient Cards.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-100 text-slate-700 dark:text-slate-200 font-bold text-[11px] rounded-xl border border-slate-300 dark:border-slate-700 transition flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>

          {/* 1. College Contact Details */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>College Office & Campus Address</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  College Name
                </label>
                <input
                  type="text"
                  required
                  value={instSettings.collegeName}
                  onChange={(e) => setInstSettings({ ...instSettings, collegeName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  College Phone
                </label>
                <input
                  type="text"
                  required
                  value={instSettings.collegePhone}
                  onChange={(e) => setInstSettings({ ...instSettings, collegePhone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  College Email
                </label>
                <input
                  type="email"
                  required
                  value={instSettings.collegeEmail}
                  onChange={(e) => setInstSettings({ ...instSettings, collegeEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Address Line 1 (Building / Campus)
                </label>
                <input
                  type="text"
                  value={instSettings.addressLine1}
                  onChange={(e) => setInstSettings({ ...instSettings, addressLine1: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Address Line 2 (Locality / Rajganj)
                </label>
                <input
                  type="text"
                  value={instSettings.addressLine2}
                  onChange={(e) => setInstSettings({ ...instSettings, addressLine2: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Post Office (P.O.)
                </label>
                <input
                  type="text"
                  value={instSettings.po}
                  onChange={(e) => setInstSettings({ ...instSettings, po: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  District
                </label>
                <input
                  type="text"
                  value={instSettings.district}
                  onChange={(e) => setInstSettings({ ...instSettings, district: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  State & PIN Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={instSettings.state}
                    onChange={(e) => setInstSettings({ ...instSettings, state: e.target.value })}
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                  />
                  <input
                    type="text"
                    value={instSettings.pincode}
                    onChange={(e) => setInstSettings({ ...instSettings, pincode: e.target.value })}
                    className="w-28 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Principal & Hospital Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Principal Contact */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-purple-600" />
                <span>Principal Secretariat Contact</span>
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Principal Name
                  </label>
                  <input
                    type="text"
                    required
                    value={instSettings.principalName}
                    onChange={(e) => setInstSettings({ ...instSettings, principalName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Principal Mobile
                  </label>
                  <input
                    type="text"
                    required
                    value={instSettings.principalMobile}
                    onChange={(e) => setInstSettings({ ...instSettings, principalMobile: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Principal Email
                  </label>
                  <input
                    type="email"
                    required
                    value={instSettings.principalEmail}
                    onChange={(e) => setInstSettings({ ...instSettings, principalEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Hospital Contact */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-emerald-600" />
                <span>Hospital Desk & Emergency</span>
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Hospital Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={instSettings.hospitalPhone}
                    onChange={(e) => setInstSettings({ ...instSettings, hospitalPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Emergency Hotline
                  </label>
                  <input
                    type="text"
                    required
                    value={instSettings.emergencyPhone}
                    onChange={(e) => setInstSettings({ ...instSettings, emergencyPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Official Website URL
                  </label>
                  <input
                    type="text"
                    required
                    value={instSettings.websiteUrl}
                    onChange={(e) => setInstSettings({ ...instSettings, websiteUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. OPD Patient Card PDF Template Configuration */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-500" />
              <span>OPD Patient Card PDF Template Options</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  PDF Header Subtitle
                </label>
                <input
                  type="text"
                  required
                  value={instSettings.pdfHeaderSubtitle}
                  onChange={(e) => setInstSettings({ ...instSettings, pdfHeaderSubtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  PDF Verification Notice Text
                </label>
                <input
                  type="text"
                  required
                  value={instSettings.pdfQrVerificationText}
                  onChange={(e) => setInstSettings({ ...instSettings, pdfQrVerificationText: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingInst}
              className="px-6 py-3 rounded-xl bg-[#002147] hover:bg-[#001530] text-white font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4 text-emerald-400" />
              <span>Save Official Contact & PDF Settings</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
