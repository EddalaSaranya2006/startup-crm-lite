// ─── Internal helpers ────────────────────────────────────────────────────────

const calculateMonthKey = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

const calculateDayKey = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().split('T')[0];
};

const calculateDaysDifference = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
  return Math.max(0, Math.floor((end - start) / (1000 * 60 * 60 * 24)));
};

/** Returns last N month keys in "YYYY-MM" format, newest last. */
const getLastNMonths = (n) => {
  const months = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  return months;
};

// ─── Exported analytics functions ────────────────────────────────────────────

/**
 * Returns count + percentage for each lead status.
 * @param {Array} leads
 * @returns {{ status: string, count: number, percentage: string }[]}
 */
export const getStatusDistribution = (leads) => {
  if (!Array.isArray(leads) || leads.length === 0) return [];

  const distribution = leads.reduce((acc, lead) => {
    const status = lead.status || 'New';
    const existing = acc.find((item) => item.status === status);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ status, count: 1 });
    }
    return acc;
  }, []);

  return distribution.map((item) => ({
    ...item,
    percentage: ((item.count / leads.length) * 100).toFixed(1),
  }));
};

/**
 * Returns lead count per month for the last 6 months (including zero months).
 * @param {Array} leads
 * @returns {{ month: string, count: number }[]}
 */
export const getMonthlyLeads = (leads) => {
  if (!Array.isArray(leads) || leads.length === 0) return [];

  const lastSixMonths = getLastNMonths(6);
  const monthlyData = {};

  leads.forEach((lead) => {
    const key = calculateMonthKey(lead.createdAt);
    if (key) monthlyData[key] = (monthlyData[key] || 0) + 1;
  });

  return lastSixMonths.map((month) => ({
    month,
    count: monthlyData[month] || 0,
  }));
};

/**
 * Returns win-rate per month for the last 6 months.
 * @param {Array} leads
 * @returns {{ month: string, rate: number }[]}
 */
export const getConversionByMonth = (leads) => {
  if (!Array.isArray(leads) || leads.length === 0) return [];

  const lastSixMonths = getLastNMonths(6);
  const stats = {};

  leads.forEach((lead) => {
    const key = calculateMonthKey(lead.createdAt);
    if (!key) return;
    if (!stats[key]) stats[key] = { total: 0, won: 0 };
    stats[key].total += 1;
    if (lead.status === 'Won') stats[key].won += 1;
  });

  return lastSixMonths.map((month) => {
    const s = stats[month] || { total: 0, won: 0 };
    return {
      month,
      rate: s.total > 0 ? parseFloat(((s.won / s.total) * 100).toFixed(1)) : 0,
    };
  });
};

/**
 * Returns won revenue per month for the last 6 months.
 * @param {Array} leads
 * @returns {{ month: string, revenue: number }[]}
 */
export const getRevenueByMonth = (leads) => {
  if (!Array.isArray(leads) || leads.length === 0) return [];

  const lastSixMonths = getLastNMonths(6);
  const monthlyRevenue = {};

  leads.forEach((lead) => {
    if (lead.status === 'Won') {
      const key = calculateMonthKey(lead.wonAt || lead.createdAt);
      if (key) monthlyRevenue[key] = (monthlyRevenue[key] || 0) + (lead.value || 0);
    }
  });

  return lastSixMonths.map((month) => ({
    month,
    revenue: monthlyRevenue[month] || 0,
  }));
};

/**
 * Sum of value for all non-Won / non-Lost leads.
 */
export const getPipelineValue = (leads) => {
  if (!Array.isArray(leads)) return 0;
  return leads
    .filter((l) => l.status !== 'Won' && l.status !== 'Lost')
    .reduce((sum, l) => sum + (l.value || 0), 0);
};

/**
 * Sum of value for Won leads.
 */
export const getWonRevenue = (leads) => {
  if (!Array.isArray(leads)) return 0;
  return leads.filter((l) => l.status === 'Won').reduce((sum, l) => sum + (l.value || 0), 0);
};

/**
 * Average days from createdAt → wonAt for Won leads.
 * Falls back to 0 if no wonAt is available on any lead.
 */
export const getAverageSalesCycle = (leads) => {
  if (!Array.isArray(leads) || leads.length === 0) return 0;
  const wonLeads = leads.filter(
    (l) => l.status === 'Won' && l.createdAt && (l.wonAt || l.closedAt)
  );
  if (wonLeads.length === 0) return 0;
  const totalDays = wonLeads.reduce(
    (sum, l) => sum + calculateDaysDifference(l.createdAt, l.wonAt || l.closedAt),
    0
  );
  return Math.round(totalDays / wonLeads.length);
};

