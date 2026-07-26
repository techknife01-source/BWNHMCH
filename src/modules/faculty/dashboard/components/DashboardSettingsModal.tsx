import React from 'react';
import { X, Settings, Moon, Sun, Monitor, Zap, Bell, Check } from 'lucide-react';
import { useDashboardSettings } from '../hooks/useDashboardSettings';

interface DashboardSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DashboardSettingsModal: React.FC<DashboardSettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, updateNotificationPreferences } = useDashboardSettings();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/50 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Faculty Portal Preferences & Settings
              </h3>
              <p className="text-2xs text-slate-500">
                Configure theme appearance, display density, and notification channels
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-6">
          {/* Theme Preferences */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase text-slate-500 tracking-wider block">
              Interface Theme
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'light', label: 'Light Theme', icon: Sun },
                { id: 'dark', label: 'Dark Mode', icon: Moon },
                { id: 'system', label: 'System Auto', icon: Monitor },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => updateSettings({ theme: id as 'light' | 'dark' | 'system' })}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col items-start gap-2 transition cursor-pointer ${
                    settings.theme === id
                      ? 'bg-emerald-50/80 border-emerald-400 dark:bg-emerald-950/40 dark:border-emerald-700'
                      : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${settings.theme === id ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Display Density & Animations */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-extrabold uppercase text-slate-500 tracking-wider block">
              Display & Motion Options
            </label>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">Compact Interface Mode</h4>
                <p className="text-3xs text-slate-500">Reduce card padding for dense information viewing</p>
              </div>
              <input
                type="checkbox"
                checked={settings.compactMode}
                onChange={(e) => updateSettings({ compactMode: e.target.checked })}
                className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">UI Transitions & Animations</h4>
                <p className="text-3xs text-slate-500">Enable micro-animations and layout motion</p>
              </div>
              <input
                type="checkbox"
                checked={settings.animationsEnabled}
                onChange={(e) => updateSettings({ animationsEnabled: e.target.checked })}
                className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Default Landing Card */}
          <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-extrabold uppercase text-slate-500 tracking-wider block">
              Default Focus Card
            </label>
            <select
              value={settings.defaultLandingWidget}
              onChange={(e) => updateSettings({ defaultLandingWidget: e.target.value })}
              className="w-full p-3 text-xs font-bold rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
            >
              <option value="statistics">Faculty Metrics Overview</option>
              <option value="upcomingClasses">Today's Academic Classes</option>
              <option value="quickActions">Quick Action Panel</option>
              <option value="calendarWidget">Academic Calendar</option>
            </select>
          </div>

          {/* Notification Preferences */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-extrabold uppercase text-slate-500 tracking-wider block">
              Notification & Alert Dispatch
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Email Circulars</span>
                <input
                  type="checkbox"
                  checked={settings.notificationPreferences.emailAlerts}
                  onChange={(e) => updateNotificationPreferences({ emailAlerts: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Browser Push Alerts</span>
                <input
                  type="checkbox"
                  checked={settings.notificationPreferences.pushAlerts}
                  onChange={(e) => updateNotificationPreferences({ pushAlerts: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-3xs font-extrabold uppercase text-slate-400">Minimum Alert Priority Level</span>
              <select
                value={settings.notificationPreferences.minimumPriority}
                onChange={(e) => updateNotificationPreferences({ minimumPriority: e.target.value as any })}
                className="w-full p-2.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white cursor-pointer"
              >
                <option value="Low">Low (Receive all circulars)</option>
                <option value="Medium">Medium (Receive medium & above)</option>
                <option value="High">High (Receive high priority & critical)</option>
                <option value="Critical">Critical (Only urgent emergency alerts)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
};
