import React, { useState } from 'react';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Badge } from '../../../components/common/Badge';
import { hospitalCoreService } from '../../../services/hospitalCoreService';
import {
  Bell,
  Settings,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldAlert,
  Save,
  Volume2,
  DollarSign,
  Users,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ReceptionNotifsSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'notifs' | 'settings'>('notifs');
  const notifications = hospitalCoreService.getNotifications();
  const initialSettings = hospitalCoreService.getSettings();

  const [settingsForm, setSettingsForm] = useState(initialSettings);

  const handleMarkRead = (id: string) => {
    hospitalCoreService.markNotificationRead(id);
    toast.success('Notification marked as read.');
    setActiveTab((prev) => prev); // refresh
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    hospitalCoreService.updateSettings(settingsForm);
    toast.success('Reception Terminal Settings Saved Successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('notifs')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-extrabold rounded-xl transition cursor-pointer ${
              activeTab === 'notifs'
                ? 'bg-[#002147] text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Bell className="w-4 h-4 text-amber-400" />
            <span>Reception Alerts Feed ({notifications.filter((n) => !n.read).length} New)</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-extrabold rounded-xl transition cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#002147] text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Settings className="w-4 h-4 text-emerald-400" />
            <span>Terminal Configurations</span>
          </button>
        </div>
      </div>

      {activeTab === 'notifs' ? (
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Hospital & Reception Real-time Alerts</h3>
            <p className="text-xs text-slate-500">Live operational notifications from OPD rooms and reception counters</p>
          </div>

          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 rounded-xl border flex items-start justify-between gap-4 transition ${
                  notif.read
                    ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-80'
                    : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 shadow-xs'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="pt-0.5">
                    {notif.type === 'EMERGENCY' ? (
                      <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
                    ) : notif.type === 'WARNING' ? (
                      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                    ) : (
                      <Info className="w-5 h-5 text-blue-500 shrink-0" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-slate-900 dark:text-white">{notif.title}</span>
                      <Badge variant={notif.type === 'EMERGENCY' ? 'danger' : notif.type === 'WARNING' ? 'warning' : 'primary'}>
                        {notif.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{notif.message}</p>
                    <p className="text-[10px] text-slate-400 mt-1.5">{notif.timestamp}</p>
                  </div>
                </div>

                {!notif.read && (
                  <button
                    onClick={() => handleMarkRead(notif.id)}
                    className="px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 transition shrink-0 cursor-pointer"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card className="p-5 space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Reception Desk & OPD Fee Configurations</h3>
            <p className="text-xs text-slate-500">Configure ticket fees, token dispatch limits, and counter preferences</p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs max-w-2xl">
            <Input
              label="Hospital Name"
              value={settingsForm.hospitalName}
              onChange={(e) => setSettingsForm({ ...settingsForm, hospitalName: e.target.value })}
            />

            <Input
              label="Reception Counter Designation"
              value={settingsForm.receptionCounterName}
              onChange={(e) => setSettingsForm({ ...settingsForm, receptionCounterName: e.target.value })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="General OPD Registration Fee (₹) *"
                type="number"
                value={settingsForm.opdRegistrationFee}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, opdRegistrationFee: parseFloat(e.target.value) || 0 })
                }
              />

              <Input
                label="Max Tokens Per Doctor Daily *"
                type="number"
                value={settingsForm.maxTokensPerDoctor}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, maxTokensPerDoctor: parseInt(e.target.value) || 30 })
                }
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <p className="font-bold text-slate-800 dark:text-slate-200">Counter Rules & Announcements</p>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settingsForm.autoResetQueueDaily}
                  onChange={(e) => setSettingsForm({ ...settingsForm, autoResetQueueDaily: e.target.checked })}
                  className="rounded text-[#002147] focus:ring-[#002147]"
                />
                <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  Auto-reset Token numbers to #1 every morning at 00:00
                </span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settingsForm.emergencyOverrideAllowed}
                  onChange={(e) => setSettingsForm({ ...settingsForm, emergencyOverrideAllowed: e.target.checked })}
                  className="rounded text-[#002147] focus:ring-[#002147]"
                />
                <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  Allow Receptionist Emergency Queue Jump Override
                </span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settingsForm.announcementSound}
                  onChange={(e) => setSettingsForm({ ...settingsForm, announcementSound: e.target.checked })}
                  className="rounded text-[#002147] focus:ring-[#002147]"
                />
                <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  Enable OPD Chime Sound when calling next token
                </span>
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="primary" type="submit" className="flex items-center gap-1.5">
                <Save className="w-4 h-4" />
                <span>Save Reception Settings</span>
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};
