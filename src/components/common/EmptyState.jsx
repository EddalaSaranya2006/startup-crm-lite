import { SearchX, UsersRound } from 'lucide-react';

const EmptyState = ({ hasLeads = false, onClearFilters }) => {
  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 px-6 py-12 text-center shadow-xs dark:shadow-none">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
        {hasLeads ? <SearchX className="h-6 w-6" /> : <UsersRound className="h-6 w-6" />}
      </div>
      <h3 className="text-base font-bold text-gray-900 dark:text-white">No leads found</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
        {hasLeads
          ? 'No leads match your current search or filter. Try clearing filters to see the full list.'
          : 'There are no leads yet. Add your first lead to start building your pipeline.'}
      </p>
      {hasLeads && onClearFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:shadow-md dark:shadow-none cursor-pointer min-h-[44px]"
        >
          Clear filters
        </button>
      )}
    </div>
  );
};

export default EmptyState;
