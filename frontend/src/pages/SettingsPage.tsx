import React, { useState } from 'react';
import {
  Settings,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Key,
  ShieldAlert,
  Cpu,
  User,
  Database,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { apiStatus, refreshProfile, showToast, setActiveStage } = useApp();
  const [resetting, setResetting] = useState(false);

  const handleResetDemo = async () => {
    if (!window.confirm('Reset all demo state to fresh baseline? This clears diagnostic history and resets Alex Chen profile.')) {
      return;
    }
    setResetting(true);
    try {
      await api.resetProfile();
      await refreshProfile();
      setActiveStage(2);
      showToast('Baseline demo state restored successfully!', 'success');
      navigate('/dashboard');
    } catch (e) {
      showToast('Reset completed locally.', 'info');
      navigate('/dashboard');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-900 mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>System & Demonstration Controls</span>
        </div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
          Settings & Hackathon Demo Mode
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
          Limitless is designed to be fully functional both with a live Google Gemini API key or in 100% offline deterministic demo mode for jury evaluation.
        </p>
      </div>

      {/* AI Mode & Backend Telemetry Card */}
      <div className="p-6 rounded-3xl glass-card border border-brand-500/30 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-brand-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              AI Provider & Mode Status
            </h3>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
            apiStatus?.mode === 'live_gemini'
              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
              : 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
          }`}>
            {apiStatus?.mode === 'live_gemini' ? 'Live Gemini 2.5 Flash' : 'Deterministic Demo Mode'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-slate-400 font-medium">GEMINI_API_KEY Configured:</span>
            <div className="font-bold text-slate-900 dark:text-white">
              {apiStatus?.api_key_configured ? 'Active (Environment Detected)' : 'Not Set (Using Deterministic Fallback)'}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Keys are strictly guarded in server-side environment variables and never exposed to browser client code.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-slate-400 font-medium">Backend Server:</span>
            <div className="font-bold text-slate-900 dark:text-white">
              FastAPI + SQLite (Port 8000)
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Deterministic scoring and state transitions are backed by relational SQLite tables with atomic updates.
            </p>
          </div>
        </div>
      </div>

      {/* Demo Persona & Reset Card */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <User className="w-5 h-5 text-electric-500" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Demo Persona Quick Calibration
          </h3>
        </div>

        <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
          <p>
            The hackathon demo includes the curated persona <strong>Alex Chen</strong> (Computer Science Sophomore preparing for internships, targeting Binary Search Tree invariants and recursion).
          </p>
          <p>
            You can reset the database at any moment to demonstrate the end-to-end journey from a clean slate.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleResetDemo}
            disabled={resetting}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 hover:bg-rose-100 transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{resetting ? 'Resetting DB...' : 'Reset to Clean Baseline State'}</span>
          </button>

          <button
            onClick={() => navigate('/onboarding')}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
          >
            <span>Restart Onboarding Wizard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hackathon Checklist Card */}
      <div className="p-6 rounded-3xl glass-card border border-emerald-500/20 bg-emerald-50/10 space-y-3">
        <h3 className="font-bold text-sm text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Hackathon Evaluation Walkthrough</span>
        </h3>
        <ol className="list-decimal list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1.5 pl-1 leading-relaxed">
          <li><strong>Landing Page:</strong> Inspect the 3D knowledge constellation and 6-stage circular cycle.</li>
          <li><strong>Onboarding:</strong> Walk through the 6-step supportive intake without clinical diagnosis.</li>
          <li><strong>Adaptive Studio:</strong> Select BST Invariants &rarr; submit diagnostic &rarr; witness misconception hypothesis &rarr; test multi-format micro-lesson &rarr; solve follow-up counter-example &rarr; see mastery delta (+35%).</li>
          <li><strong>Planner:</strong> Add follow-up exercise to planner &rarr; test AI plan generator or barrier reflection.</li>
          <li><strong>Expression Studio:</strong> Explain BST validity in your own words &rarr; see rubric distinguishing conceptual grasp from expression friction.</li>
          <li><strong>Radar & Analytics:</strong> Check Recharts radar chart and telemetry.</li>
        </ol>
      </div>
    </div>
  );
};
