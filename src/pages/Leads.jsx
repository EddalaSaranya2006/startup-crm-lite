import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, Grid, List, X } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import LeadTable from '../components/leads/LeadTable';
import LeadCard from '../components/leads/LeadCard';
import LeadForm from '../components/leads/LeadForm';
import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import EmptyState from '../components/common/EmptyState';
import PageContainer from '../components/layout/PageContainer';
import { useLeads } from '../context/LeadContext';

/**
 * Leads Management Page Component
 * Handles the complete list, filter, search, creation, editing, and deletion operations for leads.
 *
 * @component
 * @returns {React.ReactElement} The Leads page.
 */
const Leads = () => {
  const location = useLocation();
  const { leads, addLead, updateLead, deleteLead } = useLeads();

  // Derive initial modal state from router location (e.g. Quick Actions → Add Lead).
  // Using lazy useState avoids calling setState inside an effect.
  const [isModalOpen, setIsModalOpen] = useState(
    () => !!(location.state?.openAddModal)
  );
  const [selectedLead, setSelectedLead] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Clear the routing flag from history on mount so a reload doesn't reopen the modal.
  // This effect never calls setState — it only touches the browser history API.
  const didClearRouteState = useRef(false);
  useEffect(() => {
    if (!didClearRouteState.current && location.state?.openAddModal) {
      window.history.replaceState({}, document.title);
      didClearRouteState.current = true;
    }
  }, [location.state]);

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
      deleteLead(id);
      
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
      updateLead(selectedLead.id, formData);
      toast.success(`Changes to "${formData.name}" saved successfully!`, {
        style: {
          borderRadius: '12px',
          background: '#22C55E',
          color: '#FFF',
        },
      });
    } else {
      // Create mode: Append new item
      addLead(formData);
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

  const filteredLeads = leads
    .filter((lead) => activeFilter === 'All' || lead.status === activeFilter)
    .filter(
      (lead) =>
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const resetFilters = () => {
    setSearchQuery('');
    setActiveFilter('All');
  };

  const hasActiveFilters = searchQuery !== '' || activeFilter !== 'All';
  const showEmptyState = filteredLeads.length === 0;

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      {/* Toast provider */}
      <Toaster position="top-right" />

      <PageContainer className="py-4 md:py-6 lg:py-8">
      {/* Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-text-dark dark:text-white tracking-tight">Lead Management</h1>
          <p className="text-text-gray dark:text-gray-400 mt-1 font-medium text-sm md:text-base">
            Monitor, edit, and organize your potential CRM deals and customer pipelines.
          </p>
        </div>

        <button
          onClick={handleAddClick}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-3 md:py-2.5 px-5 rounded-xl shadow-sm hover:shadow-md dark:shadow-none transition-all duration-200 cursor-pointer min-h-[44px] w-full sm:w-auto"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Add Lead</span>
        </button>
      </div>

      {/* Filter Action Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-xs dark:shadow-none mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <SearchBar
              key={searchQuery === '' ? 'empty-search' : 'active-search'}
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>

          <div className="flex items-center justify-end">
            <div className="hidden md:flex lg:hidden items-center border border-gray-200 dark:border-gray-700 rounded-xl p-1 bg-gray-50 dark:bg-gray-900/50">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'table' ? 'bg-white dark:bg-gray-800 text-primary shadow-xs dark:shadow-none' : 'text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                title="Table view"
                aria-label="Toggle Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('card')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'card' ? 'bg-white dark:bg-gray-800 text-primary shadow-xs dark:shadow-none' : 'text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                title="Card grid view"
                aria-label="Toggle Card View"
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-4 transition-all duration-300">
          <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} leads={leads} />
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 mr-1">Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-2.5 py-1 rounded-lg border border-blue-100 dark:border-blue-800">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-blue-900 dark:hover:text-blue-100">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {activeFilter !== 'All' && (
              <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-2.5 py-1 rounded-lg border border-blue-100 dark:border-blue-800">
                Status: {activeFilter}
                <button onClick={() => setActiveFilter('All')} className="hover:text-blue-900 dark:hover:text-blue-100">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-primary transition-colors hover:underline cursor-pointer min-h-[44px] px-2 flex items-center justify-center"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Leads Main Container View */}
      <div>
        {/* Mobile: Card View Only */}
        <div className="block md:hidden">
          {showEmptyState ? (
            <EmptyState hasLeads={leads.length > 0} onClearFilters={resetFilters} />
          ) : (
            <div className="grid grid-cols-1 gap-6">
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

        {/* Tablet: Hybrid View */}
        <div className="hidden md:block lg:hidden">
          {showEmptyState ? (
            <EmptyState hasLeads={leads.length > 0} onClearFilters={resetFilters} />
          ) : viewMode === 'table' ? (
            <LeadTable leads={filteredLeads} onEdit={handleEditClick} onDelete={handleDeleteClick} />
          ) : (
            <div className="grid grid-cols-2 gap-6">
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

        {/* Desktop: Full Table View */}
        <div className="hidden lg:block">
          {showEmptyState ? (
            <EmptyState hasLeads={leads.length > 0} onClearFilters={resetFilters} />
          ) : (
            <LeadTable leads={filteredLeads} onEdit={handleEditClick} onDelete={handleDeleteClick} />
          )}
        </div>
      </div>

      {/* Add / Edit Form Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center md:p-4 bg-gray-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-800 w-full h-full min-h-screen md:h-auto md:min-h-0 md:max-w-lg md:rounded-2xl shadow-2xl border-0 md:border border-gray-100 dark:border-gray-800 flex flex-col md:block overflow-hidden transform transition-all duration-300 scale-100">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {selectedLead ? 'Edit Lead Details' : 'Add New Lead'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:text-gray-400 transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
              >
                <X className="w-6 h-6 md:w-5 md:h-5" />
              </button>
            </div>

            {/* Modal Body container hosting LeadForm */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                <LeadForm
                  initialData={selectedLead}
                  onSubmit={handleFormSubmit}
                  onCancel={() => setIsModalOpen(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      </PageContainer>
    </div>
  );
};

export default Leads;
