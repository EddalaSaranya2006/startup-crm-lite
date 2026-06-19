/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const LEADS_STORAGE_KEY = 'startup-crm-lite:leads';

/**
 * @typedef {Object} Lead
 * @property {string} id
 * @property {string} name
 * @property {string} company
 * @property {string} email
 * @property {string} phone
 * @property {'New' | 'Contacted' | 'Meeting Scheduled' | 'Proposal Sent' | 'Won' | 'Lost'} status
 * @property {'Website' | 'Referral' | 'LinkedIn' | 'Cold Call' | 'Email Campaign' | 'Other'} source
 * @property {string} createdAt ISO date
 * @property {number} [value]
 * @property {string} [dateAdded] Compatibility alias for createdAt
 */

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
    createdAt: '2026-06-15T09:30:00.000Z',
    dateAdded: '2026-06-15T09:30:00.000Z',
    owner: 'Sarah',
    wonAt: '2026-06-25T12:00:00Z',
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
    createdAt: '2026-06-14T14:15:00.000Z',
    dateAdded: '2026-06-14T14:15:00.000Z',
    owner: 'Alex',
    contactedAt: '2026-06-16T11:00:00Z',
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
    createdAt: '2026-06-12T10:00:00.000Z',
    dateAdded: '2026-06-12T10:00:00.000Z',
    owner: 'David',
    proposalAt: '2026-06-20T10:00:00Z',
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
    createdAt: '2026-06-10T16:45:00.000Z',
    dateAdded: '2026-06-10T16:45:00.000Z',
    owner: 'Emma',
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
    createdAt: '2026-06-08T11:20:00.000Z',
    dateAdded: '2026-06-08T11:20:00.000Z',
    owner: 'John',
    closedAt: '2026-06-20T11:20:00Z',
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
    createdAt: '2026-06-05T09:00:00.000Z',
    dateAdded: '2026-06-05T09:00:00.000Z',
    owner: 'Sarah',
    wonAt: '2026-06-18T09:00:00Z',
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
    createdAt: '2026-06-03T15:30:00.000Z',
    dateAdded: '2026-06-03T15:30:00.000Z',
    owner: 'Alex',
    proposalAt: '2026-06-15T15:30:00Z',
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
    createdAt: '2026-06-01T10:00:00.000Z',
    dateAdded: '2026-06-01T10:00:00.000Z',
    owner: 'David',
    contactedAt: '2026-06-05T10:00:00Z',
  },
];

export const LeadContext = createContext(undefined);

/**
 * Normalizes a lead so older persisted data still matches the app's current shape.
 *
 * @param {Partial<Lead>} lead - Raw lead data.
 * @returns {Lead} Normalized lead object.
 */
const normalizeLead = (lead) => {
  const createdAt = lead.createdAt || lead.dateAdded || new Date().toISOString();
  const status = lead.status === 'Proposal' ? 'Proposal Sent' : lead.status || 'New';

  return {
    id: String(lead.id || createLeadId()),
    name: lead.name || '',
    company: lead.company || '',
    email: lead.email || '',
    phone: lead.phone || '',
    status,
    source: lead.source || 'Website',
    value: Number(lead.value) || 0,
    createdAt,
    dateAdded: createdAt,
    owner: lead.owner || 'Unassigned',
    contactedAt: lead.contactedAt || null,
    meetingAt: lead.meetingAt || null,
    proposalAt: lead.proposalAt || null,
    wonAt: lead.wonAt || null,
    closedAt: lead.closedAt || null,
  };
};

/**
 * Creates a unique lead ID using the browser crypto API when available.
 *
 * @returns {string} Unique lead ID.
 */
const createLeadId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return Date.now().toString();
};

/**
 * Loads leads from localStorage, falling back to the starter dataset.
 *
 * @returns {Lead[]} Lead list.
 */
