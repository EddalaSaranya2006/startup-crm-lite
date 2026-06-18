import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

/**
 * @typedef {'primary' | 'success' | 'warning' | 'danger'} ThemeColor
 */

/**
 * StatsCard Component
 * Displays a metric with an icon, numeric value, and percentage change.
 *
 * @component
 * @param {Object} props
 * @param {string} props.title - The title of the metric.
 * @param {string|number} props.value - The main value to show.
 * @param {React.ComponentType} props.icon - A Lucide Icon component.
 * @param {number} props.change - Percentage change compared to last month.
 * @param {ThemeColor} props.color - Theme color variant to apply.
 * @returns {React.ReactElement} The StatsCard component.
 */
const StatsCard = ({ title, value, icon: Icon, change, color = 'primary' }) => {
  const isPositive = change >= 0;

  // Color mapping configuration based on required design tokens
  const colorMap = {
    primary: {
      text: 'text-primary',
      bg: 'bg-primary/10',
      border: 'border-primary/20',
      iconColor: 'text-primary',
    },
    success: {
      text: 'text-success',
      bg: 'bg-success/10',
      border: 'border-success/20',
      iconColor: 'text-success',
    },
    warning: {
      text: 'text-warning',
      bg: 'bg-warning/10',
      border: 'border-warning/20',
      iconColor: 'text-warning',
    },
    danger: {
      text: 'text-danger',
      bg: 'bg-danger/10',
      border: 'border-danger/20',
      iconColor: 'text-danger',
    },
  };

  const style = colorMap[color] || colorMap.primary;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-xs dark:shadow-none hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2 font-roboto">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${style.bg} ${style.border} border`}>
          <Icon className={`w-6 h-6 ${style.iconColor}`} />
        </div>
      </div>

      <div className="flex items-center mt-4 text-sm">
        <span
          className={`flex items-center px-2.5 py-0.5 rounded-full font-medium ${
            isPositive
              ? 'text-success bg-success/10 border border-success/20'
              : 'text-danger bg-danger/10 border border-danger/20'
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="w-4 h-4 mr-1 stroke-[2.5]" />
          ) : (
            <ArrowDownRight className="w-4 h-4 mr-1 stroke-[2.5]" />
          )}
          {Math.abs(change).toFixed(1)}%
        </span>
        <span className="text-gray-400 dark:text-gray-500 ml-2">vs last month</span>
      </div>
    </div>
  );
};

export default StatsCard;
