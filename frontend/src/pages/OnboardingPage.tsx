import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  Clock,
  Target,
  Brain,
  ShieldCheck,
  Compass,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

const GOAL_OPTIONS = [
  'Prepare for technical internships or placements',
  'Master tree, graph, and recursive algorithms',
  'Understand underlying concepts more deeply',
  'Prepare for semester or competitive examinations',
  'Improve verbal and written technical explanation',
  'Build a sustainable, guilt-free study habit',
  'Overcome procrastination on large coding assignments'
];

const DIFFICULTY_TYPES = [
  { id: 'understanding', label: 'Understanding the initial concept', desc: 'Making sense of the definition or mental model.' },
  { id: 'remembering', label: 'Remembering details long-term', desc: 'Retaining syntax or formulas after a few days.' },
  { id: 'application', label: 'Applying the concept to novel problems', desc: 'Knowing the concept, but getting stuck on variations or edge cases.' },
  { id: 'explanation', label: 'Explaining it clearly to others', desc: 'Solving it in code, but struggling to articulate why in an interview.' }
];

const FORMAT_PREFERENCES = [
  { id: 'worked_example', label: 'Worked Examples & Step-by-Step Traces', desc: 'See a concrete counter-example and trace variables line by line.' },
  { id: 'visual_diagram', label: 'Visual Spatial Models & Diagrams', desc: 'See bounding intervals, call-stack trees, or memory layouts.' },
  { id: 'active_practice', label: 'Active Problem-Solving Drills', desc: 'Jump straight into solving challenges with progressive hints.' },
  { id: 'structured_text', label: 'Structured Written Theory', desc: 'Read concise, mathematically rigorous definitions.' }
];

