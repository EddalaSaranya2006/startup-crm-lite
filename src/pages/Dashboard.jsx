import { useState } from 'react';
import { Users, DollarSign, Award, Activity, X } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import StatsCard from '../components/dashboard/StatsCard';
import PipelineOverview from '../components/dashboard/PipelineOverview';
import RecentLeads from '../components/dashboard/RecentLeads';
import QuickActions from '../components/dashboard/QuickActions';
import { useLeads } from '../context/LeadContext';

/**
 * Dashboard Component
 * The main container/page displaying KPIs, visual pipeline progress, recent leads, and quick actions.
 *
 * @component
 * @returns {React.ReactElement} The Dashboard page.
 */
const Dashboard = () => {
  const { leads, addLead } = useLeads();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'New',
    source: 'Website',
    value: '',
  });

  // Calculate Metrics dynamically
  const totalLeads = leads.length;
  
  // Pipeline Value = sum of values of all active deals.
  const pipelineValue = leads.reduce((sum, lead) => {
    if (['new', 'contacted', 'meeting scheduled', 'proposal sent'].includes(lead.status.toLowerCase())) {
      return sum + (lead.value || 0);
    }
    return sum;
  }, 0);

  // Win Rate = Won leads / (Won + Lost leads)
  const wonCount = leads.filter((l) => l.status.toLowerCase() === 'won').length;
  const lostCount = leads.filter((l) => l.status.toLowerCase() === 'lost').length;
  const closedCount = wonCount + lostCount;
  const winRate = closedCount > 0 ? (wonCount / closedCount) * 100 : 0;

  // Active Deals = count of deals not Won or Lost
  const activeDeals = leads.filter(
    (l) => !['won', 'lost'].includes(l.status.toLowerCase())
  ).length;

  /**
   * Submits the new lead form, validating entries and updating local state.
   *
   * @param {React.FormEvent} e - Form event.
   */
  const handleAddLeadSubmit = (e) => {
    e.preventDefault();

    if (!newLead.name.trim() || !newLead.company.trim()) {
      toast.error('Name and Company are required!');
      return;
    }

    const leadToAdd = {
      name: newLead.name.trim(),
      company: newLead.company.trim(),
      email: newLead.email.trim(),
      phone: newLead.phone.trim(),
      status: newLead.status,
      source: newLead.source,
      value: Number(newLead.value) || 0,
    };

    const createdLead = addLead(leadToAdd);
    setIsAddModalOpen(false);
    setNewLead({
      name: '',
      company: '',
      email: '',
      phone: '',
      status: 'New',
      source: 'Website',
      value: '',
    });

    toast.success(`Lead for "${createdLead.name}" added successfully!`, {
      style: {
        borderRadius: '12px',
        background: '#0F172A',
        color: '#FFF',
      },
    });
  };

  /**
   * Updates fields inside the new lead state object.
   *
   * @param {React.ChangeEvent<HTMLInputElement|HTMLSelectElement>} e - Change event.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLead((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 md:p-8 min-h-screen bg-background">
      {/* Toast notifications */}
      <Toaster position="top-right" />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-text-dark tracking-tight">Dashboard</h1>
          <p className="text-text-gray mt-1 font-medium">
            Welcome back! Monitor your business performance and manage incoming deals.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-text-gray font-semibold bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
          <span>Live Metrics</span>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Leads"
          value={totalLeads}
          icon={Users}
          change={12.5}
          color="primary"
        />
        <StatsCard
          title="Active Pipeline"
          value={`$${pipelineValue.toLocaleString()}`}
          icon={DollarSign}
          change={8.2}
          color="warning"
        />
        <StatsCard
          title="Win Rate"
          value={`${winRate.toFixed(1)}%`}
          icon={Award}
          change={3.4}
          color="success"
        />
        <StatsCard
          title="Active Deals"
          value={activeDeals}
          icon={Activity}
          change={10.0}
          color="danger"
        />
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Left Section (Pipeline and Recent Leads) */}
        <div className="lg:col-span-2 space-y-6">
          <PipelineOverview leads={leads} />
          <RecentLeads leads={leads} />
        </div>

        {/* Right Section (Quick Actions & Metrics Info Card) */}
        <div className="space-y-6">
          <QuickActions onAddLead={() => setIsAddModalOpen(true)} />
          
          {/* Informational Widget / Metric Guide */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
              <DollarSign className="w-64 h-64" />
            </div>
            <h4 className="text-lg font-bold">Pipeline Target</h4>
            <p className="text-blue-100 text-sm mt-1">
              You have closed ${wonCount > 0 ? leads.filter(l => l.status.toLowerCase() === 'won').reduce((sum, l) => sum + l.value, 0).toLocaleString() : 0} in sales this month. Keep pushing to reach your $150,000 team goal!
            </p>
            <div className="mt-6">
              <div className="flex justify-between text-xs text-blue-200 mb-1 font-semibold">
                <span>Progress</span>
                <span>{((leads.filter(l => l.status.toLowerCase() === 'won').reduce((sum, l) => sum + l.value, 0) / 150000) * 100).toFixed(0)}%</span>
              </div>
              <div className="h-2 w-full bg-blue-900/40 rounded-full overflow-hidden">
                <div
                  style={{ width: `${Math.min(100, (leads.filter(l => l.status.toLowerCase() === 'won').reduce((sum, l) => sum + l.value, 0) / 150000) * 100)}%` }}
                  className="h-full bg-white rounded-full transition-all duration-1000"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Lead Dialog Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden transform transition-all duration-300 scale-100">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Add New Lead</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddLeadSubmit}>
              <div className="p-6 space-y-4">
                {/* Contact Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={newLead.name}
                    onChange={handleInputChange}
                    placeholder="e.g. John Doe"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all text-gray-900"
                  />
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Company *
                  </label>
                  <input
                    type="text"
                    name="company"
                    required
                    value={newLead.company}
                    onChange={handleInputChange}
                    placeholder="e.g. Acme Corp"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all text-gray-900"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={newLead.email}
                    onChange={handleInputChange}
                    placeholder="e.g. john@acme.com"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all text-gray-900"
                  />
                </div>

                {/* Lead Status & Value */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={newLead.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white transition-all text-gray-900"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Meeting Scheduled">Meeting Scheduled</option>
                      <option value="Proposal Sent">Proposal Sent</option>
                      <option value="Won">Won</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Deal Value ($)
                    </label>
                    <input
                      type="number"
                      name="value"
                      min="0"
                      value={newLead.value}
                      onChange={handleInputChange}
                      placeholder="e.g. 15000"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-100 text-sm font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary/95 text-white rounded-lg text-sm font-semibold transition-all shadow-xs cursor-pointer"
                >
                  Add Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
