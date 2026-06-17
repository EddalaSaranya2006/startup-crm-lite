import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, Search, Grid, List, X, Filter } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import LeadTable from '../components/leads/LeadTable';
import LeadCard from '../components/leads/LeadCard';
import LeadForm from '../components/leads/LeadForm';

// Initial leads database matching dashboard seed data
const INITIAL_LEADS = [
  {
    id: '1',
    name: 'Jane Doe',
    company: 'Acme Corp',
    status: 'Won',
    email: 'jane@acme.com',
    phone: '(555) 123-4567',
    source: 'LinkedIn',
    value: 15000,
    dateAdded: '2026-06-15T09:30:00.000Z',
  },
  {
    id: '2',
    name: 'John Smith',
    company: 'Beta Inc',
    status: 'Contacted',
    email: 'john@betainc.com',
    phone: '(555) 234-5678',
    source: 'Website',
    value: 8500,
    dateAdded: '2026-06-14T14:15:00.000Z',
  },
  {
    id: '3',
    name: 'Alice Johnson',
    company: 'Gamma LLC',
    status: 'Proposal Sent',
    email: 'alice@gammallc.com',
    phone: '(555) 345-6789',
    source: 'Referral',
    value: 24000,
    dateAdded: '2026-06-12T10:00:00.000Z',
  },
  {
    id: '4',
    name: 'Bob Brown',
    company: 'Delta Co',
    status: 'New',
    email: 'bob@deltaco.com',
    phone: '(555) 456-7890',
    source: 'Cold Call',
    value: 5000,
    dateAdded: '2026-06-10T16:45:00.000Z',
  },
  {
    id: '5',
    name: 'Charlie Green',
    company: 'Epsilon Ltd',
    status: 'Lost',
    email: 'charlie@epsilon.com',
    phone: '(555) 567-8901',
    source: 'Email Campaign',
    value: 3200,
    dateAdded: '2026-06-08T11:20:00.000Z',
  },
  {
    id: '6',
    name: 'Diana Prince',
    company: 'Wayne Enterprises',
    status: 'Won',
    email: 'diana@wayne.com',
    phone: '(555) 678-9012',
    source: 'LinkedIn',
    value: 50000,
    dateAdded: '2026-06-05T09:00:00.000Z',
  },
  {
    id: '7',
    name: 'Evan Wright',
    company: 'Apex Corp',
    status: 'Proposal Sent',
    email: 'evan@apex.com',
    phone: '(555) 789-0123',
    source: 'Website',
    value: 12000,
    dateAdded: '2026-06-03T15:30:00.000Z',
  },
  {
    id: '8',
    name: 'Fiona Gallagher',
    company: 'South Side Corp',
    status: 'Contacted',
    email: 'fiona@southside.com',
    phone: '(555) 890-1234',
    source: 'Other',
    value: 4500,
    dateAdded: '2026-06-01T10:00:00.000Z',
  },
];

/**
 * Leads Management Page Component
 * Handles the complete list, filter, search, creation, editing, and deletion operations for leads.
 *
 * @component
 * @returns {React.ReactElement} The Leads page.
 */
