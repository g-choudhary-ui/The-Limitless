import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Sun, Moon, ArrowRight, LayoutDashboard, Cpu, Compass } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme, apiStatus, profile } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const isLanding = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-electric-400 flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-xl tracking-tight bg-gradient-to-r from-[#2e2322] via-brand-700 to-[#5f3331] dark:from-[#f7ede6] dark:via-brand-200 dark:to-[#d3c4be] bg-clip-text text-transparent">
                LIMITLESS
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-tight -mt-1 hidden sm:block">
              Understand Yourself. Learn Smarter.
            </p>
          </div>
        </Link>

        {/* Navigation Links for Landing */}
        {isLanding ? (
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#how-it-works" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              How It Works
            </a>
            <a href="#learning-cycle" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Learning Cycle
            </a>
            <a href="#philosophy" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Our Philosophy
            </a>
            <Link to="/learn" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Diagnostic Studio
            </Link>
          </nav>
        ) : (
          <div className="hidden md:flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-900 text-brand-700 dark:text-brand-300 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>Current Cycle: Stage {profile?.current_cycle_stage || 2} of 6</span>
            </span>
          </div>
        )}

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          {/* Mode Pill Indicator */}
          <div
            title={apiStatus?.mode === 'live_gemini' ? 'Connected to Google Gemini API' : 'Running in Deterministic Demo Mode (No Key Required)'}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium border bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                apiStatus?.mode === 'live_gemini'
                  ? 'bg-emerald-500 animate-pulse'
                  : 'bg-amber-400'
              }`}
            />
            <span className="text-[11px]">
              {apiStatus?.mode === 'live_gemini' ? 'Live Gemini AI' : 'Demo Mode'}
            </span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Primary CTA */}
          {isLanding ? (
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/onboarding"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-600 to-electric-600 hover:from-brand-500 hover:to-electric-500 shadow-sm shadow-brand-500/30 hover:shadow-md transition-all duration-200"
              >
                <span>Discover My Journey</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
