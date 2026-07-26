import React from 'react';
import { Card } from '../../../components/common/Card';
import { StatCard } from '../../../components/common/StatCard';
import { Badge } from '../../../components/common/Badge';
import { hospitalCoreService } from '../../../services/hospitalCoreService';
import {
  Users,
  Stethoscope,
  Clock,
  CheckCircle2,
  Calendar,
  UserPlus,
  Ticket,
  Search,
  Bell,
  ArrowRight,
  Building2,
  Activity,
  AlertTriangle,
} from 'lucide-react';

interface HospitalOverviewProps {
  onNavigate: (tabId: string) => void;
  onOpenRegisterModal: () => void;
  onOpenTokenModal: () => void;
  onOpenAppointmentModal: () => void;
}

export const HospitalOverview: React.FC<HospitalOverviewProps> = ({
  onNavigate,
  onOpenRegisterModal,
  onOpenTokenModal,
  onOpenAppointmentModal,
}) => {
  const stats = hospitalCoreService.getHospitalStats();
  const departments = hospitalCoreService.getDepartments();
  const doctors = hospitalCoreService.getDoctors();
  const waitingTokens = hospitalCoreService.getTokens('ALL', 'WAITING');
  const inConsultationTokens = hospitalCoreService.getTokens('ALL', 'IN_CONSULTATION');
  const notifications = hospitalCoreService.getNotifications().slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Quick Action Banner */}
      <div className="bg-gradient-to-r from-[#002147] via-slate-900 to-[#003366] text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase px-2 py-0.5 rounded">
              Hospital Core & Reception Live
            </span>
            <span className="text-slate-300 text-xs">Counter 01 Active</span>
          </div>
          <h2 className="text-xl font-black">Burdwan Homoeopathic Medical College & Hospital</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Real-time OPD Patient Registration, Token Queue Management & Doctor Schedules
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenTokenModal}
            className="flex items-center gap-1.5 bg-[#00A651] hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm cursor-pointer"
          >
            <Ticket className="w-4 h-4" />
            <span>Issue OPD Token</span>
          </button>
          <button
            onClick={onOpenRegisterModal}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>New Patient</span>
          </button>
          <button
            onClick={onOpenAppointmentModal}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* Dashboard Key Stat Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's OPD Registrations"
          value={stats.todayOpdRegistrations}
          icon={<Ticket className="w-6 h-6 text-blue-600" />}
          trend="+18% vs Yesterday"
          trendUp={true}
        />
        <StatCard
          title="Active Doctors Available"
          value={`${stats.doctorsAvailableToday} / ${doctors.length}`}
          icon={<Stethoscope className="w-6 h-6 text-emerald-600" />}
          trend="All OPD Rooms Open"
          trendUp={true}
        />
        <StatCard
          title="Current Waiting Queue"
          value={stats.activeQueueCount}
          icon={<Clock className="w-6 h-6 text-amber-600" />}
          trend="Average Wait ~12 mins"
          trendUp={false}
        />
        <StatCard
          title="Completed Consultations"
          value={stats.completedConsultationsToday}
          icon={<CheckCircle2 className="w-6 h-6 text-indigo-600" />}
          trend="Today's Target 80+"
          trendUp={true}
        />
      </div>

      {/* Main Grid: Live Queue Monitor & Department OPD Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live OPD Queue Live Board */}
        <Card className="lg:col-span-2 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
                <span>Live OPD Queue Monitor</span>
              </h3>
              <p className="text-xs text-slate-500">Currently serving and waiting patients by OPD Room</p>
            </div>
            <button
              onClick={() => onNavigate('queue')}
              className="text-xs font-bold text-[#002147] dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Full Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Current In Consultation Showcase */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">In Consultation Now</p>
            {inConsultationTokens.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 text-center">
                <p className="text-xs text-slate-500">No active consultation in progress. Call next patient from queue.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {inConsultationTokens.map((tok) => (
                  <div
                    key={tok.id}
                    className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-xs font-black bg-emerald-600 text-white">
                          Token #{tok.tokenNumber} ({tok.tokenCode})
                        </span>
                        <Badge variant="accent">{tok.roomNo}</Badge>
                      </div>
                      <p className="font-bold text-xs text-slate-900 dark:text-white mt-1.5">{tok.patientName}</p>
                      <p className="text-[11px] text-slate-500">{tok.doctorName} • {tok.department}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Waiting Queue Stream */}
          <div className="space-y-3 pt-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Next In Queue ({waitingTokens.length} Waiting)</p>
            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
              {waitingTokens.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No patients in waiting line.</p>
              ) : (
                waitingTokens.slice(0, 5).map((tok) => (
                  <div
                    key={tok.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-slate-200 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-[#002147] text-white flex items-center justify-center font-bold text-xs">
                        #{tok.tokenNumber}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{tok.patientName}</p>
                        <p className="text-[10px] text-slate-500">
                          {tok.uhid} • {tok.department} ({tok.doctorName})
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="warning">{tok.status}</Badge>
                      <p className="text-[10px] text-slate-400 mt-1">{tok.issuedAt}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </Card>

        {/* Right Panel: Reception Notifications & Quick Shortcuts */}
        <div className="space-y-6">
          {/* Notifications Brief */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" />
                <span>Reception Alerts</span>
              </h3>
              <button
                onClick={() => onNavigate('notifications')}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 rounded-xl border text-xs space-y-1 ${
                    n.type === 'EMERGENCY'
                      ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200'
                      : n.type === 'WARNING'
                      ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-2xs uppercase tracking-wider">{n.category}</span>
                    <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                  </div>
                  <p className="font-semibold text-xs">{n.title}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{n.message}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Department Queue Counts */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#002147]" />
                <span>Departments OPD Status</span>
              </h3>
              <button
                onClick={() => onNavigate('departments')}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Details
              </button>
            </div>

            <div className="space-y-2">
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{dept.name}</p>
                    <p className="text-[10px] text-slate-400">{dept.opdRoom} • HOD: {dept.headOfDepartment}</p>
                  </div>
                  <div className="text-right space-y-0.5">
                    <Badge variant={dept.activeDoctorsCount > 0 ? 'accent' : 'secondary'}>
                      {dept.activeDoctorsCount > 0 ? `${dept.waitingTokensCount} Waiting` : 'Doctor Offline'}
                    </Badge>
                    <p className="text-[10px] text-slate-400">{dept.completedTodayCount} done today</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
