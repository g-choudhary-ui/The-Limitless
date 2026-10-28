import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Brain,
  Target,
  Compass,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Layers,
  Shield,
  HelpCircle,
  Lightbulb,
  FileCheck
} from 'lucide-react';
import { Constellation3D } from '../components/Constellation3D';
import { LearningCycleMap } from '../components/LearningCycleMap';

export const LandingPage: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-brand-400/15 via-electric-400/10 to-transparent blur-[120px] pointer-events-none -z-10" />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-brand-500/20 text-xs font-semibold text-brand-700 dark:text-brand-300 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-brand-500 animate-spin-slow" />
              <span>Understand Yourself. Learn Smarter. Become Limitless.</span>
            </div>

            {/* Headline */}
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-900 dark:text-white leading-[1.12] tracking-tight">
              Your Weakness Is Not Your Limit.{' '}
              <span className="gradient-text">It's Your Next Learning Opportunity.</span>
            </h1>

            {/* Supporting Description */}
            <p className="text-slate-600 dark:text-slate-300 text-lg sm:text-xl font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Discover how you genuinely learn, uncover hidden conceptual gaps without judgment, test teaching strategies empirically, and build a personalized path toward the person you want to become.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/onboarding"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl text-base font-semibold text-white bg-gradient-to-r from-brand-600 via-brand-500 to-electric-600 hover:from-brand-500 hover:to-electric-500 shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/35 hover:-translate-y-0.5 transition-all duration-200"
              >
                <span>Discover My Learning Journey</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-base font-semibold text-slate-700 dark:text-slate-200 glass-card hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <span>Explore How It Works</span>
              </a>
            </div>

            {/* Trust indicators */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Evidence-based diagnosis</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Zero test shaming</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Adapts to your pace</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Right 3D Centerpiece */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            <div className="w-full max-w-[480px] h-[440px] rounded-3xl glass-card p-2 relative shadow-2xl overflow-hidden border border-white/40 dark:border-white/10">
              <Constellation3D />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full glass-panel text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Live Knowledge Constellation
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- SECTION 1: THE REAL PROBLEM --- */}
      <section id="how-it-works" className="py-20 bg-beige-100/50 dark:bg-[#1e1717]/60 border-y border-beige-200/80 dark:border-brand-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold tracking-widest text-brand-700 dark:text-brand-300 uppercase">
              The Reality of Studying
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#2e2322] dark:text-[#f7ede6]">
              Marks Alone Cannot Explain Where You Struggle
            </h2>
            <p className="text-[#786866] dark:text-[#aa9896] text-base leading-relaxed">
              Traditional exams give you a score, but never explain *why* an error occurred. Most students struggle with one of three common friction points:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl glass-card relative overflow-hidden border-t-4 border-brand-500 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-brand-500/15 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-6">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#2e2322] dark:text-white mb-3">
                "I study, but I don't always understand where I am going wrong."
              </h3>
              <p className="text-[#786866] dark:text-[#aa9896] text-sm leading-relaxed">
                You might understand 80% of a concept, but a single subtle misconception (like checking only local parent-child relationships instead of subtree ranges) causes repeated failure on tests.
              </p>
            </div>

            <div className="p-8 rounded-2xl glass-card relative overflow-hidden border-t-4 border-electric-500 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-electric-500/15 text-electric-600 dark:text-electric-400 flex items-center justify-center mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#2e2322] dark:text-white mb-3">
                "I have goals, but I struggle to turn them into consistent action."
              </h3>
              <p className="text-[#786866] dark:text-[#aa9896] text-sm leading-relaxed">
                When a planned topic feels too massive or ambiguous, starting is hard. It is rarely laziness; it's lack of a clear, psychologically manageable next step.
              </p>
            </div>

            <div className="p-8 rounded-2xl glass-card relative overflow-hidden border-t-4 border-beige-500 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-beige-500/15 text-beige-700 dark:text-beige-300 flex items-center justify-center mb-6">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#2e2322] dark:text-white mb-3">
                "I know I can improve, but I don't know which strategy works for me."
              </h3>
              <p className="text-[#786866] dark:text-[#aa9896] text-sm leading-relaxed">
                Reading static textbooks works for some, while worked examples or spatial visual diagrams work for others. Limitless tests formats empirically to see what actually sticks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: THE CONTINUOUS LEARNING CYCLE --- */}
      <section id="learning-cycle" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold tracking-widest text-electric-600 dark:text-electric-400 uppercase">
            The Central Engine
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#2e2322] dark:text-[#f7ede6]">
            A Continuous Adaptive Cycle
          </h2>
          <p className="text-[#786866] dark:text-[#aa9896] text-base leading-relaxed">
            Every screen connects to this loop: diagnose gaps, investigate the cause, try tailored micro-lessons, practice, and update real mastery estimates.
          </p>
        </div>

        {/* Interactive Cycle Map */}
        <LearningCycleMap currentStage={2} />
      </section>

      {/* --- SECTION 3: BEYOND MARKS --- */}
      <section id="philosophy" className="py-20 bg-beige-100/50 dark:bg-[#1e1717]/60 border-y border-beige-200/80 dark:border-brand-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold tracking-widest text-brand-700 dark:text-brand-300 uppercase">
                Our Educational Philosophy
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#2e2322] dark:text-[#f7ede6] leading-snug">
                Beyond Marks: True Understanding, Application & Expression
              </h2>
              <p className="text-[#786866] dark:text-[#aa9896] text-base leading-relaxed">
                A grade is only a snapshot in time. Real competence is multi-dimensional. Limitless separates your performance into measurable, workable pillars:
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#2e2322] dark:text-white">Conceptual Foundations</h4>
                    <p className="text-xs text-[#786866] dark:text-[#aa9896]">Distinguishes whether you hold a fundamental misconception or merely made a calculation slip.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-lg bg-electric-500/10 text-electric-600 dark:text-electric-400 flex items-center justify-center shrink-0 mt-0.5">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#2e2322] dark:text-white">Knowledge-to-Expression</h4>
                    <p className="text-xs text-[#786866] dark:text-[#aa9896]">Separates tacit knowledge from communication skills needed for technical interviews and written exams.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#2e2322] dark:text-white">Calibrated Growth & Self-Awareness</h4>
                    <p className="text-xs text-[#786866] dark:text-[#aa9896]">Track progress against your personal baseline, building genuine confidence through demonstrated competence.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="p-8 rounded-3xl glass-card border border-beige-200/90 dark:border-brand-900/40 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-beige-200 dark:border-brand-900/60 pb-4">
                  <h3 className="font-display font-bold text-lg text-[#2e2322] dark:text-[#f7ede6]">
                    Traditional LMS vs Limitless AI
                  </h3>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                    Comparative
                  </span>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4 pb-3 border-b border-beige-100 dark:border-brand-950">
                    <div>
                      <p className="text-stone-400 font-medium">Standard Quizzes</p>
                      <p className="font-semibold text-rose-500 mt-1">"Incorrect: Score 6/10"</p>
                      <p className="text-stone-500 mt-1">No diagnosis of why you chose that answer.</p>
                    </div>
                    <div>
                      <p className="text-brand-700 dark:text-brand-300 font-semibold">Limitless AI</p>
                      <p className="font-semibold text-emerald-600 dark:text-emerald-400 mt-1">"Misconception Detected: Local Invariant Bias"</p>
                      <p className="text-[#786866] dark:text-[#aa9896] mt-1">Triggers a targeted counter-example and re-tests the boundary.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-stone-400 font-medium">Missed Tasks</p>
                      <p className="font-semibold text-rose-500 mt-1">"Streak broken! 0 days"</p>
                      <p className="text-stone-500 mt-1">Shaming and superficial gamification.</p>
                    </div>
                    <div>
                      <p className="text-brand-700 dark:text-brand-300 font-semibold">Limitless AI</p>
                      <p className="font-semibold text-brand-700 dark:text-brand-300 mt-1">"What made this difficult to start?"</p>
                      <p className="text-[#786866] dark:text-[#aa9896] mt-1">Identifies task size or friction, decomposing into a 10m micro-step.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 4: FINAL CALL TO ACTION --- */}
      <section className="py-20 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-12 md:p-16 rounded-3xl bg-gradient-to-tr from-[#3a1d1c] via-[#592f2d] to-[#251515] text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-electric-500/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight">
              Stop guessing what to improve.{' '}
              <span className="text-beige-300">Start understanding how to improve.</span>
            </h2>
            <p className="text-beige-100 text-base sm:text-lg leading-relaxed">
              Experience the adaptive learning cycle with zero setup. Step into a supportive platform designed to make you an independent, confident learner.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/onboarding"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-[#3a1d1c] bg-[#fcfaf7] hover:bg-white shadow-xl transition-all duration-200"
              >
                <span>Start My Learning Journey</span>
                <ArrowRight className="w-4 h-4 text-brand-600" />
              </Link>
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-base font-semibold text-beige-100 hover:text-white border border-beige-300/30 hover:bg-white/10 transition-colors"
              >
                <span>View Sample Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>Limitless AI — Adaptive Learning & Cognitive Growth Platform. Built for college learners.</p>
      </footer>
    </div>
  );
};
