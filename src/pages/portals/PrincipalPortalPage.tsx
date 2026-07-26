import React from 'react';
import { Card } from '../../components/common/Card';
import { ShieldCheck, FileText, Users } from 'lucide-react';

export const PrincipalPortalPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Principal's Executive Desk</h1>
        <p className="text-xs text-slate-500">Academic Governance & NCH Compliance Administration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-2">
          <ShieldCheck className="h-6 w-6 text-blue-600" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">NCH Inspections Portal</h3>
          <p className="text-xs text-slate-500">Monitor compliance documentation and infrastructure readiness.</p>
        </Card>
        <Card className="p-6 space-y-2">
          <FileText className="h-6 w-6 text-emerald-600" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Circular Publishing</h3>
          <p className="text-xs text-slate-500">Approve and issue official institutional notices and policies.</p>
        </Card>
        <Card className="p-6 space-y-2">
          <Users className="h-6 w-6 text-amber-600" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Faculty Reviews</h3>
          <p className="text-xs text-slate-500">Oversee academic performance, research grants, and hospital OPD statistics.</p>
        </Card>
      </div>
    </div>
  );
};
