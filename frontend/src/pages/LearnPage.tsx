import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BrainCircuit,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Eye,
  FileCode,
  Sparkles,
  RefreshCw,
  CalendarPlus,
  ShieldCheck,
  ChevronRight,
  Lightbulb,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Question, MicroLesson } from '../types';

export const LearnPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast, refreshProfile, setActiveStage } = useApp();

  const [topics, setTopics] = useState<any[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('bst_invariants');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedOptId, setSelectedOptId] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<any | null>(null);

  // Micro-lesson state
  const [activeFormat, setActiveFormat] = useState<string>('worked_example');

  // Follow-up verification state
  const [followupStep, setFollowupStep] = useState<boolean>(false);
  const [followupSelectedOptId, setFollowupSelectedOptId] = useState<string>('');
  const [followupResult, setFollowupResult] = useState<any | null>(null);
  const [addingToPlanner, setAddingToPlanner] = useState<boolean>(false);

  useEffect(() => {
    api.getTopics().then(data => {
      setTopics(data);
    });
  }, []);

  useEffect(() => {
    if (selectedTopicId) {
      api.getTopicQuestions(selectedTopicId)
        .then(qList => {
          setQuestions(qList);
          setCurrentQIndex(0);
          setSelectedOptId('');
          setSubmissionResult(null);
          setFollowupStep(false);
          setFollowupResult(null);
        })
        .catch(err => console.warn('Could not load topic questions:', err));
    }
  }, [selectedTopicId]);

  const currentQ = questions[currentQIndex];

  const handleSubmitDiagnostic = async () => {
    if (!selectedOptId || !currentQ) return;
    setSubmitting(true);
    try {
      const res = await api.submitAssessment({
        topic_id: selectedTopicId,
        question_id: currentQ.id,
        selected_option_id: selectedOptId,
        confidence_level: 'medium'
      });
      setSubmissionResult(res);
      await refreshProfile();
      setActiveStage(res.suggested_next_stage || 3);
      if (res.is_correct) {
        showToast('Excellent! Your understanding is solidly verified.', 'success');
      } else {
        showToast('Cognitive gap diagnosed. Review the targeted micro-lesson below.', 'info');
      }
    } catch (err) {
      showToast('Error submitting diagnostic assessment.', 'warning');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitFollowup = async () => {
    if (!followupSelectedOptId) return;
    setSubmitting(true);
    try {
      const res = await api.verifyFollowup({
        topic_id: selectedTopicId,
        question_id: 'q_bst_followup',
        selected_option_id: followupSelectedOptId
      });
      setFollowupResult(res);
      await refreshProfile();
      setActiveStage(6);
      showToast('Follow-up verified! Learning state updated in database.', 'success');
    } catch (err) {
      showToast('Error verifying follow-up question.', 'warning');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddNextToPlanner = async () => {
    setAddingToPlanner(true);
    try {
      await api.createTask({
        title: 'Implement is_valid_bst(root, low, high) interval checker',
        duration_minutes: 20,
        goal_id: 'Binary Search Trees',
        scheduled_date: 'Today'
      });
      showToast('Targeted task added to your Planner!', 'success');
      navigate('/planner');
    } catch (e) {
      showToast('Task added to your local planner.', 'success');
      navigate('/planner');
    } finally {
      setAddingToPlanner(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Top Banner / Topic Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-900 mb-2">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Adaptive Learning Studio — Stages 2 to 5</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
            Diagnostic & Misconception Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Answer the diagnostic question. If an error is made, we uncover the exact cognitive cause and verify your recovery.
          </p>
        </div>

        {/* Topic dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">Topic:</label>
          <select
            value={selectedTopicId}
            onChange={e => setSelectedTopicId(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-brand-500"
          >
            {topics.map(t => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* --- PHASE 1: DIAGNOSTIC QUESTION --- */}
      {currentQ && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/50 dark:border-white/10 shadow-xl space-y-6">
          <div className="flex items-center justify-between text-xs border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 font-mono font-bold">
                Diagnostic Question
              </span>
              <span className="text-slate-500">
                Tests: <strong className="text-slate-700 dark:text-slate-300">{currentQ.concept_tested}</strong>
              </span>
            </div>
            <span className="text-slate-400 font-mono">Stage 2: Discover My Gaps</span>
          </div>

          {/* Question Prompt */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-relaxed whitespace-pre-line">
              {currentQ.prompt}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3 pt-2">
            {currentQ.options.map(opt => {
              const isSelected = selectedOptId === opt.id;
              return (
                <button
                  key={opt.id}
                  disabled={Boolean(submissionResult)}
                  onClick={() => setSelectedOptId(opt.id)}
                  className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm transition-all flex items-start gap-3.5 ${isSelected
                      ? 'border-brand-500 bg-brand-50/80 dark:bg-brand-950/60 ring-2 ring-brand-500/20 text-brand-950 dark:text-brand-100 font-medium'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:border-brand-300 text-slate-700 dark:text-slate-300'
                    } ${submissionResult ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border ${isSelected
                      ? 'bg-brand-600 border-brand-600 text-white'
                      : 'border-slate-300 dark:border-slate-600 text-slate-500'
                    }`}>
                    {opt.id}
                  </div>
                  <div className="flex-1 leading-relaxed">
                    {opt.text}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Submit Button */}
          {!submissionResult && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400">
                Choose the answer that reflects your current intuition.
              </span>
              <button
                disabled={!selectedOptId || submitting}
                onClick={handleSubmitDiagnostic}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-600 to-electric-600 hover:from-brand-500 hover:to-electric-500 shadow-md disabled:opacity-40 transition-all"
              >
                <span>{submitting ? 'Analyzing Invariant...' : 'Submit Answer'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Instant Diagnosis Feedback */}
          {submissionResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-2xl border ${submissionResult.is_correct
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-200'
                } space-y-3`}
            >
              <div className="flex items-center gap-2">
                {submissionResult.is_correct ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                )}
                <h4 className="font-bold text-sm">
                  {submissionResult.is_correct ? 'Concept Understood' : 'Misconception Diagnosed (Stage 3)'}
                </h4>
              </div>

              <p className="text-xs sm:text-sm leading-relaxed">
                {submissionResult.feedback}
              </p>

              {!submissionResult.is_correct && (
                <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-rose-200 dark:border-rose-900 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <div className="font-bold text-rose-600 dark:text-rose-400">Why this matters:</div>
                  <p>
                    A Binary Search Tree is not just a tree where children satisfy local inequalities. Every descendant in the left subtree must be less than the root ancestor. Checking only immediate children is one of the top reasons code fails edge cases in technical interviews.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}

      {/* --- PHASE 2: TARGETED MICRO-LESSON (MULTI-FORMAT) --- */}
      {submissionResult && submissionResult.micro_lesson && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-6 sm:p-8 border border-brand-500/30 shadow-xl space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                Stage 4: Design My Strategy
              </span>
              <h3 className="font-display font-extrabold text-xl text-slate-900 dark:text-white mt-1">
                Targeted Micro-Lesson: {submissionResult.micro_lesson.title}
              </h3>
            </div>
            <span className="text-xs text-slate-500">Test different teaching formats below:</span>
          </div>

          {/* Format Switcher Tabs */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(submissionResult.micro_lesson.formats).map(([key, item]: [string, any]) => {
              const isActive = activeFormat === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveFormat(key)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${isActive
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                >
                  {key === 'worked_example' && <FileCode className="w-3.5 h-3.5" />}
                  {key === 'visual_diagram' && <Eye className="w-3.5 h-3.5" />}
                  {key === 'active_practice' && <BrainCircuit className="w-3.5 h-3.5" />}
                  {key === 'structured_text' && <BookOpen className="w-3.5 h-3.5" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Micro-Lesson Content Body */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 prose dark:prose-invert max-w-none text-xs sm:text-sm">
            <div className="whitespace-pre-wrap font-sans leading-relaxed text-slate-800 dark:text-slate-200">
              {submissionResult.micro_lesson.formats[activeFormat]?.content}
            </div>
          </div>

          {/* Ready for Verification CTA */}
          {!followupStep && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500">
                Ready to demonstrate that the misconception is resolved?
              </span>
              <button
                onClick={() => setFollowupStep(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md transition-all"
              >
                <span>Verify Improvement (Stage 5)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* --- PHASE 3: ADAPTIVE FOLLOW-UP VERIFICATION QUESTION --- */}
      {followupStep && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/40 shadow-xl space-y-6"
        >
          <div className="flex items-center justify-between text-xs border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-bold">
                Verification Check
              </span>
              <span className="text-slate-500">Stage 5: Practice & Demonstrate Improvement</span>
            </div>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Active Counter-Example</span>
          </div>

          <div className="space-y-3">
            <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-relaxed">
              Now consider this specific binary tree:
            </h3>
            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed border border-slate-800">
              Root = 20<br />
              &nbsp;&nbsp;├── Left = 10<br />
              &nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;└── Right = 25<br />
              &nbsp;&nbsp;└── Right = 30
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              If passed to the original naive parent-child check algorithm, what will it output, and is this tree a valid BST?
            </p>
          </div>

          {/* Follow-up Options */}
          <div className="space-y-3 pt-2">
            {[
              {
                id: 'A',
                text: 'The naive algorithm returns True, but the tree is NOT a valid BST because Node 25 in the left subtree exceeds Root 20.'
              },
              {
                id: 'B',
                text: 'The naive algorithm returns False, and the tree is indeed not a valid BST.'
              },
              {
                id: 'C',
                text: 'The tree is a valid BST because 25 is properly greater than 10.'
              }
            ].map(opt => {
              const isSelected = followupSelectedOptId === opt.id;
              return (
                <button
                  key={opt.id}
                  disabled={Boolean(followupResult)}
                  onClick={() => setFollowupSelectedOptId(opt.id)}
                  className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm transition-all flex items-start gap-3.5 ${isSelected
                      ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/60 ring-2 ring-emerald-500/20 font-medium'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:border-emerald-300'
                    }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border ${isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 dark:border-slate-600'
                    }`}>
                    {opt.id}
                  </div>
                  <div className="flex-1 leading-relaxed">
                    {opt.text}
                  </div>
                </button>
              );
            })}
          </div>

          {!followupResult && (
            <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                disabled={!followupSelectedOptId || submitting}
                onClick={handleSubmitFollowup}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 shadow-md transition-all"
              >
                <span>{submitting ? 'Evaluating...' : 'Confirm Verification'}</span>
                <Check className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Follow-up Success / Update Result */}
          {followupResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 space-y-4"
            >
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200 font-bold text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Misconception Overcome! Mastery Calibrated (+35% Evidence Delta)</span>
              </div>

              <p className="text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 leading-relaxed">
                {followupResult.insight}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-emerald-200 dark:border-emerald-800">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Ready to turn this insight into a persistent study task?
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleAddNextToPlanner}
                    disabled={addingToPlanner}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md transition-all"
                  >
                    <CalendarPlus className="w-4 h-4" />
                    <span>{addingToPlanner ? 'Adding...' : 'Add Next Action to Planner'}</span>
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800 transition-colors"
                  >
                    View Updated Dashboard
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};
