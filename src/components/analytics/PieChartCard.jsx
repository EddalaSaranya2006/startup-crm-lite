import React, { useState, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
import { STATUS_COLORS } from '../../constants/analyticsColors';
import { useTheme } from '../../context/ThemeContext';

// ── Active (hovered) slice with outer ring ────────────────────────────────────

const ActiveSlice = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 5}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={outerRadius + 14}
        outerRadius={outerRadius + 18}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.5}
      />
    </g>
  );
};

// ── Custom tooltip ────────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const color = STATUS_COLORS[d.name] || '#94A3B8';
  return (
    <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl shadow-xl border border-slate-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
        <p className="font-bold text-slate-900 dark:text-white text-sm">{d.name}</p>
      </div>
      <p className="text-slate-600 dark:text-gray-400 text-sm">{d.value} Leads</p>
      <p className="text-slate-400 dark:text-gray-500 text-xs">{d.percentage}% of total</p>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

const PieChartCard = ({ data, totalLeads }) => {
  const { isDarkMode } = useTheme();
  const [activeIndex, setActiveIndex] = useState(null);

  const onEnter = useCallback((_, index) => setActiveIndex(index), []);
  const onLeave = useCallback(() => setActiveIndex(null), []);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Lead Status Distribution</h3>
        <div className="flex flex-col items-center justify-center h-80 text-slate-400 dark:text-gray-500 gap-3">
          <div className="w-16 h-16 bg-slate-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-3xl">
            🥧
          </div>
          <p className="text-sm">No data available</p>
        </div>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.status,
    value: item.count,
    percentage: item.percentage,
  }));

  const hovered = activeIndex !== null ? chartData[activeIndex] : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Lead Status Distribution</h3>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">Hover a slice to inspect</p>
        </div>
        <span className="text-xs font-semibold text-slate-500 dark:text-gray-400 bg-slate-100 dark:bg-gray-800 px-3 py-1 rounded-full">
          {chartData.length} stages
        </span>
      </div>

      {/* Doughnut chart */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={72}
              outerRadius={110}
              paddingAngle={3}
              dataKey="value"
              activeIndex={activeIndex ?? undefined}
              activeShape={ActiveSlice}
              onMouseEnter={onEnter}
              onMouseLeave={onLeave}
              animationBegin={0}
              animationDuration={900}
            >
              {chartData.map((entry, i) => (
                <Cell
                  key={`cell-${i}`}
                  fill={STATUS_COLORS[entry.name] || '#94A3B8'}
                  stroke={isDarkMode ? '#1f2937' : 'white'}
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label (dynamic on hover) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center transition-all duration-200">
            <p className="text-3xl font-bold text-slate-900 dark:text-white leading-none">
              {hovered ? hovered.value : totalLeads}
            </p>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 max-w-[80px] leading-tight">
              {hovered ? hovered.name : 'Total Leads'}
            </p>
          </div>
        </div>
      </div>

      {/* Legend grid */}
      <div className="mt-4 grid grid-cols-2 gap-1.5">
        {chartData.map((entry) => {
          const color = STATUS_COLORS[entry.name] || '#94A3B8';
          return (
            <div
              key={entry.name}
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors cursor-default"
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-slate-600 dark:text-gray-400 flex-1 truncate">{entry.name}</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">{entry.value}</span>
              <span className="text-xs text-slate-400 dark:text-gray-500">({entry.percentage}%)</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PieChartCard;
