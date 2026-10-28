import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Compass, Search, HelpCircle, Compass as CompassIcon, Sliders, PlayCircle, RefreshCw, ArrowRight } from 'lucide-react';

interface StageInfo {
  number: number;
  name: string;
  shortDesc: string;
  icon: any;
  route: string;
  tag: string;
}

const STAGES: StageInfo[] = [
  {
    number: 1,
    name: 'Understand Me',
    shortDesc: 'Discovers your learning goals, routine, preferences, and self-reported strengths.',
    icon: Compass,
    route: '/onboarding',
    tag: 'Baseline Context'
  },
  {
    number: 2,
    name: 'Discover My Gaps',
    shortDesc: 'Diagnostic assessments reveal specific cognitive misconceptions without judgment.',
    icon: Search,
    route: '/learn',
    tag: 'Diagnostic Testing'
  },
  {
    number: 3,
    name: 'Understand Why',
    shortDesc: 'Distinguishes conceptual gaps from expression difficulties or planning friction.',
    icon: HelpCircle,
    route: '/learn',
    tag: 'Root-Cause Analysis'
  },
  {
    number: 4,
    name: 'Design My Strategy',
    shortDesc: 'Tests worked examples, visual models, or structured challenges tailored to you.',
    icon: Sliders,
    route: '/strategies',
    tag: 'Format Personalization'
  },
  {
    number: 5,
    name: 'Practice & Improve',
    shortDesc: 'Adaptive follow-up exercises verify that the underlying misconception is resolved.',
    icon: PlayCircle,
    route: '/learn',
    tag: 'Targeted Practice'
  },
  {
    number: 6,
    name: 'Reflect & Adapt',
    shortDesc: 'Calibrates evidence-based mastery, updates growth maps, and plans your next cycle.',
    icon: RefreshCw,
    route: '/growth',
    tag: 'Evolutionary Loop'
  }
];

interface LearningCycleMapProps {
  currentStage?: number;
  interactive?: boolean;
}

export const LearningCycleMap: React.FC<LearningCycleMapProps> = ({
  currentStage = 2,
  interactive = true
}) => {
  const navigate = useNavigate();
  const [selectedStage, setSelectedStage] = React.useState<number>(currentStage);

  const activeInfo = STAGES.find(s => s.number === selectedStage) || STAGES[1];

  return (
    <div className="w-full rounded-2xl glass-card p-6 md:p-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-[70px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-electric-500/10 rounded-full blur-[70px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Visual Circular Cycle Display */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative min-h-[380px]">
          {/* Circular Orbit Track */}
          <div className="relative w-[320px] h-[320px] md:w-[360px] md:h-[360px] rounded-full border-2 border-dashed border-beige-300 dark:border-brand-900/60 flex items-center justify-center">
            {/* Center Core */}
            <div className="w-32 h-32 rounded-full glass-panel shadow-lg flex flex-col items-center justify-center text-center p-3 z-10 border border-brand-400/40">
              <span className="text-[10px] font-semibold tracking-widest text-brand-700 dark:text-brand-300 uppercase">
                Continuous
              </span>
              <span className="font-display font-bold text-lg text-[#2e2322] dark:text-[#f7ede6]">
                Cycle
              </span>
              <span className="text-[11px] text-[#786866] dark:text-[#aa9896]">
                Stage {selectedStage} of 6
              </span>
            </div>

            {/* Stage Nodes positioned in a circle */}
            {STAGES.map((stage, idx) => {
              const angle = (idx * (360 / STAGES.length) - 90) * (Math.PI / 180);
              const radius = 145; // radius in px
              const x = Math.round(radius * Math.cos(angle));
              const y = Math.round(radius * Math.sin(angle));

              const isCurrent = stage.number === currentStage;
              const isSelected = stage.number === selectedStage;
              const isCompleted = stage.number < currentStage;

              const Icon = stage.icon;

              return (
                <motion.button
                  key={stage.number}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedStage(stage.number)}
                  className={`absolute w-13 h-13 -ml-6.5 -mt-6.5 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md ${
                    isSelected
                      ? 'bg-gradient-to-tr from-brand-600 to-electric-500 text-white ring-4 ring-brand-400/30 shadow-brand-500/30'
                      : isCompleted
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                      : isCurrent
                      ? 'bg-brand-500/20 border border-brand-500/40 text-brand-700 dark:text-brand-300 animate-pulse'
                      : 'bg-white dark:bg-[#251e1d] border border-beige-200 dark:border-brand-900/60 text-[#786866] dark:text-[#aa9896] hover:border-brand-400'
                  }`}
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`
                  }}
                  title={`Stage ${stage.number}: ${stage.name}`}
                >
                  <Icon className="w-5 h-5" />
                  {isCurrent && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-brand-500 rounded-full ring-2 ring-white dark:ring-stone-900" />
                  )}
                </motion.button>
              );
            })}
          </div>

          <div className="text-xs text-stone-500 dark:text-stone-400 mt-4 text-center">
            Click any node on the orbit to inspect its role and jump directly to that phase.
          </div>
        </div>

        {/* Selected Stage Detail Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full bg-beige-50/80 dark:bg-[#221a19]/80 p-6 rounded-2xl border border-beige-200 dark:border-brand-900/40">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300">
                Stage {activeInfo.number}: {activeInfo.tag}
              </span>
              {activeInfo.number === currentStage && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 animate-pulse">
                  Active Now
                </span>
              )}
            </div>

            <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-slate-100 mb-2">
              {activeInfo.name}
            </h3>

            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
              {activeInfo.shortDesc}
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                <span>
                  <strong>Evidence-Driven:</strong> Every answer updates real mastery estimates; never assumes failure is lack of effort.
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="w-1.5 h-1.5 rounded-full bg-electric-500 mt-1.5 shrink-0" />
                <span>
                  <strong>Targeted Feedback:</strong> Distinguishes syntax slips from fundamental prerequisite gaps.
                </span>
              </div>
            </div>
          </div>

          {interactive && (
            <button
              onClick={() => navigate(activeInfo.route)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-brand-600 to-electric-600 hover:from-brand-500 hover:to-electric-500 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <span>Explore {activeInfo.name}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
