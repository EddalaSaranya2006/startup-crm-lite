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
    <div className="flex flex-wrap items-center gap-2" aria-label="Filter leads by status">
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter;

        return (
          <button
            key={filter}
            type="button"
            onClick={() => onFilterChange(filter)}
            className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer ${
              isActive
                ? 'border-primary bg-primary text-white shadow-xs shadow-primary/20'
                : 'border-gray-200 bg-white text-gray-600 hover:border-primary/30 hover:bg-primary/5 hover:text-primary'
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
