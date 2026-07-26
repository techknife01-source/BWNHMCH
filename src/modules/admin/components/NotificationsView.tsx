import React, { useState } from 'react';
import { adminHrService } from '../../../services/adminHrService';
import { AdminNotification } from '../../../types/adminHr';
import { Modal } from '../../../components/common/Modal';
import { BellRing, Plus, Send, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export const NotificationsView: React.FC = () => {
  const [notifications, setNotifications] = useState<AdminNotification[]>(adminHrService.getNotifications());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: 'Urgent: Monthly Biometric Attendance Sync',
    message: 'All staff members are reminded to verify their daily punch log before payroll freeze on the 28th.',
    type: 'INFO' as AdminNotification['type'],
    recipientType: 'ALL' as AdminNotification['recipientType'],
  });

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    adminHrService.addNotification(formData);
    toast.success('Internal notification dispatched!');
    setNotifications(adminHrService.getNotifications());
    setIsModalOpen(false);
  };

  const handleMarkAsRead = (id: string) => {
    adminHrService.markNotificationRead(id);
    setNotifications(adminHrService.getNotifications());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BellRing className="w-5 h-5 text-indigo-600" />
            <span>Internal Broadcasts & System Alerts ({notifications.length})</span>
          </h2>
          <p className="text-xs text-slate-500">
            Real-time staff alerts, biometric sync reminders & HR approval notifications
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-[#002147] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Dispatch Notification</span>
        </button>
      </div>

      {/* Grid */}
      <div className="space-y-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-4 rounded-2xl border shadow-xs flex justify-between items-start gap-4 transition ${
              notif.isRead
                ? 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                : 'bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800'
            }`}
          >
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  notif.type === 'ALERT'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                }`}>
                  {notif.type}
                </span>
                <span className="font-bold text-slate-500">Recipient: {notif.recipientType}</span>
                <span className="text-slate-400 text-[10px]">• {notif.createdAt}</span>
              </div>

              <h4 className="font-black text-slate-900 dark:text-white text-sm">{notif.title}</h4>
              <p className="text-slate-600 dark:text-slate-300">{notif.message}</p>
            </div>

            {!notif.isRead && (
              <button
                onClick={() => handleMarkAsRead(notif.id)}
                className="px-3 py-1.5 bg-[#002147] text-white text-[11px] font-bold rounded-xl shrink-0 cursor-pointer"
              >
                Mark Read
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Dispatch Internal Notification">
        <form onSubmit={handleSendNotification} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Alert Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Priority Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as AdminNotification['type'] })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
              >
                <option value="INFO">INFO</option>
                <option value="ALERT">ALERT</option>
                <option value="ACTION">ACTION REQUIRED</option>
                <option value="SUCCESS">SUCCESS</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Recipients</label>
              <select
                value={formData.recipientType}
                onChange={(e) => setFormData({ ...formData, recipientType: e.target.value as AdminNotification['recipientType'] })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
              >
                <option value="ALL">ALL STAFF</option>
                <option value="TEACHING">TEACHING FACULTY</option>
                <option value="HOSPITAL_STAFF">HOSPITAL STAFF</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Message Body</label>
            <textarea
              rows={3}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-800 font-bold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#002147] text-white font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" /> Dispatch Alert
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
