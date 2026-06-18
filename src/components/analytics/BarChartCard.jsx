import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { getShortMonthLabel, getLongMonthLabel } from '../../utils/analyticsHelpers';
import { useTheme } from '../../context/ThemeContext';

// ── Custom tooltip ────────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl shadow-xl border border-slate-200 dark:border-gray-700">
      <p className="font-bold text-slate-900 dark:text-white text-sm mb-1.5">{getLongMonthLabel(d.rawMonth)}</p>
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
        <p className="text-sm font-semibold text-blue-600">{d.count} Leads</p>
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

const BarChartCard = React.memo(({ data }) => {
  const { isDarkMode } = useTheme();
  
  const chartData = useMemo(
    () =>
      (data || []).map((item) => ({
        month: getShortMonthLabel(item.month),
        rawMonth: item.month,
        count: item.count,
      })),
    [data]
  );

  const maxCount = useMemo(
    () => Math.max(...chartData.map((d) => d.count), 1),
    [chartData]
  );

  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Monthly Leads Trend</h3>
        <div className="flex items-center justify-center h-72 text-slate-400 dark:text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  const totalLeads = chartData.reduce((s, d) => s + d.count, 0);
  const avgLeads = (totalLeads / chartData.length).toFixed(1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Monthly Leads Trend</h3>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">Last 6 months</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalLeads}</p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">{avgLeads} avg / mo</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} barSize={38} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#f1f5f9'} vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: isDarkMode ? '#1e293b' : '#f8fafc', radius: 8 }} />
          <Bar dataKey="count" radius={[8, 8, 0, 0]} animationDuration={800}>
            {chartData.map((entry, i) => (
              <Cell
                key={`cell-${i}`}
                fill={entry.count === maxCount ? '#2563EB' : (isDarkMode ? '#3b82f6' : '#BFDBFE')}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend hint */}
      <div className="flex items-center gap-4 mt-3 text-xs text-slate-500 dark:text-gray-400">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-blue-600" />
          <span>Peak month</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-blue-200" />
          <span>Other months</span>
        </div>
      </div>
    </div>
  );
});

BarChartCard.displayName = 'BarChartCard';
export default BarChartCard;
