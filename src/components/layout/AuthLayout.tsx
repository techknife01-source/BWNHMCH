import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { APP_CONSTANTS } from '../../constants/app.constants';

export const AuthLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-slate-100 antialiased">
      <header className="flex items-center justify-between p-6">
        <Link to="/" className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-black">
            <Building2 className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-sm text-white">{APP_CONSTANTS.SHORT_NAME}</span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
          <Outlet />
        </div>
      </main>

      <footer className="p-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {APP_CONSTANTS.INSTITUTION_NAME}
      </footer>
    </div>
  );
};
