import { Pencil, Trash2, Mail, Phone, Tag } from 'lucide-react';
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
 * LeadCard Component
 * Displays a single lead in a structured card view with edit and delete actions.
 *
 * @component
 * @param {Object} props
 * @param {Lead} props.lead - The lead object to display.
 * @param {Function} props.onEdit - Callback function when the edit button is clicked.
 * @param {Function} props.onDelete - Callback function when the delete button is clicked.
 * @returns {React.ReactElement} The LeadCard component.
 */
const LeadCard = ({ lead, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 flex flex-col justify-between h-full group">
      <div>
        {/* Header containing name and status */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h4 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors">
              {lead.name}
            </h4>
            <p className="text-xs text-gray-500 font-medium">{lead.company}</p>
          </div>
          <StatusBadge status={lead.status} />
        </div>

        {/* Lead Contact Info */}
        <div className="space-y-2 mt-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <a
              href={`mailto:${lead.email}`}
              className="hover:underline hover:text-primary transition-colors truncate block max-w-full"
              aria-label={`Email ${lead.name}`}
            >
              {lead.email}
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400" />
            {lead.phone ? (
              <span className="font-roboto">{lead.phone}</span>
            ) : (
              <span className="text-gray-400 italic">No phone provided</span>
            )}
          </div>

          {lead.source && (
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg w-fit mt-1 border border-gray-100">
              <Tag className="w-3.5 h-3.5 text-gray-400" />
              <span>Source: {lead.source}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 mt-5 pt-4">
        {lead.value !== undefined && lead.value > 0 ? (
          <span className="text-sm font-semibold text-gray-900">
            ${lead.value.toLocaleString()}
          </span>
        ) : (
          <span className="text-xs text-gray-400 italic">No value</span>
        )}

        <div className="flex items-center gap-2">
          {/* Edit Button */}
          <button
            onClick={() => onEdit(lead)}
            className="p-2 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-xl border border-transparent hover:border-primary/10 transition-all cursor-pointer"
            aria-label={`Edit lead ${lead.name}`}
          >
            <Pencil className="w-4 h-4" />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(lead.id)}
            className="p-2 text-gray-500 hover:text-danger hover:bg-danger/5 rounded-xl border border-transparent hover:border-danger/10 transition-all cursor-pointer"
            aria-label={`Delete lead ${lead.name}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadCard;
