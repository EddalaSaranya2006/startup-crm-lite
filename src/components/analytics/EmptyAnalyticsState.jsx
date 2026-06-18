import React from 'react';
import { Plus, BarChart3 } from 'lucide-react';

const EmptyAnalyticsState = ({ onAddLead }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-gray-800 rounded-3xl border border-slate-200 dark:border-gray-700 shadow-sm min-h-[60vh]">
      <div className="w-24 h-24 mb-6 relative">
        <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse" />
        <div className="absolute inset-2 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100">
          <BarChart3 className="w-10 h-10 text-blue-500" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Analytics Data Yet</h2>
      <p className="text-slate-500 dark:text-gray-400 max-w-md mb-8">
        Your dashboard is looking a little empty. Start adding leads and moving them through your pipeline to see beautiful insights and charts here.
      </p>

      <button
        onClick={onAddLead}
        className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all"
      >
        <Plus className="w-5 h-5" />
        Add Your First Lead
      </button>

      <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl opacity-40 grayscale pointer-events-none">
        <div className="h-32 bg-slate-100 dark:bg-gray-800 rounded-2xl" />
        <div className="h-32 bg-slate-100 dark:bg-gray-800 rounded-2xl" />
        <div className="h-32 bg-slate-100 dark:bg-gray-800 rounded-2xl" />
      </div>
    </div>
  );
};

export default EmptyAnalyticsState;
