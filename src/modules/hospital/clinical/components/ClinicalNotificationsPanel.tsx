import React, { useState } from 'react';
import { Card } from '../../../../components/common/Card';
import { Badge } from '../../../../components/common/Badge';
import { hospitalClinicalService } from '../../../../services/hospitalClinicalService';
import { ClinicalAlert } from '../../../../types/clinical';
import {
  Bell,
  AlertTriangle,
  FileCheck2,
  Clock,
  Stethoscope,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ClinicalNotificationsPanelProps {
  onSelectPatientEmr?: (ipdNo: string) => void;
}

export const ClinicalNotificationsPanel: React.FC<ClinicalNotificationsPanelProps> = ({
  onSelectPatientEmr,
}) => {
  const alerts = hospitalClinicalService.getAlerts();
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filteredAlerts = alerts.filter(
    (a) => filterSeverity === 'ALL' || a.severity === filterSeverity
  );

  const handleMarkRead = (id: string) => {
    hospitalClinicalService.markAlertRead(id);
    toast.success('Alert marked as acknowledged.');
    setFilterSeverity((prev) => prev); // force refresh
  };

  return (
    <Card className="p-5 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-rose-500" />
            <span>IPD Clinical Alerts & Escalations</span>
          </h3>
          <p className="text-xs text-slate-500">
            Real-time critical vitals alerts, lab reports ready, medication reminders & doctor reviews
          </p>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => setFilterSeverity('ALL')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterSeverity === 'ALL'
                ? 'bg-[#002147] text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            All Alerts ({alerts.length})
          </button>
          <button
            onClick={() => setFilterSeverity('HIGH')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterSeverity === 'HIGH'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-rose-600'
            }`}
          >
            Critical High ({alerts.filter((a) => a.severity === 'HIGH').length})
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="py-8 text-center text-slate-400 italic text-xs">
            No active clinical alerts for this filter.
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border flex items-start justify-between gap-4 transition ${
                alert.isRead
                  ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-75'
                  : alert.severity === 'HIGH'
                  ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-300 dark:border-rose-900 shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="pt-0.5 shrink-0">
                  {alert.alertType === 'CRITICAL_VITAL' ? (
                    <ShieldAlert className="w-5 h-5 text-rose-600" />
                  ) : alert.alertType === 'LAB_RESULT_READY' ? (
                    <FileCheck2 className="w-5 h-5 text-blue-600" />
                  ) : alert.alertType === 'MEDICATION_DUE' ? (
                    <Clock className="w-5 h-5 text-amber-500" />
                  ) : (
                    <Stethoscope className="w-5 h-5 text-emerald-600" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white">{alert.title}</span>
                    <Badge variant={alert.severity === 'HIGH' ? 'danger' : alert.severity === 'MEDIUM' ? 'warning' : 'primary'}>
                      {alert.severity}
                    </Badge>
                  </div>

                  {alert.patientName && (
                    <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                      Patient: {alert.patientName} {alert.bedNo && `(Bed ${alert.bedNo})`}{' '}
                      {alert.ipdNo && `• IPD: ${alert.ipdNo}`}
                    </p>
                  )}

                  <p className="text-xs text-slate-600 dark:text-slate-300">{alert.message}</p>
                  <p className="text-[10px] text-slate-400">{alert.timestamp}</p>
                </div>
              </div>

              <div className="flex items-center space-x-1 shrink-0">
                {alert.ipdNo && onSelectPatientEmr && (
                  <button
                    onClick={() => onSelectPatientEmr(alert.ipdNo!)}
                    className="px-2.5 py-1 text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition cursor-pointer"
                  >
                    Open EMR
                  </button>
                )}

                {!alert.isRead && (
                  <button
                    onClick={() => handleMarkRead(alert.id)}
                    className="px-2.5 py-1 text-[10px] font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 transition cursor-pointer"
                  >
                    Ack
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
