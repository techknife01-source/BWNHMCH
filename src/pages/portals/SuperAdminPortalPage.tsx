import React from 'react';
import { Card } from '../../components/common/Card';
import { ShieldAlert, Database, Server } from 'lucide-react';

export const SuperAdminPortalPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Super Admin Command Center</h1>
        <p className="text-xs text-slate-500">System security, database audit logs, RBAC permissions & backup</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-2">
          <ShieldAlert className="h-6 w-6 text-rose-600" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Security & Roles</h3>
          <p className="text-xs text-slate-500">Configure Spring Security JWT tokens, roles, and privileges.</p>
        </Card>
        <Card className="p-6 space-y-2">
          <Database className="h-6 w-6 text-blue-600" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">MongoDB Audit Logs</h3>
          <p className="text-xs text-slate-500">Inspect system access, user logins, and data mutation trails.</p>
        </Card>
        <Card className="p-6 space-y-2">
          <Server className="h-6 w-6 text-emerald-600" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Cloud API Keys</h3>
          <p className="text-xs text-slate-500">Cloudinary image bucket settings, SMTP email relay, and server health.</p>
        </Card>
      </div>
    </div>
  );
};
