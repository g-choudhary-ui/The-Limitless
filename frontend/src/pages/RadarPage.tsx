import React, { useState, useEffect } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import {
  Radar as RadarIcon,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers
} from 'lucide-react';
import { api } from '../services/api';
import { RadarSkill } from '../types';
import { useNavigate } from 'react-router-dom';

export const RadarPage: React.FC = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState<RadarSkill[]>([]);
  const [targetProfile, setTargetProfile] = useState<string>('Software Engineering Intern (Algorithms & Systems)');

  useEffect(() => {
    api.getSkillsRadar().then(res => {
      setSkills(res.skills);
      setTargetProfile(res.target_profile);
    });
  }, []);

  const chartData = skills.map(s => ({
    subject: s.subject,
    demonstrated: s.assessed ? s.demonstrated : 0,
    required: s.required,
    assessed: s.assessed
  }));

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-900 mb-2">
          <RadarIcon className="w-3.5 h-3.5" />
          <span>Competency Calibration</span>
        </div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
          Skill Gap Radar
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Comparing required industry or course competencies against demonstrated performance. Unassessed skills are clearly distinguished from zero-mastery to avoid misleading assumptions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Radar Chart Visual */}
        <div className="lg:col-span-7 p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center">
          <div className="w-full flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Benchmark Target: {targetProfile}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
              Recharts Engine
            </span>
          </div>

          <div className="w-full h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#94a3b8" strokeDasharray="3 3" opacity={0.3} />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 9 }} />
                <Radar
                  name="Required Proficiency"
                  dataKey="required"
                  stroke="#94a3b8"
                  fill="#94a3b8"
                  fillOpacity={0.15}
                />
                <Radar
                  name="Demonstrated Evidence"
                  dataKey="demonstrated"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.45}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    fontSize: '11px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown List */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-2">
            Competency Evidence Ledger
          </h3>

          <div className="space-y-3">
            {skills.map((s, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {s.subject}
                  </h4>
                  {s.assessed ? (
                    <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
                      {s.demonstrated}% / {s.required}%
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-500">
                      Unassessed
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Status:</span>
                  <span className={`font-semibold ${s.evidence_status.includes('Gap')
                      ? 'text-rose-500'
                      : s.evidence_status.includes('Developing')
                        ? 'text-amber-500'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}>
                    {s.evidence_status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/learn')}
            className="w-full mt-4 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-600 to-electric-600 hover:from-brand-500 hover:to-electric-500 shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <span>Resolve Priority Gap (BST Bounds)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
