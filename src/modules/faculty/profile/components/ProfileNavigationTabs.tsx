import React from 'react';
import { ProfileTab } from '../types/profile.types';
import {
  LayoutDashboard,
  User,
  GraduationCap,
  Building2,
  Stethoscope,
  Briefcase,
  Award,
  Shield,
  FileCheck,
  PhoneCall,
  FolderOpen,
  History,
  Lock,
  Sliders,
} from 'lucide-react';

interface ProfileNavigationTabsProps {
  activeTab: ProfileTab;
  onSelectTab: (tab: ProfileTab) => void;
}

export const ProfileNavigationTabs: React.FC<ProfileNavigationTabsProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const tabs: { id: ProfileTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'academic', label: 'Academic Credentials', icon: GraduationCap },
    { id: 'department', label: 'Department', icon: Building2 },
    { id: 'professional', label: 'Clinical / OPD', icon: Stethoscope },
    { id: 'experience', label: 'Teaching & Research', icon: Briefcase },
    { id: 'awards', label: 'Awards & Honours', icon: Award },
    { id: 'registration', label: 'Council Reg & Memberships', icon: Shield },
    { id: 'employment', label: 'Employment & Emergency', icon: FileCheck },
    { id: 'contact', label: 'Contact & Social', icon: PhoneCall },
    { id: 'documents', label: 'Documents Vault', icon: FolderOpen },
    { id: 'timeline', label: 'Profile Timeline', icon: History },
    { id: 'security', label: 'Security & Sessions', icon: Lock },
    { id: 'settings', label: 'Preferences', icon: Sliders },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-2 border border-slate-200/80 dark:border-slate-800 shadow-xs">
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin pb-1 sm:pb-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-[#002147] text-white shadow-md dark:bg-emerald-600'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400 dark:text-white' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
