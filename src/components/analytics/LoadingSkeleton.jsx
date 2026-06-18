import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="animate-pulse p-6">
      <div className="h-10 w-64 bg-slate-200 dark:bg-gray-700 rounded-lg mb-8" />
      
      <div className="h-16 w-full bg-slate-200 dark:bg-gray-700 rounded-2xl mb-8" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-32 bg-slate-200 dark:bg-gray-700 rounded-2xl" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="h-80 bg-slate-200 dark:bg-gray-700 rounded-2xl" />
        <div className="h-80 bg-slate-200 dark:bg-gray-700 rounded-2xl" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 bg-slate-200 dark:bg-gray-700 rounded-2xl" />
        <div className="h-80 bg-slate-200 dark:bg-gray-700 rounded-2xl" />
      </div>
    </div>
  );
};

export default LoadingSkeleton;
