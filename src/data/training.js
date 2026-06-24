// Structured Training Center curriculum (A–E). Learning content is generic and training-safe.
// Practice tasks point at real simulator actions via an "action" target the page understands.

export const trainingTracks = [
  {
    id: 'A', title: 'Personal Lines — Homeowners', icon: '🏠',
    modules: [
      'HO-3 basic homeowners policy structure',
      'Coverage A, B, C, D, E, and F explained',
      'Deductibles (flat, percentage, wind/hail)',
      'Mortgagee / lender servicing',
      'Additional interest vs additional insured',
      'Home policy renewal review',
      'Cancellation / non-payment alerts',
      'Underwriting missing-document requests',
      'Claims support basics',
      'Escalation rules for unlicensed VAs'
    ],
    practice: [
      { id: 'A1', label: 'Create a homeowners lead', action: 'new-lead' },
      { id: 'A2', label: 'Add a household account', action: 'new-account' },
      { id: 'A3', label: 'Add a home policy (account detail)', action: 'accounts' },
      { id: 'A4', label: 'Create a mortgagee update service request', action: 'service-requests' },
      { id: 'A5', label: 'Respond to a billing pending-cancellation alert', action: 'alerts' },
      { id: 'A6', label: 'Create a renewal review task', action: 'new-task' },
      { id: 'A7', label: 'Identify when to escalate to a licensed agent', action: 'scenarios' }
    ]
  },
  {
    id: 'B', title: 'Personal Lines — Auto', icon: '🚗',
    modules: [
      'Auto policy basic information',
      'Drivers, vehicles, and VINs',
      'Garaging address and usage',
      'ID cards and proof of insurance',
      'Lienholders and loss payees',
      'Driver change and vehicle replacement',
      'Auto renewal review',
      'Cross-sell home and auto'
    ],
    practice: [
      { id: 'B1', label: 'Create an auto lead', action: 'new-lead' },
      { id: 'B2', label: 'Add driver and vehicle details (quote intake)', action: 'quote-center' },
      { id: 'B3', label: 'Create an ID card service request', action: 'service-requests' },
      { id: 'B4', label: 'Create a lienholder update task', action: 'new-task' },
      { id: 'B5', label: 'Handle an auto billing alert', action: 'alerts' },
      { id: 'B6', label: 'Prepare quote intake notes', action: 'quote-center' }
    ]
  },
  {
    id: 'C', title: 'Sales Side — Product Learning', icon: '🎯',
    modules: [
      'Lead stages: New → Contacted → Warm',
      'Waiting for response & follow-up',
      'Quote prepared, quote sent',
      'Closed won and closed lost',
      'Cross-sell opportunity spotting',
      'Product matching: Home, Auto, Renters, Condo, Umbrella'
    ],
    practice: [
      { id: 'C1', label: 'Move a lead through stages', action: 'product-learning' },
      { id: 'C2', label: 'Identify a product opportunity', action: 'product-learning' },
      { id: 'C3', label: 'Create a follow-up task', action: 'new-task' },
      { id: 'C4', label: 'Create quote notes', action: 'quote-center' },
      { id: 'C5', label: 'Mark a lead as quoted', action: 'leads' },
      { id: 'C6', label: 'Mark a lead closed won / lost', action: 'leads' }
    ]
  },
  {
    id: 'D', title: 'Service Side — Home & Auto Servicing', icon: '🛠️',
    modules: [
      'Billing requests',
      'Policy changes',
      'Cancellations',
      'Renewals',
      'Claims support',
      'Document requests',
      'Lender / mortgagee updates',
      'ID cards',
      'Service request status handling'
    ],
    practice: [
      { id: 'D1', label: 'Open a service request', action: 'service-requests' },
      { id: 'D2', label: 'Assign a status', action: 'service-requests' },
      { id: 'D3', label: 'Create an activity', action: 'alerts' },
      { id: 'D4', label: 'Add a note', action: 'accounts' },
      { id: 'D5', label: 'Mark a request in process', action: 'service-requests' },
      { id: 'D6', label: 'Mark a request completed', action: 'service-requests' },
      { id: 'D7', label: 'Escalate when needed', action: 'scenarios' }
    ]
  },
  {
    id: 'E', title: 'Commercial Lines', icon: '🏬',
    modules: [
      'General Liability basics',
      'Business Auto basics',
      'BOP basics',
      'Commercial Property basics',
      'Workers Compensation basics',
      'COI basics',
      'Additional insured & waiver of subrogation',
      'Commercial audit support',
      'Payroll updates',
      'Commercial service request routing'
    ],
    practice: [
      { id: 'E1', label: 'Create a commercial account', action: 'new-account' },
      { id: 'E2', label: 'Create a commercial lead', action: 'new-lead' },
      { id: 'E3', label: 'Add a commercial policy', action: 'accounts' },
      { id: 'E4', label: 'Create a COI service request', action: 'service-requests' },
      { id: 'E5', label: 'Create an additional insured request', action: 'service-requests' },
      { id: 'E6', label: 'Create a payroll audit task', action: 'new-task' },
      { id: 'E7', label: 'Create a business auto change request', action: 'service-requests' },
      { id: 'E8', label: 'Create a renewal follow-up', action: 'new-task' },
      { id: 'E9', label: 'Identify licensed-agent escalation points', action: 'scenarios' }
    ]
  }
];