const Leads = () => {
  const location = useLocation();

  // Core data state
  const [leads, setLeads] = useState(INITIAL_LEADS);

  // Derive initial modal state from router location (e.g. Quick Actions → Add Lead).
  // Using lazy useState avoids calling setState inside an effect.
  const [isModalOpen, setIsModalOpen] = useState(
    () => !!(location.state?.openAddModal)
  );
  const [selectedLead, setSelectedLead] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'

  // Filter and Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');

  // Clear the routing flag from history on mount so a reload doesn't reopen the modal.
  // This effect never calls setState — it only touches the browser history API.
  const didClearRouteState = useRef(false);
  useEffect(() => {
    if (!didClearRouteState.current && location.state?.openAddModal) {
      window.history.replaceState({}, document.title);
      didClearRouteState.current = true;
    }
  }, [location.state]);

  // Options lists
  const statusOptions = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];
  const sourceOptions = ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'];

  /**
   * Opens the lead form modal in CREATE mode.
   */
  const handleAddClick = () => {
    setSelectedLead(null);
    setIsModalOpen(true);
  };

  /**
   * Opens the lead form modal in EDIT mode with target lead data populated.
   *
   * @param {Object} lead - The lead to edit.
   */
  const handleEditClick = (lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  /**
   * Deletes a lead by ID and displays a customized destructive red toast.
   *
   * @param {string|number} id - The ID of the lead to remove.
   */
  const handleDeleteClick = (id) => {
    const leadToDelete = leads.find((l) => l.id === id);
    if (!leadToDelete) return;

    if (window.confirm(`Are you sure you want to delete the lead for "${leadToDelete.name}"?`)) {
      setLeads((prev) => prev.filter((l) => l.id !== id));
      
      // Toast notification styled in Red for deletion
      toast.error(`Lead "${leadToDelete.name}" was deleted.`, {
        style: {
          borderRadius: '12px',
          background: '#EF4444',
          color: '#FFF',
        },
        duration: 3000,
      });
    }
  };

  /**
   * Handles creating a new lead or updating an existing one, triggering a success toast.
   *
   * @param {Object} formData - Validated data submitted from LeadForm.
   */
  const handleFormSubmit = (formData) => {
    if (selectedLead) {
      // Edit mode: Update existing item
      setLeads((prev) =>
        prev.map((l) => (l.id === selectedLead.id ? { ...l, ...formData } : l))
      );
      toast.success(`Changes to "${formData.name}" saved successfully!`, {
        style: {
          borderRadius: '12px',
          background: '#22C55E',
          color: '#FFF',
        },
      });
    } else {
      // Create mode: Append new item
      const newLeadObj = {
        ...formData,
        id: Date.now().toString(),
        dateAdded: new Date().toISOString(),
      };
      setLeads((prev) => [newLeadObj, ...prev]);
      toast.success(`New lead for "${formData.name}" created!`, {
        style: {
          borderRadius: '12px',
          background: '#22C55E',
          color: '#FFF',
        },
      });
    }
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  // Filter and search computation logic
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    const matchesSource = sourceFilter === 'All' || lead.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setSourceFilter('All');
  };

  const hasActiveFilters = searchTerm !== '' || statusFilter !== 'All' || sourceFilter !== 'All';

  return (
    <div className="p-6 md:p-8 min-h-screen bg-background">
      {/* Toast provider */}
      <Toaster position="top-right" />

      {/* Main Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-text-dark tracking-tight">Lead Management</h1>
          <p className="text-text-gray mt-1 font-medium">
            Monitor, edit, and organize your potential CRM deals and customer pipelines.
          </p>
        </div>

        <button
          onClick={handleAddClick}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 text-white font-semibold py-2.5 px-5 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Add Lead</span>
        </button>
      </div>

      {/* Filter Action Bar */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search Field */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads by name, company, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-900"
            />
          </div>

          {/* Filters & Toggles Wrapper */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter Dropdown */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400 shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-900 transition-all cursor-pointer"
              >
                <option value="All">All Statuses</option>
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Source Filter Dropdown */}
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-900 transition-all cursor-pointer"
            >
              <option value="All">All Sources</option>
              {sourceOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

            {/* View Mode Toggle Controls */}
            <div className="flex items-center border border-gray-200 rounded-xl p-1 bg-gray-50/50">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'table' ? 'bg-white text-primary shadow-xs' : 'text-gray-400 hover:text-gray-700'
                }`}
                title="Table view"
                aria-label="Toggle Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('card')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'card' ? 'bg-white text-primary shadow-xs' : 'text-gray-400 hover:text-gray-700'
                }`}
                title="Card grid view"
                aria-label="Toggle Card View"
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Clear Badges */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100">
            <span className="text-xs font-semibold text-gray-500 mr-1">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-lg border border-blue-100">
                Search: "{searchTerm}"
                <button onClick={() => setSearchTerm('')} className="hover:text-blue-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {statusFilter !== 'All' && (
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-lg border border-blue-100">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter('All')} className="hover:text-blue-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {sourceFilter !== 'All' && (
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-lg border border-blue-100">
                Source: {sourceFilter}
                <button onClick={() => setSourceFilter('All')} className="hover:text-blue-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-gray-500 hover:text-primary transition-colors hover:underline cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Leads Main Container View */}
      <div>
        {/* Responsive Check: Table view is hidden on screens below 'lg' where cards stack */}
        <div className="lg:hidden">
          {filteredLeads.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center text-gray-400 text-sm">
              No leads found matching your criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredLeads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </div>

        {/* Large screen layout obeys the selected toggle mode */}
        <div className="hidden lg:block">
          {viewMode === 'table' ? (
            <LeadTable
              leads={filteredLeads}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLeads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Form Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden transform transition-all duration-300 scale-100">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                {selectedLead ? 'Edit Lead Details' : 'Add New Lead'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body container hosting LeadForm */}
            <div className="p-6">
              <LeadForm
                initialData={selectedLead}
                onSubmit={handleFormSubmit}
                onCancel={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
