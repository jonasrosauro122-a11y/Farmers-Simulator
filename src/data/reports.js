// Report catalog for the Reports Hub. Each id maps to a renderer in ReportsPage.

export const reportCatalog = [
  { id: 'lead-conversion', title: 'Lead Conversion Report', category: 'Sales', description: 'Lead counts by status with conversion and loss rates.' },
  { id: 'quote-pipeline', title: 'Quote Pipeline Report', category: 'Sales', description: 'Open opportunities, quoted premium, owner, and next action.' },
  { id: 'open-tasks', title: 'Open Tasks Report', category: 'Service', description: 'Open, due-today, and overdue tasks by owner and priority.' },
  { id: 'renewal', title: 'Renewal Report', category: 'Retention', description: 'Policies expiring within 90 days and renewal review items.' },
  { id: 'policy-summary', title: 'Policy Summary Report', category: 'Book of Business', description: 'All in-force policies by line, status, and written premium.' },
  { id: 'claims-activity', title: 'Claims Activity Report', category: 'Service', description: 'Open and closed claims with status and assigned account.' },
  { id: 'agency-activity', title: 'Agency Activity Report', category: 'Operations', description: 'Recent notes, lead activity, and task completions across the agency.' },
  { id: 'cross-sell', title: 'Cross-Sell Opportunities', category: 'Sales', description: 'Active accounts holding a single policy line.' }
];
