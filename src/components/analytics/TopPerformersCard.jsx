import React, { useState } from 'react';
import { Trophy, Target, Users } from 'lucide-react';
import { formatCompactCurrency } from '../../utils/analyticsHelpers';
import { PALETTE } from '../../constants/analyticsColors';

const TopPerformersCard = ({ performers, prospectors }) => {
  const [activeTab, setActiveTab] = useState('closers'); // 'closers' | 'prospectors'

  const activeData = activeTab === 'closers' ? performers : prospectors;
  const hasData = activeData && activeData.length > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {/* Header & Tabs */}
      <div className="p-6 pb-4 border-b border-slate-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Top Performers</h3>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">Leaderboard by role activity</p>
          </div>
          <div className="p-2 bg-amber-50 rounded-lg">
            <Trophy className="w-5 h-5 text-amber-500" />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('closers')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'closers'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-50 dark:bg-gray-900 text-slate-600 dark:text-gray-400 hover:bg-slate-100'
            }`}
          >
            <Target className="w-4 h-4" />
            Top Closers
          </button>
          <button
            onClick={() => setActiveTab('prospectors')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'prospectors'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-50 dark:bg-gray-900 text-slate-600 dark:text-gray-400 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            Top Prospectors
          </button>
        </div>
      </div>

      {/* List */}
      <div className="p-6 flex-1">
        {!hasData ? (
          <div className="flex items-center justify-center h-48 text-slate-400 dark:text-gray-500">
            No performance data available
          </div>
        ) : (
          <div className="space-y-4">
            {activeData.map((performer, index) => {
              const color = PALETTE[index % PALETTE.length];
              const pctOfMax = Math.max(5, performer.percentage); // Minimum 5% to always show a bar
              
              return (
                <div key={performer.name} className="group">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm font-semibold text-slate-700 dark:text-gray-300 flex items-center gap-2">
                        {performer.name}
                        {index === 0 && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-md">
                            #1
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {activeTab === 'closers'
                          ? formatCompactCurrency(performer.revenue)
                          : performer.count}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-gray-500 w-16 text-right">
                        {activeTab === 'closers' ? `${performer.wins} Wins` : 'Active'}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar resembling Lead Sources */}
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
        )}
      </div>
    </div>
  );
};

export default TopPerformersCard;
