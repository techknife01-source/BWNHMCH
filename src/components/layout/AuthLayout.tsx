import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { APP_CONSTANTS } from '../../constants/app.constants';
import { CollegeLogo } from '../common/CollegeLogo';

export const AuthLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-slate-100 antialiased">
      <header className="flex items-center justify-between p-6">
        <Link to="/" className="flex items-center space-x-3">
          <CollegeLogo size="sm" />
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
