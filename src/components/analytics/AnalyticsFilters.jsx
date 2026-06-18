import { Calendar } from 'lucide-react';
import { useState, useCallback } from 'react';

const PRESETS = [
  { label: 'Last 7 Days', value: '7days' },
  { label: 'Last 30 Days', value: '30days' },
  { label: 'Last 90 Days', value: '90days' },
  { label: 'This Year', value: 'thisYear' },
  { label: 'All Time', value: 'allTime' },
];

const AnalyticsFilters = ({ onDateRangeChange, currentPreset }) => {
  const [customRange, setCustomRange] = useState({ start: '', end: '' });
  const [showCustom, setShowCustom] = useState(false);

  const handlePreset = useCallback(
    (value) => {
      setShowCustom(false);
      onDateRangeChange(value, null);
    },
    [onDateRangeChange]
  );

  const handleCustomToggle = useCallback(() => {
    setShowCustom((prev) => !prev);
  }, []);

  const handleCustomChange = useCallback(
    (start, end) => {
      setCustomRange({ start, end });
      if (start && end) {
        onDateRangeChange('custom', { start: new Date(start), end: new Date(end) });
      }
    },
    [onDateRangeChange]
  );

  const activeLabel =
    currentPreset === 'custom' && customRange.start && customRange.end
      ? `${customRange.start} → ${customRange.end}`
      : (PRESETS.find((p) => p.value === currentPreset)?.label ?? 'All Time');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm mb-6 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 md:p-5">
        {/* Left: icon + label */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg shrink-0">
            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-gray-200">Date Range</p>
            <p className="text-xs text-slate-500 dark:text-gray-400">{activeLabel}</p>
          </div>
        </div>

        {/* Right: preset buttons — scrollable on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
          {PRESETS.map((preset) => {
            const isActive = currentPreset === preset.value && !showCustom;
            return (
              <button
                key={preset.value}
                onClick={() => handlePreset(preset.value)}
                className={`px-3 md:px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 min-h-[44px] ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-200 scale-[1.02]'
                    : 'bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
          <button
            onClick={handleCustomToggle}
            className={`px-3 md:px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 min-h-[44px] ${
              showCustom
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                : 'bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Custom Range
          </button>
        </div>
      </div>

      {/* Collapsible custom range picker */}
      {showCustom && (
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 px-4 md:px-5 pb-5 pt-0 border-t border-slate-100 dark:border-gray-700">
          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
              Start Date
            </label>
            <input
              type="date"
              value={customRange.start}
              onChange={(e) => handleCustomChange(e.target.value, customRange.end)}
              className="w-full sm:w-auto px-3 py-2.5 border border-slate-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-700 dark:text-gray-300 bg-slate-50 dark:bg-gray-900 min-h-[44px]"
            />
          </div>
          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
              End Date
            </label>
            <input
              type="date"
              value={customRange.end}
              onChange={(e) => handleCustomChange(customRange.start, e.target.value)}
              className="w-full sm:w-auto px-3 py-2.5 border border-slate-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-700 dark:text-gray-300 bg-slate-50 dark:bg-gray-900 min-h-[44px]"
            />
          </div>
          {customRange.start && customRange.end && (
            <div className="mt-4 flex items-end">
              <div className="px-3 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-xs font-medium text-green-700 dark:text-green-400">
                ✓ Range applied
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalyticsFilters;

