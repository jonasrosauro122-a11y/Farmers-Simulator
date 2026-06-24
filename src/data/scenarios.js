// 18 built-in practice scenarios for the Scenarios page.
// Each is fictional training content. "cannot" lists actions that require a licensed agent.

export const SCENARIO_GROUPS = ['Personal Lines Home', 'Personal Lines Auto', 'Commercial Lines'];

export const scenarios = [
  {
    id: 'SC01', group: 'Personal Lines Home', title: 'Home lead with upcoming X-date',
    background: 'A prospect, Jordan Miller, calls about a homeowners policy that renews with their current carrier in 30 days.',
    crmTask: 'Create a homeowners lead and record the X-date so the agency can follow up before renewal.',
    requiredFields: ['First/Last name', 'Phone & email', 'Product interest: Home', 'X-Date', 'Lead source'],
    escalation: 'You may gather details and prepare quote intake notes. A licensed agent must prepare and present the actual quote.',
    success: 'Lead saved with Home interest, a future X-date, and an intake note.',
    points: 10, route: 'leads', cta: 'Open Leads'
  },
  {
    id: 'SC02', group: 'Personal Lines Home', title: 'Mortgagee / lender update request',
    background: 'Mia Carter refinanced and her new lender needs to be listed as mortgagee on policy H09244871.',
    crmTask: 'Open a service request to update the mortgagee and route it for licensed processing.',
    requiredFields: ['Policy number', 'New mortgagee name & clause', 'Loan number', 'Effective date'],
    escalation: 'Collect and enter the mortgagee details. A licensed agent endorses the change effective.',
    success: 'Service request created with the new mortgagee information and routed.',
    points: 10, route: 'service-requests', cta: 'Open Service Requests'
  },
  {
    id: 'SC03', group: 'Personal Lines Home', title: 'Billing pending cancellation (non-pay)',
    background: 'A billing alert shows Avery Thompson is pending cancellation for non-payment with a balance due.',
    crmTask: 'Review the alert, make an approved reminder contact, and log the activity.',
    requiredFields: ['Account/household', 'Balance due', 'Approved reminder script used', 'Activity note'],
    escalation: 'Never promise the policy will not cancel or that a payment will fix coverage. Escalate disputes.',
    success: 'Alert reviewed, reminder logged, no coverage promises made.',
    points: 10, route: 'alerts', cta: 'Open Alerts'
  },
  {
    id: 'SC04', group: 'Personal Lines Home', title: 'Renewal review needed',
    background: 'Homeowners policy H09244871 renews next month and the household wants a review.',
    crmTask: 'Create a renewal review task assigned to licensed staff.',
    requiredFields: ['Related account', 'Task category: Renewal review', 'Due date', 'Priority'],
    escalation: 'You may schedule and prep the review. Coverage and pricing discussion is licensed work.',
    success: 'Renewal review task created with a due date before the renewal.',
    points: 10, route: 'tasks', cta: 'Open Tasks'
  },
  {
    id: 'SC05', group: 'Personal Lines Home', title: 'Missing roof / inspection information',
    background: 'Underwriting needs the roof age and recent updates before a pending home policy can be issued.',
    crmTask: 'Create a task to request the missing roof information from the customer.',
    requiredFields: ['Related account', 'What is missing (roof age/updates)', 'Due date'],
    escalation: 'Do not tell the customer the policy is approved — it is pending underwriting.',
    success: 'Missing-info task created and documented.',
    points: 10, route: 'tasks', cta: 'Open Tasks'
  },
  {
    id: 'SC06', group: 'Personal Lines Home', title: 'Claims follow-up request',
    background: 'A homeowner asks about the status of an open water-damage claim.',
    crmTask: 'Document the request and route to the assigned licensed staff; share only the recorded status.',
    requiredFields: ['Account/household', 'Claim reference', 'Documented status only', 'Callback task'],
    escalation: 'Never state whether a loss is or is not covered. Escalate coverage questions.',
    success: 'Status shared from notes only, follow-up task created for licensed staff.',
    points: 10, route: 'service-requests', cta: 'Open Service Requests'
  },
  {
    id: 'SC07', group: 'Personal Lines Auto', title: 'Auto quote intake',
    background: 'Olivia Tran wants an auto quote for a two-vehicle household.',
    crmTask: 'Create an auto lead and capture quote intake notes (drivers, vehicles, garaging).',
    requiredFields: ['Name & contact', 'Product interest: Auto', 'Driver details', 'Vehicle/VIN', 'Garaging address'],
    escalation: 'Gather and prepare intake only. A licensed agent prepares and presents the quote.',
    success: 'Auto lead saved with complete intake notes.',
    points: 10, route: 'quote-center', cta: 'Open Quote Center'
  },
  {
    id: 'SC08', group: 'Personal Lines Auto', title: 'Add driver request',
    background: 'A customer wants to add a newly licensed teen driver to their auto policy.',
    crmTask: 'Collect driver details and create a task for the licensed desk to endorse.',
    requiredFields: ['Policy number', 'Driver name & DOB', 'License number/state', 'Effective date'],
    escalation: 'A VA collects details; a licensed person makes the endorsement effective.',
    success: 'Driver-change task created with all required fields.',
    points: 10, route: 'tasks', cta: 'Open Tasks'
  },
  {
    id: 'SC09', group: 'Personal Lines Auto', title: 'Replace vehicle request',
    background: 'A customer traded a car and needs the new vehicle on the auto policy.',
    crmTask: 'Document the new VIN and use, then route for licensed processing.',
    requiredFields: ['Policy number', 'New VIN', 'Year/Make/Model', 'Use & garaging', 'Lienholder (if any)'],
    escalation: 'Do not confirm the new car is covered until licensed staff process the change.',
    success: 'Vehicle-replacement service request created and routed.',
    points: 10, route: 'service-requests', cta: 'Open Service Requests'
  },
  {
    id: 'SC10', group: 'Personal Lines Auto', title: 'ID card request',
    background: 'A customer needs proof-of-insurance ID cards emailed today.',
    crmTask: 'Create an ID card service request with the delivery method.',
    requiredFields: ['Policy number', 'Vehicles', 'Delivery method (email/mail)'],
    escalation: 'You may prepare/route the request. Confirm issuance follows agency procedure.',
    success: 'ID card service request created with delivery details.',
    points: 10, route: 'service-requests', cta: 'Open Service Requests'
  },
  {
    id: 'SC11', group: 'Personal Lines Auto', title: 'Lienholder update',
    background: 'A customer financed their vehicle and the bank must be listed as lienholder.',
    crmTask: 'Capture the lienholder details and create a task to add it.',
    requiredFields: ['Policy number', 'Lienholder name & address', 'Loan/account number', 'VIN'],
    escalation: 'Collect and enter details; licensed staff endorse the lienholder.',
    success: 'Lienholder-update task created and documented.',
    points: 10, route: 'tasks', cta: 'Open Tasks'
  },
  {
    id: 'SC12', group: 'Personal Lines Auto', title: 'Auto policy cancellation question',
    background: 'A customer asks how to cancel their auto policy because they sold the car.',
    crmTask: 'Document the request and route to licensed staff; do not process the cancellation.',
    requiredFields: ['Policy number', 'Reason for request', 'Requested cancel date', 'Activity note'],
    escalation: 'A VA cannot bind, cancel, or confirm cancellation. Route to a licensed agent.',
    success: 'Cancellation request documented and routed; no cancellation processed by the VA.',
    points: 10, route: 'service-requests', cta: 'Open Service Requests'
  },
  {
    id: 'SC13', group: 'Commercial Lines', title: 'COI request for a landlord',
    background: 'Riverstone Bakery LLC needs a certificate of insurance for their landlord.',
    crmTask: 'Open a COI service request capturing the certificate holder and required wording.',
    requiredFields: ['Policy number(s)', 'Certificate holder name & address', 'Required wording', 'Deadline'],
    escalation: 'Issuing certificates is licensed work in most states. Prepare a draft and route.',
    success: 'COI service request created with holder and wording captured.',
    points: 10, route: 'service-requests', cta: 'Open Service Requests'
  },
  {
    id: 'SC14', group: 'Commercial Lines', title: 'Additional insured request',
    background: 'BluePeak Plumbing LLC must add a general contractor as additional insured on their GL.',
    crmTask: 'Collect the additional insured details and route to the licensed commercial desk.',
    requiredFields: ['Policy number', 'Additional insured name & address', 'Project/contract reference', 'Effective date'],
    escalation: 'Endorsing additional insureds and confirming coverage is licensed work.',
    success: 'Additional-insured request created with contract reference.',
    points: 10, route: 'service-requests', cta: 'Open Service Requests'
  },
  {
    id: 'SC15', group: 'Commercial Lines', title: 'Workers comp payroll audit',
    background: 'Riverstone Bakery LLC has a workers comp audit and must submit payroll figures.',
    crmTask: 'Create a payroll audit task and request the payroll worksheet.',
    requiredFields: ['Policy number', 'Audit period', 'Payroll by class', 'Due date'],
    escalation: 'Collect figures only. Licensed/audit staff finalize audit results and premium.',
    success: 'Payroll audit task created with audit period and due date.',
    points: 10, route: 'tasks', cta: 'Open Tasks'
  },
  {
    id: 'SC16', group: 'Commercial Lines', title: 'Business auto driver update',
    background: 'Summit Auto Repair LLC hired a new driver to be added to the business auto policy.',
    crmTask: 'Capture the driver and route a business-auto change request.',
    requiredFields: ['Policy number', 'Driver name & DOB', 'License number/state', 'Effective date'],
    escalation: 'A VA collects details; licensed staff endorse the driver onto the policy.',
    success: 'Business-auto change request created with driver details.',
    points: 10, route: 'service-requests', cta: 'Open Service Requests'
  },
  {
    id: 'SC17', group: 'Commercial Lines', title: 'BOP renewal review',
    background: "Summit Auto Repair LLC's BOP renews soon and the owner wants a review.",
    crmTask: 'Create a renewal review task and gather updated business details.',
    requiredFields: ['Related account', 'Task category: Renewal review', 'Updated exposures', 'Due date'],
    escalation: 'Schedule and prep; coverage and pricing are licensed discussions.',
    success: 'BOP renewal review task created before the renewal date.',
    points: 10, route: 'tasks', cta: 'Open Tasks'
  },
  {
    id: 'SC18', group: 'Commercial Lines', title: 'Commercial property evidence request',
    background: 'A lender needs evidence of commercial property insurance for Northgate Dental Group.',
    crmTask: 'Open a service request for evidence of property insurance and capture the lender details.',
    requiredFields: ['Policy number', 'Lender/holder name & address', 'Loan number', 'Deadline'],
    escalation: 'Preparing evidence/EOI is licensed work in most states. Draft and route.',
    success: 'Evidence-of-insurance service request created with lender details.',
    points: 10, route: 'service-requests', cta: 'Open Service Requests'
  }
];
