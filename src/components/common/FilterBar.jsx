const FILTERS = ['All', 'New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];

const FilterBar = ({ activeFilter, onFilterChange, leads = [] }) => {
  const counts = FILTERS.reduce((acc, filter) => {
    acc[filter] =
      filter === 'All'
        ? leads.length
        : leads.filter((lead) => lead.status === filter).length;
    return acc;
  }, {});

  return (
    <div
      className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1"
      aria-label="Filter leads by status"
    >
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter;

        return (
          <button
            key={filter}
            type="button"
            onClick={() => onFilterChange(filter)}
            className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap min-h-[44px] flex-shrink-0 ${
              isActive
                ? 'border-blue-600 bg-blue-600 text-white shadow-sm dark:shadow-none shadow-blue-600/30'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
            aria-pressed={isActive}
          >
            {filter} ({counts[filter] || 0})
          </button>
        );
      })}
    </div>
  );
};

export default FilterBar;

