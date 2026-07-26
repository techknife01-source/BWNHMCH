import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { ShieldX, Home } from 'lucide-react';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="rounded-full bg-rose-100 p-4 text-rose-600 dark:bg-rose-950/40">
        <ShieldX className="h-12 w-12" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">403 Access Forbidden</h1>
      <p className="text-xs text-slate-500 max-w-md">
        You do not possess the required security privileges or role assignment to view this digital desk.
      </p>
      <Link to="/portal/dashboard">
        <Button variant="primary">
          <Home className="h-4 w-4" />
          <span>Return to Portal Dashboard</span>
        </Button>
      </Link>
    </div>
  );
};
