import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BrainCircuit,
  Sliders,
  Radar,
  CalendarCheck2,
  Mic,
  TrendingUp,
  BarChart3,
  Settings,
  ChevronRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/learn', label: 'Adaptive Learn', icon: BrainCircuit, badge: 'Core' },
  { path: '/strategies', label: 'Strategies Lab', icon: Sliders },
  { path: '/radar', label: 'Skill Gap Radar', icon: Radar },
  { path: '/planner', label: 'Goal Planner', icon: CalendarCheck2 },
  { path: '/expression', label: 'Expression Studio', icon: Mic },
  { path: '/growth', label: 'My Growth', icon: TrendingUp },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/settings', label: 'Settings & Demo', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { profile } = useApp();

  return (
    <aside className="w-64 border-r border-beige-200/80 dark:border-brand-900/40 bg-beige-50/80 dark:bg-[#1f1918]/90 backdrop-blur-md flex flex-col justify-between p-4 shrink-0 h-[calc(100vh-4rem)] sticky top-16 hidden md:flex">
      <div className="space-y-6">
        {/* User Card */}
        <div className="p-3 rounded-xl bg-white/90 dark:bg-[#271e1d] border border-beige-200/80 dark:border-brand-900/50 flex items-center gap-3 shadow-xs">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-500 to-electric-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            {profile?.name ? profile.name.charAt(0) : 'A'}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-[#2e2322] dark:text-[#f7ede6] truncate">
              {profile?.name || 'Alex Chen'}
            </h4>
            <p className="text-[11px] text-[#786866] dark:text-[#aa9896] truncate">
              {profile?.current_study || 'CS Sophomore'}
            </p>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="space-y-1">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-400/30 shadow-xs'
                      : 'text-[#786866] dark:text-[#aa9896] hover:bg-beige-100/70 dark:hover:bg-[#2b2120] hover:text-[#2e2322] dark:hover:text-[#f7ede6]'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-500 text-white">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Safety & Trust Note at bottom */}
      <div className="p-3 rounded-xl bg-brand-50/50 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900 text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5">
        <div className="flex items-center gap-1.5 font-semibold text-brand-700 dark:text-brand-300">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
          <span>Non-Judgmental Learning</span>
        </div>
        <p className="leading-tight text-[10px]">
          No public rankings or test shaming. Every gap is treated as a stepping stone.
        </p>
      </div>
    </aside>
  );
};
