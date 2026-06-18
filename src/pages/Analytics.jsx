import { useState, useCallback } from 'react';
import { useLeads } from '../context/LeadContext';
import { useNavigate } from 'react-router-dom';
import { useAnalytics } from '../hooks/useAnalytics';
import { BarChart3, Download, RefreshCw } from 'lucide-react';
import AnalyticsFilters from '../components/analytics/AnalyticsFilters';
import StatsCards from '../components/analytics/StatsCards';
import PieChartCard from '../components/analytics/PieChartCard';
import FunnelChartCard from '../components/analytics/FunnelChartCard';
import BarChartCard from '../components/analytics/BarChartCard';
import LineChartCard from '../components/analytics/LineChartCard';
import RevenueChartCard from '../components/analytics/RevenueChartCard';
import LeadSourceChart from '../components/analytics/LeadSourceChart';
import SalesVelocityCard from '../components/analytics/SalesVelocityCard';
import ForecastCard from '../components/analytics/ForecastCard';
import ActivityHeatmap from '../components/analytics/ActivityHeatmap';
import TopPerformersCard from '../components/analytics/TopPerformersCard';
import EmptyAnalyticsState from '../components/analytics/EmptyAnalyticsState';
import LoadingSkeleton from '../components/analytics/LoadingSkeleton';

const Analytics = () => {
  const { leads } = useLeads();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('allTime');
  const [customDateRange, setCustomDateRange] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const analytics = useAnalytics(leads, dateRange, customDateRange);

  const handleDateRangeChange = useCallback((preset, custom) => {
    setDateRange(preset);
    setCustomDateRange(custom);
  }, []);

  const handleAddLead = useCallback(() => {
    navigate('/leads');
  }, [navigate]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  }, []);

  if (!leads || leads.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-6 md:p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-xl">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics Dashboard</h1>
          </div>
          <p className="text-slate-500 dark:text-gray-400 ml-14">Track sales performance and growth trends.</p>
        </div>
        <EmptyAnalyticsState onAddLead={handleAddLead} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20 p-6 md:p-8">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-xl shadow-sm">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics Dashboard</h1>
          </div>
          <p className="text-slate-500 dark:text-gray-400 ml-14 flex items-center gap-2 flex-wrap">
            Track sales performance and growth trends.
            <span className="text-xs text-blue-600 font-semibold bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">
              {analytics.totalLeads} leads analyzed
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all shadow-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
      <AnalyticsFilters onDateRangeChange={handleDateRangeChange} currentPreset={dateRange} />

      {/* ── KPI Cards ── */}
      <StatsCards
        stats={{
          totalLeads: analytics.totalLeads,
          conversionRate: analytics.conversionRate,
          pipelineValue: analytics.pipelineValue,
          wonRevenue: analytics.wonRevenue,
          averageSalesCycle: analytics.averageSalesCycle,
          lostRate: analytics.lostRate,
        }}
      />

      {/* ── Row 1 : Status Pie + Sales Funnel ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <PieChartCard data={analytics.statusDistribution} totalLeads={analytics.totalLeads} />
        <FunnelChartCard data={analytics.funnelData} />
      </div>

      {/* ── Row 2 : Monthly Leads + Conversion Trend ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <BarChartCard data={analytics.monthlyLeads} />
        <LineChartCard data={analytics.conversionByMonth} />
      </div>

      {/* ── Row 3 : Revenue Area + Lead Sources ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <RevenueChartCard data={analytics.revenueByMonth} />
        <LeadSourceChart data={analytics.leadSourceStats} />
      </div>

      {/* ── Row 4 : Activity Heatmap + Top Performers ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ActivityHeatmap data={analytics.activityHeatmap} />
        <TopPerformersCard performers={analytics.topPerformers} prospectors={analytics.topProspectors} />
      </div>

      {/* ── Row 5 : Sales Velocity + Forecast ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesVelocityCard velocity={analytics.salesVelocity} />
        <ForecastCard forecast={analytics.forecastRevenue} />
      </div>
    </div>
  );
};

export default Analytics;
