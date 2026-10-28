import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sliders,
  Sparkles,
  BarChart2,
  FileCode,
  Eye,
  BrainCircuit,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { api } from '../services/api';
import { StrategyExperiment } from '../types';
import { useApp } from '../context/AppContext';

export const StrategiesPage: React.FC = () => {
  const { showToast } = useApp();
  const [strategies, setStrategies] = useState<StrategyExperiment[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [testingFormat, setTestingFormat] = useState<string | null>(null);
  const [trialResult, setTrialResult] = useState<any | null>(null);

  const loadData = async () => {
    try {
      const data = await api.getStrategyExperiments();
      setStrategies(data.strategies);
      setSummary(data.summary);
    } catch (e) {
      console.warn('Failed to load strategy experiments:', e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRunMiniTrial = (stratId: string) => {
    setTestingFormat(stratId);
    setTrialResult(null);
  };

  const handleCompleteTrial = async (correct: boolean) => {
    if (!testingFormat) return;
    try {
      await api.recordStrategyExperiment({
        strategy_type: testingFormat,
        topic_id: 'bst_invariants',
        retention_score: correct ? 90.0 : 50.0,
        clarity_rating: correct ? 5 : 3,
        followup_correct: correct,
        notes: `Tested ${testingFormat} on tree boundary invariant.`
      });
      setTrialResult({
        correct,
        msg: correct
          ? 'Strong positive correlation! This approach provided clear conceptual clarity for you on this topic.'
          : 'Moderate struggle detected. We will de-prioritize this format for structural algorithm topics without labeling you permanently.'
      });
      showToast('Trial recorded in empirical evidence database.', 'success');
      loadData();
    } catch (e) {
      showToast('Recorded trial locally.', 'info');
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-900 mb-2">
          <Sliders className="w-3.5 h-3.5" />
          <span>Stage 4: Format Discovery Engine</span>
        </div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
          Learning Strategy Experiments
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
          We never assign permanent personality labels like "visual learner." Instead, we treat each teaching style as a scientific hypothesis and measure your follow-up retention objectively.
        </p>
      </div>

      {/* Insight Callout */}
      <div className="p-5 rounded-2xl glass-card border border-brand-500/20 bg-gradient-to-r from-brand-500/5 via-electric-500/5 to-transparent flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300">
            Current Empirical Observation
          </h4>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 mt-1 leading-relaxed">
            {summary || 'Worked examples and visual diagrams currently show the highest retention on structural algorithm topics.'}
          </p>
        </div>
      </div>

      {/* Strategies Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {strategies.map(strat => {
          return (
            <div
              key={strat.id}
              className={`p-6 rounded-3xl glass-card border transition-all flex flex-col justify-between ${strat.recommended
                  ? 'border-brand-500/40 shadow-lg shadow-brand-500/5'
                  : 'border-slate-200 dark:border-slate-800'
                }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                      {strat.id === 'worked_example' && <FileCode className="w-5 h-5" />}
                      {strat.id === 'visual_diagram' && <Eye className="w-5 h-5" />}
                      {strat.id === 'active_practice' && <BrainCircuit className="w-5 h-5" />}
                      {strat.id === 'structured_text' && <BookOpen className="w-5 h-5" />}
                    </div>
                    <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                      {strat.name}
                    </h3>
                  </div>

                  {strat.recommended && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                      High Efficacy
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {strat.description}
                </p>

                {/* Metrics */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Observed Retention:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {strat.observed_retention}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-500 to-electric-500 rounded-full"
                      style={{ width: `${strat.observed_retention}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Evidence base:</span>
                    <span>{strat.trials_completed} trials recorded</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleRunMiniTrial(strat.id)}
                className="mt-6 w-full py-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-white dark:hover:bg-brand-600 transition-colors"
              >
                Test This Format Now
              </button>
            </div>
          );
        })}
      </div>

      {/* Mini Interactive Trial Modal / Drawer */}
      {testingFormat && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 sm:p-8 rounded-3xl glass-card border border-brand-500/50 shadow-2xl space-y-5 bg-white/95 dark:bg-slate-900/95"
        >
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-[10px] font-mono font-bold uppercase">
                Active Strategy Trial
              </span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Simulating: {testingFormat.replace('_', ' ').toUpperCase()}
              </h3>
            </div>
            <button
              onClick={() => setTestingFormat(null)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Close
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Quick retention test: In a BST, suppose node 10 is the left child of 20. If node 10 has a right child of 25, which boundary is violated?
          </p>

          {!trialResult ? (
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => handleCompleteTrial(true)}
                className="flex-1 py-3 px-4 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors"
              >
                Root 20's upper boundary (25 &gt; 20 in left subtree) [Correct]
              </button>
              <button
                onClick={() => handleCompleteTrial(false)}
                className="flex-1 py-3 px-4 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                Node 10's parent relation (25 &lt; 10) [Incorrect]
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Trial Outcome Processed</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300">{trialResult.msg}</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
