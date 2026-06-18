import { SearchX, UsersRound } from 'lucide-react';

const EmptyState = ({ hasLeads = false, onClearFilters }) => {
  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 px-6 py-12 text-center shadow-xs dark:shadow-none">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/5 text-primary">
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
          className="mt-5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary/95 hover:shadow-md cursor-pointer"
        >
          Clear filters
        </button>
      )}
    </div>
  );
};

export default EmptyState;
