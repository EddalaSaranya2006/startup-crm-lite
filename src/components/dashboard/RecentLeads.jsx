
/**
 * @typedef {Object} Lead
 * @property {string|number} id - Unique identifier for the lead.
 * @property {string} name - Name of the lead contact.
 * @property {string} company - Name of the lead's company.
 * @property {string} status - Pipeline stage status (e.g., 'New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost').
 * @property {number} value - Financial value of the lead.
 * @property {string} dateAdded - ISO date string when the lead was added.
 */

/**
 * RecentLeads Component
 * Displays the latest 5 leads in a clean, tabular format.
 *
 * @component
 * @param {Object} props
 * @param {Lead[]} props.leads - Array of lead objects.
 * @returns {React.ReactElement} The RecentLeads component.
 */
const RecentLeads = ({ leads = [] }) => {
  // Sort leads by createdAt descending, then take the first 5
  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.createdAt || b.dateAdded) - new Date(a.createdAt || a.dateAdded))
    .slice(0, 5);

  // Status badge style mapping
  const statusBadgeStyles = {
    new: 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700',
    contacted: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800',
    'meeting scheduled': 'text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30 border border-sky-100 dark:border-sky-800',
    'proposal sent': 'text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800',
    won: 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800',
    lost: 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800',
  };

  /**
   * Helper function to format dates nicely.
   *
   * @param {string} dateString - ISO Date string.
   * @returns {string} Formatted date.
   */
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs dark:shadow-none overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Leads</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Track and monitor the latest additions to your pipeline</p>
        </div>
        <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-md border border-blue-200 dark:border-blue-800">
          Last 5 added
        </span>
      </div>

      <div className="overflow-hidden">
        <table className="w-full table-fixed text-left border-collapse">
          <colgroup>
            <col className="w-[28%]" />
            <col className="w-[28%]" />
            <col className="w-[18%]" />
            <col className="w-[13%]" />
            <col className="w-[13%]" />
          </colgroup>
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/70 border-b border-gray-100 dark:border-gray-800">
              <th className="px-3 py-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
              <th className="px-3 py-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Company</th>
              <th className="px-3 py-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-3 py-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Value</th>
              <th className="px-3 py-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date Added</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {recentLeads.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-400 dark:text-gray-500">
                  No leads available. Add some leads to get started.
                </td>
              </tr>
            ) : (
              recentLeads.map((lead) => {
                const normalizedStatus = (lead.status === 'Proposal' ? 'Proposal Sent' : lead.status || 'New').toLowerCase();
                const badgeStyle = statusBadgeStyles[normalizedStatus] || 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700';

                return (
                  <tr
                    key={lead.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors duration-150 group"
                  >
                    <td className="px-3 py-4 align-top">
                      <div className="text-xs font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors break-words">
                        {lead.name}
                      </div>
                      {lead.email && (
                        <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal mt-0.5 break-words">{lead.email}</div>
                      )}
                    </td>
                    <td className="px-3 py-4 align-top text-xs text-gray-600 dark:text-gray-400 break-words">{lead.company}</td>
                    <td className="px-3 py-4 align-top">
                      <span className={`inline-flex max-w-full items-center px-2 py-1 rounded-full text-[10px] leading-tight font-medium whitespace-normal ${badgeStyle}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-3 py-4 align-top text-xs font-semibold text-gray-900 dark:text-white font-roboto whitespace-nowrap">
                      ${(lead.value || 0).toLocaleString()}
                    </td>
                    <td className="px-3 py-4 align-top text-[11px] leading-snug text-gray-500 dark:text-gray-400">{formatDate(lead.createdAt || lead.dateAdded)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentLeads;
