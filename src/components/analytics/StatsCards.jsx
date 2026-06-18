import React, { useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Briefcase,
  CheckCircle,
  Clock,
  XCircle,
  Target,
} from 'lucide-react';
import { formatCurrency } from '../../utils/analyticsHelpers';

// ── Individual stat card ──────────────────────────────────────────────────────

const StatCard = ({ title, value, icon: Icon, trend, scheme, suffix }) => {
  const schemes = {
    blue: {
      iconBg: 'from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700',
      shadow: 'shadow-blue-100 dark:shadow-blue-900/20',
      accent: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800',
    },
    green: {
      iconBg: 'from-emerald-500 to-green-600 dark:from-emerald-600 dark:to-green-700',
      shadow: 'shadow-emerald-100 dark:shadow-emerald-900/20',
      accent: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800',
    },
    purple: {
      iconBg: 'from-violet-500 to-purple-600 dark:from-violet-600 dark:to-purple-700',
      shadow: 'shadow-violet-100 dark:shadow-violet-900/20',
      accent: 'bg-violet-50 dark:bg-violet-900/20 border-violet-100 dark:border-violet-800',
    },
    cyan: {
      iconBg: 'from-cyan-500 to-sky-600 dark:from-cyan-600 dark:to-sky-700',
      shadow: 'shadow-cyan-100 dark:shadow-cyan-900/20',
      accent: 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-100 dark:border-cyan-800',
    },
    amber: {
      iconBg: 'from-amber-400 to-orange-500 dark:from-amber-500 dark:to-orange-600',
      shadow: 'shadow-amber-100 dark:shadow-amber-900/20',
      accent: 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800',
    },
    red: {
      iconBg: 'from-rose-500 to-red-600 dark:from-rose-600 dark:to-red-700',
      shadow: 'shadow-rose-100 dark:shadow-rose-900/20',
      accent: 'bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800',
    },
  };

  const s = schemes[scheme] || schemes.blue;
  const trendUp = trend >= 0;

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-default overflow-hidden">
      {/* Subtle corner glow */}
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${s.iconBg} opacity-5 group-hover:opacity-10 transition-opacity`} />

      <div className="relative flex items-start justify-between mb-5">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest mb-2">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight truncate">
            {value}
            {suffix && (
              <span className="text-xl font-semibold text-slate-400 dark:text-gray-500 ml-1.5">{suffix}</span>
            )}
          </h3>
        </div>

        <div
          className={`p-3.5 rounded-2xl bg-gradient-to-br ${s.iconBg} shadow-lg ${s.shadow} flex-shrink-0 ml-3`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>

      {trend !== undefined && (
        <div className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
              trendUp
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
            }`}
          >
            {trendUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {Math.abs(trend).toFixed(1)}%
          </span>
          <span className="text-xs text-slate-400 dark:text-gray-500">vs last period</span>
        </div>
      )}
    </div>
  );
};

// ── Grid of 6 KPI cards ───────────────────────────────────────────────────────

const StatsCards = React.memo(({ stats }) => {
  const { totalLeads, conversionRate, pipelineValue, wonRevenue, averageSalesCycle, lostRate } =
    stats;

  const cards = useMemo(
    () => [
      {
        title: 'Total Leads',
        value: totalLeads,
        icon: Users,
        scheme: 'blue',
        trend: 12.5,
      },
      {
        title: 'Conversion Rate',
        value: `${conversionRate}%`,
        icon: Target,
        scheme: 'green',
        trend: 5.2,
      },
      {
        title: 'Pipeline Value',
        value: formatCurrency(pipelineValue),
        icon: Briefcase,
        scheme: 'purple',
        trend: 8.1,
      },
      {
        title: 'Won Revenue',
        value: formatCurrency(wonRevenue),
        icon: CheckCircle,
        scheme: 'cyan',
        trend: 15.3,
      },
      {
        title: 'Avg Sales Cycle',
        value: averageSalesCycle || '—',
        icon: Clock,
        scheme: 'amber',
        suffix: averageSalesCycle ? 'days' : '',
        trend: -2.1,
      },
      {
        title: 'Lost Rate',
        value: `${lostRate}%`,
        icon: XCircle,
        scheme: 'red',
        trend: -3.4,
      },
    ],
    [totalLeads, conversionRate, pipelineValue, wonRevenue, averageSalesCycle, lostRate]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-6">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
});

StatsCards.displayName = 'StatsCards';
export default StatsCards;
