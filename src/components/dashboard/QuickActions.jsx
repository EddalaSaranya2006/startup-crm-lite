import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, List, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useLeads } from '../../context/LeadContext';
import { exportLeadsToCSV } from '../../utils/exportHelpers';

/**
 * QuickActions Component
 * Renders quick access buttons for common operations: Add New Lead, View All Leads, and Export Data.
 *
 * @component
 * @param {Object} props
 * @param {Function} [props.onAddLead] - Callback when "Add New Lead" is clicked (optional).
 * @returns {React.ReactElement} The QuickActions component.
 */
const QuickActions = ({ onAddLead }) => {
  const navigate = useNavigate();
  const { leads } = useLeads();
  const [isExporting, setIsExporting] = useState(false);

  /**
   * Handles the export data action, simulating a download delay with toast feedback.
   */
  const handleExport = () => {
    if (isExporting) return;
    setIsExporting(true);

    const toastId = toast.loading('Preparing data export...', {
      style: {
        borderRadius: '12px',
        background: '#0F172A',
        color: '#FFF',
      },
    });

    setTimeout(() => {
      exportLeadsToCSV(leads);
      toast.success('Leads data exported successfully as CSV!', {
        id: toastId,
        duration: 3000,
        style: {
          borderRadius: '12px',
          background: '#0F172A',
          color: '#FFF',
        },
      });
      setIsExporting(false);
    }, 1500);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-xs dark:shadow-none">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
      <div className="flex flex-col gap-3">
        {/* Add New Lead Button */}
        <button
          onClick={onAddLead || (() => navigate('/leads', { state: { openAddModal: true } }))}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-sm hover:shadow-md dark:shadow-none transition-all duration-200 cursor-pointer min-h-[44px]"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Add New Lead</span>
        </button>

        {/* View All Leads Button */}
        <button
          onClick={() => navigate('/leads')}
          className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 cursor-pointer min-h-[44px]"
        >
          <List className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          <span>View All Leads</span>
        </button>

        {/* Export Data Button */}
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
        >
          <Download className={`w-5 h-5 text-slate-500 dark:text-slate-400 ${isExporting ? 'animate-bounce' : ''}`} />
          <span>{isExporting ? 'Exporting...' : 'Export Data'}</span>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
