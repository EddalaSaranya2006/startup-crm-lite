export const exportLeadsToCSV = (leads) => {
  if (!leads || !leads.length) return;

  const headers = ['Name', 'Company', 'Email', 'Phone', 'Status', 'Source', 'Value', 'Date Added'];
  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.join(','));

  // Add rows
  leads.forEach(lead => {
    // Format date properly depending on what format createdAt is in
    let dateStr = '';
    if (lead.createdAt) {
      try {
        dateStr = new Date(lead.createdAt).toLocaleDateString();
      } catch (e) {
        dateStr = lead.createdAt;
      }
    }

    const values = [
      `"${(lead.name || '').replace(/"/g, '""')}"`,
      `"${(lead.company || '').replace(/"/g, '""')}"`,
      `"${(lead.email || '').replace(/"/g, '""')}"`,
      `"${(lead.phone || '').replace(/"/g, '""')}"`,
      `"${lead.status || ''}"`,
      `"${lead.source || ''}"`,
      lead.value || 0,
      `"${dateStr}"`
    ];
    csvRows.push(values.join(','));
  });

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
