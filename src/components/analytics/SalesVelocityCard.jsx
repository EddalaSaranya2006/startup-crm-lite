import React from 'react';
import { Target, Zap, Clock, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/analyticsHelpers';

const SalesVelocityCard = ({ velocity }) => {
  const { velocity: v, winRate, avgDealSize, salesCycle } = velocity || {};

  if (!velocity) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-48 h-48 rounded-full bg-white dark:bg-gray-800 opacity-10 blur-2xl" />
      <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-indigo-900 opacity-20 blur-xl" />

      <div className="relative z-10 flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-5 h-5 text-indigo-200" />
            <h3 className="text-lg font-bold">Sales Velocity</h3>
          </div>
          <p className="text-sm text-indigo-100 opacity-90">Expected daily revenue generation</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">{formatCurrency(v)}</p>
          <p className="text-xs text-indigo-200 font-medium">per day</p>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-3 gap-4 bg-white dark:bg-gray-800/10 backdrop-blur-sm rounded-xl p-4">
        <div>
          <div className="flex items-center gap-1.5 mb-1 text-indigo-100">
            <Target className="w-3.5 h-3.5" />
            <span className="text-xs font-medium uppercase tracking-wider">Win Rate</span>
          </div>
          <p className="text-lg font-bold">{winRate}%</p>
        </div>
        <div>
          <div className="flex items-center gap-1.5 mb-1 text-indigo-100">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="text-xs font-medium uppercase tracking-wider">Avg Deal</span>
          </div>
          <p className="text-lg font-bold">{formatCurrency(avgDealSize)}</p>
        </div>
        <div>
          <div className="flex items-center gap-1.5 mb-1 text-indigo-100">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-medium uppercase tracking-wider">Cycle</span>
          </div>
          <p className="text-lg font-bold">{salesCycle} <span className="text-sm font-normal text-indigo-200">days</span></p>
        </div>
      </div>
    </div>
  );
};

export default SalesVelocityCard;
