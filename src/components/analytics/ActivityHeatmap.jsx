import React from 'react';

const getColor = (count) => {
  if (count === 0) return 'bg-slate-100 dark:bg-gray-800';
  if (count === 1) return 'bg-blue-200';
  if (count === 2) return 'bg-blue-300';
  if (count <= 4) return 'bg-blue-400';
  if (count <= 7) return 'bg-blue-500';
  return 'bg-blue-600';
};

const ActivityHeatmap = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Activity Heatmap</h3>
        <div className="flex items-center justify-center h-[200px] text-slate-400 dark:text-gray-500">
          No activity data available
        </div>
      </div>
    );
  }

  // The data comes as a flat array of 91 days.
  // Group into columns of 7 days (representing weeks).
  const weeks = [];
  let currentWeek = [];

  data.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === data.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const totalActions = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Activity Heatmap</h3>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">Lead interactions over the last 90 days</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-slate-900 dark:text-white">{totalActions}</p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">Total Actions</p>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex gap-1.5 min-w-max">
          {weeks.map((week, wIndex) => (
            <div key={wIndex} className="flex flex-col gap-1.5">
              {week.map((day, dIndex) => (
                <div
                  key={day.date}
                  title={`${day.date}: ${day.count} actions`}
                  className={`w-3.5 h-3.5 rounded-sm ${getColor(day.count)} cursor-pointer hover:ring-2 hover:ring-slate-400 hover:ring-offset-1 transition-all`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 mt-4 text-xs text-slate-500 dark:text-gray-400">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-slate-100 dark:bg-gray-800" />
          <div className="w-3 h-3 rounded-sm bg-blue-200" />
          <div className="w-3 h-3 rounded-sm bg-blue-400" />
          <div className="w-3 h-3 rounded-sm bg-blue-600" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

export default ActivityHeatmap;
