
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
    'contacted': 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200/60 dark:border-blue-800',
    'meeting scheduled': 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200/60 dark:border-purple-800',
    'proposal sent': 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-indigo-200/60 dark:border-indigo-800',
    'won': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
    'lost': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
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