/**
 * Lost leads / total leads × 100.
 */
export const getLostRate = (leads) => {
  if (!Array.isArray(leads) || leads.length === 0) return 0;
  const lost = leads.filter((l) => l.status === 'Lost').length;
  return parseFloat(((lost / leads.length) * 100).toFixed(1));
};

/**
 * Won leads / total leads × 100.
 */
export const getConversionRate = (leads) => {
  if (!Array.isArray(leads) || leads.length === 0) return 0;
  const won = leads.filter((l) => l.status === 'Won').length;
  return parseFloat(((won / leads.length) * 100).toFixed(1));
};

/**
 * Count of leads per source, sorted descending.
 */
export const getLeadSourceStats = (leads) => {
  if (!Array.isArray(leads) || leads.length === 0) return [];

  const sources = {};
  leads.forEach((l) => {
    const src = l.source || 'Other';
    sources[src] = (sources[src] || 0) + 1;
  });

  return Object.entries(sources)
    .map(([source, count]) => ({
      source,
      count,
      percentage: parseFloat(((count / leads.length) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.count - a.count);
};

/**
 * Funnel stages with per-stage count, drop-off %, and total conversion %.
 */
export const getFunnelData = (leads) => {
  if (!Array.isArray(leads) || leads.length === 0) return [];

  const statuses = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won'];
  const total = leads.length;

  const rawCounts = {};
  statuses.forEach((s) => {
    rawCounts[s] = leads.filter((l) => l.status === s).length;
  });

  return statuses.map((status, index) => {
    const count = rawCounts[status];
    const prevCount = index === 0 ? total : rawCounts[statuses[index - 1]];
    const dropOff =
      index > 0 && prevCount > 0
        ? parseFloat((((prevCount - count) / prevCount) * 100).toFixed(1))
        : 0;
    const conversionRate = total > 0 ? parseFloat(((count / total) * 100).toFixed(1)) : 0;

    return { name: status, value: count, dropOff, conversionRate };
  });
};

/**
 * Sales velocity object with component metrics.
 * Formula: (Opportunities × WinRate × AvgDealSize) / SalesCycleDays
 * @returns {{ velocity: number, winRate: number, avgDealSize: number, salesCycle: number }}
 */
export const getSalesVelocity = (leads) => {
  const empty = { velocity: 0, winRate: 0, avgDealSize: 0, salesCycle: 0 };
  if (!Array.isArray(leads) || leads.length === 0) return empty;

  const wonLeads = leads.filter((l) => l.status === 'Won');
  if (wonLeads.length === 0) return empty;

  const avgDealSize = wonLeads.reduce((s, l) => s + (l.value || 0), 0) / wonLeads.length;
  const winRate = (wonLeads.length / leads.length) * 100;
  const salesCycle = getAverageSalesCycle(leads) || 30;
  const velocity =
    salesCycle > 0
      ? Math.round((leads.length * (winRate / 100) * avgDealSize) / salesCycle)
      : 0;

  return {
    velocity,
    winRate: parseFloat(winRate.toFixed(1)),
    avgDealSize: Math.round(avgDealSize),
    salesCycle,
  };
};

/**
 * Revenue forecast based on 6-month average with growth trend.
 * @returns {{ forecast: number, growthRate: number, confidence: number }}
 */
export const getForecastRevenue = (leads) => {
  const empty = { forecast: 0, growthRate: 0, confidence: 0 };
  const revenueData = getRevenueByMonth(leads);
  if (revenueData.length === 0) return empty;

  const nonZero = revenueData.filter((m) => m.revenue > 0);
  if (nonZero.length === 0) return empty;

  const avg = nonZero.reduce((s, m) => s + m.revenue, 0) / nonZero.length;

  const lastTwo = nonZero.slice(-2);
  let growthRate = 0;
  if (lastTwo.length === 2 && lastTwo[0].revenue > 0) {
    growthRate = parseFloat(
      (((lastTwo[1].revenue - lastTwo[0].revenue) / lastTwo[0].revenue) * 100).toFixed(1)
    );
  }

  const confidence = Math.min(95, Math.round((nonZero.length / 6) * 85) + 10);
  const forecast = Math.round(avg * (1 + Math.max(0, growthRate) / 100));

  return { forecast, growthRate, confidence };
};

/**
 * Top performers ranked by Won revenue.
 * @returns {{ name: string, revenue: number, wins: number, percentage: number }[]}
 */
export const getTopPerformers = (leads) => {
  if (!Array.isArray(leads) || leads.length === 0) return [];

  const revenueMap = {};
  const winsMap = {};

  leads.forEach((l) => {
    const owner = l.owner || 'Unassigned';
    revenueMap[owner] = revenueMap[owner] || 0;
    winsMap[owner] = winsMap[owner] || 0;
    if (l.status === 'Won') {
      revenueMap[owner] += l.value || 0;
      winsMap[owner] += 1;
    }
  });

  const sorted = Object.entries(revenueMap)
    .map(([name, revenue]) => ({ name, revenue, wins: winsMap[name] || 0 }))
    .filter((p) => p.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const max = sorted[0]?.revenue || 1;
  return sorted.map((p) => ({
    ...p,
    percentage: Math.round((p.revenue / max) * 100),
  }));
};

/**
 * Top prospectors ranked by volume of 'New' or 'Contacted' leads.
 * @returns {{ name: string, count: number, percentage: number }[]}
 */
export const getTopProspectors = (leads) => {
  if (!Array.isArray(leads) || leads.length === 0) return [];

  const prospectingMap = {};

  leads.forEach((l) => {
    const owner = l.owner || 'Unassigned';
    if (l.status === 'New' || l.status === 'Contacted') {
      prospectingMap[owner] = (prospectingMap[owner] || 0) + 1;
    }
  });

  const sorted = Object.entries(prospectingMap)
    .map(([name, count]) => ({ name, count }))
    .filter((p) => p.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const max = sorted[0]?.count || 1;
  return sorted.map((p) => ({
    ...p,
    percentage: Math.round((p.count / max) * 100),
  }));
};

/**
 * Day-level activity data for the last 91 days (GitHub-style heatmap).
 * Counts createdAt, contactedAt, meetingAt, proposalAt, wonAt events.
 * @returns {{ date: string, count: number }[]}
 */
export const getActivityHeatmapData = (leads) => {
  if (!Array.isArray(leads)) return [];

  const activityMap = {};

  leads.forEach((lead) => {
    [lead.createdAt, lead.contactedAt, lead.meetingAt, lead.proposalAt, lead.wonAt]
      .filter(Boolean)
      .forEach((dateStr) => {
        const key = calculateDayKey(dateStr);
        if (key) activityMap[key] = (activityMap[key] || 0) + 1;
      });
  });

  // Always count createdAt at minimum (all leads have this)
  const today = new Date();
  const days = [];
  for (let i = 90; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    days.push({ date: key, count: activityMap[key] || 0 });
  }
  return days;
};

// ─── Date filtering ───────────────────────────────────────────────────────────

export const filterLeadsByDateRange = (leads, startDate, endDate) => {
  if (!Array.isArray(leads)) return [];
  return leads.filter((lead) => {
    const d = new Date(lead.createdAt);
    return d >= startDate && d <= endDate;
  });
};

export const getDateRangeByPreset = (preset) => {
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  switch (preset) {
    case '7days': {
      const start = new Date(startOfToday);
      start.setDate(start.getDate() - 7);
      return { start, end: startOfToday };
    }
    case '30days': {
      const start = new Date(startOfToday);
      start.setDate(start.getDate() - 30);
      return { start, end: startOfToday };
    }
    case '90days': {
      const start = new Date(startOfToday);
      start.setDate(start.getDate() - 90);
      return { start, end: startOfToday };
    }
    case 'thisYear': {
      const start = new Date(today.getFullYear(), 0, 1);
      return { start, end: startOfToday };
    }
    default:
      return { start: new Date(0), end: startOfToday };
  }
};

// ─── Formatters ───────────────────────────────────────────────────────────────

export const formatCurrency = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatCompactCurrency = (value) => {
  if (!value && value !== 0) return '₹0';
  if (value >= 10_000_000) return `₹${(value / 10_000_000).toFixed(1)}Cr`;
  if (value >= 100_000) return `₹${(value / 100_000).toFixed(1)}L`;
  if (value >= 1_000) return `₹${(value / 1_000).toFixed(1)}K`;
  return `₹${value}`;
};

export const formatDate = (date) =>
  new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));

/** Converts "2026-06" → "Jun" */
export const getShortMonthLabel = (monthStr) => {
  if (!monthStr) return '';
  const [year, month] = monthStr.split('-');
  return new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleDateString('en-IN', {
    month: 'short',
  });
};

/** Converts "2026-06" → "June 2026" */
export const getLongMonthLabel = (monthStr) => {
  if (!monthStr) return '';
  const [year, month] = monthStr.split('-');
  return new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
  });
};
