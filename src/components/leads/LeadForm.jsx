import { useState, useCallback, useEffect } from 'react';

/**
 * @typedef {Object} LeadFormInput
 * @property {string} name
 * @property {string} company
 * @property {string} email
 * @property {string} phone
 * @property {string} status
 * @property {string} source
 * @property {string} owner
 * @property {number|string} value
 */

/**
 * LeadForm Component
 * Renders a form for creating or editing leads. Includes validation for required fields.
 *
 * @component
 * @param {Object} props
 * @param {LeadFormInput} [props.initialData] - Existing lead data if editing.
 * @param {Function} props.onSubmit - Callback when form is successfully submitted.
 * @param {Function} props.onCancel - Callback when form is cancelled.
 * @returns {React.ReactElement} The LeadForm component.
 */
const LeadForm = ({ initialData, onSubmit, onCancel }) => {
  const isEditMode = !!initialData;

  /**
   * Builds clean form state from an optional initialData object.
   *
   * @param {LeadFormInput|undefined} data
   * @returns {LeadFormInput}
   */
  const buildFormState = useCallback(
    (data) => ({
      name: data?.name || '',
      company: data?.company || '',
      email: data?.email || '',
      phone: data?.phone || '',
      status: data?.status || 'New',
      source: data?.source || 'Website',
      owner: data?.owner || 'Unassigned',
      value: data?.value !== undefined ? data.value : '',
    }),
    []
  );

  const [formData, setFormData] = useState(() => buildFormState(initialData));
  const [errors, setErrors] = useState({});

  // Re-populate when the modal switches between create / edit targets.
  // Using the stable `buildFormState` callback avoids a direct setState call.
  useEffect(() => {
    setFormData(buildFormState(initialData));
    setErrors({});
  }, [initialData, buildFormState]);

  // Valid status and source options
  const statusOptions = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];
  const sourceOptions = ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'];
  const ownerOptions = ['Unassigned', 'Sarah', 'Alex', 'David', 'Emma', 'John'];

  /**
   * Performs client-side validation check of form fields.
   *
   * @returns {boolean} True if form inputs are valid.
   */
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Contact name is required';
    }
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles text input value change and removes associated error label.
   *
   * @param {React.ChangeEvent<HTMLInputElement|HTMLSelectElement>} e
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error when typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Handles form submit trigger.
   *
   * @param {React.FormEvent} e
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const submittedData = {
        ...formData,
        value: Number(formData.value) || 0,
      };
      onSubmit(submittedData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Contact Name */}
      <div>
        <label htmlFor="name" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
          Contact Name *
        </label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. John Doe"
          className={`w-full px-4 py-3 md:px-3.5 md:py-2 border rounded-xl bg-white dark:bg-gray-900 text-base md:text-sm transition-all text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-primary/20 ${
            errors.name ? 'border-danger focus:border-danger' : 'border-gray-200 dark:border-gray-700 focus:border-primary'
          }`}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <span id="name-error" className="text-xs text-danger font-medium mt-1 block">
            {errors.name}
          </span>
        )}
      </div>

      {/* Company Name */}
      <div>
        <label htmlFor="company" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
          Company Name *
        </label>
        <input
          id="company"
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="e.g. Acme Corp"
          className={`w-full px-4 py-3 md:px-3.5 md:py-2 border rounded-xl bg-white dark:bg-gray-900 text-base md:text-sm transition-all text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-primary/20 ${
            errors.company ? 'border-danger focus:border-danger' : 'border-gray-200 dark:border-gray-700 focus:border-primary'
          }`}
          aria-invalid={!!errors.company}
          aria-describedby={errors.company ? 'company-error' : undefined}
        />
        {errors.company && (
          <span id="company-error" className="text-xs text-danger font-medium mt-1 block">
            {errors.company}
          </span>
        )}
      </div>

      {/* Email Address */}
      <div>
        <label htmlFor="email" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
          Email Address *
        </label>
        <input
          id="email"
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="e.g. john@acme.com"
          className={`w-full px-4 py-3 md:px-3.5 md:py-2 border rounded-xl bg-white dark:bg-gray-900 text-base md:text-sm transition-all text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-primary/20 ${
            errors.email ? 'border-danger focus:border-danger' : 'border-gray-200 dark:border-gray-700 focus:border-primary'
          }`}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <span id="email-error" className="text-xs text-danger font-medium mt-1 block">
            {errors.email}
          </span>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <label htmlFor="phone" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
          Phone Number
        </label>
        <input
          id="phone"
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="e.g. (555) 000-0000"
          className="w-full px-4 py-3 md:px-3.5 md:py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-base md:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-900 dark:text-white font-roboto"
        />
      </div>

      {/* Status & Marketing Source — stack on mobile, 2-col on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-3 md:px-3.5 md:py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-base md:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-gray-900 transition-all text-gray-900 dark:text-white"
          >
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="source" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
            Source
          </label>
          <select
            id="source"
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="w-full px-4 py-3 md:px-3.5 md:py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-base md:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-gray-900 transition-all text-gray-900 dark:text-white"
          >
            {sourceOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Owner & Deal Value — 2-col on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="owner" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
            Owner
          </label>
          <select
            id="owner"
            name="owner"
            value={formData.owner}
            onChange={handleChange}
            className="w-full px-4 py-3 md:px-3.5 md:py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-base md:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-gray-900 transition-all text-gray-900 dark:text-white"
          >
            {ownerOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="value" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
            Deal Value ($)
          </label>
          <input
            id="value"
            type="number"
            name="value"
            min="0"
            value={formData.value}
            onChange={handleChange}
            placeholder="e.g. 5000"
            className="w-full px-4 py-3 md:px-3.5 md:py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-base md:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Form Actions — stack on mobile, row on sm+ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto px-4 py-3 md:py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 text-base md:text-sm font-semibold transition-all cursor-pointer min-h-[44px]"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto px-5 py-3 md:py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-xl text-base md:text-sm font-semibold transition-all shadow-sm hover:shadow-md dark:shadow-none cursor-pointer min-h-[44px]"
        >
          {isEditMode ? 'Save Changes' : 'Create Lead'}
        </button>
      </div>
    </form>
  );
};

export default LeadForm;
