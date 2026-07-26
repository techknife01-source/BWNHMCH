import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { ThemeToggle } from './ThemeToggle';
import { Notifications } from './Notifications';
import { ProfileMenu } from './ProfileMenu';
import { CommandPalette } from '../common/CommandPalette';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/80 px-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">ERP Control Center</h2>
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Notifications />
            <ProfileMenu />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      <CommandPalette />
    </div>
  );
};
