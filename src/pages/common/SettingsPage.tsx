import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Moon, 
  Sun, 
  Laptop, 
  Globe, 
  Bell, 
  Eye, 
  Lock, 
  Sliders, 
  Check, 
  ShieldAlert,
  Volume2
} from 'lucide-react';
import { motion } from 'framer-motion';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();

  // Settings State
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
  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    showContactInfo: false,
    activityVisibility: 'faculty',
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sliders className="w-6 h-6 text-[#002147] dark:text-[#00A651]" />
            System & Personal Preferences
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Customize your portal interface, accessibility features, notification channels, and privacy controls.
          </p>
        </div>
        {saved && (
          <div className="px-3 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200 flex items-center gap-1.5 animate-fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Preferences Saved</span>
          </div>
        )}
      </div>

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

        {/* Accessibility & Privacy */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#00A651]" />
            Accessibility & Privacy Controls
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

        {/* Save Button Bar */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-xl bg-[#002147] hover:bg-[#001530] text-white font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
};
