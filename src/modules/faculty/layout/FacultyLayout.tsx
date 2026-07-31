import React, { useState } from 'react';
import { NavLink, Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  BookOpen,
  CheckSquare,
  FileText,
  FolderOpen,
  GraduationCap,
  Award,
  FlaskConical,
  Library,
  Stethoscope,
  Building2,
  Settings,
  LogOut,
  Search,
  Menu,
  X,
  ChevronRight,
  Bell,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { ThemeToggle } from '../../../components/layout/ThemeToggle';
import { Notifications } from '../../../components/layout/Notifications';
import { ProfileMenu } from '../../../components/layout/ProfileMenu';

interface FacultyLayoutProps {
  children?: React.ReactNode;
  pageTitle?: string;
}

export const FacultyLayout: React.FC<FacultyLayoutProps> = ({ children, pageTitle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login/faculty');
  };

  const navItems = [
    { label: 'Dashboard', path: '/faculty/dashboard', icon: LayoutDashboard },
    { label: 'My Profile', path: '/faculty/profile', icon: User },
    { label: 'My Classes', path: '/faculty/classes', icon: BookOpen },
    { label: 'Attendance', path: '/faculty/attendance', icon: CheckSquare },
    { label: 'Assignments', path: '/faculty/assignments', icon: FileText },
    { label: 'Study Materials', path: '/faculty/study-material', icon: FolderOpen },
    { label: 'Examinations', path: '/faculty/examinations', icon: GraduationCap },
    { label: 'Results', path: '/faculty/results', icon: Award },
    { label: 'Research', path: '/faculty/research', icon: FlaskConical },
    { label: 'Library', path: '/faculty/library', icon: Library },
    { label: 'Hospital Posting', path: '/faculty/hospital', icon: Stethoscope },
    { label: 'Department', path: '/faculty/department', icon: Building2 },
    { label: 'Settings', path: '/faculty/settings', icon: Settings },
  ];

  // Helper to construct breadcrumb paths
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentSegment = pathSegments[pathSegments.length - 1] || 'dashboard';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 shadow-xs">
        <div className="px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
          {/* Left section: Hamburger & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              aria-label="Toggle Sidebar Menu"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/faculty/dashboard" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#002147] to-[#00A651] flex items-center justify-center text-white shadow-sm font-black text-lg">
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

          {/* Quick Search */}
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

          {/* Right section: Theme, Notifications, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Notifications />
            <ProfileMenu />
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar Navigation */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* User Brief Card */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-sm border border-emerald-200 dark:border-emerald-800 shrink-0">
              {user?.fullName?.charAt(0) || 'F'}
            </div>
            <div className="overflow-hidden min-w-0">
              <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                {user?.fullName || 'Faculty Member'}
              </h4>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">
                {user?.department || 'Homoeopathic Faculty'}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-[#002147] text-white shadow-xs dark:bg-[#00A651]'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 flex flex-col justify-between">
          <div className="max-w-7xl w-full mx-auto space-y-6">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center justify-between flex-wrap gap-2 text-2xs font-bold text-slate-500 uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <Link to="/faculty/dashboard" className="hover:text-emerald-600 transition">
                  Faculty Portal
                </Link>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="text-slate-900 dark:text-slate-200 capitalize">
                  {pageTitle || currentSegment.replace('-', ' ')}
                </span>
              </div>
              <span className="bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full text-3xs font-black border border-emerald-200 dark:border-emerald-800">
                Academic Session 2026 - 2027
              </span>
            </div>

            {/* Render Child Content or Outlet */}
            {children || <Outlet />}
          </div>

          {/* Faculty Footer */}
          <footer className="mt-12 pt-6 border-t border-slate-200/80 dark:border-slate-800 text-2xs text-slate-500 flex flex-wrap items-center justify-between gap-4 max-w-7xl w-full mx-auto">
            <div>
              <p className="font-semibold">
                © {new Date().getFullYear()} BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL. All rights reserved.
              </p>
              <p className="text-[10px] text-slate-400">
                Affiliated to WBUHS | Approved by NCH, Ministry of AYUSH, Govt. of India
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                <Sparkles className="w-3 h-3" /> Digital Ecosystem v2.5
              </span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};
