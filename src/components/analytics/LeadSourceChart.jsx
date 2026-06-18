import React from 'react';
import { SOURCE_COLORS } from '../../constants/analyticsColors';

const LeadSourceChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Top Lead Sources</h3>
        <div className="flex items-center justify-center h-72 text-slate-400 dark:text-gray-500">
          No source data available
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Top Lead Sources</h3>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">Where your leads are coming from</p>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((item, index) => {
          const color = SOURCE_COLORS[item.source] || SOURCE_COLORS.Other;
          const pctOfMax = (item.count / maxCount) * 100;

          return (
            <div key={item.source} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm font-semibold text-slate-700 dark:text-gray-300">{item.source}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{item.count}</span>
                  <span className="text-xs text-slate-400 dark:text-gray-500 ml-1.5">({item.percentage}%)</span>
                </div>
              </div>
              
              <div className="h-2 w-full bg-slate-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${pctOfMax}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeadSourceChart;
