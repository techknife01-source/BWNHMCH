import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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
  X
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

interface DashboardSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
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

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        aria-label="Faculty Navigation Sidebar"
      >
        {/* Sidebar Close button on mobile */}
        <div className="lg:hidden p-3 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
          <span className="font-extrabold text-xs text-slate-900 dark:text-white">
            Navigation Menu
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
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

        {/* Navigation Items */}
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

        {/* Logout */}
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
    </>
  );
};
