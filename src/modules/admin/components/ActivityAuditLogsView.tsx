import React, { useState } from 'react';
import { adminHrService } from '../../../services/adminHrService';
import { ActivityAuditLog } from '../../../types/adminHr';
import { Shield, Search, Terminal, Lock } from 'lucide-react';

export const ActivityAuditLogsView: React.FC = () => {
  const [logs] = useState<ActivityAuditLog[]>(adminHrService.getAuditLogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('ALL');

  const filteredLogs = logs.filter((log) => {
    const userStr = (log.userName || log.performedBy || log.userEmail || '').toLowerCase();
    const matchesSearch =
      userStr.includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesModule = selectedModule === 'ALL' || log.module === selectedModule;
    return matchesSearch && matchesModule;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            <span>Administrative Security & Compliance Audit Trail ({logs.length})</span>
          </h2>
          <p className="text-xs text-slate-500">
            Immutable log of HR modifications, salary disbursements, biometric log updates & security access
          </p>
        </div>

        <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-mono font-bold text-xs rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
          <Lock className="w-3.5 h-3.5" /> SECURE TRACE ACTIVE
        </span>
      </div>

      {/* Filter */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search audit trail by user, action or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
          />
        </div>

        <select
          value={selectedModule}
          onChange={(e) => setSelectedModule(e.target.value)}
          className="p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
        >
          <option value="ALL">All System Modules</option>
          <option value="HR_EMPLOYEE">HR & EMPLOYEE</option>
          <option value="PAYROLL">PAYROLL</option>
          <option value="LEAVE">LEAVE MANAGEMENT</option>
          <option value="ATTENDANCE">ATTENDANCE</option>
          <option value="DOCUMENT">DOCUMENT VAULT</option>
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
                <th className="p-3">Timestamp</th>
                <th className="p-3">User & Role</th>
                <th className="p-3">Module</th>
                <th className="p-3">Action Performed</th>
                <th className="p-3">Details & Target ID</th>
                <th className="p-3 font-mono text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="p-3 text-slate-500 font-bold">{log.timestamp}</td>
                  <td className="p-3 font-sans">
                    <p className="font-bold text-slate-900 dark:text-white">
                      {log.userName || log.performedBy || log.userEmail || 'System Admin'}
                    </p>
                    <p className="text-[10px] text-blue-600">{log.userRole || 'ROLE_ADMIN'}</p>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {log.module}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{log.action}</td>
                  <td className="p-3 font-sans text-slate-600 dark:text-slate-400">{log.details}</td>
                  <td className="p-3 text-right text-slate-400">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
