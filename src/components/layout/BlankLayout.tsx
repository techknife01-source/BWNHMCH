import React from 'react';
import { Outlet } from 'react-router-dom';

export const BlankLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <Outlet />
    </div>
  );
};