const BARRIER_OPTIONS = [
  'I am unsure where to begin when opening a problem',
  'The task feels too large or intimidating',
  'I underestimate the time required and run out of bandwidth',
  'Other academic coursework or chores interrupt me',
  'I get discouraged if my first attempt fails',
  'I am not entirely sure yet'
];

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { refreshProfile, showToast, setActiveStage } = useApp();

  const [step, setStep] = useState<number>(1);
  const totalSteps = 6;

  // Form states
  const [name, setName] = useState('Alex Chen');
  const [currentStudy, setCurrentStudy] = useState('Computer Science Sophomore');
  const [goals, setGoals] = useState<string[]>([
    'Prepare for technical internships or placements',
    'Master tree, graph, and recursive algorithms'
  ]);
  const [comfortableSubjects, setComfortableSubjects] = useState('Arrays, Hash Tables, Basic OOP');
  const [hardTopics, setHardTopics] = useState('BST Subtree Invariants, Recursive Backtracking');
  const [stuckReaction, setStuckReaction] = useState('I usually re-read the code repeatedly without knowing how to trace it.');
  const [difficultyType, setDifficultyType] = useState('application');
  const [preferredFormat, setPreferredFormat] = useState('worked_example');
  const [dailyHours, setDailyHours] = useState(1.5);
  const [schedulePref, setSchedulePref] = useState('flexible');
  const [planningBarriers, setPlanningBarriers] = useState<string[]>([
    'The task feels too large or intimidating',
    'I am unsure where to begin when opening a problem'
  ]);
  const [gpa, setGpa] = useState('3.5');
  const [targetRole, setTargetRole] = useState('Software Engineering Intern');
  const [saving, setSaving] = useState(false);

  const toggleGoal = (g: string) => {
    setGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  };

  const toggleBarrier = (b: string) => {
    setPlanningBarriers(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      await api.saveOnboarding({
        name,
        current_study: currentStudy,
        goals,
        comfortable_subjects: comfortableSubjects.split(',').map(s => s.trim()).filter(Boolean),
        hard_topics: hardTopics.split(',').map(s => s.trim()).filter(Boolean),
        stuck_reaction: stuckReaction,
        difficulty_type: difficultyType as any,
        preferred_format: preferredFormat,
        daily_study_hours: dailyHours,
        schedule_preference: schedulePref,
        planning_barriers: planningBarriers,
        academic_baseline: {
          recent_gpa: gpa,
          target_role: targetRole
        }
      });
      await refreshProfile();
      setActiveStage(2);
      showToast('Profile created successfully! Initial diagnostic assessment ready.', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast('Saved profile in local demo mode.', 'info');
      setActiveStage(2);
      navigate('/dashboard');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Wizard Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-3">
          <div className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-bold">
            <Compass className="w-4 h-4" />
            <span>Stage 1: Understand Me</span>
          </div>
          <span>Step {step} of {totalSteps}</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-brand-500 to-electric-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Main Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 shadow-xl border border-white/60 dark:border-white/10 relative">
        <AnimatePresence mode="wait">
          {/* STEP 1: Get to Know Me */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Step 1 — Welcoming Context
                </span>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white mt-1">
                  Get to Know You
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                  We use your responses to calibrate recommendations to your exact level. Nothing is judged or graded here.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    What name or nickname should we use?
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                    placeholder="e.g. Alex"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    What are you currently studying or preparing for?
                  </label>
                  <input
                    type="text"
                    value={currentStudy}
                    onChange={e => setCurrentStudy(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                    placeholder="e.g. Computer Science Sophomore / Tech Interviews"
                  />
                </div>

                <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900 text-xs text-brand-800 dark:text-brand-300 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                  <span>
                    Your privacy and pace are completely respected. You can adjust or reset this profile at any time.
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Understand My Goals */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Step 2 — Meaningful Direction
                </span>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white mt-1">
                  Understand Your Goals
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                  Select all that resonate with your current aspirations:
                </p>
              </div>

              <div className="space-y-2.5">
                {GOAL_OPTIONS.map(goal => {
                  const isChecked = goals.includes(goal);
                  return (
                    <button
                      key={goal}
                      onClick={() => toggleGoal(goal)}
                      type="button"
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                        isChecked
                          ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-900 dark:text-brand-200'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-brand-300'
                      }`}
                    >
                      <span>{goal}</span>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                        isChecked ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300 dark:border-slate-600'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 3: Current Experience & Learning Style */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Step 3 — Experience & Hypotheses
                </span>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white mt-1">
                  How Concepts Feel Right Now
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                  Where does friction usually show up? We treat format preferences as hypotheses to test empirically.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    When you face a difficult topic, where do you usually get stuck?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {DIFFICULTY_TYPES.map(d => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setDifficultyType(d.id)}
                        className={`text-left p-3.5 rounded-xl border transition-all ${
                          difficultyType === d.id
                            ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 ring-2 ring-brand-500/20'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{d.label}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{d.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Which explanation format would you like to test first?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {FORMAT_PREFERENCES.map(f => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setPreferredFormat(f.id)}
                        className={`text-left p-3.5 rounded-xl border transition-all ${
                          preferredFormat === f.id
                            ? 'bg-electric-50 dark:bg-electric-950/60 border-electric-500 ring-2 ring-electric-500/20'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{f.label}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{f.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Study Routine & Psychological Safety */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Step 4 — Realistic Routines
                </span>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white mt-1">
                  Your Available Routine
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                  Sustainable plans beat intense burnout. We never shame missed days.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    <span>Realistic daily study bandwidth:</span>
                    <span className="text-brand-600 dark:text-brand-400 font-mono text-sm">{dailyHours} hours / day</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="6"
                    step="0.5"
                    value={dailyHours}
                    onChange={e => setDailyHours(parseFloat(e.target.value))}
                    className="w-full accent-brand-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>30m (Bite-sized)</span>
                    <span>3 hours (Focused)</span>
                    <span>6 hours (Deep immersion)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    When a planned session gets missed or delayed, what usually happens?
                  </label>
                  <div className="space-y-2">
                    {BARRIER_OPTIONS.map(barrier => {
                      const isChecked = planningBarriers.includes(barrier);
                      return (
                        <button
                          key={barrier}
                          type="button"
                          onClick={() => toggleBarrier(barrier)}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                            isChecked
                              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-900 dark:text-amber-200'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span>{barrier}</span>
                          <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                            isChecked ? 'bg-amber-500 border-amber-500 text-white' : 'border-slate-400'
                          }`}>
                            {isChecked && <Check className="w-3 h-3" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 5: Academic Baseline (Optional) */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Step 5 — Optional Academic Baseline
                </span>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white mt-1">
                  Contextual Baseline
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                  Scores provide supporting context, but direct problem-solving evidence is what drives recommendations.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Target Role or Milestone
                  </label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={e => setTargetRole(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                    placeholder="e.g. Software Engineering Intern"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Recent GPA or Percentage (Optional)
                  </label>
                  <input
                    type="text"
                    value={gpa}
                    onChange={e => setGpa(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                    placeholder="e.g. 3.5 / 4.0 or 85%"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Comfortable Topics (Where you already feel confident)
                  </label>
                  <input
                    type="text"
                    value={comfortableSubjects}
                    onChange={e => setComfortableSubjects(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                    placeholder="e.g. Arrays, Hash Maps, Git"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Topics You Find Difficult (Gaps you want to crack)
                  </label>
                  <input
                    type="text"
                    value={hardTopics}
                    onChange={e => setHardTopics(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                    placeholder="e.g. BST Invariants, Dynamic Programming"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 6: Initial Profile Generation */}
          {step === 6 && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Step 6 — Calibrated Starting Point
                </span>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white mt-1">
                  Your Initial Learning Profile
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                  Here is the starting configuration for {name}. Notice we clearly distinguish self-reported preferences from demonstrated proof.
                </p>
              </div>

              <div className="space-y-3 text-xs bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500">Learner Name:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500">Self-Reported Strengths:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{comfortableSubjects || 'Arrays & Hashing'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500">Target Learning Gaps:</span>
                  <span className="font-medium text-rose-500">{hardTopics || 'BST Subtree Invariants'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500">Strategy Hypothesis:</span>
                  <span className="font-medium text-brand-600 dark:text-brand-400 capitalize">
                    {preferredFormat.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500">Recommended First Diagnostic:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    Binary Search Trees: Subtree-Wide Bounds
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-800 dark:text-emerald-300">
                <p className="font-bold">Next Action:</p>
                <p className="mt-1">
                  We'll start with a single, gentle diagnostic problem in Stage 2 to uncover if the common parent-child misconception is present.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wizard Controls */}
        <div className="flex items-center justify-between pt-8 border-t border-slate-200 dark:border-slate-800 mt-8">
          {step > 1 ? (
            <button
              onClick={() => setStep(s => s - 1)}
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            {step < totalSteps && (
              <button
                onClick={() => setStep(s => s + 1)}
                type="button"
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
              >
                Skip Question
              </button>
            )}

            {step < totalSteps ? (
              <button
                onClick={() => setStep(s => s + 1)}
                type="button"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-electric-600 hover:from-brand-500 hover:to-electric-500 shadow-md transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={saving}
                type="button"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-500/20 transition-all disabled:opacity-50"
              >
                <span>{saving ? 'Configuring Profile...' : 'Build My Learning Journey'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
