
/**
 * @typedef {Object} Lead
 * @property {string|number} id - Unique identifier for the lead.
 * @property {string} name - Name of the lead contact.
 * @property {string} company - Name of the lead's company.
 * @property {'New' | 'Contacted' | 'Meeting Scheduled' | 'Proposal Sent' | 'Won' | 'Lost'} status - Pipeline stage status.
 * @property {number} value - Financial value of the lead.
 * @property {string} dateAdded - Date when the lead was added.
 */

/**
 * PipelineOverview Component
 * Renders a visual horizontal bar with colored segments representing the distribution of leads across different statuses.
 *
 * @component
 * @param {Object} props
 * @param {Lead[]} props.leads - Array of lead objects.
 * @returns {React.ReactElement} The PipelineOverview component.
 */
const PipelineOverview = ({ leads = [] }) => {
  // Define configuration for pipeline statuses
  const STATUS_CONFIG = {
    New: { label: 'New', colorClass: 'bg-primary', textClass: 'text-primary', badgeClass: 'bg-primary/10 text-primary border-primary/20' },
    Contacted: { label: 'Contacted', colorClass: 'bg-warning', textClass: 'text-warning', badgeClass: 'bg-warning/10 text-warning border-warning/20' },
    'Meeting Scheduled': { label: 'Meeting Scheduled', colorClass: 'bg-sky-500', textClass: 'text-sky-600', badgeClass: 'bg-sky-50 text-sky-600 border-sky-100' },
    'Proposal Sent': { label: 'Proposal Sent', colorClass: 'bg-indigo-500', textClass: 'text-indigo-600', badgeClass: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
    Won: { label: 'Won', colorClass: 'bg-success', textClass: 'text-success', badgeClass: 'bg-success/10 text-success border-success/20' },
    Lost: { label: 'Lost', colorClass: 'bg-danger', textClass: 'text-danger', badgeClass: 'bg-danger/10 text-danger border-danger/20' },
  };

  const totalLeads = leads.length;

  // Calculate lead count and value per status
  const statusSummary = leads.reduce((acc, lead) => {
    const status = lead.status === 'Proposal' ? 'Proposal Sent' : lead.status || 'New';
    const matchedKey = Object.keys(STATUS_CONFIG).find(
      (key) => key.toLowerCase() === status.toLowerCase()
    ) || 'New';

    if (!acc[matchedKey]) {
      acc[matchedKey] = { count: 0, value: 0 };
    }
    acc[matchedKey].count += 1;
    acc[matchedKey].value += lead.value || 0;
    return acc;
  }, {});

  // Initialize summary for all configured statuses
  Object.keys(STATUS_CONFIG).forEach((key) => {
    if (!statusSummary[key]) {
      statusSummary[key] = { count: 0, value: 0 };
    }
  });

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Pipeline Stage Distribution</h3>
          <p className="text-sm text-gray-500">Distribution of {totalLeads} leads across active deal stages</p>
        </div>
        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
          Active Pipeline
        </span>
      </div>

      {/* Visual Horizontal Segments Bar */}
      <div className="h-6 w-full bg-gray-100 rounded-full overflow-hidden flex mb-6 shadow-inner">
        {totalLeads === 0 ? (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">
            No leads in pipeline
          </div>
        ) : (
          Object.entries(STATUS_CONFIG).map(([key, config]) => {
            const count = statusSummary[key]?.count || 0;
            const percentage = totalLeads > 0 ? (count / totalLeads) * 100 : 0;
            if (percentage === 0) return null;

            return (
              <div
                key={key}
                style={{ width: `${percentage}%` }}
                className={`${config.colorClass} h-full transition-all duration-500 hover:opacity-90 relative group`}
              >
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10 bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                  {config.label}: {count} ({percentage.toFixed(0)}%)
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Grid List for Details */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {Object.entries(STATUS_CONFIG).map(([key, config]) => {
          const stats = statusSummary[key];
          const count = stats?.count || 0;
          const value = stats?.value || 0;
          const percentage = totalLeads > 0 ? (count / totalLeads) * 100 : 0;

          return (
            <div
              key={key}
              className="p-3 bg-gray-50/50 rounded-xl border border-gray-100 flex flex-col justify-between hover:bg-gray-50 transition-colors"
            >
              <div>
                <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium ${config.badgeClass} mb-2`}>
                  {config.label}
                </span>
                <div className="text-xl font-bold text-gray-900 font-roboto">{count}</div>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500 border-t border-gray-100/50 pt-2">
                <span>{percentage.toFixed(0)}%</span>
                <span className="font-medium text-gray-700">
                  ${value.toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineOverview;
