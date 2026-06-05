// Agency news feed for the home dashboard, plus Training Center content.

export const agencyNews = [
  { id: 'N001', date: '06/05/2026', title: 'Training Bulletin: Wind and Hail Severity Zones and Deductible Reminder', minutes: 3, type: 'Rates & Rules' },
  { id: 'N002', date: '06/04/2026', title: 'Broader Eligibility in the Homeowners Practice Program', minutes: 1, type: 'Rates & Rules' },
  { id: 'N003', date: '06/03/2026', title: 'Auto Rate Revision Practice Notice', minutes: 1, type: 'Rates & Rules' },
  { id: 'N004', date: '06/03/2026', title: 'Underwriting Guideline Change for Selected Counties', minutes: 1, type: 'Agency News' },
  { id: 'N005', date: '06/02/2026', title: 'Office Hours Update for the Summer Schedule', minutes: 1, type: 'Agency News' },
  { id: 'N006', date: '06/02/2026', title: 'Wildfire Mitigation Discount Practice Reminder', minutes: 2, type: 'Product Resources' },
  { id: 'N007', date: '06/01/2026', title: 'How to Prepare a Certificate Request Packet', minutes: 4, type: 'Product Resources' }
];

// Guided practice scenarios shown in the Training Center.
export const trainingScenarios = [
  {
    id: 'S1', title: 'New Prospect Intake', icon: '📝',
    description: 'A caller wants a homeowners quote for a house they are buying.',
    steps: ['Create a new lead with interest "Home" from the Leads page.', 'Record the closing date in a note.', 'Create a task to collect the prior dec page.', 'Set status to Contacted after the call.'],
    compliance: 'You may gather information. Quoting requires producer approval.'
  },
  {
    id: 'S2', title: 'Quote Follow-Up', icon: '📞',
    description: 'Noah Rivera was quoted 5 days ago and has not responded.',
    steps: ['Open Noah Rivera from the Leads page.', 'Review the activity notes.', 'Log a follow-up note after the call attempt.', 'Update status to Follow-Up and set a task for 2 days out.'],
    compliance: 'Never restate coverage terms from memory — read from the prepared quote only.'
  },
  {
    id: 'S3', title: 'Renewal Follow-Up', icon: '🔄',
    description: 'Summit Bakery\u2019s Workers Comp renews this month and the payroll worksheet is missing.',
    steps: ['Find Summit Bakery LLC with Account Lookup.', 'Open the Documents tab and confirm the worksheet status.', 'Call/email for the worksheet and log the activity.', 'Route the completed worksheet to the Commercial Team via a task.'],
    compliance: 'Renewal terms and pricing discussions belong to licensed staff.'
  },
  {
    id: 'S4', title: 'Missing Document Follow-Up', icon: '📄',
    description: 'A pending homeowners policy needs a signed application page.',
    steps: ['Open Ramos Household.', 'Check the Documents tab for the application.', 'Create a task: "Collect missing signature page".', 'Add an activity note with the customer\u2019s response.'],
    compliance: 'Do not tell the customer the policy is "approved" — it is pending underwriting.'
  },
  {
    id: 'S5', title: 'Payment Reminder', icon: '💳',
    description: 'Parker Family has a $165 past-due balance.',
    steps: ['Open Parker Family and review the Billing tab.', 'Use the approved payment reminder script.', 'Log the contact in the activity timeline.', 'If the customer disputes the bill, escalate — do not adjust anything.'],
    compliance: 'Never promise that a late payment will not affect the policy.'
  },
  {
    id: 'S6', title: 'Claims Follow-Up', icon: '🛠️',
    description: 'A customer calls asking about their open claim status.',
    steps: ['Open the account and read the Claims tab.', 'Share only the documented status (e.g., "in adjuster review").', 'Log the call and notify the assigned licensed staff.', 'Create a task if the customer needs a call back.'],
    compliance: 'NEVER state whether a loss is or is not covered.'
  },
  {
    id: 'S7', title: 'Policy Change Request', icon: '✏️',
    description: 'A customer wants to add a vehicle to their auto policy.',
    steps: ['Document the vehicle details (VIN, year, make, model, use).', 'Add the request as an activity note.', 'Create a task assigned to licensed staff to process the endorsement.', 'Tell the customer the request was submitted for processing.'],
    compliance: 'A VA collects details; a licensed person makes the change effective.'
  },
  {
    id: 'S8', title: 'Certificate / Evidence Request', icon: '📜',
    description: 'A commercial customer needs a certificate of insurance for a contract.',
    steps: ['Record the certificate holder name and address.', 'Capture any special wording the contract requires.', 'Create a task for the licensed desk with all details attached.', 'Set the due date based on the customer\u2019s deadline.'],
    compliance: 'Issuing certificates and evidence of insurance is licensed work in most states.'
  },
  {
    id: 'S9', title: 'Escalation Scenario', icon: '🚨',
    description: 'An upset customer demands to know if their water damage is covered.',
    steps: ['Stay calm and acknowledge the concern.', 'Explain a licensed team member will review and call back today.', 'Create a HIGH priority task for licensed staff immediately.', 'Log the conversation word-for-word in the activity notes.'],
    compliance: 'Coverage interpretation under pressure is still coverage interpretation. Escalate.'
  }
];

export const assessmentQuestions = [
  { id: 'Q1', question: 'A customer asks: "Is my roof leak covered?" What should a non-licensed VA do?',
    options: ['Read the policy and explain the coverage', 'Say it is probably covered if they have homeowners', 'Document the question and route it to licensed staff', 'Tell them to call the claims department and hang up'],
    answer: 2 },
  { id: 'Q2', question: 'Where do unclaimed inbound leads wait before they are assigned?',
    options: ['Reports Hub', 'Lead Depot', 'Alerts Hub', 'Direct Mail'], answer: 1 },
  { id: 'Q3', question: 'A payment is past due. Which action is appropriate for a VA?',
    options: ['Waive the late fee', 'Promise the policy will not cancel', 'Make a reminder call using the approved script and log it', 'Change the due date in the billing system'], answer: 2 },
  { id: 'Q4', question: 'Which of these may a non-licensed VA do?',
    options: ['Bind a new auto policy', 'Quote without approval', 'Interpret an exclusion', 'Gather information and create tasks'], answer: 3 },
  { id: 'Q5', question: 'The fastest way to find a customer by policy number is:',
    options: ['Scroll the Accounts list', 'Account Lookup in the bottom utility bar', 'The Direct Mail page', 'APEX Analytics'], answer: 1 }
];
