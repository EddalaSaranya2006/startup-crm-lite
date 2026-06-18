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
import PageContainer from '../components/layout/PageContainer';

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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <PageContainer className="py-4 md:py-6 lg:py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Analytics Dashboard</h1>
          </div>
          <p className="text-slate-500 dark:text-gray-400 ml-12 md:ml-14 text-sm">Track sales performance and growth trends.</p>
        </div>
        <EmptyAnalyticsState onAddLead={handleAddLead} />
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageContainer className="py-4 md:py-6 lg:py-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 md:mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl shadow-sm">
              <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Analytics Dashboard</h1>
          </div>
          <p className="text-slate-500 dark:text-gray-400 ml-12 md:ml-14 flex items-center gap-2 flex-wrap text-sm">
            Track sales performance and growth trends.
            <span className="text-xs text-blue-600 font-semibold bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 px-2.5 py-0.5 rounded-full">
              {analytics.totalLeads} leads analyzed
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-3 md:px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-700 transition-all shadow-sm min-h-[44px]"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button className="flex items-center gap-2 px-3 md:px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/50 transition-all shadow-sm min-h-[44px]">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
        <PieChartCard data={analytics.statusDistribution} totalLeads={analytics.totalLeads} />
        <FunnelChartCard data={analytics.funnelData} />
      </div>

      {/* ── Row 2 : Monthly Leads + Conversion Trend ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
        <BarChartCard data={analytics.monthlyLeads} />
        <LineChartCard data={analytics.conversionByMonth} />
      </div>

      {/* ── Row 3 : Revenue Area + Lead Sources ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
        <RevenueChartCard data={analytics.revenueByMonth} />
        <LeadSourceChart data={analytics.leadSourceStats} />
      </div>

      {/* ── Row 4 : Activity Heatmap + Top Performers ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
        <ActivityHeatmap data={analytics.activityHeatmap} />
        <TopPerformersCard performers={analytics.topPerformers} prospectors={analytics.topProspectors} />
      </div>

      {/* ── Row 5 : Sales Velocity + Forecast ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <SalesVelocityCard velocity={analytics.salesVelocity} />
        <ForecastCard forecast={analytics.forecastRevenue} />
      </div>
      </PageContainer>
    </div>
  );
};

export default Analytics;
