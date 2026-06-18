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
      iconBg: 'from-blue-500 to-blue-600',
      shadow: 'shadow-blue-100',
      accent: 'bg-blue-50 border-blue-100',
    },
    green: {
      iconBg: 'from-emerald-500 to-green-600',
      shadow: 'shadow-emerald-100',
      accent: 'bg-emerald-50 border-emerald-100',
    },
    purple: {
      iconBg: 'from-violet-500 to-purple-600',
      shadow: 'shadow-violet-100',
      accent: 'bg-violet-50 border-violet-100',
    },
    cyan: {
      iconBg: 'from-cyan-500 to-sky-600',
      shadow: 'shadow-cyan-100',
      accent: 'bg-cyan-50 border-cyan-100',
    },
    amber: {
      iconBg: 'from-amber-400 to-orange-500',
      shadow: 'shadow-amber-100',
      accent: 'bg-amber-50 border-amber-100',
    },
    red: {
      iconBg: 'from-rose-500 to-red-600',
      shadow: 'shadow-rose-100',
      accent: 'bg-rose-50 border-rose-100',
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
                ? 'bg-green-100 text-green-700 border-green-200'
                : 'bg-red-100 text-red-700 border-red-200'
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
});

StatsCards.displayName = 'StatsCards';
export default StatsCards;
