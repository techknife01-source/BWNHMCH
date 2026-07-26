import React, { useState } from 'react';
import { UserPreferencesSettings } from '../../types/profile.types';
import { Sliders, Moon, Sun, Monitor, Globe, Bell, Eye, Save } from 'lucide-react';

interface SettingsSectionProps {
  settings: UserPreferencesSettings;
  onSaveSettings: (settings: Partial<UserPreferencesSettings>) => Promise<void>;
  isSaving: boolean;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  settings,
  onSaveSettings,
  isSaving,
}) => {
  const [theme, setTheme] = useState(settings.theme);
  const [language, setLanguage] = useState(settings.language);
  const [notifications, setNotifications] = useState(settings.notifications);
  const [privacy, setPrivacy] = useState(settings.privacy);

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePrivacyToggle = (key: keyof typeof privacy) => {
    setPrivacy((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    await onSaveSettings({
      theme,
      language,
      notifications,
      privacy,
    });
  };

  return (
    <div className="space-y-6">
      {/* Theme & Language */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <Sliders className="w-5 h-5 text-emerald-600" />
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Display Theme & Language Preferences
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Theme Selector */}
          <div className="space-y-2">
            <label className="text-3xs font-black uppercase text-slate-400 tracking-wider">
              Interface Theme Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-3 rounded-2xl border text-xs font-bold transition cursor-pointer flex flex-col items-center gap-1.5 ${
                  theme === 'light'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-3 rounded-2xl border text-xs font-bold transition cursor-pointer flex flex-col items-center gap-1.5 ${
                  theme === 'dark'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Moon className="w-4 h-4 text-purple-500" />
                <span>Dark</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`p-3 rounded-2xl border text-xs font-bold transition cursor-pointer flex flex-col items-center gap-1.5 ${
                  theme === 'system'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Monitor className="w-4 h-4 text-blue-500" />
                <span>System</span>
              </button>
            </div>
          </div>

          {/* Language Selector */}
          <div className="space-y-2">
            <label className="text-3xs font-black uppercase text-slate-400 tracking-wider">
              System Interface Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="w-full px-3.5 py-3 text-xs rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-bold focus:ring-2 focus:ring-emerald-500"
            >
              <option value="English">English (United States / India)</option>
              <option value="Bengali">Bengali (বাংলা)</option>
              <option value="Hindi">Hindi (हिन्दी)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications Preferences */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Bell className="w-5 h-5 text-amber-500" />
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Academic & OPD Notification Channels
          </h3>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Email Notifications for Class Schedules & Roster Updates</span>
            <input
              type="checkbox"
              checked={notifications.emailNotifications}
              onChange={() => handleNotificationToggle('emailNotifications')}
              className="w-4 h-4 accent-emerald-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">SMS Alerts for Urgent Hospital Emergency OPD Postings</span>
            <input
              type="checkbox"
              checked={notifications.smsNotifications}
              onChange={() => handleNotificationToggle('smsNotifications')}
              className="w-4 h-4 accent-emerald-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">University Examination Duty Alerts</span>
            <input
              type="checkbox"
              checked={notifications.examDutyNotifications}
              onChange={() => handleNotificationToggle('examDutyNotifications')}
              className="w-4 h-4 accent-emerald-600 rounded"
            />
          </label>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Eye className="w-5 h-5 text-purple-600" />
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Faculty Directory Privacy Settings
          </h3>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Display Personal Mobile Phone Number to Students</span>
            <input
              type="checkbox"
              checked={privacy.showPhoneToStudents}
              onChange={() => handlePrivacyToggle('showPhoneToStudents')}
              className="w-4 h-4 accent-emerald-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Publish Official Email on College Public Website Directory</span>
            <input
              type="checkbox"
              checked={privacy.showEmailToPublic}
              onChange={() => handlePrivacyToggle('showEmailToPublic')}
              className="w-4 h-4 accent-emerald-600 rounded"
            />
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-[#002147] hover:bg-[#003366] text-white rounded-2xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
        >
          <Save className="w-4 h-4 text-emerald-400" />
          <span>{isSaving ? 'Saving Preferences...' : 'Save Settings'}</span>
        </button>
      </div>
    </div>
  );
};
