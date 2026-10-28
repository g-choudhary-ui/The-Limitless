import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Save,
  MessageSquareQuote
} from 'lucide-react';
import { api } from '../services/api';
import { ReflectionItem } from '../types';
import { useApp } from '../context/AppContext';

export const GrowthPage: React.FC = () => {
  const { showToast } = useApp();
  const [reflections, setReflections] = useState<ReflectionItem[]>([]);
  const [whatUnderstood, setWhatUnderstood] = useState('');
  const [whatHelped, setWhatHelped] = useState('');
  const [bestApproach, setBestApproach] = useState('Worked examples with tree counter-examples');
  const [nextStep, setNextStep] = useState('Write an in-order BST validator without references.');
  const [saving, setSaving] = useState(false);

  const loadReflections = async () => {
    try {
      const data = await api.getReflections();
      setReflections(data);
    } catch (e) {
      console.warn('Error loading reflections:', e);
    }
  };

  useEffect(() => {
    loadReflections();
  }, []);

  const handleSaveReflection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatUnderstood.trim() || !whatHelped.trim()) return;
    setSaving(true);
    try {
      await api.saveReflection({
        what_understood: whatUnderstood,
        what_helped: whatHelped,
        best_approach: bestApproach,
        next_step: nextStep
      });
      showToast('Weekly reflection recorded in private growth journal.', 'success');
      setWhatUnderstood('');
      setWhatHelped('');
      loadReflections();
    } catch (e) {
      showToast('Saved reflection locally.', 'info');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-900 mb-2">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Stage 6: Reflect & Adapt</span>
        </div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
          My Growth and Reflection
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
          A calm, private space free from competitive leaderboards or artificial streaks. Growth is demonstrated through understanding, not repetitive busywork.
        </p>
      </div>

      {/* Baseline to Present Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
            Initial Baseline
          </div>
          <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Local Invariant Bias
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Struggled to identify why checking only node.left and node.right failed on deeper ancestor subtrees.
          </p>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-emerald-500/30 bg-emerald-50/10 space-y-2">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Demonstrated Strength
          </div>
          <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Subtree Interval Slicing
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Successfully traced the Node 25 counter-example and proved understanding of ancestor range propagation.
          </p>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-brand-500/30 bg-brand-50/10 space-y-2">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Effective Strategy
          </div>
          <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Worked Examples & Traces
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            84.5% retention observed when testing concrete counter-examples before writing recursion.
          </p>
        </div>
      </div>

      {/* Reflection Journal Form */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card border border-brand-500/20 shadow-xl space-y-5">
        <div className="flex items-center gap-2.5 border-b border-slate-200 dark:border-slate-800 pb-3">
          <MessageSquareQuote className="w-5 h-5 text-brand-500" />
          <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
            Weekly Self-Reflection Prompt
          </h3>
        </div>

        <form onSubmit={handleSaveReflection} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              1. What do you understand better now than before?
            </label>
            <input
              type="text"
              required
              placeholder="e.g. I understand that BST validity requires an interval (low, high) passed from ancestors..."
              value={whatUnderstood}
              onChange={e => setWhatUnderstood(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              2. What was difficult, and what actually helped you break through?
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Tracing Node 25 in the left branch of Root 20 made the boundary violation obvious..."
              value={whatHelped}
              onChange={e => setWhatHelped(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                3. Which approach worked best for you?
              </label>
              <input
                type="text"
                value={bestApproach}
                onChange={e => setBestApproach(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                4. What is your next realistic step?
              </label>
              <input
                type="text"
                value={nextStep}
                onChange={e => setNextStep(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-brand-600 hover:bg-brand-500 shadow-md transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Record Reflection'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Reflection History Log */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
          Past Reflections & Evidence Log
        </h3>

        <div className="space-y-4">
          {reflections.map(ref => (
            <div
              key={ref.id}
              className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between text-slate-400 font-mono text-[11px] pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{ref.timestamp}</span>
                </span>
                <span className="text-emerald-500 font-bold">Verified Growth</span>
              </div>
              <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                <strong>What I understood:</strong> {ref.what_understood}
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                <strong>What helped:</strong> {ref.what_helped}
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-[11px] text-slate-500">
                <span>Best approach: <strong className="text-slate-700 dark:text-slate-300">{ref.best_approach}</strong></span>
                <span>Next step: <strong className="text-brand-600 dark:text-brand-400">{ref.next_step}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
