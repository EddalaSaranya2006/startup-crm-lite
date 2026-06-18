
/**
 * StatusBadge Component
 * Renders a pill-shaped colored badge corresponding to the lead's status.
 *
 * @component
 * @param {Object} props
 * @param {string} props.status - The current status of the lead.
 * @returns {React.ReactElement} The StatusBadge component.
 */
const StatusBadge = ({ status }) => {
  const statusConfig = {
    'new': 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700',
    'contacted': 'bg-blue-50 text-blue-700 border-blue-200/60',
    'meeting scheduled': 'bg-purple-50 text-purple-700 border-purple-200/60',
    'proposal sent': 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
    'won': 'bg-success/10 text-success border-success/20',
    'lost': 'bg-danger/10 text-danger border-danger/20',
  };

  const normalizedStatus = (status || '').toLowerCase().trim();
  const classes = statusConfig[normalizedStatus] || 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${classes}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
