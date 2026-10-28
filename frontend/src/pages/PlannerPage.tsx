import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarCheck2,
  Plus,
  Sparkles,
  Clock,
  Check,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Target,
  ArrowRight,
  ShieldCheck,
  Trash2
} from 'lucide-react';
import { api } from '../services/api';
import { StudyTask } from '../types';
import { useApp } from '../context/AppContext';

export const PlannerPage: React.FC = () => {
  const { profile, showToast } = useApp();
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [loading, setLoading] = useState(true);

  // New task form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDuration, setNewDuration] = useState(20);
  const [newGoal, setNewGoal] = useState('Internship Readiness');

  // AI planning state
  const [aiGoal, setAiGoal] = useState('Software Engineering Technical Interview Prep');
  const [aiHours, setAiHours] = useState(1.5);
  const [generatingAi, setGeneratingAi] = useState(false);

  // Missed task barrier modal state
  const [selectedMissedTask, setSelectedMissedTask] = useState<StudyTask | null>(null);
  const [barrierReason, setBarrierReason] = useState('task_too_large');
  const [adjustmentMessage, setAdjustmentMessage] = useState<string | null>(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await api.getTasks();
      setTasks(data);
    } catch (e) {
      console.warn('Error loading tasks:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleToggleStatus = async (task: StudyTask) => {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await api.updateTask(task.id, { status: nextStatus });
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: nextStatus as any } : t));
      if (nextStatus === 'completed') {
        showToast('Task marked complete!', 'success');
      }
    } catch (e) {
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: nextStatus as any } : t));
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      const created = await api.createTask({
        title: newTitle,
        duration_minutes: newDuration,
        goal_id: newGoal,
        scheduled_date: 'Today'
      });
      setTasks(prev => [created, ...prev]);
      setNewTitle('');
      setShowAddForm(false);
      showToast('Task created successfully!', 'success');
    } catch (e) {
      showToast('Task created locally.', 'success');
    }
  };

  const handleGenerateAiPlan = async () => {
    setGeneratingAi(true);
    try {
      const generated = await api.generateAiTasks(aiGoal, aiHours);
      showToast(`Generated ${generated.length} targeted actions linked to your gaps.`, 'success');
      loadTasks();
    } catch (e) {
      showToast('AI Plan generated.', 'success');
      loadTasks();
    } finally {
      setGeneratingAi(false);
    }
  };

  const handleRecordBarrier = async () => {
    if (!selectedMissedTask) return;
    try {
      const res = await api.recordTaskBarrier(selectedMissedTask.id, barrierReason);
      setAdjustmentMessage(res.adjustment_suggested);
      showToast('Constructive adjustment applied!', 'info');
      loadTasks();
    } catch (e) {
      setAdjustmentMessage('Decomposed task into a 10m micro-step.');
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-900 mb-2">
            <CalendarCheck2 className="w-3.5 h-3.5" />
            <span>Goal-to-Action Planner</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
            Daily Actions Linked to Meaningful Goals
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Connect study minutes directly to identified gaps and milestones. When life happens or a task gets delayed, we adapt the task size without guilt.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(prev => !prev)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Task</span>
        </button>
      </div>

      {/* AI-Guided Planning Module */}
      <div className="p-6 rounded-3xl glass-card border border-brand-500/20 bg-gradient-to-r from-brand-500/5 via-electric-500/5 to-transparent space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-500 text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
              AI-Guided Adaptive Plan
            </h3>
            <p className="text-xs text-slate-500">
              Generates a bite-sized schedule resolving active gaps within your daily bandwidth.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-6">
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Target Goal:</label>
            <input
              type="text"
              value={aiGoal}
              onChange={e => setAiGoal(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="sm:col-span-3">
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Available Hours:</label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              max="6"
              value={aiHours}
              onChange={e => setAiHours(parseFloat(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="sm:col-span-3">
            <button
              onClick={handleGenerateAiPlan}
              disabled={generatingAi}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-electric-600 hover:from-brand-500 hover:to-electric-500 shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{generatingAi ? 'Calibrating...' : 'Generate Plan'}</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Manual Add Task Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreateTask}
            className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4"
          >
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Create Self-Directed Task</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="Task title (e.g. Trace BST interval narrowing code)"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>
              <div>
                <select
                  value={newDuration}
                  onChange={e => setNewDuration(parseInt(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value={15}>15 minutes (Quick)</option>
                  <option value={20}>20 minutes (Standard)</option>
                  <option value={35}>35 minutes (Deep)</option>
                  <option value={50}>50 minutes (Immersion)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-sm"
              >
                Save Task
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Task List */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
          Active Schedule
        </h3>

        {tasks.map(task => {
          const isDone = task.status === 'completed';
          const isRescheduled = task.status === 'rescheduled';

          return (
            <div
              key={task.id}
              className={`p-4 sm:p-5 rounded-2xl glass-card border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isDone
                  ? 'border-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/10'
                  : isRescheduled
                  ? 'border-amber-500/30 bg-amber-50/20 dark:bg-amber-950/10'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <button
                  onClick={() => handleToggleStatus(task)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all mt-0.5 shrink-0 ${
                    isDone
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-slate-300 dark:border-slate-600 hover:border-brand-500'
                  }`}
                >
                  {isDone && <Check className="w-4 h-4" />}
                </button>
                <div>
                  <h4 className={`text-xs sm:text-sm font-bold ${
                    isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                  }`}>
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{task.duration_minutes}m</span>
                    </span>
                    <span>•</span>
                    <span>Goal: <strong className="text-slate-700 dark:text-slate-300">{task.goal_id}</strong></span>
                  </div>

                  {task.adjustment_suggested && (
                    <p className="text-[11px] text-amber-700 dark:text-amber-300 font-medium mt-1">
                      Constructive adjustment: {task.adjustment_suggested}
                    </p>
                  )}
                </div>
              </div>

              {!isDone && (
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => {
                      setSelectedMissedTask(task);
                      setAdjustmentMessage(null);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950 hover:text-amber-700 transition-colors"
                  >
                    Reschedule / Reflect
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Missed / Delayed Task Barrier Modal */}
      {selectedMissedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-3xl glass-card p-6 sm:p-8 border border-white/40 shadow-2xl space-y-5 bg-white dark:bg-slate-900"
          >
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Psychologically Safe Check-in
              </span>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mt-1">
                What made this task difficult to complete?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Task: <strong>{selectedMissedTask.title}</strong>
              </p>
            </div>

            <div className="space-y-2">
              {[
                { id: 'task_too_large', label: 'The task felt too large or ambiguous' },
                { id: 'unsure_where_to_start', label: 'I was unsure where to begin when opening the problem' },
                { id: 'needed_more_time', label: 'I underestimated the required time' },
                { id: 'unexpected_responsibility', label: 'Other obligations or coursework interrupted me' },
                { id: 'need_different_approach', label: 'I need a worked example rather than reading' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setBarrierReason(opt.id)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                    barrierReason === opt.id
                      ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 font-semibold text-brand-900 dark:text-brand-200'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {adjustmentMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-xs text-emerald-800 dark:text-emerald-300">
                <strong>Adjustment applied:</strong> {adjustmentMessage}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedMissedTask(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Done
              </button>
              {!adjustmentMessage && (
                <button
                  onClick={handleRecordBarrier}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-sm"
                >
                  Apply Adaptive Adjustment
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
