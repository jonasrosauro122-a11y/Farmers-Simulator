// Portal simulator content. Fictional data inspired by the uploaded portal reference.

export const endorsementTypes = [
  'Mailing address update',
  'Mortgagee / lender update',
  'Add or remove vehicle',
  'Add or remove driver',
  'Additional insured request',
  'Waiver of subrogation request',
  'Certificate / evidence request',
  'Payroll or audit update',
  'Business location update'
];

export const serviceOpsAnswers = [
  {
    keywords: ['change', 'endorse', 'policy', 'moving', 'address'],
    title: 'Can you request a change on a policy that is moving in a few days?',
    answer: 'Yes — collect the requested change, effective date, reason for change, and any supporting documents. Create a service request and route to licensed staff. Do not confirm coverage, premium impact, eligibility, or that the change is approved.'
  },
  {
    keywords: ['id card', 'cards', 'auto id'],
    title: 'How do I handle an Auto ID card request?',
    answer: 'Verify the customer, confirm the policy number and vehicle, then use the document area to simulate viewing or generating ID cards. If the customer asks coverage questions, route to licensed staff.'
  },
  {
    keywords: ['billing', 'payment', 'pay', 'late', 'cancel'],
    title: 'How do I handle a billing or pending cancellation question?',
    answer: 'Read documented billing status, balance, due date, and payment method. You may create a payment reminder task or billing note. Never waive fees, move due dates, promise reinstatement, or say coverage will remain active.'
  },
  {
    keywords: ['coi', 'certificate', 'additional insured', 'waiver'],
    title: 'How do I handle a certificate or additional insured request?',
    answer: 'Gather certificate holder name/address, required wording, contract reference, deadline, and policies involved. Create a service request and route for licensed review before issuance.'
  },
  {
    keywords: ['claim', 'loss', 'covered'],
    title: 'How do I respond to claim or coverage questions?',
    answer: 'Collect the customer question verbatim and create a task or service request. Do not interpret policy language, determine if something is covered, or promise claim outcomes.'
  }
];

export const agencyUpdates = [
  { date: 'Jun 26, 2026', category: 'Distribution', title: 'New Personal Lines brand strategy training posted', summary: 'Review the new customer-first positioning before working renewal conversations.' },
  { date: 'Jun 25, 2026', category: 'Operations', title: 'Customer retention signal update', summary: 'Retention alerts now prioritize billing, documents, and renewal follow-up patterns.' },
  { date: 'Jun 25, 2026', category: 'Security', title: 'Email phishing awareness reminder', summary: 'Never open unknown attachments from unverified certificate holders or vendors.' }
];

export const keyDates = [
  { date: 'Jul 17', label: 'All Lines Billing Close' },
  { date: 'Jun 28', label: 'Topper Club Lead Table Review' },
  { date: 'Jul 15', label: 'Personal Lines product bulletin due' },
  { date: 'Jul 27', label: 'Commercial service quality calibration' }
];

export const rateRules = [
  { line: 'Personal', state: 'CA', title: 'Non-payment cancellation review process', date: 'Jun 22, 2026' },
  { line: 'Commercial', state: 'AZ', title: 'Certificate wording and AI endorsement reminders', date: 'Jun 20, 2026' },
  { line: 'Personal', state: 'TX', title: 'Home underwriting document reminder', date: 'Jun 18, 2026' }
];

export const resourceTiles = [
  { title: 'PolicyCenter Policy System', description: 'Practice looking up policy details, forms, billing, and documents.', target: 'customer-info' },
  { title: 'PolicyCenter Resources', description: 'Review document request handling and service guardrails.', target: 'service-ops' },
  { title: 'Self-Service', description: 'Practice guiding customers to documents and billing records.', target: 'billing' },
  { title: 'Signal Videos & Resources', description: 'Use training resources and product basics for customer scenarios.', target: 'product-learning' },
  { title: 'Underwriting Opportunity', description: 'Practice escalating risk, eligibility, and coverage questions.', target: 'alerts-hub' }
];

export const chatTranscripts = [
  { id: 'CHAT-1001', customer: 'Alana Rivera', topic: 'Billing payment schedule', result: 'Customer asked for next due date. VA read documented billing status only.' },
  { id: 'CHAT-1002', customer: 'Harbor Grove Contractors LLC', topic: 'Certificate request', result: 'Contract wording collected and routed to Commercial Service.' },
  { id: 'CHAT-1003', customer: 'Daniel Foster', topic: 'New home closing', result: 'Lead follow-up created for licensed review.' }
];
