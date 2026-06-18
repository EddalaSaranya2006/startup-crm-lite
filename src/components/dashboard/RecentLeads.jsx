
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
    new: 'text-primary bg-primary/10 border border-primary/20',
    contacted: 'text-warning bg-warning/10 border border-warning/20',
    'meeting scheduled': 'text-sky-600 bg-sky-50 border border-sky-100',
    'proposal sent': 'text-indigo-600 bg-indigo-50 border border-indigo-100',
    won: 'text-success bg-success/10 border border-success/20',
    lost: 'text-danger bg-danger/10 border border-danger/20',
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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Recent Leads</h3>
          <p className="text-sm text-gray-500">Track and monitor the latest additions to your pipeline</p>
        </div>
        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-md">
          Last 5 added
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Value</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date Added</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {recentLeads.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-400">
                  No leads available. Add some leads to get started.
                </td>
              </tr>
            ) : (
              recentLeads.map((lead) => {
                const normalizedStatus = (lead.status === 'Proposal' ? 'Proposal Sent' : lead.status || 'New').toLowerCase();
                const badgeStyle = statusBadgeStyles[normalizedStatus] || 'text-gray-600 bg-gray-100 border-gray-200';

                return (
                  <tr
                    key={lead.id}
                    className="hover:bg-gray-50/80 transition-colors duration-150 group"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">
                        {lead.name}
                      </div>
                      {lead.email && (
                        <div className="text-xs text-gray-400 font-normal mt-0.5">{lead.email}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{lead.company}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${badgeStyle}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 font-roboto">
                      ${(lead.value || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(lead.createdAt || lead.dateAdded)}</td>
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
