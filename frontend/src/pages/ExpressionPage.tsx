import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mic,
  Sparkles,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  MessageSquare,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { api } from '../services/api';
import { ExpressionEvaluation } from '../types';
import { useApp } from '../context/AppContext';

export const ExpressionPage: React.FC = () => {
  const { showToast } = useApp();

  const [concept, setConcept] = useState('Why does local parent-child checking fail for BST validation?');
  const [style, setStyle] = useState<'interview' | 'exam' | 'peer'>('interview');
  const [explanation, setExplanation] = useState(
    'A binary search tree requires that everything on the left is smaller and everything on the right is bigger. If you only check if node.left is less than node, a node deep on the right of the left subtree could be greater than the root and the algorithm would still pass it as true.'
  );
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<ExpressionEvaluation | null>(null);

  const handleEvaluate = async () => {
    if (!explanation.trim()) return;
    setEvaluating(true);
    try {
      const res = await api.evaluateExpression({
        concept,
        explanation,
        style
      });
      setEvaluation(res);
      showToast('Expression evaluated with rubric analysis.', 'success');
    } catch (e) {
      showToast('Evaluation completed in fallback mode.', 'info');
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-900 mb-2">
          <Mic className="w-3.5 h-3.5" />
          <span>Knowledge-to-Expression Studio</span>
        </div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
          Bridge the Gap Between Understanding and Articulation
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Many learners understand a concept internally, but lose marks in exams or interviews because of structure and vocabulary. Limitless evaluates your explanation and distinguishes conceptual confusion from communication friction.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Prompt & Textarea */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Prompt to Explain:
              </label>
              <input
                type="text"
                value={concept}
                onChange={e => setConcept(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              />
            </div>

            {/* Mode / Style selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Audience / Setting:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'interview', label: 'Technical Interview', desc: 'Precise, concise, invariant-focused' },
                  { id: 'exam', label: 'Written Exam Answer', desc: 'Inductive proof and definitions' },
                  { id: 'peer', label: 'Peer Explanation', desc: 'Intuitive analogies & examples' },
                ].map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setStyle(m.id as any)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${style === m.id
                        ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-900 dark:text-brand-200 ring-2 ring-brand-500/20 font-bold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                  >
                    <div>{m.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Explanation textarea */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Explain in your own words:
              </label>
              <textarea
                rows={6}
                value={explanation}
                onChange={e => setExplanation(e.target.value)}
                className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-brand-500 leading-relaxed"
                placeholder="Write your explanation freely without worrying about sounding perfect..."
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-slate-400">
                AI separates reasoning from communication fluency.
              </span>
              <button
                onClick={handleEvaluate}
                disabled={evaluating}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-600 to-electric-600 hover:from-brand-500 hover:to-electric-500 shadow-md transition-all disabled:opacity-50"
              >
                <span>{evaluating ? 'Analyzing Expression...' : 'Evaluate Explanation'}</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Rubric Feedback & Diagnosis */}
        <div className="lg:col-span-5 space-y-4">
          {evaluation ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-3xl glass-card border border-brand-500/30 shadow-xl space-y-5"
            >
              {/* Diagnosis Badge */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Diagnosis Result
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${evaluation.diagnosis === 'sound_understanding'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                    : evaluation.diagnosis === 'expression_difficulty'
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                      : 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                  }`}>
                  {evaluation.diagnosis.replace('_', ' ')}
                </span>
              </div>

              {/* Rubric Scores */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <div className="font-mono font-bold text-lg text-brand-600 dark:text-brand-400">
                    {evaluation.conceptual_score}%
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Conceptual</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <div className="font-mono font-bold text-lg text-electric-600 dark:text-electric-400">
                    {evaluation.clarity_score}%
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Clarity</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <div className="font-mono font-bold text-lg text-slate-700 dark:text-slate-300">
                    {evaluation.structure_score}%
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Structure</div>
                </div>
              </div>

              <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed p-3.5 rounded-xl bg-brand-50/50 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900">
                <strong>Why this rating:</strong> {evaluation.diagnosis_explanation}
              </div>

              {/* Strengths */}
              <div className="space-y-1.5 text-xs">
                <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Demonstrated Strengths</span>
                </div>
                <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1 pl-1">
                  {evaluation.strengths.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              {/* Missing Key Points */}
              <div className="space-y-1.5 text-xs">
                <div className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Missing Essential Terminology</span>
                </div>
                <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1 pl-1">
                  {evaluation.missing_key_points.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </div>

              {/* Refined Expert Version */}
              <div className="space-y-1 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="font-bold text-brand-600 dark:text-brand-400">
                  Polished Articulation:
                </span>
                <p className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] leading-relaxed">
                  "{evaluation.refined_version}"
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="p-8 rounded-3xl glass-card border border-dashed border-slate-300 dark:border-slate-800 text-center text-xs text-slate-400 flex flex-col items-center justify-center min-h-[320px] space-y-3">
              <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-600" />
              <p>Type your explanation and submit for instant diagnostic evaluation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
