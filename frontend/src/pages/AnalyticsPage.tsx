import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Brain,
  CheckCircle2,
  Sparkles,
  Layers,
  HelpCircle
} from 'lucide-react';
import { api } from '../services/api';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    api.getAnalytics().then(res => setData(res));
  }, []);

  if (!data) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading progress telemetry...</div>;
  }

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-900 mb-2">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Multidimensional Telemetry</span>
        </div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
          Progress and Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Knowledge mastery is strictly separated from study hours or completed checkboxes. A high score represents verified cognitive understanding, not time spent sitting at a screen.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Concepts Mastered</div>
          <div className="text-2xl font-display font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {data.stats.concepts_mastered}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Empirically proven</div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Developing Invariants</div>
          <div className="text-2xl font-display font-bold text-brand-600 dark:text-brand-400 mt-1">
            {data.stats.concepts_developing}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Active practice loop</div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Active Gaps</div>
          <div className="text-2xl font-display font-bold text-rose-500 mt-1">
            {data.stats.active_gaps}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Under investigation</div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Learning Velocity</div>
          <div className="text-xl font-display font-bold text-electric-600 dark:text-electric-400 mt-1 truncate">
            {data.stats.learning_velocity}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Retention rate delta</div>
        </div>
      </div>

      {/* CHART 1: Mastery Growth vs Baseline */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
              Mastery Progression vs Baseline
            </h3>
            <p className="text-xs text-slate-500">
              Tracking your calibrated concept mastery as diagnostic assessments are solved.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
            Steady Improvement
          </span>
        </div>

        <div className="w-full h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.mastery_progression}>
              <defs>
                <linearGradient id="currentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke="#94a3b8" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '11px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Area
                type="monotone"
                dataKey="current"
                name="Demonstrated Mastery %"
                stroke="#8b5cf6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#currentGrad)"
              />
              <Area
                type="monotone"
                dataKey="baseline"
                name="Initial Baseline %"
                stroke="#94a3b8"
                strokeDasharray="4 4"
                fillOpacity={0}
                fill="#94a3b8"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CHART 2: Domain Competence Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
              Domain Competence
            </h3>
            <p className="text-xs text-slate-500">
              Evaluated across theory, coding, articulation, and habit regularity.
            </p>
          </div>

          <div className="w-full h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.domain_competence}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke="#94a3b8" />
                <XAxis dataKey="domain" tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px'
                  }}
                />
                <Bar dataKey="score" name="Your Score" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                <Bar dataKey="benchmark" name="Target Benchmark" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strategy Retention Comparison */}
        <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
              Strategy Efficacy Comparison
            </h3>
            <p className="text-xs text-slate-500">
              Average retention percentage recorded for each learning format.
            </p>
          </div>

          <div className="w-full h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.strategy_efficacy} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke="#94a3b8" />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis dataKey="name" type="category" width={110} tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px'
                  }}
                />
                <Bar dataKey="retention" name="Observed Retention %" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
