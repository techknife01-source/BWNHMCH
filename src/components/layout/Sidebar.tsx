import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Building2,
  Stethoscope,
  BookOpen,
  Receipt,
  ShieldCheck,
  UserCheck,
  LogOut,
  ChevronDown,
  ChevronRight,
  Search,
  Star,
  Clock,
  Settings,
  FileText,
  Calendar,
  Award,
  FlaskConical,
  Pill,
  BedDouble,
  BarChart2,
  FolderLock,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  HelpCircle,
  Menu,
  Globe,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { hasRole, getUserDisplayDesignation } from '../../utils/permissionHelper';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { CollegeLogo } from '../common/CollegeLogo';

interface NavGroup {
  category: string;
  items: NavItem[];
}

interface NavItem {
  label: string;
  href: string;
  icon: any;
  roles: string[];
  badge?: string;
  subItems?: { label: string; href: string }[];
}

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onMobileClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(['/portal/dashboard', '/portal/profile']);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    'Academic & Campus': true,
    'Hospital & Healthcare': true,
  });
  const [recentItems, setRecentItems] = useState<{ label: string; href: string }[]>([]);

  // Close mobile sidebar on route change
  useEffect(() => {
    if (onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  // Track recent pages visited
  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath.startsWith('/portal/')) {
      const pageName = currentPath.split('/portal/')[1]?.replace('-', ' ') || 'Dashboard';
      const formattedName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
      
      setRecentItems((prev) => {
        const filtered = prev.filter((i) => i.href !== currentPath);
        return [{ label: formattedName, href: currentPath }, ...filtered].slice(0, 4);
      });
    }
  }, [location.pathname]);

  const toggleFavorite = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (favorites.includes(href)) {
      setFavorites(favorites.filter((h) => h !== href));
    } else {
      setFavorites([...favorites, href]);
    }
  };

  const toggleExpand = (category: string) => {
    setExpandedItems((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  // Role-based Nav Structure
  const menuGroups: NavGroup[] = [
    {
      category: 'Overview & Analytics',
      items: [
        { label: 'Dashboard', href: '/portal/dashboard', icon: LayoutDashboard, roles: ['ALL'] },
        { label: 'Super Admin Center', href: '/portal/super-admin', icon: FolderLock, roles: ['ROLE_SUPER_ADMIN'], badge: 'ROOT' },
      ],
    },
    {
      category: 'Academic & Campus',
      items: [
        { label: 'Student Management', href: '/portal/student', icon: GraduationCap, roles: ['ROLE_STUDENT', 'ROLE_FACULTY', 'ROLE_PRINCIPAL', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN'] },
        { label: 'Faculty & Classes', href: '/portal/faculty', icon: Users, roles: ['ROLE_FACULTY', 'ROLE_PRINCIPAL', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN'] },
        { label: 'Principal Executive Desk', href: '/portal/principal', icon: ShieldCheck, roles: ['ROLE_PRINCIPAL', 'ROLE_SUPER_ADMIN'] },
        { label: 'Admin Operations', href: '/portal/admin', icon: Building2, roles: ['ROLE_ADMIN', 'ROLE_SUPER_ADMIN'] },
        { label: 'CMS Content Studio', href: '/portal/cms', icon: Globe, roles: ['ROLE_ADMIN', 'ROLE_PRINCIPAL', 'ROLE_SUPER_ADMIN'], badge: 'CMS' },
      ],
    },
    {
      category: 'Hospital & Healthcare',
      items: [
        { label: 'Hospital Care & OPD', href: '/portal/hospital', icon: Stethoscope, roles: ['ROLE_HOSPITAL_STAFF', 'ROLE_DOCTOR', 'ROLE_FACULTY', 'ROLE_SUPER_ADMIN'] },
        { label: 'Reception & Queue', href: '/portal/reception', icon: UserCheck, roles: ['ROLE_RECEPTIONIST', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN'] },
      ],
    },
    {
      category: 'Library & Accounts',
      items: [
        { label: 'Digital Library', href: '/portal/library', icon: BookOpen, roles: ['ALL'] },
        { label: 'Accounts & Fees', href: '/portal/accounts', icon: Receipt, roles: ['ROLE_ACCOUNTANT', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN'] },
      ],
    },
    {
      category: 'Personal Settings',
      items: [
        { label: 'My Profile', href: '/portal/profile', icon: User, roles: ['ALL'] },
        { label: 'System Settings', href: '/portal/settings', icon: Settings, roles: ['ALL'] },
      ],
    }
  ];

  const userRoles = user?.roles || ['ROLE_STUDENT'];

  // Filter items based on role AND search query
  const filteredGroups = menuGroups.map((group) => {
    const validItems = group.items.filter((item) => {
      const roleAllowed = hasRole(userRoles, item.roles);
      const matchesSearch = item.label.toLowerCase().includes(searchQuery.toLowerCase());
      return roleAllowed && matchesSearch;
    });

    return { ...group, items: validItems };
  }).filter((group) => group.items.length > 0);

  const renderNavBody = (collapsedState: boolean) => (
    <>
      {/* Quick Search */}
      {!collapsedState && (
        <div className="p-3 border-b border-slate-100 dark:border-slate-800">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search portal menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#002147] dark:focus:ring-[#00A651]"
            />
          </div>
        </div>
      )}

      {/* Navigation Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
        {/* Favorites section */}
        {!collapsedState && favorites.length > 0 && !searchQuery && (
          <div className="space-y-1">
            <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>Pinned Favorites</span>
            </p>
            {favorites.map((favHref) => {
              const allItems = menuGroups.flatMap((g) => g.items);
              const matched = allItems.find((i) => i.href === favHref);
              if (!matched) return null;
              const Icon = matched.icon;
              const isActive = location.pathname === matched.href;

              return (
                <Link
                  key={matched.href}
                  to={matched.href}
                  onClick={() => onMobileClose?.()}
                  className={cn(
                    'flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all',
                    isActive
                      ? 'bg-[#002147] text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  )}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="truncate">{matched.label}</span>
                  </div>
                  <button onClick={(e) => toggleFavorite(matched.href, e)}>
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  </button>
                </Link>
              );
            })}
          </div>
        )}

        {/* Menu Categories */}
        {filteredGroups.map((group) => {
          const isExpanded = expandedItems[group.category] !== false;

          return (
            <div key={group.category} className="space-y-1">
              {!collapsedState && (
                <button
                  onClick={() => toggleExpand(group.category)}
                  className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                >
                  <span>{group.category}</span>
                  {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>
              )}

              {(isExpanded || collapsedState) && (
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    const isFav = favorites.includes(item.href);

                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => onMobileClose?.()}
                        className={cn(
                          'flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all group relative',
                          isActive
                            ? 'bg-[#002147] text-white shadow-sm dark:bg-[#002147]'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                        )}
                        title={collapsedState ? item.label : undefined}
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#002147] dark:group-hover:text-[#00A651]')} />
                          {!collapsedState && <span className="truncate">{item.label}</span>}
                        </div>

                        {!collapsedState && (
                          <div className="flex items-center gap-1.5">
                            {item.badge && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                {item.badge}
                              </span>
                            )}
                            <button
                              onClick={(e) => toggleFavorite(item.href, e)}
                              className="opacity-0 group-hover:opacity-100 transition p-1 text-slate-400 hover:text-amber-500"
                            >
                              <Star className={cn('w-3.5 h-3.5', isFav && 'text-amber-500 fill-amber-500 opacity-100')} />
                            </button>
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Recently Viewed Items */}
        {!collapsedState && recentItems.length > 0 && !searchQuery && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
            <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Recently Opened</span>
            </p>
            {recentItems.map((rec) => (
              <Link
                key={rec.href}
                to={rec.href}
                onClick={() => onMobileClose?.()}
                className="flex items-center gap-2 px-3 py-1.5 text-2xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="truncate">{rec.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* User Footer & Logout */}
      <div className="border-t border-slate-100 p-3 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-2">
        {!collapsedState && user && (
          <div className="flex items-center space-x-3 px-2 py-1.5">
            <div className="w-8 h-8 rounded-full bg-[#002147] text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
              ) : (
                user.fullName?.charAt(0) || 'U'
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{user.fullName}</p>
              <p className="text-[10px] text-[#00A651] font-bold truncate uppercase">{getUserDisplayDesignation(user)}</p>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            if (onMobileClose) onMobileClose();
            logout();
          }}
          className={cn(
            'flex w-full items-center justify-center space-x-2 rounded-xl py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer',
            collapsedState && 'px-0'
          )}
          title="Sign Out"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsedState && <span>Sign Out</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="relative z-10 flex h-full w-[280px] max-w-[85vw] flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                <Link to="/" onClick={onMobileClose} className="flex items-center space-x-3 overflow-hidden">
                  <CollegeLogo size="sm" />
                  <div className="min-w-0">
                    <span className="font-extrabold text-xs text-[#002147] dark:text-white block truncate uppercase">
                      BHMCH
                    </span>
                    <span className="text-[10px] text-[#00A651] font-bold block truncate">Digital ERP Portal</span>
                  </div>
                </Link>
                <button
                  onClick={onMobileClose}
                  className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {renderNavBody(false)}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: isCollapsed ? 80 : 280 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden md:flex h-full flex-col border-r border-slate-200 bg-white dark:border-slate-800/80 dark:bg-slate-900 shadow-xs relative z-30 select-none overflow-hidden shrink-0"
      >
        {/* Desktop Brand Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          {!isCollapsed && (
            <Link to="/" className="flex items-center space-x-3 overflow-hidden">
              <CollegeLogo size="sm" />
              <div className="min-w-0">
                <span className="font-extrabold text-xs text-[#002147] dark:text-white block truncate leading-tight uppercase tracking-tight">
                  BHMCH
                </span>
                <span className="text-[10px] text-[#00A651] font-bold block truncate">Digital ERP Portal</span>
              </div>
            </Link>
          )}
          {isCollapsed && (
            <Link to="/" title="Burdwan Homoeopathic Medical College">
              <CollegeLogo size="sm" />
            </Link>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 transition cursor-pointer"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>
        </div>

        {renderNavBody(isCollapsed)}
      </motion.aside>
    </>
  );
};

