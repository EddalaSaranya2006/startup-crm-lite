import React from 'react';
import { TrendingUp, Sparkles, AlertCircle } from 'lucide-react';
import { formatCompactCurrency, formatCurrency } from '../../utils/analyticsHelpers';

const ForecastCard = ({ forecast }) => {
  const { forecast: projected, growthRate, confidence } = forecast || {};

  if (!forecast) return null;

  const isPositive = growthRate >= 0;

  return (
    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-48 h-48 rounded-full bg-white dark:bg-gray-800 opacity-10 blur-2xl" />
      <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-emerald-900 opacity-20 blur-xl" />

      <div className="relative z-10 flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-emerald-200" />
            <h3 className="text-lg font-bold">Revenue Forecast</h3>
          </div>
          <p className="text-sm text-emerald-100 opacity-90">Projected for next 30 days</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">{formatCompactCurrency(projected)}</p>
          <p className="text-xs text-emerald-200 font-medium">Expected</p>
        </div>
      </div>

      <div className="relative z-10 flex gap-4 bg-white/15 dark:bg-gray-800/10 backdrop-blur-sm rounded-xl p-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isPositive ? 'bg-white/20 dark:bg-gray-800/20' : 'bg-red-500/20'}`}>
            <TrendingUp className={`w-5 h-5 ${isPositive ? 'text-white' : 'text-red-200 rotate-180'}`} />
          </div>
          <div>
            <p className="text-xs font-medium text-emerald-100 uppercase tracking-wider">Growth Trend</p>
            <p className="text-lg font-bold">{isPositive ? '+' : ''}{growthRate}%</p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-l border-white/20 pl-4">
          <div className="p-2 rounded-lg bg-white/20 dark:bg-gray-800/20">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs font-medium text-emerald-100 uppercase tracking-wider">Confidence</p>
            <p className="text-lg font-bold">{confidence}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastCard;
