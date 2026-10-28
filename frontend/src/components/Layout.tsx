import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Layout: React.FC = () => {
  const location = useLocation();
  const { toast } = useApp();
  const isLanding = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f6f0] dark:bg-[#181313] text-[#2e2322] dark:text-[#f7ede6] transition-colors duration-200">
      <Navbar />

      {/* Toast notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl glass-card shadow-xl border border-white/40 dark:border-white/10 text-xs font-medium animate-bounce">
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          {toast.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-500" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-brand-500" />}
          <span>{toast.message}</span>
        </div>
      )}

      {isLanding ? (
        <main className="flex-1 w-full">
          <Outlet />
        </main>
      ) : (
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          <Sidebar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      )}
    </div>
  );
};
