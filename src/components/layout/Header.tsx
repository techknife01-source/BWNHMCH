import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone, Mail, Award, Search, Building2, Globe, Shield, GraduationCap, Users, Stethoscope, ChevronDown, HeartPulse, UserPlus, FileText } from 'lucide-react';
import { APP_CONSTANTS } from '../../constants/app.constants';
import { institutionSettingsService, InstitutionSettings } from '../../services/institutionSettingsService';
import { ThemeToggle } from './ThemeToggle';
import { Notifications } from './Notifications';
import { ProfileMenu } from './ProfileMenu';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<'academics' | 'hospital' | 'logins' | null>(null);
  const [lang, setLang] = useState<'EN' | 'BN' | 'HI'>('EN');
  const [settings, setSettings] = useState<InstitutionSettings>(() => institutionSettingsService.getSettings());

  useEffect(() => {
    const handleSettingsUpdate = () => {
      setSettings(institutionSettingsService.getSettings());
    };
    window.addEventListener('bhmch_institution_settings_updated', handleSettingsUpdate);
    return () => window.removeEventListener('bhmch_institution_settings_updated', handleSettingsUpdate);
  }, []);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About College', href: '/about' },
    { label: 'Principal Desk', href: '/principal-desk' },
    { label: 'Departments', href: '/departments' },
    { label: 'Faculty Directory', href: '/faculty-directory' },
    { label: 'Academic Activity', href: '/academic-activity' },
    { label: 'Courses', href: '/courses' },
    { label: 'Admission 2026', href: '/admission', highlight: true },
    { label: 'Hospital & OPD', href: '/hospital' },
    { label: 'Doctors', href: '/doctors' },
    { label: 'Notice Board', href: '/notice' },
    { label: 'News & Events', href: '/events' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Downloads', href: '/downloads' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 transition-all shadow-xs">
      {/* Top Bar Info Banner */}
      <div className="bg-[#002147] px-4 py-1 text-slate-200 text-[11px] font-medium hidden lg:flex items-center justify-between border-b border-white/10">
        <div className="flex items-center space-x-5">
          <span className="flex items-center gap-1"><Phone className="h-3 w-3 text-emerald-400" /> College: {settings.collegePhone}</span>
          <span className="flex items-center gap-1 text-rose-300 font-bold"><HeartPulse className="h-3 w-3 text-rose-400" /> Hospital Phone: {settings.hospitalPhone}</span>
          <span className="flex items-center gap-1"><Mail className="h-3 w-3 text-blue-300" /> {settings.collegeEmail}</span>
          <span className="flex items-center gap-1 text-amber-300"><Award className="h-3 w-3" /> ESTD {settings.establishedYear}</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-3xs font-bold uppercase tracking-wider">
            <span className="text-slate-400">Login Shortcuts:</span>
            <Link to="/login/student" className="text-emerald-300 hover:underline">Student</Link>
            <span className="text-slate-600">•</span>
            <Link to="/login/faculty" className="text-blue-300 hover:underline">Faculty</Link>
            <span className="text-slate-600">•</span>
            <Link to="/login/admin" className="text-amber-300 hover:underline">Admin</Link>
          </div>

          <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded text-[10px]">
            <Globe className="w-3 h-3 text-emerald-400" />
            <button onClick={() => setLang('EN')} className={`px-1 font-bold ${lang === 'EN' ? 'text-white' : 'text-slate-400'}`}>EN</button>
            <span>/</span>
            <button onClick={() => setLang('BN')} className={`px-1 font-bold ${lang === 'BN' ? 'text-white' : 'text-slate-400'}`}>বাংলা</button>
            <span>/</span>
            <button onClick={() => setLang('HI')} className={`px-1 font-bold ${lang === 'HI' ? 'text-white' : 'text-slate-400'}`}>हिंदी</button>
          </div>
        </div>
      </div>

      {/* Main Brand Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#002147] text-white font-black text-sm shadow-md group-hover:bg-[#003366] transition">
            BW
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-[#002147] dark:text-white leading-tight">
              {APP_CONSTANTS.INSTITUTION_NAME}
            </h1>
            <p className="text-[10px] font-bold text-[#00A651] tracking-wide uppercase flex items-center gap-2">
              <span>Attached 50-Bed Teaching Hospital</span>
              <span className="text-slate-400 hidden sm:inline">• Purba Bardhaman, WB</span>
            </p>
          </div>
        </Link>

        {/* Header Right Actions */}
        <div className="flex items-center space-x-3">
          <Link
            to="/admission"
            className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#00A651] hover:bg-emerald-600 text-white font-bold text-xs shadow-sm transition"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Apply Admission 2026</span>
          </Link>

          <ThemeToggle />
          <Notifications />
          <ProfileMenu />

          {/* Mobile Hamburger Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden lg:block border-t border-slate-100 bg-slate-50/70 dark:border-slate-800/80 dark:bg-slate-900/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1 text-xs font-semibold">
          <div className="flex items-center space-x-1 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`rounded-lg px-2.5 py-1.5 transition-all whitespace-nowrap ${
                  item.highlight
                    ? 'bg-[#00A651] text-white hover:bg-emerald-600 font-bold'
                    : 'text-slate-700 hover:bg-white hover:text-[#002147] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-400'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-900 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-xs font-semibold ${
                  item.highlight ? 'bg-[#00A651] text-white font-bold' : 'text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Direct Login Portals</p>
            <div className="flex gap-2">
              <Link to="/login/student" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center py-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold rounded-lg">
                Student Login
              </Link>
              <Link to="/login/faculty" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center py-2 bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold rounded-lg">
                Faculty Login
              </Link>
              <Link to="/login/admin" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center py-2 bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold rounded-lg">
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
