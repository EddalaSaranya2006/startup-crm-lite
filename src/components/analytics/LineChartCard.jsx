import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
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
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
        <p className="text-sm font-semibold text-emerald-600">{d.rate}% Conversion</p>
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

const LineChartCard = React.memo(({ data }) => {
  const { isDarkMode } = useTheme();

  const chartData = useMemo(
    () =>
      (data || []).map((item) => ({
        month: getShortMonthLabel(item.month),
        rawMonth: item.month,
        rate: parseFloat(item.rate) || 0,
      })),
    [data]
  );

  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Monthly Conversion Rate</h3>
        <div className="flex items-center justify-center h-72 text-slate-400 dark:text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  const avgRate = chartData.length
    ? (chartData.reduce((s, d) => s + d.rate, 0) / chartData.length).toFixed(1)
    : 0;
  const latestRate = chartData[chartData.length - 1]?.rate || 0;
  const peaked = Math.max(...chartData.map((d) => d.rate));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Monthly Conversion Rate</h3>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">Won ÷ Total leads per month</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-emerald-600">{latestRate}%</p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">{avgRate}% avg · {peaked}% peak</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22C55E" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#f1f5f9'} vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            axisLine={false}
            tickLine={false}
            width={36}
          />
          <Tooltip content={<CustomTooltip />} />
          {/* Average reference line */}
          <ReferenceLine
            y={parseFloat(avgRate)}
            stroke="#22C55E"
            strokeDasharray="5 4"
            strokeOpacity={0.4}
            strokeWidth={1.5}
          />
          <Area
            type="monotone"
            dataKey="rate"
            stroke="#22C55E"
            strokeWidth={3}
            fill="url(#convGrad)"
            dot={{ fill: '#22C55E', r: 5, strokeWidth: 2, stroke: isDarkMode ? '#1f2937' : '#fff' }}
            activeDot={{ r: 7, strokeWidth: 2, stroke: isDarkMode ? '#1f2937' : '#fff' }}
            animationDuration={900}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Avg line hint */}
      <div className="flex items-center gap-2 mt-3 text-xs text-slate-500 dark:text-gray-400">
        <div className="w-6 border-t-2 border-emerald-400 border-dashed" />
        <span>Average ({avgRate}%)</span>
      </div>
    </div>
  );
});

LineChartCard.displayName = 'LineChartCard';
export default LineChartCard;
