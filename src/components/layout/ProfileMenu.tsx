import React from 'react';
import { User, LogOut, Key, Activity, Settings, HelpCircle, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getUserDisplayDesignation } from '../../utils/permissionHelper';
import { Avatar } from '../common/Avatar';
import { Dropdown } from '../common/Dropdown';

export const ProfileMenu: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return (
      <Link
        to="/login"
        className="rounded-xl bg-[#002147] hover:bg-[#001530] px-4 py-2 text-xs font-bold text-white shadow-sm transition uppercase tracking-wider"
      >
        Sign In
      </Link>
    );
  }

  const items = [
    {
      id: 'dashboard',
      label: 'Portal Dashboard',
      icon: <LayoutDashboard className="h-4 w-4" />,
      onClick: () => navigate('/portal/dashboard'),
    },
    {
      id: 'profile',
      label: 'My Profile & Details',
      icon: <User className="h-4 w-4" />,
      onClick: () => navigate('/portal/profile'),
    },
    {
      id: 'change-password',
      label: 'Change Password',
      icon: <Key className="h-4 w-4" />,
      onClick: () => navigate('/portal/profile?tab=security'),
    },
    {
      id: 'activity-log',
      label: 'Activity Log',
      icon: <Activity className="h-4 w-4" />,
      onClick: () => navigate('/portal/profile?tab=activity'),
    },
    {
      id: 'preferences',
      label: 'Preferences & Settings',
      icon: <Settings className="h-4 w-4" />,
      onClick: () => navigate('/portal/settings'),
    },
    {
      id: 'help',
      label: 'Help & Technical Support',
      icon: <HelpCircle className="h-4 w-4" />,
      onClick: () => navigate('/contact'),
    },
    {
      id: 'logout',
      label: 'Sign Out',
      icon: <LogOut className="h-4 w-4" />,
      danger: true,
      onClick: () => {
        logout();
        navigate('/login');
      },
    },
  ];

  return (
    <Dropdown
      trigger={
        <button className="flex items-center space-x-2.5 rounded-xl p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
          <Avatar src={user.avatarUrl} name={user.fullName} size="sm" />
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{user.fullName}</p>
            <p className="text-[10px] text-[#00A651] font-semibold uppercase">{getUserDisplayDesignation(user)}</p>
          </div>
        </button>
      }
      items={items}
    />
  );
};
