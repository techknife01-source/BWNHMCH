import React, { useState } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { DashboardSidebar } from './DashboardSidebar';
import { Sparkles } from 'lucide-react';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Sticky Top Header */}
      <DashboardHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex overflow-hidden">
        {/* Responsive Collapsible Sidebar */}
        <DashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Scrollable Content Area */}
        <main
          tabIndex={-1}
          className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 flex flex-col justify-between"
          aria-label="Dashboard Content Area"
        >
          <div className="max-w-7xl w-full mx-auto">
            {children}
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-6 border-t border-slate-200/80 dark:border-slate-800 text-2xs text-slate-500 flex flex-wrap items-center justify-between gap-4 max-w-7xl w-full mx-auto">
            <div>
              <p className="font-semibold">
                © {new Date().getFullYear()} Burdwan Homoeopathic Medical College & Hospital. All rights reserved.
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
