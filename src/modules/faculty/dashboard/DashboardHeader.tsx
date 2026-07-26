import React, { useState } from 'react';
import { Search, Menu, X, Bell, User, LogOut, Sparkles, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { ThemeToggle } from '../../../components/layout/ThemeToggle';
import { Notifications } from '../../../components/layout/Notifications';
import { ProfileMenu } from '../../../components/layout/ProfileMenu';

interface DashboardHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 shadow-xs">
      <div className="px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left section: Hamburger & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Toggle Navigation Sidebar"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/faculty/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#002147] to-[#00A651] flex items-center justify-center text-white shadow-xs font-black text-lg">
              F
            </div>
            <div className="hidden sm:block">
              <span className="font-black text-sm text-slate-900 dark:text-white block leading-none">
                BHMC Faculty Portal
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block tracking-wider uppercase mt-0.5">
                Academic & Clinical Suite
              </span>
            </div>
          </Link>
        </div>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-md items-center relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Quick search subjects, rosters, students, notices..."
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition"
          />
        </div>

        {/* Right side tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Notifications />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
};
