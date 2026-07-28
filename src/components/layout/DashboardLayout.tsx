import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { ThemeToggle } from './ThemeToggle';
import { Notifications } from './Notifications';
import { ProfileMenu } from './ProfileMenu';
import { CommandPalette } from '../common/CommandPalette';
import { Menu } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/portal/dashboard') return 'ERP Control Center';
    if (path === '/portal/student') return 'Student Portal';
    if (path === '/portal/faculty') return 'Faculty Portal';
    if (path === '/portal/principal') return 'Principal Desk';
    if (path === '/portal/admin') return 'Admin ERP Terminal';
    if (path === '/portal/cms') return 'CMS Studio';
    if (path === '/portal/hospital') return 'Hospital OPD';
    if (path === '/portal/reception') return 'Reception Desk';
    if (path === '/portal/library') return 'Digital E-Library';
    if (path === '/portal/accounts') return 'Accounts Portal';
    if (path === '/portal/super-admin') return 'Super Admin Center';
    if (path === '/portal/profile') return 'User Profile';
    if (path === '/portal/settings') return 'System Settings';
    if (path.startsWith('/faculty/')) {
      const seg = path.split('/faculty/')[1];
      return `Faculty • ${seg.charAt(0).toUpperCase() + seg.slice(1)}`;
    }
    return 'Digital ERP Portal';
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 overflow-hidden">
      <Sidebar mobileOpen={mobileSidebarOpen} onMobileClose={() => setMobileSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <header className="flex h-14 sm:h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-3 sm:px-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 z-20 shrink-0">
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition cursor-pointer shrink-0"
              title="Open Navigation Menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 truncate leading-tight">
                {getPageTitle()}
              </h2>
              <p className="text-[10px] text-[#00A651] font-bold truncate hidden sm:block">
                BHMCH ERP Portal
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
            <ThemeToggle />
            <Notifications />
            <ProfileMenu />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 overflow-x-hidden max-w-full">
          <Outlet />
        </main>
      </div>
      <CommandPalette />
    </div>
  );
};

