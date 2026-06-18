import { useMemo } from 'react';
import {
  getStatusDistribution,
  getMonthlyLeads,
  getConversionByMonth,
  getRevenueByMonth,
  getPipelineValue,
  getWonRevenue,
  getAverageSalesCycle,
  getLostRate,
  getConversionRate,
  getLeadSourceStats,
  getFunnelData,
  getSalesVelocity,
  getForecastRevenue,
  getTopPerformers,
  getTopProspectors,
  getActivityHeatmapData,
  filterLeadsByDateRange,
  getDateRangeByPreset,
} from '../utils/analyticsHelpers';

export const useAnalytics = (leads, dateRangePreset = 'allTime', customDateRange = null) => {
  const filteredLeads = useMemo(() => {
    if (dateRangePreset === 'custom' && customDateRange) {
      return filterLeadsByDateRange(leads, customDateRange.start, customDateRange.end);
    }

    if (dateRangePreset === 'allTime') {
      return leads;
    }

    const { start, end } = getDateRangeByPreset(dateRangePreset);
    return filterLeadsByDateRange(leads, start, end);
  }, [leads, dateRangePreset, customDateRange]);

  const statusDistribution = useMemo(() => getStatusDistribution(filteredLeads), [filteredLeads]);

  const monthlyLeads = useMemo(() => getMonthlyLeads(filteredLeads), [filteredLeads]);

  const conversionByMonth = useMemo(() => getConversionByMonth(filteredLeads), [filteredLeads]);

  const revenueByMonth = useMemo(() => getRevenueByMonth(filteredLeads), [filteredLeads]);

  const pipelineValue = useMemo(() => getPipelineValue(filteredLeads), [filteredLeads]);

  const wonRevenue = useMemo(() => getWonRevenue(filteredLeads), [filteredLeads]);

  const averageSalesCycle = useMemo(() => getAverageSalesCycle(filteredLeads), [filteredLeads]);

  const lostRate = useMemo(() => getLostRate(filteredLeads), [filteredLeads]);

  const conversionRate = useMemo(() => getConversionRate(filteredLeads), [filteredLeads]);

  const leadSourceStats = useMemo(() => getLeadSourceStats(filteredLeads), [filteredLeads]);

  const funnelData = useMemo(() => getFunnelData(filteredLeads), [filteredLeads]);

  const salesVelocity = useMemo(() => getSalesVelocity(filteredLeads), [filteredLeads]);

  const forecastRevenue = useMemo(() => getForecastRevenue(filteredLeads), [filteredLeads]);

  const topPerformers = useMemo(() => getTopPerformers(filteredLeads), [filteredLeads]);

  const topProspectors = useMemo(() => getTopProspectors(filteredLeads), [filteredLeads]);

  const activityHeatmap = useMemo(() => getActivityHeatmapData(filteredLeads), [filteredLeads]);

  const totalLeads = filteredLeads.length;

  return {
    filteredLeads,
    statusDistribution,
    monthlyLeads,
    conversionByMonth,
    revenueByMonth,
    pipelineValue,
    wonRevenue,
    averageSalesCycle,
    lostRate,
    conversionRate,
    leadSourceStats,
    funnelData,
    salesVelocity,
    forecastRevenue,
    topPerformers,
    topProspectors,
    activityHeatmap,
    totalLeads,
  };
};
