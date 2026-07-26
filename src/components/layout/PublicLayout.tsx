import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { CommandPalette } from '../common/CommandPalette';

export const PublicLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50 text-slate-800 antialiased dark:bg-slate-950 dark:text-slate-100 transition-colors">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CommandPalette />
    </div>
  );
};
