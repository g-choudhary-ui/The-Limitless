import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Brain,
  CheckCircle2,
  AlertCircle,
  Clock,
  Compass,
  Play,
  Check,
  TrendingUp,
  Layers,
  ChevronRight,
  HelpCircle,
  Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { KnowledgeNode, StudyTask } from '../types';
import { LearningCycleMap } from '../components/LearningCycleMap';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, activeStage } = useApp();

  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [pathData, taskList] = await Promise.all([
        api.getLearningPath(),
        api.getTasks()
      ]);
      setNodes(pathData.nodes);
      setTasks(taskList.slice(0, 3));
      if (pathData.nodes.length > 0) {
        setSelectedNode(pathData.nodes.find(n => n.status === 'gap_detected') || pathData.nodes[0]);
      }
    } catch (err) {
      console.warn('Dashboard loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const masteredCount = nodes.filter(n => n.status === 'mastered').length;
  const developingCount = nodes.filter(n => n.status === 'developing').length;
  const gapsCount = nodes.filter(n => n.status === 'gap_detected').length;

  const handleToggleTask = async (task: StudyTask) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await api.updateTask(task.id, { status: newStatus });
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus as any } : t));
    } catch (e) {
      // local update
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus as any } : t));
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-900 mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Cycle Stage {profile?.current_cycle_stage || activeStage}: Discover & Understand Why</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
            Welcome back, {profile?.name || 'Alex Chen'}.
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            Let's decide what will help you move forward today with measurable clarity.
          </p>
        </div>

        <Link
          to="/learn"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-600 to-electric-600 hover:from-brand-500 hover:to-electric-500 shadow-md transition-all shrink-0"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Launch Adaptive Studio</span>
        </Link>
      </div>

      {/* ONE USEFUL INSIGHT BANNER */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-brand-500/10 via-electric-500/10 to-transparent border border-brand-500/20 glass-card flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-brand-500/30">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300">
              One Actionable Insight
            </h4>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 font-mono">
              Evidence-based
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
            Your recent BST validation answer checked direct parent-child relationships, missing ancestor boundary contracts. Reviewing a 3-minute worked counter-example before writing recursive code is recommended.
          </p>
        </div>
        <Link
          to="/learn"
          className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline shrink-0"
        >
          <span>Examine Lesson</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* TODAY'S FOCUS & LEARNING INTELLIGENCE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Today's Focus (Max 3 actions) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                Today's Focus
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Prioritized by detected learning gaps and available time ({profile?.daily_study_hours || 1.5}h).
              </p>
            </div>
            <Link to="/planner" className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline">
              View Planner
            </Link>
          </div>

          <div className="space-y-3">
            {tasks.map(task => {
              const isDone = task.status === 'completed';
              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl glass-card transition-all border ${isDone
                      ? 'border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10'
                      : 'border-slate-200/80 dark:border-slate-800 hover:border-brand-300'
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleTask(task)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all mt-0.5 shrink-0 ${isDone
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-slate-300 dark:border-slate-600 hover:border-brand-500'
                        }`}
                    >
                      {isDone && <Check className="w-4 h-4" />}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-xs sm:text-sm font-bold ${isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                          }`}>
                          {task.title}
                        </h4>
                        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{task.duration_minutes}m</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Goal: <span className="text-slate-700 dark:text-slate-300 font-medium">{task.goal_id || 'Internship Readiness'}</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Learning Intelligence Summary */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">
            Learning Intelligence
          </h2>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl glass-card text-center border-b-2 border-emerald-500">
              <span className="text-2xl font-display font-bold text-emerald-600 dark:text-emerald-400">
                {masteredCount}
              </span>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                Mastered
              </p>
            </div>
            <div className="p-4 rounded-2xl glass-card text-center border-b-2 border-brand-500">
              <span className="text-2xl font-display font-bold text-brand-600 dark:text-brand-400">
                {developingCount}
              </span>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                Developing
              </p>
            </div>
            <div className="p-4 rounded-2xl glass-card text-center border-b-2 border-rose-500">
              <span className="text-2xl font-display font-bold text-rose-500">
                {gapsCount}
              </span>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                Active Gaps
              </p>
            </div>
          </div>

          {/* Cognitive Breakdown Card */}
          <div className="p-5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>Evidence Status</span>
              <span className="text-[10px] font-mono text-slate-400">Calibrated</span>
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Tree Invariant Verification:</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                  Gap Detected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Call-Stack Return Bounds:</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                  Developing (75%)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">In-Order Monotonic Traversal:</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  Mastered (88%)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Dynamic Programming States:</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
                  Insufficient Evidence
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE KNOWLEDGE GROWTH MAP */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              My Growth Map
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive node graph. Click any node to inspect evidence, prerequisites, and targeted exercises.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Node Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {nodes.map(node => {
              const isSelected = selectedNode?.id === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-4 rounded-2xl glass-card text-left transition-all border ${isSelected
                      ? 'border-brand-500 ring-2 ring-brand-500/20 shadow-md'
                      : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                      {node.subject}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${node.status === 'mastered'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                        : node.status === 'gap_detected'
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                          : 'bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300'
                      }`}>
                      {node.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {node.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {node.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Mastery:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className="h-full bg-brand-500 rounded-full"
                          style={{ width: `${node.mastery_score}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                        {node.mastery_score}%
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Node Inspector */}
          {selectedNode && (
            <div className="lg:col-span-4 p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                Node Inspector
              </span>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                {selectedNode.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedNode.description}
              </p>

              <div className="space-y-2 text-xs pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-500">Calculated Mastery:</span>
                  <span className="font-mono font-bold text-brand-600 dark:text-brand-400">
                    {selectedNode.mastery_score}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Evidence Count:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    {selectedNode.evidence_count} diagnostic attempts
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Prerequisites:</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {selectedNode.prerequisites.length > 0 ? selectedNode.prerequisites.join(', ') : 'None (Core)'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate('/learn')}
                className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-electric-600 hover:from-brand-500 hover:to-electric-500 shadow-md transition-all"
              >
                <span>Launch Targeted Diagnostic</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CONTINUOUS CYCLE EMBED */}
      <div className="pt-4">
        <div className="mb-4">
          <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">
            Current Position in Learning Cycle
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Stages evolve in real-time as you complete diagnostic tasks and follow-ups.
          </p>
        </div>
        <LearningCycleMap currentStage={profile?.current_cycle_stage || 2} />
      </div>
    </div>
  );
};
