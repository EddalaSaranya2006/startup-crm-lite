import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

/**
 * @typedef {Object} Lead
 * @property {string|number} id - Unique identifier for the lead.
 * @property {string} name - Name of the lead contact.
 * @property {string} company - Name of the lead's company.
 * @property {string} email - Email address of the lead.
 * @property {string} [phone] - Phone number of the lead.
 * @property {string} status - Pipeline stage status.
 * @property {string} [source] - Marketing source of the lead.
 * @property {number} [value] - Deal value.
 * @property {string} dateAdded - ISO date string when the lead was added.
 */

/**
 * LeadTable Component
 * Displays the list of leads in a clean, professional, table layout with edit and delete operations.
 *
 * @component
 * @param {Object} props
 * @param {Lead[]} props.leads - Array of lead objects to render.
 * @param {Function} props.onEdit - Callback when the edit action is clicked.
 * @param {Function} props.onDelete - Callback when the delete action is clicked.
 * @returns {React.ReactElement} The LeadTable component.
 */
const LeadTable = ({ leads = [], onEdit, onDelete }) => {
  /**
   * Helper function to format ISO date strings.
   *
   * @param {string} dateString
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
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/70 border-b border-gray-100 dark:border-gray-800">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Company</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date Added</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {leads.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-10 text-center text-sm text-gray-400 dark:text-gray-500">
                  No leads found matching your criteria.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150 group">
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                      {lead.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{lead.company}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    <a
                      href={`mailto:${lead.email}`}
                      className="hover:underline hover:text-primary transition-colors truncate block max-w-[200px]"
                      aria-label={`Email ${lead.name}`}
                    >
                      {lead.email}
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 px-2.5 py-1 rounded-md border border-gray-100 dark:border-gray-800">
                      {lead.source || 'Website'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{formatDate(lead.dateAdded)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(lead)}
                        className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg border border-transparent hover:border-primary/10 transition-all cursor-pointer"
                        aria-label={`Edit lead ${lead.name}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(lead.id)}
                        className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-danger hover:bg-danger/5 rounded-lg border border-transparent hover:border-danger/10 transition-all cursor-pointer"
                        aria-label={`Delete lead ${lead.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadTable;