const loadStoredLeads = () => {
  try {
    if (typeof window === 'undefined') {
      return INITIAL_LEADS.map(normalizeLead);
    }

    const storedLeads = window.localStorage.getItem(LEADS_STORAGE_KEY);
    if (!storedLeads) {
      return INITIAL_LEADS.map(normalizeLead);
    }

    const parsedLeads = JSON.parse(storedLeads);
    return Array.isArray(parsedLeads) ? parsedLeads.map(normalizeLead) : INITIAL_LEADS.map(normalizeLead);
  } catch (error) {
    console.error('Unable to load leads from localStorage.', error);
    return INITIAL_LEADS.map(normalizeLead);
  }
};

/**
 * Provides lead data and lead mutations to the application.
 *
 * @param {Object} props - Provider props.
 * @param {React.ReactNode} props.children - Child tree.
 * @returns {React.ReactElement} Lead context provider.
 */
export const LeadProvider = ({ children }) => {
  const [leads, setLeads] = useState(loadStoredLeads);

  useEffect(() => {
    try {
      window.localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
    } catch (error) {
      console.error('Unable to save leads to localStorage.', error);
    }
  }, [leads]);

  /**
   * Adds a new lead to the beginning of the lead list.
   *
   * @param {Partial<Lead>} leadData - Lead data from a form.
   * @returns {Lead} The created lead.
   */
  const addLead = useCallback((leadData) => {
    const createdAt = new Date().toISOString();
    const status = leadData.status || 'New';
    const now = createdAt;
    
    const newLead = normalizeLead({
      ...leadData,
      id: createLeadId(),
      createdAt,
      dateAdded: createdAt,
      contactedAt: status === 'Contacted' ? now : null,
      meetingAt: status === 'Meeting Scheduled' ? now : null,
      proposalAt: status === 'Proposal Sent' ? now : null,
      wonAt: status === 'Won' ? now : null,
      closedAt: status === 'Lost' ? now : null,
    });

    setLeads((currentLeads) => [newLead, ...currentLeads]);
    return newLead;
  }, []);

  /**
   * Updates an existing lead by ID.
   *
   * @param {string} id - Lead ID.
   * @param {Partial<Lead>} leadData - Fields to update.
   * @returns {void}
   */
  const updateLead = useCallback((id, leadData) => {
    setLeads((currentLeads) =>
      currentLeads.map((lead) => {
        if (lead.id === id) {
          const updated = { ...lead, ...leadData, id: lead.id, createdAt: lead.createdAt };
          
          if (leadData.status && leadData.status !== lead.status) {
            const now = new Date().toISOString();
            if (leadData.status === 'Contacted' && !updated.contactedAt) updated.contactedAt = now;
            if (leadData.status === 'Meeting Scheduled' && !updated.meetingAt) updated.meetingAt = now;
            if (leadData.status === 'Proposal Sent' && !updated.proposalAt) updated.proposalAt = now;
            if (leadData.status === 'Won' && !updated.wonAt) updated.wonAt = now;
            if (leadData.status === 'Lost' && !updated.closedAt) updated.closedAt = now;
          }
          
          return normalizeLead(updated);
        }
        return lead;
      })
    );
  }, []);

  /**
   * Deletes a lead by ID.
   *
   * @param {string} id - Lead ID.
   * @returns {void}
   */
  const deleteLead = useCallback((id) => {
    setLeads((currentLeads) => currentLeads.filter((lead) => lead.id !== id));
  }, []);

  /**
   * Finds a lead by ID.
   *
   * @param {string} id - Lead ID.
   * @returns {Lead|undefined} Matching lead when found.
   */
  const getLeadById = useCallback((id) => leads.find((lead) => lead.id === id), [leads]);

  const value = useMemo(
    () => ({ leads, addLead, updateLead, deleteLead, getLeadById }),
    [leads, addLead, updateLead, deleteLead, getLeadById]
  );

  return <LeadContext.Provider value={value}>{children}</LeadContext.Provider>;
};

/**
 * Reads the lead context.
 *
 * @returns {{leads: Lead[], addLead: Function, updateLead: Function, deleteLead: Function, getLeadById: Function}} Lead context value.
 * @throws {Error} When used outside LeadProvider.
 */
export const useLeads = () => {
  const context = useContext(LeadContext);

  if (!context) {
    throw new Error('useLeads must be used within a LeadProvider.');
  }

  return context;
};
